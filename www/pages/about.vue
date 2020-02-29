<template>
    <div>
        <header>
          <a href="/" class="logo"><img src="/assets/img/svg/5sgift.svg" alt=""></a>
            <div :class="{'hamburger-active': IsActiveHamburgerClass}" class="hamburger" v-on:click="toggleMenu()">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
        <div class="menu">
            <ul class="nav">
              <li><a href="/">{{ $t('menu.home') }}.</a></li>
              <li><a href="/about/">{{ $t('menu.about') }}.</a></li>
              <!--<li><a href="#">{{ $t('menu.account') }}.</a></li>-->
              <li><a href="/">{{ $t('menu.createWallet') }}.</a></li>
            </ul>
            <div class="lang-block">
                <button class="btn lang-active"><img src="/assets/img/svg/en.svg" alt="">En</button>
                <button class="btn"><img src="/assets/img/svg/rus.svg" alt="">Rus</button>
            </div>
        </div>
        <!-- /Header -->
        <!-- Content -->
        <main v-if="step === 1">
            <div class="container">
                <div class="conten-items">
                    <!-- Content Start -->
                    <div class="content__item about">
                        <h1>{{ $t('about.title') }}</h1>
                        <p>{{ $t('about.text') }}</p>
                        <p class="caption">{{ $t('about.titleLink') }}</p>
                        <ul class="useful-links">
                            <li><a target="_blank" rel="nofollow" href="https://www.minter.network/">{{ $t('about.link1') }}</a></li>
                            <li><a target="_blank" rel="nofollow" href="https://about.minter.network/">{{ $t('about.link2') }}</a></li>
                            <li><a target="_blank" rel="nofollow" href="https://console.minter.network/">{{ $t('about.link3') }}</a></li>
                            <li><a target="_blank" rel="nofollow" href="https://t.me/MinterTeam">{{ $t('about.link4') }}</a></li>
                        </ul>
                    </div>
                    <!-- /Content Start -->
                </div>
            </div>
        </main>
        <!-- /Content -->
        <!-- Footer -->
        <footer>
            <a href="https://www.minter.network/" target="_blank" class="copy">Powered by <span>Minter</span></a>
        </footer>
        <!-- /Footer -->
        <!-- /Page -->
        <!-- Scripts -->
        <transition name="fade">
            <div class="menu" v-bind:class="{ 'menu-visible': isShowMenu }" v-if="isShowMenu">
                <ul class="nav">
                    <li><a href="/">{{ $t('menu.home') }}.</a></li>
                    <li><a href="/about/">{{ $t('menu.about') }}.</a></li>
                    <!--<li><a href="#">{{ $t('menu.account') }}.</a></li>-->
                    <li><a href="#" v-on:click="startCreateMenu()">{{ $t('menu.createWallet') }}.</a></li>
                </ul>
                <div class="lang-block">
                    <button class="btn" v-bind:class="{ 'lang-active': currentLang === 'en' }"  v-on:click="changeLocale('en')"><img src="/assets/img/svg/en.svg" alt="">En</button>
                    <button class="btn" v-bind:class="{ 'lang-active': currentLang === 'ru' }"  v-on:click="changeLocale('ru')"><img src="/assets/img/svg/rus.svg" alt="">Rus</button>
                </div>
            </div>
        </transition>

        <div class="container">
            <div class="conten-items">

                <!-- Content Choose Wallet -->
                <transition name="fade">
                    <div v-if="step === 2" class="content__item content__choose-wallet content__item-active step-2">
                        <h5 v-html="newLineLabel($t('create.title'))"></h5>
                        <div class="buttons">
                            <button v-on:click="isCreateOne = true" class="btn btn-radio" v-bind:class="{ 'btn-radio__active': isCreateOne }">
                                <span class="outer"><span class="internal"></span></span>{{ $t('create.one') }}
                            </button>
                            <button v-on:click="isCreateOne = false" class="btn btn-radio" v-bind:class="{ 'btn-radio__active': !isCreateOne }">
                                <span class="outer"><span class="internal"></span></span>{{ $t('create.multi') }}
                            </button>
                        </div>
                        <a class="more-about" v-on:click="toggleShowType()">{{ $t('create.learnMore') }}</a>
                        <div>
                            <div class="buttons-one" v-show="isCreateOne">
                                <a class="btn" id="simple" v-on:click="startCreateSimple()"><img src="/assets/img/svg/wallet_light.svg" alt="">{{ $t('create.simple') }}</a>
                                <a class="btn" id="feedback" v-on:click="startCreateFeedback()"><img src="/assets/img/svg/feedback.svg" alt="">{{ $t('create.feedback') }}</a>
                                <a class="btn" id="action" v-on:click="startCreateAction()"><img src="/assets/img/svg/action.svg" alt="">{{ $t('create.action') }}</a>
                            </div>
                            <div class="buttons-multiple" v-if="!isCreateOne" style="display: block;">
                                <a class="btn" id="simple" v-on:click="startCreateSimple()"><img src="/assets/img/svg/wallet_light.svg" alt="">{{ $t('create.simple') }}</a>
                                <a class="btn" id="feedback" v-on:click="startCreateFeedback()"><img src="/assets/img/svg/feedback.svg" alt="">{{ $t('create.feedback') }}</a>
                            </div>
                        </div>
                    </div>
                </transition>
                <!-- /Content Choose Wallet -->

                <!-- Content Attach Messege -->
                <transition name="fade">
                    <div v-if="step === 3" class="content__item content__attach-messege content__item-active">
                        <form>

                            <p style="margin-bottom: 0">{{ $t('create.attachMessage') }}?</p>
                            <div class="trigger trigger-01" v-bind:class="{ 'trigger-active': isActiveTrigger01 }" v-on:click="isActiveTrigger01 = !isActiveTrigger01">
                                <span class="trigger_no">{{ $t('NO') }}</span><span class="trigger_circle"></span><span class="trigger_yes">{{ $t('YES') }}</span>
                            </div>
                            <transition name="fadeDown">
                                <input id="input-01" v-if="isActiveTrigger01" type="text" v-bind:placeholder="$t('create.yourMessageHere')" v-model="createParamMessage" style="display: block">
                            </transition>
                            <p style="margin-bottom: 0">{{ $t('create.putPassword') }}?</p>
                            <div class="trigger trigger-02" v-bind:class="{ 'trigger-active': isActiveTrigger02 }" v-on:click="isActiveTrigger02 = !isActiveTrigger02">
                                <span class="trigger_no">{{ $t('NO') }}</span><span class="trigger_circle"></span><span class="trigger_yes">{{ $t('YES') }}</span>
                            </div>
                            <transition name="fadeDown">
                                <input id="input-02" v-if="isActiveTrigger02" type="password" v-bind:placeholder="$t('create.yourPasswordHere')" v-model="createParamPassword" style="display: block">
                            </transition>
                        </form>
                        <button class="btn" v-on:click="startCreateWallet()">{{ $t('goToNext') }}</button>
                        <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
                    </div>
                </transition>
                <!-- /Content Attach Messege -->

                <!-- Content Describe Feedback -->
                <transition name="fade">
                    <div v-if="step === 31" class="content__item content__describe-action content__item-active content__item-active">
                        <p>{{ $t('create.feedbackTitle') }}</p>
                        <div class="text-wrap">
                            <textarea id="ta" name="" maxlength="140" v-bind:placeholder="$t('create.feedbackPlaceholder')" @input="inputValue(0, $event)" v-model="createParamMessage"></textarea>
                            <div class="max-lenght">
                                <span id="max_lenght">{{ msgSize }}</span>
                                <img v-show="isTextarea[0]" src="/assets/img/svg/feedback_grey.svg" alt="">
                            </div>
                        </div>
                        <input type="text" v-bind:placeholder="$t('create.backEmail')" v-model="createParamEmail">
                        <button class="btn" v-on:click="startCreateWallet()">{{ $t('goToNext') }}</button>
                        <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
                    </div>
                </transition>
                <!-- /Content Describe Feedback -->

                <!-- Content Describe Action -->
                <transition name="fade">
                    <div v-if="step === 32" class="content__item content__describe-action content__item-active content__item-active">
                        <p>{{ $t('create.actionTitle') }}</p>
                        <div class="text-wrap">
                            <textarea id="ta" name="" maxlength="140" v-bind:placeholder="$t('create.actionPlaceholder')" @input="inputValue(1, $event)" v-model="createParamMessage"></textarea>
                            <div class="max-lenght">
                                <span id="max_lenght">{{ msgSize }}</span>
                                <img v-show="isTextarea[1]" src="/assets/img/svg/action_grey.svg" alt="">
                            </div>
                        </div>
                        <input type="text" v-bind:placeholder="$t('create.actionEmail')" v-model="createParamEmail">
                        <button class="btn" v-on:click="startCreateWallet()">{{ $t('goToNext') }}</button>
                        <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
                    </div>
                </transition>
                <!-- /Content Describe Action -->

                <!-- Content Type Wallet -->
                <transition name="fade">
                    <div v-if="step === 6" class="content__item content__type-wallet content__item-active">
                        <h1>{{ $t('create.numberCreate') }}?</h1>
                        <a class="more-about" v-on:click="toggleShowNType()">{{ $t('create.learnMore') }}</a>
                        <a class="btn" v-on:click="startCreateMultiFixed()"><img src="/assets/img/svg/fixed_1.svg" alt="">{{ $t('Fixed') }}</a>
                        <a class="btn" v-on:click="startCreateMultiUnlim()"><img src="/assets/img/svg/unlimited_1.svg" alt="">{{ $t('Unlimited') }}</a>

                        <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
                    </div>
                </transition>
                <!-- /Content Type Wallet -->

                <!-- Content Form multiply simple unlim  -->
                <transition name="fade">
                    <div v-if="step === 7" class="content__item content__form content__item-active">
                        <p class="unlimited" v-if="!createParamIsFixed">{{ $t('create.numberWalletUnlim') }}</p>
                        <input type="text" v-if="createParamIsFixed" class="input" v-bind:placeholder="$t('create.numberWallet')" v-model="createParamCount">

                        <input type="text" class="input" v-bind:placeholder="$t('create.oneWalletBalance')" v-model="createParamBalance">
                        <!--<input type="text" class="input" v-bind:placeholder="$t('create.numberWallet')" placeholder="Message (optional)">-->
                        <input type="text" class="input" v-bind:placeholder="$t('create.yourEmail')" v-model="createParamEmail">
                        <input type="password" class="input" v-bind:placeholder="$t('create.passToCompany')" v-model="createParamCompanyPass">
                        <button class="btn" v-on:click="startCreateCompanyParams()">{{ $t('goToNext') }}</button>
                        <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
                    </div>
                </transition>
                <!-- /Content Form -->

                <!-- Content Describe Feedback -->
                <transition name="fade">
                    <div v-if="step === 71" class="content__item content__describe-action content__item-active content__item-active">
                        <p>{{ $t('create.feedbackTitle') }}</p>
                        <div class="text-wrap">
                            <textarea id="ta" name="" maxlength="140" v-bind:placeholder="$t('create.feedbackPlaceholder')" v-model="createParamMessage"></textarea>
                            <div class="max-lenght">
                                <span id="max_lenght">{{ msgSize }}</span>
                                <img src="/assets/img/svg/feedback_grey.svg" alt="">
                            </div>
                        </div>
                        <button class="btn" v-on:click="startCreateCompany()">{{ $t('goToNext') }}</button>
                        <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
                    </div>
                </transition>
                <!-- /Content Describe Feedback -->

                <!-- Content Coins Address -->
                <transition name="fade">
                    <div v-if="step === 4" class="content__item content__coins-address content__item-active">
                        <h5 v-if="!this.isBalanceGreatThenZero">{{ $t('create.plzFill') }}</h5>
                        <h5 v-if="this.isBalanceGreatThenZero">{{ $t('create.plzFillPart1') }} <span v-on:click="copyToClipboard(minNewBalance)">{{ minNewBalance }} {{ $t('create.minBalanceCoin')}}</span> {{ $t('create.plzFillPart2') }}</h5>
                        <div :class="{'active-copy' : isCopiededAdress}" class="copy_link">
                            <p>{{ addressForFilling }}</p>
                            <button class="btn btn-copy" v-on:click="copyToClipboard(addressForFilling, $event)">Copy<img src="/assets/img/svg/copy.svg" alt=""></button>
                        </div>
                        <div class="qr-code" v-if="typeof addressForFilling !== 'undefined'">
                            <qrcode v-bind:value="addressForFilling" :options="{ width: 121 }" tag="img"></qrcode>
                        </div>
                        <button class="btn" v-on:click="startCreateSuccess()">{{ $t('goToNext') }}</button>
                        <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
                    </div>
                </transition>
                <!-- /Content Coins Address -->

                <!-- Content Success -->
                <transition name="fade">
                    <div v-if="step === 5" class="content__item content__success content__item-active">
                        <h1>{{ $t('success') }}!</h1>
                        <p>{{ $t('create.willReceive') }}:</p>
                        <div class="score">
                            <p class="balance" v-for="balance in balances">{{ prettyFormat(balance.amount) }} {{ balance.coin }}</p>
                            <p class="currency">~{{ balanceSum }}</p>
                        </div>
                        <p class="share">{{ $t('create.shareLink') }}:</p>
                        <div :class="{'active-copy' : isCopiededSuccess}" class="copy_link">
                            <p>{{ createdLink }}</p>
                            <div class="buttons">
                                <button class="btn btn-copy btn-link-copy" v-on:click="copyToClipboard(createdLink, $event)">{{ $t('Link') }}<img src="/assets/img/svg/copy.svg" alt=""></button>
                                <button class="btn btn-copy btn-qr" v-on:click="toggleShowQR(createdLink)">QR<img src="/assets/img/svg/qr_link_blue.svg" alt=""></button>
                                <!--<button class="btn btn-copy btn-share disabled">{{ $t('Share') }}<img src="/assets/img/svg/share.svg" alt=""></button>-->
                                <button class="btn btn-copy btn-more" v-on:click="toggleShowDir()">{{ $t('More') }}<span>...</span></button>
                            </div>
                        </div>
                        <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
                        <div class="back"></div>
                    </div>
                </transition>
                <!-- /Content Success -->

                <!-- Content Success -->
                <transition name="fade">
                    <div v-if="step === 51" class="content__item content__success content__success-multiple content__item-active">
                        <h1>{{ $t('success') }}!</h1>
                        <p v-if="!createParamIsFixed" v-html="newLineLabel($t('create.successUnlim'))">:</p>
                        <p v-if="createParamIsFixed">{{ createParamCount }} <span v-html="newLineLabel($t('create.successFixed'))"></span></p>
                        <div class="score">
                            <p class="balance" v-for="balance in balances">{{ prettyFormat(balance.amount) }} {{ balance.coin }}</p>
                            <p class="currency">~{{ balanceSum }}</p>
                        </div>
                        <p class="share">{{ $t('create.walletList') }}:</p>
                        <div class="send_link">
                            <div class="buttons">
                                <button id="send" class="btn btn-copy" v-on:click="sendListToEmail()">{{ $t('create.sendEmail') }}<img src="/assets/img/svg/email.svg" alt=""></button>
                                <button v-if="createParamIsFixed" id="save" class="btn btn-copy" v-on:click="copyList()">{{ $t('create.sendList') }}<img src="/assets/img/svg/download.svg" alt=""></button>
                                <button v-if="!createParamIsFixed" id="copy" class="btn btn-copy" v-on:click="copyUrlSuccess()">{{ $t('create.copyLink') }}<img src="/assets/img/svg/copy.svg" alt=""></button>
                                <!--<button id="share" class="btn btn-copy disabled">{{ $t('create.shareList') }}<img src="/assets/img/svg/share.svg" alt=""></button>-->
                            </div>
                        </div>
                        <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
                        <div class="back"></div>
                    </div>
                </transition>
                <!-- /Content Success -->
            </div>
        </div>
        <!-- Modal Activation Types-->
        <transition name="fade">
            <div class="modal-alert modal-activation-types" v-bind:class="{ 'modal-activation-types-active': isShowModalType }" v-show="isShowModalType">
                <div class="container">
                    <div class="close-modal-alert" v-on:click="toggleShowType()">
                        <span></span><span></span>
                    </div>
                    <h5>{{ $t('create.detailTypeTitle') }}</h5>
                    <!--<p class="title"><img src="/assets/img/svg/wallet_dark.svg" alt="">{{ $t('create.simple') }}</p>
                    <p>{{ $t('create.detailSimple') }}</p>-->
                    <p class="title"><img src="/assets/img/svg/feedback_dark.svg" alt="">{{ $t('create.feedback') }}</p>
                    <p>{{ $t('create.detailFeedback') }}</p>
                    <p class="title"><img src="/assets/img/svg/action_dark.svg" alt="">{{ $t('create.action') }}</p>
                    <p>{{ $t('create.detailAction') }}</p>
                </div>
            </div>
        </transition>
        <!-- /Modal Activation Types -->

        <!-- Modal Activation Types-->
        <transition name="fade">
            <div class="modal-alert modal-activation-types modal-type2" v-bind:class="{ 'modal-activation-types-active': isShowModalNType }" v-show="isShowModalNType">
                <div class="container">
                    <div class="close-modal-alert" v-on:click="toggleShowNType()">
                        <span></span><span></span>
                    </div>
                    <p class="title"><img src="/assets/img/svg/fixed_1.svg" alt="">{{ $t('Fixed') }}</p>
                    <p v-html="$t('create.fixedDetail')"></p>
                    <p class="title"><img src="/assets/img/svg/unlimited_1.svg" alt="">{{ $t('Unlimited') }}</p>
                    <p v-html="$t('create.unlimDetail')"></p>
                </div>
            </div>
        </transition>
        <!-- /Modal Activation Types -->

        <!-- Modal QR -->
        <div class="modal-alert modal-qr" v-bind:class="{ 'modal-activation-qr': isShowModalQR }" v-if="isShowModalQR">
            <div class="close-modal-alert" v-on:click="toggleShowQR()">
                <span></span><span></span>
            </div>
            <qrcode v-bind:value="qrLink" :options="{ width: 250 }" tag="img"></qrcode>
        </div>
        <!-- /Modal QR -->

        <!-- Direct Links -->
        <div class="modal-alert modal-dir-links" v-bind:class="{ 'modal-activation-dir': isShowModalDir }" v-if="isShowModalDir">
            <h5>{{ $t('directLinks.title') }}:</h5>
            <div class="links-items">
                <div class="links__item">
                    <img src="/assets/img/svg/services.svg" alt="">
                    <span>Mobile<br>services</span>
                    <img v-on:click="copyToClipboard(createdLinkMobile)" src="/assets/img/svg/copy.svg" alt="">
                    <img v-on:click="toggleShowQR(createdLinkMobile)" class="qr" src="/assets/img/svg/qr_link_blue.svg" alt="">
                </div>
                <div class="links__item">
                    <img src="/assets/img/svg/games.svg" alt="">
                    <span>Games</span>
                    <img v-on:click="copyToClipboard(createdLinkGame)" src="/assets/img/svg/copy.svg" alt="">
                    <img v-on:click="toggleShowQR(createdLinkGame)" class="qr" src="/assets/img/svg/qr_link_blue.svg" alt="">
                </div>
                <div class="links__item">
                    <img src="/assets/img/svg/charity.svg" alt="">
                    <span>Charity<br>fund</span>
                    <img v-on:click="copyToClipboard(createdLinkFund)" src="/assets/img/svg/copy.svg" alt="">
                    <img v-on:click="toggleShowQR(createdLinkFund)" class="qr" src="/assets/img/svg/qr_link_blue.svg" alt="">
                </div>
                <div class="links__item">
                    <img src="/assets/img/svg/fuel.svg" alt="">
                    <span>gas<br>bonus</span>
                    <p>Coming soon.<br>Powered by NUT.<br><img src="/assets/img/svg/hazelnut.svg" alt=""></p>
                </div>
            </div>
            <button v-on:click="toggleShowDir()" class="btn btn-more btn-back"><img src="/assets/img/svg/back.svg" alt="">back</button>
        </div>
        <!-- /Direct Links -->

        <!-- Modal Alert -->
        <div class="modal-alert" v-bind:class="{ 'modal-activation-error': isShowError }" v-if="isShowError">
            <div class="close-modal-alert" v-on:click="closeError()">
                <span></span><span></span>
            </div>
            <p>{{ errorMsg }}</p>
        </div>
        <!-- /Modal Alert -->
    </div>
</template>

<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  import axios from 'axios'
  import VueQrcode from '@chenfengyuan/vue-qrcode'
  import { Decimal } from 'decimal.js'

  import {
    LINK,
    BACKEND_BASE_URL,
    createWallet,
    generateWalletUid,
    getAddressBalance,
    getCoinExchangeList,
    getFiatExchangeList,
    getBipPrice,
    prettyFormat, createCompany, DEFAULT_SYMBOL, getFiatByLocale, ACTIVATE_FEE
  } from './core'

  if (process.client) {
    Vue.use(VueClipboard)
  }

  export default {
    components: {
      //qrcode: VueQrcode,
    },
    data () {
      return {
        step: 1,
        prevStep: [],
        errorMsg: '',
        isShowError: false,

        isShowLoader: false,
        isShowMenu: false,
        isShowModalType: false,
        isShowModalNType: false,
        isShowModalQR: false,
        isShowModalDir: false,
        isCreateOne: true,
        isActiveTrigger01: false,
        isActiveTrigger02: false,
        isAddressFilling: false,
        IsActiveHamburgerClass: false,
        isCopiededAdress: false,
        isCopiededSuccess: false,
        isTextarea: [true, true],
        isHideAboutBlock: false,

        qrLink: 'empty',

        // create wallet params
        createParamMessage: '',
        createParamPassword: '',
        createParamEmail: '',
        createParamUID: '',
        createParamType: 'simple',
        createParamCount: 0,
        createParamIsFixed: true,
        createParamBalance: '',
        createParamCompanyPass: '',
        company: null,
        companyLink: '',
        minNewBalance: 0,
        isBalanceGreatThenZero: false,

        balances: [],
        addressForFilling: 'empty',
        checkInterval: null,
        coins: [],
        bipToUSD: null,
        fiat: [],
        balanceSumUSD: 0,
        balanceSumFiat: 0,

        maxLen: 140,
        minLen: 100,

      }
    },
    created () {
    },
    computed: {
      currentLang() {
        return this.$i18n.locale
      },
      createdLink() {
        return `${LINK}${this.createParamUID}`
      },
      createdLinkMobile() {
        return `${LINK}${this.createParamUID}#mobile`
      },
      createdLinkGame() {
        return `${LINK}${this.createParamUID}#game`
      },
      createdLinkFund() {
        return `${LINK}${this.createParamUID}#fund`
      },
      msgSize() {
        return this.maxLen - this.createParamMessage.length
      },
      isMinMsgSize() {
        return this.createParamMessage.length > this.minLen
      },
      balanceSum() {
        const fiatVal = getFiatByLocale(this.currentLang)
        const fiatSymbol = fiatVal ? fiatVal.symbol : ''
        if (this.currentLang === 'en') {
          return `${this.balanceSumUSD.toFixed(4)} $`
        }
        return `${this.balanceSumFiat.toFixed(2)} ${fiatSymbol}`
      },
    },
    // method
    methods: {
      changeLocale: function (locale) {
        this.$i18n.setLocaleCookie(locale)
        this.$i18n.setLocale(locale)
      },
      toggleMenu: function () {
        this.isShowMenu = !this.isShowMenu
        this.IsActiveHamburgerClass = !this.IsActiveHamburgerClass
      },
      toggleShowType: function () {
        this.isShowModalType = !this.isShowModalType
      },
      toggleShowNType: function () {
        this.isShowModalNType = !this.isShowModalNType
      },
      toggleShowQR: function (link = 'empty') {
        this.isShowModalQR = !this.isShowModalQR
        this.qrLink = link
      },
      toggleShowDir: function () {
        this.isShowModalDir = !this.isShowModalDir
      },
      closeError: function () {
        this.isShowError = false
      },
      startCreateMenu: function () {
        this.startCreate()
        this.toggleMenu()
        return false
      },
      startCreate: function () {
        this.prevStep.push(this.step)
        this.step = 2
        return false
      },
      clearParams: function () {
        this.createParamCompanyPass = ''
        this.createParamEmail = ''
        this.createParamMessage = ''
        this.createParamBalance = ''
        this.createParamUID = ''
        this.minNewBalance = new Decimal(0)
        this.isBalanceGreatThenZero = false
      },
      startCreateSimple: function () {
        this.prevStep.push(this.step)
        if (this.isCreateOne) {
          this.step = 3
          this.createParamType = 'simple'
        } else {
          this.step = 6
          this.createParamType = 'complex'
        }
        this.clearParams()
        return false
      },
      startCreateFeedback: function () {
        this.prevStep.push(this.step)
        if (this.isCreateOne) {
          this.step = 31
          this.createParamType = 'simple_feedback'
        } else {
          this.step = 6
          this.createParamType = 'complex_feedback'
        }
        this.clearParams()
        return false
      },
      startCreateAction: function () {
        this.prevStep.push(this.step)
        if (this.isCreateOne) {
          this.step = 32
          this.createParamType = 'simple_action'
        }
        this.clearParams()
        return false
      },
      startCreateMultiFixed: function () {
        this.createParamIsFixed = true
        this.createParamCount = ''
        this.prevStep.push(this.step)
        this.step = 7
        return false
      },
      startCreateMultiUnlim: function () {
        this.createParamIsFixed = false
        this.createParamCount = 0
        this.prevStep.push(this.step)
        this.step = 7
        return false
      },
      goBack: function () {
        this.step = this.prevStep.pop()
        return false
      },
      newLineLabel(label) {
        return label.split('|').join('<br>')
      },
      startCreateWallet: async function () {
        if (this.isActiveTrigger02 && !this.createParamPassword) {
          this.errorMsg = this.$t('errors.passErrorEmpty')
          this.isShowError = true
          return false
        }

        if ((this.step === 31 || this.step === 32) && this.createParamMessage.length === 0) {
          this.errorMsg = this.$t('errors.emptyText')
          this.isShowError = true
          return false
        }

        if ((this.step === 31 || this.step === 32) && !this.validateEmail(this.createParamEmail)) {
          this.errorMsg = this.$t('errors.failEmail')
          this.isShowError = true
          return false
        }

        this.prevStep.push(this.step)
        this.step = 4

        // generate wallet, start check balance
        this.createParamUID = await generateWalletUid()
        const wallet = await createWallet(this.createParamUID, this.createParamPassword)
        if (wallet && wallet.address) {
          this.addressForFilling = wallet.address
        } else {
          this.addressForFilling = 'empty'
        }

        // send info to server
        this.company = await createCompany({
          type: this.createParamType,
          uid: this.createParamUID,
          mxaddress: wallet.address,
          email: this.createParamEmail,
          protected: (this.createParamPassword && this.createParamPassword.length > 0),
          params: {
            notice: this.createParamMessage,
          }
        })
        this.companyLink = `${BACKEND_BASE_URL}/api/company/${this.company.uid}/get_wallet?count=1`
        console.log(this.company)

        this.loadAdditionalInfo()
        // start update balance
        /*const self = this
        this.checkInterval = setInterval(function(){
          self.checkFilledBalance()
        }, 7 * 1000)*/

        return false
      },
      startCreateCompanyParams: async function () {
        if (!this.createParamBalance) {
          this.errorMsg = this.$t('errors.balanceEmpty')
          this.isShowError = true
          return false
        }

        if (!this.createParamCount && this.createParamIsFixed) {
          this.errorMsg = this.$t('errors.countEmpty')
          this.isShowError = true
          return false
        }

        if (!this.validateEmail(this.createParamEmail)) {
          this.errorMsg = this.$t('errors.failEmail')
          this.isShowError = true
          return false
        }

        if (!this.createParamCompanyPass) {
          this.errorMsg = this.$t('errors.passErrorEmpty')
          this.isShowError = true
          return false
        }

        if (this.createParamType === 'complex_feedback') {
          this.prevStep.push(this.step)
          this.step = 71
        } else {
          this.startCreateCompany()
        }
      },
      startCreateCompany: async function () {
        if (this.createParamType === 'complex_feedback' && this.createParamMessage.length === 0) {
          this.errorMsg = this.$t('errors.emptyText')
          this.isShowError = true
          return false
        }

        this.prevStep.push(this.step)
        this.step = 4

        // send info to server
        const company = await createCompany({
          type: this.createParamType,
          uid: '',
          mxaddress: '',
          email: this.createParamEmail,
          password: this.createParamCompanyPass,
          params: {
            notice: this.createParamMessage,
            count: this.createParamCount,
            amount: this.createParamBalance,
          }
        })
        this.minNewBalance = new Decimal(this.createParamBalance)
          .plus(ACTIVATE_FEE)
          .mul(this.createParamCount)
        if (this.minNewBalance.gt(0)) {
          this.isBalanceGreatThenZero = true
        }

        if (company && company.warehouseWallet && company.warehouseWallet.mxaddress) {
          this.addressForFilling = company.warehouseWallet.mxaddress
        } else {
          this.addressForFilling = 'empty'
        }
        this.company = company
        this.loadAdditionalInfo()
        // start update balance
        /*const self = this
        this.checkInterval = setInterval(function(){
          self.checkFilledBalance()
        }, 7 * 1000)*/

        return false
      },
      loadAdditionalInfo: async function () {
        this.bipToUSD = await getBipPrice()
        this.fiat = await getFiatExchangeList()
        this.coins = getCoinExchangeList()
        this.fiat = getFiatExchangeList()
      },
      startCreateSuccess: async function () {
        if (!this.isAddressFilling) {
          await this.checkFilledBalance()
        }

        if (!this.isAddressFilling) {
          this.errorMsg = this.$t('errors.balanceError')
          this.isShowError = true
          return false
        }
        clearInterval(this.checkInterval)
        this.prevStep.push(this.step)

        if (this.isCreateOne) {
          this.step = 5
        } else {
          this.step = 51
        }

        return false
      },
      copyToClipboard: function (message, event = null) {
        this.$copyText(message).then( (e) => {
          if (event) {
            if (event.target.classList.contains('btn-link-copy')) {
              event.target.textContent = 'Copied'
              this.isCopiededSuccess = true
            } else {
              event.target.textContent = 'Copied to buffer'
              this.isCopiededAdress = true
            }
          }
        }, function (e) {
          console.log(message, e)
        })
      },
      checkFilledBalance: async function () {
        try {
          this.balanceSumUSD = new Decimal(0)
          this.balanceSumFiat = new Decimal(0)
          const balances = await getAddressBalance(this.addressForFilling)
          this.balances = balances
            .filter(({ amount }) => {
              return new Decimal(amount).gt(0)
            })
            .map(({ coin, amount }) => {
              let usdAmount = 0
              if (new Decimal(amount).gte(this.minNewBalance)) {
                this.isAddressFilling = true

                const coinToDef = this.coins[coin]
                if (coinToDef || coin === DEFAULT_SYMBOL) {
                  usdAmount = new Decimal(amount)
                    .mul(coinToDef ?? 1)
                    .mul(this.bipToUSD)

                  this.balanceSumUSD = this.balanceSumUSD.plus(usdAmount)
                }
              }

              return {
                coin,
                amount,
                usdAmount
              }
            })

          this.balanceSumFiat = this.balanceSumUSD
          const fiatVal = getFiatByLocale(this.currentLang)
          if (fiatVal) {
            const fiatCur = this.fiat[fiatVal.name]
            if (this.currentLang !== 'en' && fiatCur) {
              this.balanceSumFiat = this.balanceSumUSD
                .mul(fiatCur)
            }
          }
        } catch (error) {
          console.error(error)
          // this.errorMsg = error.message
          this.isShowError = true
        }
      },
      prettyFormat: function (value) {
        return prettyFormat(value)
      },
      sendListToEmail: async function () {
        try {
          const response = await axios.post(`${BACKEND_BASE_URL}/api/company/${this.company.uid}/email`)

          if (response && response.status === 200) {
            this.errorMsg = this.$t('successMsg.successSend')
            this.isShowError = true
          }
        } catch (error) {
          this.errorMsg = this.$t('error.errorSend')
          this.isShowError = true
        }
      },
      copyList: function () {
        if (this.company && this.company.wallets) {
          const links = this.company.wallets
            .map(({ uid }) => `${LINK}${uid}`)
            .join(' ; ')
          this.copyToClipboard(links)
        }
      },
      copyUrlSuccess: function () {
        this.copyToClipboard(this.companyLink)
      },
      validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
      },
      inputValue:function (param, e) {
        if(e.target.value.length > 0) {
          this.isTextarea[param] = false
        }else {
          this.isTextarea[param] = true
        }
      }

    },
    // html header section
    head: {
      meta: [
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'msapplication-TileImage', content: '/ms-icon-144x144.png' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'apple-touch-icon', size: '57x57', href: '/apple-icon-57x57.png', },
        { rel: 'apple-touch-icon', size: '60x60', href: '/apple-icon-60x60.png', },
        { rel: 'apple-touch-icon', size: '72x72', href: '/apple-icon-72x72.png', },
        { rel: 'apple-touch-icon', size: '76x76', href: '/apple-icon-76x76.png', },
        { rel: 'apple-touch-icon', size: '114x114', href: '/apple-icon-114x114.png', },
        { rel: 'apple-touch-icon', size: '120x120', href: '/apple-icon-120x120.png', },
        { rel: 'apple-touch-icon', size: '144x144', href: '/apple-icon-144x144.png', },
        { rel: 'apple-touch-icon', size: '152x152', href: '/apple-icon-152x152.png', },
        { rel: 'apple-touch-icon', size: '180x180', href: '/apple-icon-180x180.png', },
        { rel: 'icon', type: 'image/png', size: '192x192', href: '/android-icon-192x192.png', },
        { rel: 'icon', type: 'image/png', size: '36x36', href: '/android-icon-36x36.png', },
        { rel: 'icon', type: 'image/png', size: '96x96', href: '/android-icon-96x96.png', },
        { rel: 'icon', type: 'image/png', size: '48x48', href: '/android-icon-48x48.png', },
        { rel: 'manifest', href: '/manifest.json' },
      ]
    }
  }
</script>

<style>
    .menu-visible {
        opacity: 1;
        z-index: 9;
    }
    .modal-activation-types-active {
        opacity: 1;
        z-index: 11;
    }
    .modal-activation-qr {
        opacity: 1;
        z-index: 12;
        margin-top: 0;
    }
    .modal-activation-dir {
        opacity: 1;
        z-index: 11;
    }
    .modal-activation-error {
        opacity: 1;
        z-index: 5;
        margin-top: 0;
    }
    .lds-ripple {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
    }
    .lds-ripple div {
        position: absolute;
        border: 4px solid #dfc;
        opacity: 1;
        border-radius: 50%;
        animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }
    .lds-ripple div:nth-child(2) {
        animation-delay: -0.5s;
    }
    @keyframes lds-ripple {
        0% {
            top: 36px;
            left: 36px;
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            top: 0px;
            left: 0px;
            width: 72px;
            height: 72px;
            opacity: 0;
        }
    }
    .fade-enter-active {
        transition: opacity .7s;
    }
    .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .fadeDown-enter-active {
        animation: bounce-in .5s;
    }
    .fadeDown-leave-active {
        animation: bounce-in .5s reverse;
    }
    @keyframes bounce-in {
        0% {
            opacity: 0;
            transform: translateY(-50px);
        }
        100% {
            opacity: 1;
            transform: translateY(0px);
        }
    }
</style>
