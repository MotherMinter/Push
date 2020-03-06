import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';

@Injectable()
export class BitrefillService {
  private authKey;
  private authSecret;
  private authToken;
  private authEmail;
  private depositAddress;
  private client;
  private clientApi;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.authKey = this.configService.get<string>('BITREFILL_API_KEY');
    this.authSecret = this.configService.get<string>('BITREFILL_API_SECRET');
    this.authToken = this.configService.get<string>('BITREFILL_TOKEN');
    this.authEmail = this.configService.get<string>('BITREFILL_EMAIL');
    this.depositAddress = this.configService.get<string>('BITREFILL_DEPOSIT_ADDRESS');

    // this.client = axios.create({ method: 'POST', baseURL: 'https://api.bitrefill.com/v1'});
    this.client = axios.create({ baseURL: 'https://www.bitrefill.com/api/', headers: {
        authorization: `Token ${this.authToken}`,
      },
    });
    this.clientApi = axios.create({
      baseURL: 'https://api.bitrefill.com/v1/',
      method: 'POST',
      auth: {
        username: this.authKey,
        password: this.authSecret,
      },
    });
  }

  /*  async paymentOrder(params) {
    if (!params.operatorSlug || !params.valuePackage) {
      global.console.error('fail to create bitrefill order for', params);
      return false;
    }

    try {
      const response = await this.client.request({
        url: 'purchase',
        method: 'POST',
        data: params,
      });
      global.console.info(response.data);

      if (response.data && response.data.status === 'success') {
        return true;
      }

      global.console.error(response.data);
    } catch (error) {
      global.console.error(error);
    }
    return false;
  }*/

  async checkList(slug) {
    try {
      const response = await this.client.request({
        url: `product/${slug}`,
        method: 'GET',
      });
      if (response.data && response.data.packages) {
        global.console.log((new Date()).toISOString(), 'bitrefill', slug, response.data.packages);
        return response.data.packages
          .map((item) => {
            if (item.value.length < 7) {
              item.label = `${item.value} ${response.data.currency}`;
            } else {
              item.label = item.value;
            }
            return item;
          });
      }
    } catch (error) {
      global.console.error((new Date()).toISOString(), 'bitrefill', slug, error);
    }
    return false;
  }

  async createPreOrder(orderParams) {
    try {
      const response = await this.client.request({
        url: 'accounts/invoice',
        method: 'POST',
        data: {
          items: [
            orderParams,
          ],
          email: this.authEmail,
          isSubscribing: false,
          paymentMethod: 'dashboard',
        },
      });
      global.console.log((new Date()).toISOString(), 'bitrefill', orderParams, response.data);

      if (response.data && response.data.status === 'unpaid' && response.data.id) {
        return response.data;
      }
    } catch (error) {
      global.console.error((new Date()).toISOString(), 'bitrefill', orderParams, error);
    }
    return false;
  }

  async createOrder(params) {
    if (!params.operatorSlug || !params.valuePackage) {
      global.console.error((new Date()).toISOString(), 'bitrefill', 'fail to create bitrefill order for', params);
      return false;
    }

    try {
      const response = await this.clientApi.request({
        url: 'order',
        data: params,
      });
      global.console.log((new Date()).toISOString(), 'bitrefill', response.data);

      if (response.data && response.data.status === 'unpaid') {
        // store and return order information
        return response.data.id;
      }

      global.console.error((new Date()).toISOString(), 'bitrefill', response.data);
    } catch (error) {
      global.console.error((new Date()).toISOString(), 'bitrefill', error);
    }
    return null;
  }

  /*async payInvoice(orderId) {
    try {
      const response = await this.client.request({
        url: 'accounts/pay_invoice',
        method: 'POST',
        data: {
          invoiceId: orderId,
          currency: 'XBT',
        },
      });
      global.console.info(orderId, response.data);

      if (response.data) {
        return response.data;
      }
    } catch (error) {
      global.console.error(orderId, error);
    }
    return false;
  }*/

  async paymentOrder(orderId) {
    if (!orderId) {
      global.console.error((new Date()).toISOString(), 'bitrefill', 'fail to create bitrefill order for', orderId);
      return false;
    }

    try {
      const response = await this.clientApi.request({
          url: `order/${orderId}/purchase`,
        });
      global.console.log((new Date()).toISOString(), 'bitrefill', orderId, response.data);
    } catch (error) {
      global.console.log((new Date()).toISOString(), 'bitrefill', orderId);
    }
    return true;
  }

  async getDepositAddress() {
    /*try {
      const response = await this.client.request({
        url: 'accounts/deposit_address',
        method: 'GET',
      });
      if (response.data && response.data.account_id) {
        global.console.info(response.data.account_id);
        return response.data.account_id;
      }
    } catch (error) {
      global.console.error(error);
    }
    return false;*/
    return this.depositAddress;
  }
}
