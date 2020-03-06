import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as cryptoRandomString from 'crypto-random-string';

import { Company, Wallet } from '../entity';
import { CompanyStatus, WalletStatus } from '../enum';
import { WalletDto } from '../dto';
import { WarehouseService } from './warehouse.service';
import Decimal from 'decimal.js';

const PUSH_WALLET_ID_LENGTH = 6;

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly warehouseService: WarehouseService,
  ) {
  }

  async create(company: Company): Promise<Wallet> {
    try {
      const wallet = new Wallet();
      wallet.company = company;
      wallet.wallet = this.generateUniqWalletId();
      wallet.status = WalletStatus.NEW;

      if (company.status === CompanyStatus.FEEDBACK || company.status === CompanyStatus.COMPLEX_FEEDBACK) {
        wallet.status = WalletStatus.WAIT_FEEDBACK;
      }
      if (company.status === CompanyStatus.ACTION || company.status === CompanyStatus.COMPLEX_ACTION) {
        wallet.status = WalletStatus.WAIT_ACTION;
      }
      company.wallets.push(wallet);

      await this.walletRepository.save(wallet);

      return wallet;
    } catch (error) {
      global.console.error({ error, data: company.id });
      throw new HttpException('Fail to create wallet', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async add(company: Company, uid: string, mxaddress: string): Promise<Wallet> {
    try {
      const wallet = new Wallet();
      wallet.company = company;
      wallet.wallet = uid;
      wallet.status = mxaddress ? WalletStatus.ACTIVE : WalletStatus.NEW;
      wallet.mxaddress = mxaddress;
      company.wallets.push(wallet);

      if (company.status === CompanyStatus.FEEDBACK || company.status === CompanyStatus.COMPLEX_FEEDBACK) {
        wallet.status = WalletStatus.WAIT_FEEDBACK;
      }
      if (company.status === CompanyStatus.ACTION || company.status === CompanyStatus.COMPLEX_ACTION) {
        wallet.status = WalletStatus.WAIT_ACTION;
      }

      await this.walletRepository.save(wallet);

      return wallet;
    } catch (error) {
      global.console.error({ error, data: company.id });
      throw new HttpException('Fail to add wallet', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async get(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne(
      { wallet: id },
      { relations: ['company'] },
      );
    if (wallet && (wallet.status === WalletStatus.NEW
      || wallet.status === WalletStatus.WAIT_ACTION
      || wallet.status === WalletStatus.WAIT_FEEDBACK)) {
      return wallet;
    }
    if (wallet && !wallet.company.isProtected) {
      return wallet;
    }

    throw new HttpException('need login', HttpStatus.UNAUTHORIZED);
  }

  async login(id: string, walletData: WalletDto): Promise<Wallet> {
    try {
      const wallet = await this.walletRepository.findOneOrFail(
        { wallet: id },
        { relations: ['company'] },
        );
      if (wallet.status === WalletStatus.NEW || wallet.status === WalletStatus.WAIT_ACTION || wallet.status === WalletStatus.WAIT_FEEDBACK) {
        if (!walletData.mxaddress) {
          throw new Error('mxaddress fail');
        }

        wallet.mxaddress = walletData.mxaddress;
        // run active company procedure
        const isActivate = await this.activateWallet(wallet);

        if (isActivate) {
          wallet.status = WalletStatus.ACTIVE;
          await this.walletRepository.save(wallet);
          return wallet;
        } else {
          throw new Error('activated failed');
        }
      }
      if (walletData.mxaddress
        && wallet.mxaddress === walletData.mxaddress) {
        return wallet;
      }
    } catch (error) {
      global.console.error({ error, data: id });
      // throw new HttpException('Fail to get wallet', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    throw new HttpException('need login', HttpStatus.UNAUTHORIZED);
  }

  async custom(company: Company = null, id: string, walletData: WalletDto): Promise<Wallet> {
    if (!walletData.mxaddress) {
      throw new HttpException('need login', HttpStatus.UNAUTHORIZED);
    }

    const wallet = await this.walletRepository.findOne(
      { wallet: id, mxaddress: walletData.mxaddress },
    );

    if (company && typeof wallet === 'undefined') {
      return this.add(company, id, walletData.mxaddress);
    }

    return wallet;
  }

  async setBalance(id: string, walletData: WalletDto): Promise<Wallet> {
    const wallet = await this.login(id, walletData);

    wallet.balances = walletData.balances;
    await this.walletRepository.save(wallet);

    return wallet;
  }

  async storeReply(wallet: Wallet, walletData: WalletDto) {
    wallet.setParams({
      reply: walletData.reply,
    });
    wallet.status = WalletStatus.ACTIVE;
    wallet.mxaddress = walletData.mxaddress;
    await this.walletRepository.save(wallet);

    return true;
  }

  async send(wallet: Wallet, rawTx: string) {
    return this.warehouseService.sendRawTx(wallet.mxaddress, rawTx);
  }

  public generateUniqWalletId(length: number = PUSH_WALLET_ID_LENGTH): string {
    return cryptoRandomString({
      length,
      type: 'url-safe',
    });
  }

  private async activateWallet(wallet: Wallet): Promise<boolean> {
    try {
      if (wallet.status === WalletStatus.ACTIVE) {
        return false;
      }
      if (!wallet.mxaddress) {
        return false;
      }
      if (!wallet.company.warehouseWallet) {
        // if simple wallet -> no need activation
        return true;
      }
      // check wh wallet balance
      await this.warehouseService.checkBalance(wallet.company.warehouseWallet);
      // transfer from wh wallet > push wallet
      const params = wallet.company.getParams();
      const amount = (params && params.amount)
        ? params.amount
        : '';
      let symbol = (params && params.symbol)
        ? params.symbol
        : '';

      if (symbol === '' && wallet.company.warehouseWallet.balances.length > 0) {
        let balance = new Decimal(0);
        wallet.company.warehouseWallet.getBalances().forEach((item) => {
          if (balance.lte(new Decimal(item.amount))) {
            balance = new Decimal(item.amount);
            symbol = item.coin;
          }
        });
      }

      return this.warehouseService.transfer(
        wallet.company.warehouseWallet,
        wallet.mxaddress,
        amount,
        symbol,
      );
    } catch (error) {
      global.console.error(error, 'error activated wallet', wallet);
      return false;
    }
  }

  /**
   * Add email to wallet
   * @param wallet
   * @param email
   */
  async addEmailToWallet(wallet: Wallet, email: string) {
    wallet.email = email;

    return this.walletRepository.save(wallet);
  }
}
