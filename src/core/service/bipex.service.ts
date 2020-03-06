import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';
import FormData = require('form-data');

@Injectable()
export class BipexService {
  private authKey;
  private client;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.authKey = this.configService.get<string>('BIPEX_AUTH_KEY');
    this.client = axios.create({
      method: 'POST',
      baseURL: 'https://bipex.net/dex/ajax.php',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getBIPSumToConvert(amountBTC: Decimal, symbol: string = 'BTC') {
    // get open order in bipex
    // calculate sum in BIP
    let sum = new Decimal(0);
    let maxPrice = new Decimal(0);
    let sumBip = new Decimal(0);

    try {
      const bodyFormData = new FormData();
      bodyFormData.append('getOrders', '1');
      bodyFormData.append('token', symbol);
      bodyFormData.append('authkey', this.authKey);

      const response = await this.client.request({
        data: bodyFormData,
        headers: bodyFormData.getHeaders(),
      });
      if (response.data && response.data.BUY && response.data.BUY.BTC) {
        // tslint:disable-next-line:forin
        for (const key in response.data.BUY.BTC) {
          const item = response.data.BUY.BTC[key];
          if (amountBTC.gte(sum)) {
            sum = sum.plus(new Decimal(item.volume).mul(item.price));
            maxPrice = new Decimal(item.price);
          } else {
            break;
          }
        }
      }
    } catch (error) {
      global.console.error((new Date()).toISOString(), 'bipex', error);

      return null;
    }

    sumBip = amountBTC
      .div(maxPrice)
      .floor()
    ;
    // return it
    return {
      amountBTC,
      amountBIP: sumBip,
      price: maxPrice,
    };
  }

  async checkDepositSum(addressFrom: string, amountBIP: Decimal) {
    // get open order in bipex
    // calculate sum in BIP
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('getOrders', '1');
      bodyFormData.append('onlyMy', '1');
      bodyFormData.append('authkey', this.authKey);

      const response = await this.client.request({
        data: bodyFormData,
        headers: bodyFormData.getHeaders(),
      });
      if (response.data && response.data.DEPOSIT) {
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < response.data.DEPOSIT.length; index += 1) {
          const item = response.data.DEPOSIT[index];

          if (item.type === 'deposit') {
            const depositSum = new Decimal(item.dat).mul(1.05);
            const txResponse = await axios.get(`https://explorer-api.minter.network/api/v1/transactions/${item.tx}`);
            if (txResponse && txResponse.data && txResponse.data.data) {
              global.console.log((new Date()).toISOString(), 'bipex', amountBIP.toString(), depositSum.toString(), txResponse.data.data.from);
              if (txResponse.data.data.from === addressFrom && depositSum.gte(amountBIP)) {
                return true;
              }
            }
          }
        }
      }
    } catch (error) {
      global.console.error((new Date()).toISOString(), 'bipex', error);
    }

    return false;
  }

  async createBuyOrder(amountBIP: Decimal, priceBTC: Decimal, symbol: string = 'BTC') {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('type', 'sell');
      bodyFormData.append('addDeal', '1');
      bodyFormData.append('token', symbol);
      bodyFormData.append('amount', amountBIP.toString());
      bodyFormData.append('price', priceBTC.toString());
      bodyFormData.append('authkey', this.authKey);

      const response = await this.client.request({
        method: 'POST',
        data: bodyFormData,
        headers: bodyFormData.getHeaders(),
      });

      if (response.data && response.data.OK) {
        return true;
      }

      global.console.error((new Date()).toISOString(), 'bipex', response.data);
    } catch (error) {
      global.console.error((new Date()).toISOString(), 'bipex', error);
    }
    return false;
  }

  async getDepositAddress() {
    return this.configService.get<string>('BIPEX_BIP_DEPOSIT_ADDRESS');
  }

  async withdrawalBTC(btcAddress, amountBTC: Decimal, symbol: string = 'BTC') {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('withdraw', '1');
      bodyFormData.append('token', symbol);
      bodyFormData.append('amount', amountBTC.toString());
      bodyFormData.append('address', btcAddress);
      bodyFormData.append('authkey', this.authKey);

      const response = await this.client.request({
        method: 'POST',
        data: bodyFormData,
        headers: bodyFormData.getHeaders(),
      });

      if (response.data && response.data.OK) {
        return true;
      }

      global.console.error((new Date()).toISOString(), 'bipex', response.data);
    } catch (error) {
      global.console.error((new Date()).toISOString(), 'bipex', error);
    }
    return false;
  }

  async getBalance() {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('getOrders', '1');
      bodyFormData.append('onlyMy', '1');
      bodyFormData.append('authkey', this.authKey);

      const response = await this.client.request({
        data: bodyFormData,
        headers: bodyFormData.getHeaders(),
      });
      if (response.data && response.data.REALBALANCE) {
        // tslint:disable-next-line:prefer-for-of
        return new Decimal(response.data.REALBALANCE.BTC);
      }
    } catch (error) {
      global.console.error((new Date()).toISOString(), 'bipex', error);
    }

    return null;
  }
}
