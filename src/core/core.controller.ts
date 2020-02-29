import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Param,
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpException, HttpStatus, HttpCode, UploadedFiles, UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { diskStorage } from 'multer';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

import { Company, Wallet, Account } from './entity';
import { AccountDto, CompanyDto, WalletDto } from './dto';
import {
  AccountService,
  BipexService,
  BitrefillService,
  CompanyService,
  LINK,
  PartnerService,
  WalletService,
} from './service';
import Decimal from 'decimal.js';

const API_LINK = 'https://p.motherminter.org/';
const SAT_BTC = 100000000;

@ApiTags('api')
@Controller('api')
export class CoreController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly walletService: WalletService,
    private readonly partnerService: PartnerService,
    private readonly accountService: AccountService,
    private readonly bitrefillService: BitrefillService,
    private readonly bipexService: BipexService,
  ) {
  }

  @Post('company')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Create company simple/complex'})
  async createCompany(@Body() company: CompanyDto): Promise<Company> {
    let account = null;
    try {
      account = await this.accountService.get(company.email, company.password);
    } catch (error) {
      // create new account this credentials
      try {
        const accountData = new AccountDto();
        accountData.email = company.email;
        accountData.password = company.password;
        account = await this.accountService.create(accountData);
      } catch (error) {
        global.console.warn(error);
      }
    }

    return this.companyService.create(company, account);
  }

  @Get('company/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get information by company'})
  async getCompany(@Param() params, @Body() body): Promise<Company> {
    if (body && body.password) {
      return this.companyService.get(params.id, body.password);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Post('company/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Update company info'})
  async updateCompany(@Param() params, @Body() body): Promise<Company> {
    if (body && body.password) {
      return this.companyService.update(params.id, body.password, body);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Get('company/:id/wallets')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get company wallet list'})
  async getCompanyWallets(@Param() params, @Body() body): Promise<Wallet[]> {
    if (body && body.password) {
      return this.companyService.walletList(params.id, body.password);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Get('company/:uid/get_wallet')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get new wallet by company'})
  async getCompanyNewWallets(@Param() params, @Query() query): Promise<string[]> {
    if (params.uid && query.count) {
      return this.companyService.getWalletList(params.uid, query.count);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Post('company/:uid/email')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send wallet list to company email'})
  async sentListToEmail(@Param() params, @Query() query) {
    if (params.uid) {
      const company = await this.companyService.getCompany(params.uid);
      const emailData = JSON.stringify({
        wallets: company.wallets
          .map((wallet) => `${LINK}${wallet.wallet}`),
      });

      await this.partnerService.sendEmail({
        to: company.email,
        subject: `Wallet list by multiple mode. Push #${company.uid}`, // Subject line
        text: emailData,
      });
      return true;
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Post('company/:uid/email_link')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send "one more wallet" link to compnany email'})
  async sentLinkToEmail(@Param() params, @Query() query) {
    if (params.uid) {
      const company = await this.companyService.getCompany(params.uid);
      const emailData = `${API_LINK}api/company/${company.uid}/get_wallet?count=1`;

      await this.partnerService.sendEmail({
        to: company.email,
        subject: `Api link for generate wallets. Push #${company.uid}`, // Subject line
        text: emailData,
      });
      return true;
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Post('company/:uid/email_wallets')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send wallet link to user emails'})
  async sentLinkToEmailWallet(@Param() params, @Query() query) {
    if (params.uid) {
      const company = await this.companyService.getCompany(params.uid);

      if (company.wallets) {
        company.wallets.forEach((wallet) => {
          if (wallet.email) {
            const walletLink = `${API_LINK}${wallet.wallet}`;
            const emailData = `
          Hi. This is your new push wallet. Use this link: ${walletLink}
          `;

            this.partnerService.sendEmail({
              to: wallet.email,
              subject: `Push. Your will receive new push wallet`, // Subject line
              text: emailData,
            });
          }
        });
      }
      return true;
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Post('company/:uid/close')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Close the company'})
  async closeCompany(@Param() params, @Query() query) {
    if (params.uid) {
      const company = await this.companyService.getCompany(params.uid);

      return this.companyService.close(company);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  /**
   * Account section
   * @param body
   * @param file
   */
  @Post('account')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
        return ;
      }
      cb(null, false);
    },
    storage: diskStorage({
      destination: '../www/static/tmp/uploads',
      path: '/tmp/uploads',
      filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() =>
          (Math.round(Math.random() * 16))
            .toString(16)).join('');
        // Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  @ApiOperation({ description: 'Create account'})
  async createAccount(@Body() body: AccountDto, @UploadedFile() file): Promise<Account> {
    if (body && body.password && body.email) {
      try {
        const account = await this.accountService.get(body.email, body.password);

        return this.accountService.update(account, body, file);
      } catch (error) {
        return this.accountService.create(body, file);
      }
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Post('account/login')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Try login account'})
  async getAccount(@Body() body: AccountDto): Promise<Account> {
    if (body && body.password && body.email) {
      return this.accountService.get(body.email, body.password);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Post(':id/complex')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get wallet information before activation'})
  async complexParams(@Param() params, @Body() walletData: WalletDto) {
    const wallet = await this.walletService.get(params.id);
    const companyParams = wallet.company.getParams();

    return {
      notice: (companyParams && companyParams.notice) ? companyParams.notice : '',
      balance: (companyParams && companyParams.amount) ? companyParams.amount : '',
    };
  }

  @Post(':id/after')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get wallet information after activation'})
  async afterActivate(@Param() params, @Body() walletData: WalletDto) {
    if (walletData.custom) {
      return {};
    }

    const wallet = await this.walletService.login(params.id, walletData);
    const companyParams = wallet.company.getParams();

    return {
      msg: (companyParams && companyParams.title) ? companyParams.title : '',
      skin: (companyParams && companyParams.skin) ? companyParams.skin : '',
      spends: (companyParams && companyParams.spends) ? companyParams.spends : [],
    };
  }

  @Post(':id/reply')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send reply/activation info'})
  async replyActivate(@Param() params, @Body() walletData: WalletDto) {
    if (walletData.reply.length < 100) {
      return {
        status: 'error',
        msg: 'too short',
      };
    }

    const wallet = await this.walletService.get(params.id);
    const globalResult = {
      status: 'ok',
    };
    const companyParams = wallet.company.getParams();
    if (wallet.company && companyParams && companyParams.callback_link) {
      const info = {
        waller_uid: wallet.wallet,
        company_uid: wallet.company.uid,
        reply: walletData.reply,
      };
      try {
        const response = await axios.post(companyParams.callback_link, info);

        globalResult.status = 'error';
        if (response.status === HttpStatus.OK && response.data) {
          if (response.data.status === 'ok') {
            globalResult.status = 'ok';
          }
        }
      } catch (error) {
        global.console.warn('error on send info', info);
      }
    }

    if (globalResult.status === 'ok') {
      await this.walletService.login(params.id, walletData);

      await this.walletService.storeReply(wallet, walletData);
      if (wallet.company && wallet.company.email) {
        const email = '';
        await this.partnerService.sendEmail({
          to: wallet.company.email,
          subject: 'New reply', // Subject line
          text: `${wallet.wallet} - ${walletData.reply}`,
        });
      }
    }

    return globalResult;
  }

  /*@Post(':id/balance')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Update wallet balance'})
  async updateWalletBalance(@Param() params, @Body() walletData: WalletDto): Promise<Wallet> {
    return this.walletService.setBalance(params.id, walletData);
  }*/

  @Post(':id/send')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send raw signed transaction to network'})
  async send(@Param() params, @Body() walletData: WalletDto, @Body() body): Promise<string> {
    let wallet;
    if (walletData.custom) {
      wallet = await this.walletService.custom(null, params.id, walletData);
      if (!wallet) {
        throw new HttpException('need login', HttpStatus.UNAUTHORIZED);
      }
    } else {
      wallet = await this.walletService.login(params.id, walletData);
    }

    return this.walletService.send(wallet, body.rawTx);
  }

  /**
   * integrations
   */
  @Post(':id/services/phone')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send information to bipToPhone service'})
  async servicesPhone(@Param() params, @Body() walletData: WalletDto, @Body() body): Promise<string> {
    if (walletData.custom) {
      const wallet = await this.walletService.custom(null, params.id, walletData);
      if (!wallet) {
        throw new HttpException('need login', HttpStatus.UNAUTHORIZED);
      }
    } else {
      await this.walletService.login(params.id, walletData);
    }

    return this.partnerService.sendToPhone(body.phone);
  }

  @Post(':id/services/bitrefill/:slug')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Try create bitrefill order'})
  async checkBitrefillList(@Param() params, @Body() walletData: WalletDto, @Body() body) {
    if (walletData.custom) {
      const wallet = await this.walletService.custom(null, params.id, walletData);
      if (!wallet) {
        throw new HttpException('need login', HttpStatus.UNAUTHORIZED);
      }
    } else {
      await this.walletService.login(params.id, walletData);
    }

    // try create bitrefill order (store order info to DB)
    const valueList = await this.bitrefillService.checkList(params.slug);
    if (valueList && valueList.length > 0) {
      const convertInfo = await this.bipexService.getBIPSumToConvert(
        new Decimal(valueList[0].satoshiPrice)
          .mul(1.1)
          .div(SAT_BTC),
      );
      if (!convertInfo) {
        throw new HttpException('fail to get item info, try later', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return Promise.all(valueList.map(async (item) => {
        const bipPrice = new Decimal(item.satoshiPrice)
          .mul(1.1)
          .div(SAT_BTC)
          .div(convertInfo.price);

        return {
          value: item.value,
          usdPrice: item.usdPrice,
          satoshiPrice: item.satoshiPrice,
          bipPrice: bipPrice.toNumber(),
        };
      }));
    }

    throw new HttpException('fail to get item info, try later', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @Post(':id/services/bitrefill')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Try create bitrefill order'})
  async tryCreateBitrefillOrder(@Param() params, @Body() walletData: WalletDto, @Body() body) {
    let wallet;
    if (walletData.custom) {
      wallet = await this.walletService.custom(null, params.id, walletData);
      if (!wallet) {
        throw new HttpException('need login', HttpStatus.UNAUTHORIZED);
      }
    } else {
      wallet = await this.walletService.login(params.id, walletData);
    }

    // try create bitrefill order (store order info to DB)
    const orderParams = {
      operatorSlug: body.slug,
      valuePackage: body.value,
      count: 1,
      giftInfo: {
        recipientName: 'User',
        senderName: 'Come (push wallet)',
        message: '',
        recipientEmail: body.recipientEmail,
      },
    };
    const order = await this.bitrefillService.createPreOrder(orderParams);
    if (order && order.orders && order.orders.length > 0) {
      // add fee for convertation
      const amountBTC = new Decimal(order.satoshiPrice)
        .mul(1.1)
        .div(SAT_BTC)
      ;
      // if success, try calculate BTC > BIP (bipex)
      const convertInfo = await this.bipexService.getBIPSumToConvert(amountBTC);
      // check balans up on bipex for this sum
      let depositSuccess = false;
      for (let attempt = 0; attempt < 10; attempt += 1) {
        depositSuccess = await this.bipexService.checkDepositSum(wallet.mxaddress, convertInfo.amountBIP);
        if (depositSuccess) {
          break;
        }
        await this.delay(3 * 1000); // 3 sec
      }
      if (!depositSuccess) {
        throw new HttpException('fail deposit BIP', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // buy BTC
      const status = await this.bipexService.createBuyOrder(convertInfo.amountBIP, convertInfo.price);
      if (status) {
        // buy btc success -> pay for item
        const orderId = await this.bitrefillService.createOrder({
          operatorSlug: body.slug,
          valuePackage: body.value,
          email: body.recipientEmail,
        });
        const result = await this.bitrefillService.paymentOrder(orderId);

        if (result) {
          return JSON.stringify({
            status: 'ok',
          });
        }
      }
    }

    throw new HttpException('fail to create order', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /*@Post(':id/services/bitrefill1')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Try create bitrefill order'})
  async tryCreateBitrefillOrder1(@Param() params, @Body() walletData: WalletDto, @Body() body) {
    // add fee for convertation
    const amountBTC = new Decimal(8900)
      .mul(1.1)
      .div(SAT_BTC)
    ;
    // if success, try calculate BTC > BIP (bipex)
    const convertInfo = await this.bipexService.getBIPSumToConvert(amountBTC);
    // check balans up on bipex for this sum
    const status = await this.bipexService.createBuyOrder(convertInfo.amountBIP, convertInfo.price);
  }*/

  /*@Post(':id/services/bitrefill/buy')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Try buy bitrefill order'})
  async tryBuyBitrefillOrder(@Param() params, @Body() walletData: WalletDto, @Body() body) {
    if (walletData.custom) {
      const wallet = await this.walletService.custom(null, params.id, walletData);
      if (!wallet) {
        throw new HttpException('need login', HttpStatus.UNAUTHORIZED);
      }
    } else {
      await this.walletService.login(params.id, walletData);
    }

    // try convert BIP in bipex to BTC
  }*/

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get wallet information by UID'})
  async getWallet(@Param() params): Promise<Wallet> {
    return this.walletService.get(params.id);
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Check login or activate wallet'})
  async activateWallet(@Param() params, @Body() walletData: WalletDto): Promise<Wallet> {
    if (walletData.custom) {
      const company = await this.companyService.getCustomCompany();

      return this.walletService.custom(company, params.id, walletData);
    }
    return this.walletService.login(params.id, walletData);
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
