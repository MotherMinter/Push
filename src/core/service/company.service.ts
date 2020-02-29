import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Account, Company, Wallet } from '../entity';
import { CompanyDto } from '../dto';
import { CompanyStatus } from '../enum';
import { WarehouseService } from './warehouse.service';
import { WalletService } from './wallet.service';

export const LINK = 'https://5s.gift/';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly warehouseService: WarehouseService,
    private readonly walletService: WalletService,
  ) {
  }

  async create(companyData: CompanyDto, account: Account = null): Promise<Company> {
    try {
      const company = new Company();
      company.email = companyData.email ?? '';
      company.password = companyData.password  ?? '';
      company.status = CompanyStatus.ACTIVE;
      company.wallets = [];
      company.isProtected = !!companyData.protected;
      company.setParams(companyData.params);
      company.uid = this.walletService.generateUniqWalletId(10);
      company.account = account;

      let isWaitNewAddress = false;
      if (companyData.type === 'complex') {
        company.status = CompanyStatus.COMPLEX;
      }
      if (companyData.type === 'complex_feedback') {
        company.status = CompanyStatus.COMPLEX_FEEDBACK;
      }
      if (companyData.type === 'complex_action') {
        company.status = CompanyStatus.COMPLEX_ACTION;
      }
      if (companyData.type === 'simple_feedback') {
        company.status = CompanyStatus.FEEDBACK;
        isWaitNewAddress = true;
      }
      if (companyData.type === 'simple_action') {
        company.status = CompanyStatus.ACTION;
        isWaitNewAddress = true;
      }

      if (company.status >= CompanyStatus.COMPLEX) {
        // create wh wallet
        company.warehouseWallet = await this.warehouseService.create();
      }

      // store
      await this.companyRepository.save(company);

      if (companyData.uid) {
        // store wallet's info
        await this.walletService.add(company, companyData.uid, companyData.mxaddress);
      } else {
        // create push wallet's
        const params = company.getParams();
        if (params && params.count && params.count > 0) {
          // complex company with many then one wallet
          for (let index = 0; index < params.count; index += 1) {
            await this.walletService.create(company);
          }
        } else {
          // simple company with one wallet
          await this.walletService.create(company);
        }
      }

      if (companyData.emailList && Array.isArray(companyData.emailList)) {
        let walletIndexShift = 0;
        for (let emailIndex = 0; emailIndex < companyData.emailList.length; emailIndex += 1) {
          if (company.wallets.length > emailIndex
            && typeof company.wallets[emailIndex + walletIndexShift] !== 'undefined') {
            const wallet = company.wallets[emailIndex + walletIndexShift];
            if (!!wallet.email) {
              walletIndexShift += 1;
              emailIndex -= 1;
            } else {
              await this.walletService.addEmailToWallet(wallet, companyData.emailList[emailIndex]);
            }
          }
        }
      }

      return company;
    } catch (error) {
      global.console.error({ error, data: companyData });
      throw new HttpException('Fail to create new company', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCustomCompany(): Promise<Company> {
    let company = await this.companyRepository.findOne({uid: 'custom'});

    if (typeof company === 'undefined') {
      company = new Company();
      company.uid = 'custom';
      company.status = CompanyStatus.ACTIVE;
      company.isProtected = true;
      company.wallets = [];
      company.warehouseWallet = null;

      await this.companyRepository.save(company);
    }

    return company;
  }

  async get(id: string, passwordHash: string): Promise<Company> {
    let company;
    try {
      company = await this.companyRepository.findOneOrFail(id);
    } catch (error) {
      global.console.error({ error, data: id });
      throw new HttpException('Fail to get company', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (company.password !== passwordHash) {
      throw new HttpException('Bad password', HttpStatus.UNAUTHORIZED);
    }

    return company;
  }

  async update(id: string, passwordHash: string, companyData: CompanyDto): Promise<Company> {
    const company = await this.get(id, passwordHash);
    company.email = companyData.email ?? company.email;
    company.password = companyData.password ?? company.password;
    company.status = companyData.status ?? company.status;
    company.setParams(companyData.params ?? company.getParams());

    // create push wallet's if need
    const params = company.getParams();
    if (params && params.count && params.count > 0
      && params.count > company.wallets.length) {
      // complex company with many then one wallet
      for (let index = company.wallets.length; index < params.count; index += 1) {
        await this.walletService.create(company);
      }
    } else {
      if (company.wallets.length === 0) {
        // simple company with one wallet
        await this.walletService.create(company);
      }
    }

    return company;
  }

  async walletList(id: string, passwordHash: string): Promise<Wallet[]> {
    const company = await this.get(id, passwordHash);

    return company.wallets;
  }

  async getWalletList(uid: string, count: number): Promise<string[]> {
    const company = await this.companyRepository.findOneOrFail({uid});
    const wallets = [];

    for (let index = 0; index < count; index += 1) {
      wallets.push(await this.walletService.create(company));
    }

    return wallets.map((wallet) => `${LINK}${wallet.wallet}`);
  }

  async getCompany(uid: string): Promise<Company> {
    return this.companyRepository.findOneOrFail({uid});
  }

  checkCredentials(company: Company, email: string, password: string) {
    return company.email === email && company.password === password;
  }

  async close(company: Company) {
    company.status = CompanyStatus.CANCEL;
    await this.companyRepository.save(company);

    if (company.warehouseWallet) {
      const balance = await this.warehouseService.checkBalance(company.warehouseWallet);
      await this.warehouseService.return(company.warehouseWallet);
    }

    return true;
  }
}
