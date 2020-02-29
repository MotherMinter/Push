<template>
  <div class="wrapper">
    <!-- Header -->
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
    <!-- /Header -->
    <main>
      <template v-if="isShowSkin">
        <iframe style="width: 100%; height: 100%; position: fixed; z-index: 100;" v-bind:src="skinContent"></iframe>
      </template>

      <div v-if="isShowLoader"  class="louder">
        <div class="louder-wrap"><div class="lds-ripple"><div></div><div></div></div></div>
      </div>

      <div class="container">
        <div class="conten-items">

          <!-- Content Start -->
          <transition name="fade">
          <div v-if="step === 1" class="content__item content__start content__item-active">
            <p>{{ $t('index.preTitle') }}</p>
            <h1>{{ $t('index.title') }}</h1>
            <a class="btn" v-on:click="startCreateSimple()">{{ $t('index.btnStartSending') }}</a>
            <a class="advanced" v-on:click="startCreate()">{{ $t('create.createTxt') }}</a>
            <div class="back">
              <div class="group">
                <img src="/assets/img/svg/back/f.svg" alt="" class="img-01">
                <img src="/assets/img/svg/back/a1.svg" alt="" class="img-02">
                <img src="/assets/img/svg/back/s.svg" alt="" class="img-03">
                <img src="/assets/img/svg/back/t.svg" alt="" class="img-04">
                <img src="/assets/img/svg/back/e.svg" alt="" class="img-05">
                <img src="/assets/img/svg/back/a2.svg" alt="" class="img-06">
                <img src="/assets/img/svg/back/s.svg" alt="" class="img-07">
                <img src="/assets/img/svg/back/y.svg" alt="" class="img-08">
              </div>
            </div>
          </div>
          </transition>
          <!-- /Content Start -->

          <!-- Content Choose Wallet -->
          <transition name="fade">
          <!--<div v-if="step === 2" class="content__item content__choose-wallet content__item-active step-2">
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
              <div class="buttons-multiple" v-show="!isCreateOne" style="display: block;">
                <a class="btn" id="simple" v-on:click="startCreateSimple()"><img src="/assets/img/svg/wallet_light.svg" alt="">{{ $t('create.simple') }}</a>
                <a class="btn" id="feedback" v-on:click="startCreateFeedback()"><img src="/assets/img/svg/feedback.svg" alt="">{{ $t('create.feedback') }}</a>
              </div>
            </div>
          </div>-->
            <div v-if="step === 2" class="content__item content__choose-wallet-new content__item-active step-2">
              <h5 v-html="newLineLabel($t('create.one'))"></h5>
              <a class="more-about" v-on:click="toggleShowType()">{{ $t('create.learnMore') }}</a>
              <a class="btn" id="feedback" v-on:click="startCreateFeedback()"><img src="/assets/img/svg/feedback.svg" alt="">{{ $t('create.feedback') }}</a>
              <a class="btn" id="action" v-on:click="startCreateAction()"><img src="/assets/img/svg/action.svg" alt="">{{ $t('create.action') }}</a>

              <h5 v-html="newLineLabel($t('create.multi'))"></h5>
              <a class="btn" id="multiple" v-on:click="showLoginModal()"><img src="/assets/img/svg/fixed_white.svg" alt="">{{ $t('create.multipleBtn') }}</a>
            </div>
          </transition>
          <!-- /Content Choose Wallet -->

          <transition name="fade">
            <!-- Content Personal Area -->
            <div v-if="step === 21"  class="content__item content__personal-area content__item-active">
              <div class="capaing-info">
                <div class="campaing-logo">
                  <a href="#" class="more-about">Logo</a>
                </div>
                <div class="personal-data">
                  <input type="text" class="input" disabled readonly="readonly" v-bind:placeholder="$t('Email')" v-model="createParamEmail">
                  <!--<input type="text" class="input" v-model="createParamBrand" v-on:focusout="createOrUpdateAccount()">-->
                </div>
              </div>
              <p class="caption">{{$t('create.myCompany')}}</p>
              <div class="campaings-items">
                <div v-for="company in companies" class="campaings__item" v-on:click="selectCompany(company)">
                  <span class="name">{{ company.uid }}</span>
                  <span class="date">{{ company.created|short }}</span>
                </div>
              </div>
              <h5>{{ $t('create.multi2')}}</h5>
              <a class="more-about" v-on:click="toggleShowType2()">{{ $t('create.learnMore') }}</a>
              <div>
                <div class="buttons-one">
                  <a class="btn" id="simple" v-on:click="startCreateSimple(false)"><img src="/assets/img/svg/wallet_light.svg" alt="">{{ $t('create.simple') }}</a>
                  <a class="btn" id="feedback" v-on:click="startCreateFeedback(false)"><img src="/assets/img/svg/feedback.svg" alt="">{{ $t('create.feedback') }}</a>
                </div>
              </div>
            </div>
            <!-- /Content Personal Areas  -->
          </transition>

          <!-- Content Attach Messege -->
          <transition name="fade">
          <div v-if="step === 3" class="content__item content__attach-messege content__item-active">
            <form>

              <p>{{ $t('create.putMoney') }}</p>
              <input id="input-01" type="text" v-bind:placeholder="$t('create.yourMoneyCountHere')" v-model="createParamBalance" style="display: block">

              <p class="options"  v-bind:class="{ 'green': isShowAdditional }">{{ $t('create.additionalOptions') }}</p>
              <div v-on:click="isShowAdditional = !isShowAdditional" class="trigger trigger-01" v-bind:class="{ 'trigger-active': isShowAdditional }" style="margin: -3px;">
                <span class="trigger_no">{{ $t('NO') }}</span><span class="trigger_circle"></span><span class="trigger_yes">{{ $t('YES') }}</span>
              </div>

              <transition name="fadeDown">
              <div class="options-wrap" v-if="isShowAdditional" style="display: block; margin-top: 5px;">
                <p>{{ $t('create.attachMessage') }}</p>
                <input id="input-02" type="text" v-bind:placeholder="$t('create.yourMessageHere')" v-model="createParamMessage" style="display: block">

                <p>{{ $t('create.putPassword') }}</p>
                <input id="input-03" type="password" v-bind:placeholder="$t('create.yourPasswordHere')" v-model="createParamPassword" style="display: block">

                <p>{{ $t('create.Skins') }}</p>
                <div class="skins-items" id="skins" style="display: block">
                  <div v-for="skin in skins" class="skins__item tab__" tabindex="0" @click="isActiveTab($event)">
                    <span v-on:click="createParamSkin = skin.id">{{ skin.label }}</span><a v-on:click="showSkinPreviewModal(skin)">{{ $t('Prev') }}</a>
                  </div>
                </div>
              </div>
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
              <textarea id="ta" name="" maxlength="140" v-bind:placeholder="$t('create.feedbackPlaceholder')" @input="inputValue(0, $event)" v-model="createParamTask"></textarea>
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
              <textarea id="ta" name="" maxlength="140" v-bind:placeholder="$t('create.actionPlaceholder')" @input="inputValue(1, $event)" v-model="createParamTask"></textarea>
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
                <textarea id="ta" name="" maxlength="140" v-bind:placeholder="$t('create.feedbackPlaceholder')" v-model="createParamTask"></textarea>
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
              <div class="copy_link">
                <p :class="{'active-copy' : isCopiededSuccess}">{{ addressForFilling }}</p>
                <div class="buttons">
                  <button :class="{'active-copy' : isCopiededSuccess}" class="btn btn-copy btn-link-copy" v-on:click="copyToClipboard(addressForFilling, $event)">Copy<img src="/assets/img/svg/copy.svg" alt=""></button>
                  <button :class="{'active-copy' : isCopiededSuccess2}" class="btn btn-copy btn-link-copy" v-on:click="copySeedToClipboard($event)">Seed<img src="/assets/img/svg/copy.svg" alt=""></button>
                  <a v-if="this.isBalanceGreatThenZero" class="btn btn-copy" target="_blank" v-bind:href="deepLink">DeepLink</a>
                </div>
              </div>
              <div class="qr-code" v-if="typeof addressForFilling !== 'undefined'">
                <qrcode v-bind:value="addressForFilling" :options="{ width: 121 }" tag="img"></qrcode>
              </div>
              <!-- <button class="btn" v-on:click="startCreateSuccess()">{{ $t('goToNext') }}</button>-->
              <!-- <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>-->
              <div class="loader-02">
                <div class="inner one"></div>
                <div class="inner two"></div>
                <div class="inner three"></div>
              </div>
              <p id="waiting">{{ $t('create.waitingForPayment') }} ...</p>

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
                <button class="btn btn-copy btn-share" v-on:click="startShare(createdLink, '', '', $event)">{{ $t('Share') }}<img src="/assets/img/svg/share.svg" alt=""></button>
                <button class="btn btn-copy btn-more" v-on:click="toggleShowDir()">{{ $t('More') }}<span>...</span></button>
              </div>
            </div>
            <!--<a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>-->
            <div class="back"></div>
          </div>
          </transition>
          <!-- /Content Success -->

          <!-- Content Success Fixed -->
          <transition name="fade">
          <div v-if="step === 51" class="content__item content__success content__success-multiple content__item-active">
            <h1>{{ $t('success') }}!</h1>
            <p v-if="createParamIsFixed">{{ createParamCount }} <span v-html="newLineLabel($t('create.successFixed'))"></span></p>
            <p v-if="!createParamIsFixed" v-html="newLineLabel($t('create.successUnlim'))">:</p>
            <div class="score">
              <p class="balance" v-for="balance in balances">{{ prettyFormat(balance.amount) }} {{ balance.coin }}</p>
              <p class="currency">~{{ balanceSum }}</p>
            </div>
            <p v-if="createParamIsFixed" class="share">{{ $t('create.walletList') }}:</p>
            <p v-if="!createParamIsFixed" class="share">{{ $t('create.grabApi') }}:</p>
            <div class="send_link">
              <div class="buttons">
                <button v-if="createParamIsFixed" id="send" class="btn btn-copy" v-on:click="sendListToEmail($event)">{{ $t('create.sendEmail') }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16">
                  <defs>
                    <style>
                      .cls-1 {
                        fill: #4a40fd;
                        fill-rule: evenodd;
                      }
                    </style>
                  </defs>
                  <path id="Forma_1" data-name="Forma 1" class="cls-1" d="M1894.63,3187h-15.26a2.313,2.313,0,0,0-2.37,2.25v11.5a2.313,2.313,0,0,0,2.37,2.25h15.26a2.32,2.32,0,0,0,2.37-2.25v-11.5A2.32,2.32,0,0,0,1894.63,3187Zm0,14.01h-15.26a0.331,0.331,0,0,1-.36-0.26v-10.11l6.9,5.75a0.775,0.775,0,0,0,.51.18h1.16a0.775,0.775,0,0,0,.51-0.18l6.9-5.75v10.11A0.331,0.331,0,0,1,1894.63,3201.01Zm-7.63-6.41-6.71-5.61h13.42Z" transform="translate(-1877 -3187)"/>
                </svg></button>
                <button v-if="!createParamIsFixed" id="send" class="btn btn-copy" v-on:click="sendLinkToEmail($event)">{{ $t('create.sendApiEmail') }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16">
                    <defs>
                      <style>
                        .cls-1 {
                          fill: #4a40fd;
                          fill-rule: evenodd;
                        }
                      </style>
                    </defs>
                    <path id="Forma_1" data-name="Forma 1" class="cls-1" d="M1894.63,3187h-15.26a2.313,2.313,0,0,0-2.37,2.25v11.5a2.313,2.313,0,0,0,2.37,2.25h15.26a2.32,2.32,0,0,0,2.37-2.25v-11.5A2.32,2.32,0,0,0,1894.63,3187Zm0,14.01h-15.26a0.331,0.331,0,0,1-.36-0.26v-10.11l6.9,5.75a0.775,0.775,0,0,0,.51.18h1.16a0.775,0.775,0,0,0,.51-0.18l6.9-5.75v10.11A0.331,0.331,0,0,1,1894.63,3201.01Zm-7.63-6.41-6.71-5.61h13.42Z" transform="translate(-1877 -3187)"/>
                  </svg></button>

                <button v-if="createParamIsFixed" id="save" class="btn btn-copy" v-on:click="copyList($event)">{{ $t('create.copyList') }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22">
                    <defs>
                      <style>
                        .cls-1 {
                          fill: #4a40fd;
                          fill-rule: evenodd;
                        }
                      </style>
                    </defs>
                    <path id="Rounded_Rectangle_6" data-name="Rounded Rectangle 6" class="cls-1" d="M860,2138h-2v2a2,2,0,0,1-2,2H846a2,2,0,0,1-2-2v-14a2,2,0,0,1,2-2h2v-2a2,2,0,0,1,2-2h10a2,2,0,0,1,2,2v14A2,2,0,0,1,860,2138Zm-12-2v-10h-1a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-1h-6A2,2,0,0,1,848,2136Zm12-13a1,1,0,0,0-1-1h-8a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-12Z" transform="translate(-844 -2120)"/>
                  </svg>
                </button>
                <button v-if="!createParamIsFixed" id="copy" class="btn btn-copy" v-on:click="copyUrlSuccess($event)">{{ $t('create.copyLink') }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22">
                    <defs>
                      <style>
                        .cls-1 {
                          fill: #4a40fd;
                          fill-rule: evenodd;
                        }
                      </style>
                    </defs>
                    <path id="Rounded_Rectangle_6" data-name="Rounded Rectangle 6" class="cls-1" d="M860,2138h-2v2a2,2,0,0,1-2,2H846a2,2,0,0,1-2-2v-14a2,2,0,0,1,2-2h2v-2a2,2,0,0,1,2-2h10a2,2,0,0,1,2,2v14A2,2,0,0,1,860,2138Zm-12-2v-10h-1a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-1h-6A2,2,0,0,1,848,2136Zm12-13a1,1,0,0,0-1-1h-8a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-12Z" transform="translate(-844 -2120)"/>
                  </svg>
                </button>

                <button v-if="createParamIsFixed" id="share" class="btn btn-copy" v-on:click="startShareList($event)">{{ $t('create.shareList') }}<img src="/assets/img/svg/share.svg" alt="">
                </button>
                <button v-if="!createParamIsFixed" id="share" class="btn btn-copy" v-on:click="startShare(companyLink, 'Wallet api link', '', $event)">{{ $t('create.shareApiLink') }}<img src="/assets/img/svg/share.svg" alt="">
                </button>
              </div>
            </div>
            <!--<a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>-->
              <div class="back"></div>
          </div>
          </transition>

          <transition name="fade">
            <!-- Content Personal Area -->
            <div v-if="step === 61 || step === 62" class="content__item content__feedback-simple content__item-active">

              <template v-if="typeof addressForFilling !== 'undefined' && addressForFilling.length > 10">
              <h5>{{ $t('compaingWallet') }}</h5>
              <div class="score">
                <p class="balance" v-for="balance in balances">{{ prettyFormat(balance.amount) }} {{ balance.coin }}</p>
                <span class="currency">~{{ balanceSum }}</span>
              </div>
              <div class="copy_link">
                <p :class="{'active-copy' : isCopiededSuccess}">{{ addressForFilling }}</p>
                <div class="buttons">
                  <button :class="{'active-copy' : isCopiededSuccess}" class="btn btn-copy btn-link-copy" v-on:click="copyToClipboard(addressForFilling, $event)">Copy<img src="/assets/img/svg/copy.svg" alt=""></button>
                  <button class="btn btn-copy btn-qr" v-on:click="toggleShowQR(addressForFilling)">QR<img src="/assets/img/svg/qr_link_blue.svg" alt=""></button>
                  <a v-if="this.isBalanceGreatThenZero" class="btn btn-copy " target="_blank" v-bind:href="deepLink">{{$t('DeepLink')}}</a>
                </div>
              </div>
              </template>

              <h5>{{$t('Settings')}}</h5>
              <div class="settings">
                <p class="caption">{{$t('create.numberWallet')}}:</p>
                <div class="number-of-wallets">
                  <input type="text" class="input" v-model="createParamCount">
                  <button class="btn lim" v-on:click="showEmailModal()">Emails</button>
                  <button class="btn unlim" v-on:click="selectUnlim()">{{$t('Unlim')}}<img src="/assets/img/svg/unlimited_blue.svg" alt=""></button>
                </div>
                <input type="text" class="input" v-bind:placeholder="$t('create.oneWalletBalance')" v-model="createParamBalance">
                <div class="target">
                  <span>{{$t('create.targetSpending')}}</span>
                  <span class="more-about" v-on:click="isShowSpendModal = true">{{$t('Select')}}</span>
                </div>
                <div class="target skins" v-if="step === 61">
                  <span>{{$t('create.Skins')}}</span>
                  <span class="more-about" v-on:click="isShowSkinModal = true">{{$t('Select')}}</span>
                </div>

                <div class="text-wrap" v-if="step === 62">
                  <textarea id="ta" name="" maxlength="140" v-bind:placeholder="$t('create.feedbackPlaceholder')" v-model="createParamTask"></textarea>
                  <div class="max-lenght">
                    <span id="max_lenght">{{ msgSize }}</span>
                    <img src="/assets/img/svg/feedback_grey.svg" alt="">
                  </div>
                </div>

                <button class="btn" v-on:click="startCreateCompany()">{{$t('create.launch')}}</button>
                <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
              </div>

            </div>
            <!-- /Content Personal Areas  -->
          </transition>


          <transition name="fade">
            <!-- Content Personal Area -->
            <div v-if="step === 80" class="content__item content__campaing-wallet content__item-active">

              <template v-if="typeof addressForFilling !== 'undefined' && addressForFilling.length > 10">
                <h5>{{ $t('compaingWallet') }}</h5>
                <div class="score">
                  <p class="balance" >
                    <template v-for="balance in balances">
                      {{ prettyFormat(balance.amount) }} {{ balance.coin }}
                    </template>
                    <span class="currency">~{{ balanceSum }}</span>
                  </p>

                  <p v-if="this.isBalanceGreatThenZero">{{ $t('create.plzFillPart1') }} <span v-on:click="copyToClipboard(minNewBalance)">{{ minNewBalance }} {{ $t('create.minBalanceCoin')}}</span> {{ $t('create.plzFillPart2') }}</p>
                </div>
                <div class="copy_link">
                  <p :class="{'active-copy' : isCopiededSuccess}">{{ addressForFilling }}</p>
                  <div class="buttons">
                    <button :class="{'active-copy' : isCopiededSuccess}" class="btn btn-copy btn-link-copy" v-on:click="copyToClipboard(addressForFilling, $event)">Copy<img src="/assets/img/svg/copy.svg" alt=""></button>
                    <button class="btn btn-copy btn-qr" v-on:click="toggleShowQR(addressForFilling)">QR<img src="/assets/img/svg/qr_link_blue.svg" alt=""></button>
                    <a v-if="this.isBalanceGreatThenZero" class="btn btn-copy " target="_blank" v-bind:href="deepLink">{{$t('DeepLink')}}</a>
                  </div>
                </div>

                <template  v-if="!isAddressFilling">
                  <div class="loader-02">
                    <div class="inner one"></div>
                    <div class="inner two"></div>
                    <div class="inner three"></div>
                  </div>
                  <p id="waiting">{{ $t('create.waitingForPayment') }} ...</p>
                </template>
              </template>

              <template>
                <h5>{{$t('create.compainInfo')}}</h5>
                <div class="info">
                  <p>{{$t('create.numberWallet')}}: <span>{{createParamCount}}</span></p>
                  <p v-if="createParamBalance">{{$t('create.oneWalletBalance')}}: <span>{{createParamBalance}}</span></p>
                  <p>{{$t('create.targetSpending')}}:</p>
                  <ul v-if="spendChecks.length > 0">
                    <li v-for="idSpend in spendChecks" v-html="getSpendLabelById(idSpend)"></li>
                  </ul>
                  <ul v-if="spendChecks.length === 0">
                    <li v-for="spend in spends" v-html="newLineLabel($t(spend.label))"></li>
                  </ul>
                  <p v-if="createParamType === 'complex_feedback'">{{$t('create.feedbackTask')}}:</p>
                  <p class="task">{{createParamTask}} <!--<img src="/assets/img/svg/edit.svg" alt="">--></p>
                </div>

                <template v-if="isAddressFilling">
                  <h6 v-if="createParamIsFixed" class="share">{{ $t('create.walletList') }}:</h6>
                  <h6 v-if="!createParamIsFixed" class="share">{{ $t('create.grabApi') }}:</h6>

                  <div class="buttons grab">
                    <button v-if="createParamIsFixed" id="send" class="btn btn-copy" v-on:click="sendListToEmail($event)">{{ $t('create.sendEmail') }}
                      <!--<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16">
                        <defs>
                          <style>
                            .cls-1 {
                              fill: #4a40fd;
                              fill-rule: evenodd;
                            }
                          </style>
                        </defs>
                        <path id="Forma_1" data-name="Forma 1" class="cls-1" d="M1894.63,3187h-15.26a2.313,2.313,0,0,0-2.37,2.25v11.5a2.313,2.313,0,0,0,2.37,2.25h15.26a2.32,2.32,0,0,0,2.37-2.25v-11.5A2.32,2.32,0,0,0,1894.63,3187Zm0,14.01h-15.26a0.331,0.331,0,0,1-.36-0.26v-10.11l6.9,5.75a0.775,0.775,0,0,0,.51.18h1.16a0.775,0.775,0,0,0,.51-0.18l6.9-5.75v10.11A0.331,0.331,0,0,1,1894.63,3201.01Zm-7.63-6.41-6.71-5.61h13.42Z" transform="translate(-1877 -3187)"/>
                      </svg>-->
                      <img src="/assets/img/svg/email-2.svg" alt="">
                      </button>
                    <button v-if="!createParamIsFixed" id="send" class="btn btn-copy" v-on:click="sendLinkToEmail($event)">{{ $t('create.sendApiEmail') }}
                      <!--<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16">
                        <defs>
                          <style>
                            .cls-1 {
                              fill: #4a40fd;
                              fill-rule: evenodd;
                            }
                          </style>
                        </defs>
                        <path id="Forma_1" data-name="Forma 1" class="cls-1" d="M1894.63,3187h-15.26a2.313,2.313,0,0,0-2.37,2.25v11.5a2.313,2.313,0,0,0,2.37,2.25h15.26a2.32,2.32,0,0,0,2.37-2.25v-11.5A2.32,2.32,0,0,0,1894.63,3187Zm0,14.01h-15.26a0.331,0.331,0,0,1-.36-0.26v-10.11l6.9,5.75a0.775,0.775,0,0,0,.51.18h1.16a0.775,0.775,0,0,0,.51-0.18l6.9-5.75v10.11A0.331,0.331,0,0,1,1894.63,3201.01Zm-7.63-6.41-6.71-5.61h13.42Z" transform="translate(-1877 -3187)"/>
                      </svg>-->
                      <img src="/assets/img/svg/email-2.svg" alt="">
                      </button>

                    <button v-if="createParamIsFixed" id="save" class="btn btn-copy" v-on:click="copyList($event)">{{ $t('create.copyList') }}
                      <!--<svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22">
                        <defs>
                          <style>
                            .cls-1 {
                              fill: #4a40fd;
                              fill-rule: evenodd;
                            }
                          </style>
                        </defs>
                        <path id="Rounded_Rectangle_6" data-name="Rounded Rectangle 6" class="cls-1" d="M860,2138h-2v2a2,2,0,0,1-2,2H846a2,2,0,0,1-2-2v-14a2,2,0,0,1,2-2h2v-2a2,2,0,0,1,2-2h10a2,2,0,0,1,2,2v14A2,2,0,0,1,860,2138Zm-12-2v-10h-1a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-1h-6A2,2,0,0,1,848,2136Zm12-13a1,1,0,0,0-1-1h-8a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-12Z" transform="translate(-844 -2120)"/>
                      </svg>-->
                      <img src="/assets/img/svg/copy.svg" alt="">
                    </button>
                    <button v-if="!createParamIsFixed" id="copy" class="btn btn-copy" v-on:click="copyUrlSuccess($event)">{{ $t('create.copyLink') }}
                      <!--<svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22">
                        <defs>
                          <style>
                            .cls-1 {
                              fill: #4a40fd;
                              fill-rule: evenodd;
                            }
                          </style>
                        </defs>
                        <path id="Rounded_Rectangle_6" data-name="Rounded Rectangle 6" class="cls-1" d="M860,2138h-2v2a2,2,0,0,1-2,2H846a2,2,0,0,1-2-2v-14a2,2,0,0,1,2-2h2v-2a2,2,0,0,1,2-2h10a2,2,0,0,1,2,2v14A2,2,0,0,1,860,2138Zm-12-2v-10h-1a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-1h-6A2,2,0,0,1,848,2136Zm12-13a1,1,0,0,0-1-1h-8a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-12Z" transform="translate(-844 -2120)"/>
                      </svg>-->
                      <img src="/assets/img/svg/copy.svg" alt="">
                    </button>

                    <button v-if="createParamIsFixed" id="share" class="btn btn-copy" v-on:click="startShareList($event)">{{ $t('create.shareList') }}<!--<img src="/assets/img/svg/share.svg" alt="">--><img src="/assets/img/svg/share-2.svg" alt="">
                    </button>
                    <button v-if="!createParamIsFixed" id="share" class="btn btn-copy" v-on:click="startShare(companyLink, 'Wallet api link', '', $event)">{{ $t('create.shareApiLink') }}<!--<img src="/assets/img/svg/share.svg" alt="">--><img src="/assets/img/svg/share-2.svg" alt="">
                    </button>
                  </div>
                  <button v-if="createParamIsFixed && emailList.length > 0" class="btn send-emails" v-on:click="sendWalletToUser()">{{$t('create.emailWallets')}}</button>

                  <!--<a href="" class="link">Statistics</a>-->

                  <button class="btn to-account" v-on:click="step = 21">{{$t('goToAcc')}}</button>
                  <button class="btn close" v-on:click="closeCompany()">{{ $t('create.closeCompany') }}</button>
                </template>

              </template>

            </div>
            <!-- /Content Personal Areas  -->
          </transition>

        </div>
      </div>
    </main>
    <!--  -->
    <!-- / -->
    <!-- Footer -->
    <footer v-if="step === 1" v-bind:class="{ 'fixed-footer': step === 1, 'footer-static': footerStatic, 'fixed-footer': !footerStatic}">
      <a href="https://www.minter.network/" target="_blank" class="copy">Powered by <span>Minter</span></a>
    </footer>
    <!-- /Footer -->


    <!-- Modal Activation Types 1-->
    <transition name="fade">
    <div class="modal-alert modal-activation-types" v-bind:class="{ 'modal-activation-types-active': isShowModalType1 }" v-show="isShowModalType1">
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
    <!-- /Modal Activation Types 1 -->

    <!-- Modal Activation Types 2-->
    <transition name="fade">
      <div class="modal-alert modal-activation-types" v-bind:class="{ 'modal-activation-types-active': isShowModalType2 }" v-show="isShowModalType2">
        <div class="container">
          <div class="close-modal-alert" v-on:click="toggleShowType2()">
            <span></span><span></span>
          </div>
          <h5>{{ $t('create.detailTypeTitle') }}</h5>
          <p class="title"><img src="/assets/img/svg/wallet_dark.svg" alt="">{{ $t('create.simple') }}</p>
          <p>{{ $t('create.detailSimple') }}</p>
          <p class="title"><img src="/assets/img/svg/feedback_dark.svg" alt="">{{ $t('create.feedback') }}</p>
          <p>{{ $t('create.detailFeedback') }}</p>
          <!--<p class="title"><img src="/assets/img/svg/action_dark.svg" alt="">{{ $t('create.action') }}</p>
          <p>{{ $t('create.detailAction') }}</p>-->
        </div>
      </div>
    </transition>
    <!-- /Modal Activation Types 1 -->

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
    <div class="modal-alert modal-dir-links" v-bind:class="{ 'modal-activation-dir': isShowModalDir }" v-show="isShowModalDir">
      <h5>{{ $t('directLinks.title') }}:</h5>
      <div class="links-items">
        <div class="links__item">
          <img src="/assets/img/svg/services.svg" alt="">
          <span>Mobile<br>services</span>
          <!--<img v-on:click="copyToClipboard(createdLinkMobile)" src="/assets/img/svg/copy.svg" alt="">-->
          <div class="qr-link" v-on:click="copyToClipboard(createdLinkMobile, $event)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22">
              <defs>
                <style>
                  .cls-1 {
                    fill: #4a40fd;
                    fill-rule: evenodd;
                  }
                </style>
              </defs>
              <path id="Rounded_Rectangle_6" data-name="Rounded Rectangle 6" class="cls-1" d="M860,2138h-2v2a2,2,0,0,1-2,2H846a2,2,0,0,1-2-2v-14a2,2,0,0,1,2-2h2v-2a2,2,0,0,1,2-2h10a2,2,0,0,1,2,2v14A2,2,0,0,1,860,2138Zm-12-2v-10h-1a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-1h-6A2,2,0,0,1,848,2136Zm12-13a1,1,0,0,0-1-1h-8a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-12Z" transform="translate(-844 -2120)"/>
            </svg>
          </div>
          <img v-on:click="toggleShowQR(createdLinkMobile)" class="qr" src="/assets/img/svg/qr_link_blue.svg" alt="">
          <img v-on:click="startShare(createdLinkMobile, 'BIP to phone', '')" src="/assets/img/svg/share.svg" alt="">
        </div>
        <div class="links__item">
          <img src="/assets/img/svg/games.svg" alt="">
          <span>Games</span>
          <!--<img v-on:click="copyToClipboard(createdLinkGame)" src="/assets/img/svg/copy.svg" alt="">-->
          <div class="qr-link" v-on:click="copyToClipboard(createdLinkGame,$event)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22">
              <defs>
                <style>
                  .cls-1 {
                    fill: #4a40fd;
                    fill-rule: evenodd;
                  }
                </style>
              </defs>
              <path id="Rounded_Rectangle_6" data-name="Rounded Rectangle 6" class="cls-1" d="M860,2138h-2v2a2,2,0,0,1-2,2H846a2,2,0,0,1-2-2v-14a2,2,0,0,1,2-2h2v-2a2,2,0,0,1,2-2h10a2,2,0,0,1,2,2v14A2,2,0,0,1,860,2138Zm-12-2v-10h-1a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-1h-6A2,2,0,0,1,848,2136Zm12-13a1,1,0,0,0-1-1h-8a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-12Z" transform="translate(-844 -2120)"/>
            </svg>
          </div>
          <img v-on:click="toggleShowQR(createdLinkGame)" class="qr" src="/assets/img/svg/qr_link_blue.svg" alt="">
          <img v-on:click="startShare(createdLinkFund, 'BIP to game', '')" src="/assets/img/svg/share.svg" alt="">
        </div>
        <div class="links__item">
          <img src="/assets/img/svg/charity.svg" alt="">
          <span>Charity<br>fund</span>
          <!--<img v-on:click="copyToClipboard(createdLinkFund)" src="/assets/img/svg/copy.svg" alt="">-->
          <div class="qr-link" v-on:click="copyToClipboard(createdLinkFund, $event)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22">
              <defs>
                <style>
                  .cls-1 {
                    fill: #4a40fd;
                    fill-rule: evenodd;
                  }
                </style>
              </defs>
              <path id="Rounded_Rectangle_6" data-name="Rounded Rectangle 6" class="cls-1" d="M860,2138h-2v2a2,2,0,0,1-2,2H846a2,2,0,0,1-2-2v-14a2,2,0,0,1,2-2h2v-2a2,2,0,0,1,2-2h10a2,2,0,0,1,2,2v14A2,2,0,0,1,860,2138Zm-12-2v-10h-1a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-1h-6A2,2,0,0,1,848,2136Zm12-13a1,1,0,0,0-1-1h-8a1,1,0,0,0-1,1v12a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1v-12Z" transform="translate(-844 -2120)"/>
            </svg>
          </div>
          <img v-on:click="toggleShowQR(createdLinkFund)" class="qr" src="/assets/img/svg/qr_link_blue.svg" alt="">
          <img v-on:click="startShare(createdLinkMobile, '', '')" src="/assets/img/svg/share.svg" alt="">
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

    <!-- Modal Login -->
    <transition name="fade">
    <div class="modal-alert modal-login" v-bind:class="{ 'modal-activation-dir': isShowLoginModal }" v-if="isShowLoginModal">
      <div class="close-modal-alert" v-on:click="isShowLoginModal = false">
        <span></span><span></span>
      </div>
      <div class="container">
        <h5>{{ $t('menu.account') }}</h5>
        <p>{{ $t('create.loginHelp') }}</p>
        <input type="text" class="input"  v-bind:placeholder="$t('Email')" v-model="createParamEmail">
        <input type="password" class="input" v-bind:placeholder="$t('password.password')" v-model="createParamCompanyPass">
        <button class="btn" v-on:click="createOrUpdateAccount()">{{ $t('create.createAccount') }}</button>
        <button class="btn" v-on:click="loginAccount()">{{ $t('create.loginAccount') }}</button>
      </div>
    </div>
    </transition>
    <!-- /Modal Login -->

    <transition name="fade">
      <!-- Modal Emails -->
      <div class="modal-alert modal-emails" v-bind:class="{ 'modal-activation-dir': isShowEmailModal }" v-if="isShowEmailModal">
        <div class="container">
          <div class="close-modal-alert" v-on:click="isShowEmailModal = false">
            <span></span><span></span>
          </div>
          <p>{{$t('create.emailLinkText')}}<a href="https://docs.google.com/spreadsheets/d/1KFYlkgu7bXZ6Z0HlbXbZQe7NnVuUEtBLo0JDQXZUWws/edit?usp=sharing" target="_blank" class="more-about">{{$t('Example')}}</a></p>
          <p class="caption">{{$t('create.emailLink')}}</p>
          <input type="text" class="input" placeholder="https://docs.google.com/spreadsheets" v-model="emailTableLink">
          <button class="btn" v-on:click="importEmail()">{{$t('Import')}}</button>
          <button class="btn btn-more btn-back" v-on:click="isShowEmailModal = false"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</button>
        </div>
      </div>
      <!-- /Modal Emails -->
    </transition>

    <transition name="fade">
      <div class="modal-alert modal-target" v-bind:class="{ 'modal-activation-dir': isShowSpendModal }" v-if="isShowSpendModal">
        <div class="container">
          <div class="close-modal-alert" v-on:click="isShowSpendModal = false">
            <span></span><span></span>
          </div>
          <div class="checkbox-items">

            <template  v-for="spend in spends">
              <div  v-if="spend.show" class="checkbox__item">
                <input type="checkbox" v-bind:id="spend.id" v-model="spendChecks" :value="spend.id">
                <label v-bind:for="spend.id"><img v-bind:src="spend.ico" alt=""></label>
                <p style="width: 1000px;" v-html="newLineLabel($t(spend.label))"></p>
              </div>
            </template>

          </div>
          <button class="btn btn-more btn-back" v-on:click="isShowSpendModal = false"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="modal-alert modal-skins" v-bind:class="{ 'modal-activation-dir': isShowSkinModal }" v-if="isShowSkinModal">
        <div class="container">
          <div class="close-modal-alert" v-on:click="isShowSkinModal = false">
            <span></span><span></span>
          </div>
          <div class="skins-items" id="skins">

            <div v-for="skin in skins" class="skins__item" tabindex="0" >
              <span v-on:click="createParamSkin = skin.id">{{ skin.label }}</span><a v-on:click="showSkinPreviewModal(skin)">{{ $t('Prev') }}</a>
            </div>

          </div>

          <button class="btn btn-more btn-back" v-on:click="isShowSkinModal = false"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</button>
        </div>
      </div>
    </transition>
    <!-- /Page -->
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  import axios from 'axios'
  import VueQrcode from '@chenfengyuan/vue-qrcode'
  import { Decimal } from 'decimal.js'
  import moment from 'moment'

  import {
    LINK,
    BACKEND_BASE_URL,
    createWallet,
    generateWalletUid,
    getAddressBalance,
    getCoinExchangeList,
    getFiatExchangeList,
    getBipPrice,
    prettyFormat,
    createCompany,
    DEFAULT_SYMBOL,
    getFiatByLocale,
    ACTIVATE_FEE,
    createDeepLink,
    getHash,
    createWalletV2,
    getMnemonic
  } from './core'
  import { SKINS } from './skins'
  import { SPENDS } from './spendings'

  if (process.client) {
    Vue.use(VueClipboard)
  }

  export default {
    components: {
      qrcode: VueQrcode,
    },
    data () {
      return {
        step: 1,
        prevStep: [],
        errorMsg: '',
        isShowError: false,

        isShowLoader: false,
        isShowMenu: false,
        isShowModalType1: false,
        isShowModalType2: false,
        isShowModalNType: false,
        isShowModalQR: false,
        isShowModalDir: false,
        isShowLoginModal: false,
        isShowEmailModal: false,
        isShowSpendModal: false,
        isShowSkinModal: false,
        isCreateOne: true,
        isShowAdditional: false,
        isActiveTrigger01: false,
        isActiveTrigger02: false,
        isActiveTrigger03: false,
        isActiveTrigger04: false,
        isAddressFilling: false,
        IsActiveHamburgerClass: false,
        isCopiededAdress: false,
        isCopiededSuccess: false,
        isCopiededSuccess2: false,
        isTextarea: [true, true],
        isBodyOverflow: false,

        qrLink: 'empty',

        // create wallet params
        createParamTask: '',
        createParamMessage: '',
        createParamPassword: '',
        createParamEmail: '',
        createParamBrand: '',
        createParamLogoPath: '',
        createParamUID: '',
        createParamType: 'simple',
        createParamCount: '',
        createParamIsFixed: true,
        createParamBalance: '',
        createParamCompanyPass: '',
        createParamSkin: '',
        company: null,
        companies: [],
        companyLink: '',
        minNewBalance: 0,
        isBalanceGreatThenZero: false,
        emailTableLink: '',
        emailList: [],

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
        isMobile: false,

        skins: SKINS,
        spends: SPENDS,
        spendChecks: [],
        isShowSkin: false,
        skinContent: '',
      }
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
          return `${this.balanceSumUSD.toFixed(2)} $`
        }
        return `${this.balanceSumFiat.toFixed(2)} ${fiatSymbol}`
      },
      deepLink() {
        if (this.minNewBalance) {
          return createDeepLink({
            to: this.addressForFilling,
            amount: this.minNewBalance,
            isMobile: this.isMobile,
          })
        }
        return ''
      },
      footerStatic() {
        return this.step === 3 || this.step === 4
      }
    },
    created () {
      if (navigator.share) {
        this.isMobile = true
      }
      this.minNewBalance = new Decimal(0)

      const self = this
      window.hideSkin = function () {
        self.isShowSkin = false
        //document.body.classList.remove('body-overflow')
      }
      window.skinMessage = function () {
        return self.companyMsg
      }
    },
    filters: {
      short: function (date) {
        return moment(date).format('DD.MM.YY');
      }
    },
    // method
    methods: {
      isActiveTab($event) {
        let tab = document.querySelectorAll('.tab__')

        if(tab.length) {
          [].forEach.call(tab, function(item) {
            item.querySelector('span').classList.remove('activeTab__')
          });
          $event.target.classList.add('activeTab__')
        }
      },
      changeLocale: function (locale) {
        this.$i18n.setLocaleCookie(locale)
        this.$i18n.setLocale(locale)
        this.isShowMenu = false
        this.IsActiveHamburgerClass = false
        this.recalculateBalance()
      },
      toggleMenu: function () {
        this.isShowMenu = !this.isShowMenu
        this.IsActiveHamburgerClass = !this.IsActiveHamburgerClass
      },
      toggleShowType: function () {
        this.isShowModalType1 = !this.isShowModalType1
      },
      toggleShowType2: function () {
        this.isShowModalType2 = !this.isShowModalType2
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
      showLoginModal () {
        this.isShowLoginModal = true
      },
      showEmailModal () {
        this.isShowEmailModal = true
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
      startCreateAccount: function () {
        // advanced mod
        this.prevStep.push(this.step)
        this.step = 11
        return false
      },
      clearParams: function () {
        console.log('clear')
        //this.createParamCompanyPass = ''
        //this.createParamEmail = ''
        this.createParamCount = 0
        this.createParamMessage = ''
        this.createParamTask = ''
        this.createParamBalance = ''
        this.createParamUID = ''
        this.createParamSkin = ''
        this.spendChecks = []
        this.minNewBalance = new Decimal(0)
        this.isBalanceGreatThenZero = false
        this.addressForFilling = 'empty'
        this.isAddressFilling = false
        this.spendChecks = []
      },
      startCreateSimple: function (isCreateOne = true) {
        this.isCreateOne = isCreateOne
        this.prevStep.push(this.step)
        this.clearParams()
        if (this.isCreateOne) {
          this.step = 3
          this.createParamType = 'simple'
        } else {
          //this.step = 6
          this.step = 61
          this.createParamType = 'complex'
        }
        return false
      },
      startCreateFeedback: function (isCreateOne = true) {
        this.isCreateOne = isCreateOne
        this.prevStep.push(this.step)
        this.clearParams()
        if (this.isCreateOne) {
          this.step = 31
          this.createParamType = 'simple_feedback'
        } else {
          // this.step = 6
          this.step = 62
          this.createParamType = 'complex_feedback'
        }
        return false
      },
      startCreateAction: function (isCreateOne = true) {
        this.isCreateOne = isCreateOne
        this.prevStep.push(this.step)
        this.clearParams()
        if (this.isCreateOne) {
          this.step = 32
          this.createParamType = 'simple_action'
        }
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
      oneLineLabel(label) {
        return label.split('|').join(' ')
      },
      startCreateWallet: async function () {
        /*if (this.isActiveTrigger01 && !this.createParamBalance) {
          this.errorMsg = this.$t('errors.balanceEmpty')
          this.isShowError = true
          return false
        }
        if (!this.isActiveTrigger01) {
          this.createParamBalance = ''
        }

        if (this.isActiveTrigger02 && !this.createParamMessage) {
          this.errorMsg = this.$t('errors.emptyText')
          this.isShowError = true
          return false
        }
        if (!this.isActiveTrigger02) {
          this.createParamMessage = ''
        }

        if (this.isActiveTrigger03 && !this.createParamPassword) {
          this.errorMsg = this.$t('errors.passErrorEmpty')
          this.isShowError = true
          return false
        }
        if (!this.isActiveTrigger03) {
          this.createParamPassword = ''
        }
        if (!this.isActiveTrigger04) {
          this.createParamSkin = ''
        }*/

        if ((this.step === 31 || this.step === 32) && this.createParamTask.length === 0) {
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
        const wallet = await createWalletV2(this.createParamUID, this.createParamPassword)
        if (wallet && wallet.address) {
          this.addressForFilling = wallet.address
        } else {
          this.addressForFilling = 'empty'
        }

        history.pushState(
          {},
          null,
          this.$route.path + this.createParamUID
        )

        this.createParamCount = 1
        // send info to server
        this.company = await createCompany({
          type: this.createParamType,
          uid: this.createParamUID,
          mxaddress: wallet.address,
          email: this.createParamEmail,
          protected: (this.createParamPassword && this.createParamPassword.length > 0),
          params: {
            title: this.createParamMessage,
            notice: this.createParamTask,
            skin: this.createParamSkin,
            amount: this.createParamBalance,
            count: this.createParamCount,
          }
        })
        this.companies.push(this.company)
        this.companyLink = `${BACKEND_BASE_URL}/api/company/${this.company.uid}/get_wallet?count=1`
        console.log(this.company)

        if (this.createParamBalance) {
          this.minNewBalance = new Decimal(Number(this.createParamBalance))
            .plus(ACTIVATE_FEE)
            .mul(this.createParamCount)
          if (this.minNewBalance.gt(0)) {
            this.isBalanceGreatThenZero = true
          }
        }

        this.loadAdditionalInfo()
        // start update balance
        const self = this
        this.checkInterval = setInterval(function(){
          self.checkFilledBalance()
          self.startCreateSuccess(false)
        }, 3 * 1000)

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
        if (this.createParamType === 'complex_feedback' && this.createParamTask.length === 0) {
          this.errorMsg = this.$t('errors.emptyText')
          this.isShowError = true
          return false
        }

        if (!this.createParamBalance) {
          this.errorMsg = this.$t('errors.balanceEmpty')
          this.isShowError = true
          return false
        }

        // send info to server
        const company = await createCompany({
          type: this.createParamType,
          uid: '',
          mxaddress: '',
          email: this.createParamEmail,
          password: getHash(this.createParamCompanyPass),
          params: {
            title: this.createParamMessage,
            notice: this.createParamTask,
            count: this.createParamCount === 'Unlim' ? 0: this.createParamCount,
            amount: this.createParamBalance,
            skin: this.createParamSkin,
            spends: this.spendChecks,
          },
          emailList: this.emailList,
        })
        if (this.createParamBalance) {
          this.minNewBalance = new Decimal(this.createParamBalance)
            .plus(ACTIVATE_FEE)
            .mul(this.createParamCount === 'Unlim' ? 1: this.createParamCount)
          if (this.minNewBalance.gt(0)) {
            this.isBalanceGreatThenZero = true
          }
        }
        this.createParamIsFixed = this.createParamCount !== 'Unlim'

        if (company && company.warehouseWallet && company.warehouseWallet.mxaddress) {
          this.addressForFilling = company.warehouseWallet.mxaddress
        } else {
          this.addressForFilling = 'empty'
        }
        this.company = company
        this.companies.push(this.company)
        this.companyLink = `${BACKEND_BASE_URL}/api/company/${this.company.uid}/get_wallet?count=1`

        this.loadAdditionalInfo()
        // start update balance
        const self = this
        this.checkInterval = setInterval(function(){
          self.checkFilledBalance()
          //self.startCreateSuccess(false)
        }, 3 * 1000)

        this.prevStep.push(this.step)
        this.step = 80
        return false
      },
      loadAdditionalInfo: async function () {
        this.bipToUSD = await getBipPrice()
        this.fiat = await getFiatExchangeList()
        this.coins = await getCoinExchangeList()
      },
      startCreateSuccess: async function (showError = true) {
        if (!this.isAddressFilling) {
          await this.checkFilledBalance()
        }

        if (!this.isAddressFilling) {
          if (showError) {
            this.errorMsg = this.$t('errors.balanceError')
            this.isShowError = true
          }
          return false
        }
        // todo: hide loader

        clearInterval(this.checkInterval)
        this.prevStep.push(this.step)

        if (this.isCreateOne) {
          this.step = 5
        } else {
          this.step = 51
        }

        this.isCopiededSuccess = false
        return false
      },
      copySeedToClipboard: async function ($event = null) {
        this.isCopiededSuccess2 = true;
        const mnemonic = await getMnemonic(this.createParamUID, this.createParamPassword)
        if($event) {
          $event.target.innerText = 'Copied'
          $event.target.classList.add('active-copy')
        }

        this.$copyText(mnemonic)
      },
      copyToClipboard: function (message, $event = null) {
        this.$copyText(message).then( (e) => {
          if ($event) {
            if ($event.target.classList.contains('qr-link') || $event.target.closest('.qr-link')) {
              document.querySelectorAll('.active-gr').forEach(function(item) { item.classList.remove('active-gr')})
              $event.target.classList.add('active-gr')
              return false
            }
            else if ($event.target.classList.contains('btn-link-copy')) {
              $event.target.innerText = 'Copied'
              this.isCopiededSuccess = true
              return false
            } else {
              // $event.target.innerText = 'Copied to buffer'
              $event.target.innerText = 'Copied'
              this.isCopiededAdress = true
              return false
            }
            if ($event.target.classList.contains('btn-copy-address')) {
              //$event.target.innerText = 'Copied to buffer'
              $event.target.innerText = 'Copied'
              //this.isCopiededSuccess = true
              return false
            }
            if($event) {
              $event.target.classList.add('active-copy')
            }
          }
        }, function (e) {
          console.log(message, e)
        })
      },
      startShare: async function (link = '', title = '', text = '', $event = null) {
        if (navigator.share) {
          navigator.share({
            title,
            text,
            url: link
          })
            .then(function () {
              // console.log("Shareing successfull")
              if($event) {
                $event.target.classList.add('active-copy')
              }
            })
            .catch(function () {
              console.log("Sharing failed")
            })
        } else {
          this.errorMsg = this.$t('errors.shareError')
          this.isShowError = true
        }
      },
      checkFilledBalance: async function () {
        try {
          const balances = await getAddressBalance(this.addressForFilling)

          this.balanceSumUSD = new Decimal(0)
          this.balanceSumFiat = new Decimal(0)
          this.balances = balances
            .filter(({ amount }) => {
              return new Decimal(amount).gt(0)
            })
            .map(({ coin, amount }) => {
              let usdAmount = 0
              if (new Decimal(amount).gte(this.minNewBalance)) {
                this.isAddressFilling = true

                const coinToDef = this.coins[coin]
                if (amount && (coinToDef || coin === DEFAULT_SYMBOL)) {
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

          if (this.isAddressFilling) {
            clearInterval(this.checkInterval)
          }

          this.recalculateBalance()
        } catch (error) {
          console.error(error)
          // this.errorMsg = error.message
          // this.isShowError = true
        }
      },
      recalculateBalance() {
        this.balanceSumFiat = this.balanceSumUSD
        const fiatVal = getFiatByLocale(this.currentLang)
        if (fiatVal) {
          const fiatCur = this.fiat[fiatVal.name]
          if (this.currentLang !== 'en' && fiatCur) {
            this.balanceSumFiat = new Decimal(this.balanceSumUSD)
              .mul(fiatCur)
          }
        }
      },
      prettyFormat: function (value) {
        return prettyFormat(value)
      },
      sendListToEmail: async function ($event = null) {
        try {
          const response = await axios.post(`${BACKEND_BASE_URL}/api/company/${this.company.uid}/email`)
          if (response && response.status === 200) {
            this.errorMsg = this.$t('successMsg.successSend')
            this.isShowError = true
          }
          if($event) {
            $event.target.classList.add('active-copy')
          }
        } catch (error) {
          this.errorMsg = this.$t('error.errorSend')
          this.isShowError = true
        }
      },
      sendLinkToEmail: async function ($event = null) {
        try {
          const response = await axios.post(`${BACKEND_BASE_URL}/api/company/${this.company.uid}/email_link`)

          if (response && response.status === 200) {
            this.errorMsg = this.$t('successMsg.successSend')
            this.isShowError = true
          }
          if($event) {
            $event.target.classList.add('active-copy')
          }
        } catch (error) {
          this.errorMsg = this.$t('error.errorSend')
          this.isShowError = true
        }
      },
      copyList: function ($event = null) {
        if (this.company && this.company.wallets) {
          const links = this.company.wallets
            .map(({ uid }) => `${LINK}${uid}`)
            .join(' ; ')
          this.copyToClipboard(links)
          if($event) {
            if($event.target.closest('.btn-copy')) {
              $event.target.closest('.btn-copy').classList.add('active-copy')
            }else {
              $event.target.classList.add('active-copy')
            }
          }
        }
      },
      startShareList: function ($event = null) {
        if (this.company && this.company.wallets) {
          const links = this.company.wallets
            .map(({ uid }) => `${LINK}${uid}`)
            .join(' ; ')
          this.startShare('', 'Wallet list', links, $event)
        }
      },
      copyUrlSuccess: function ($event = null) {
        this.copyToClipboard(this.companyLink)
        if($event) {
          if($event.target.closest('.btn-copy')) {
            $event.target.closest('.btn-copy').classList.add('active-copy')
          }else {
            $event.target.classList.add('active-copy')
          }
        }
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
      },
      showSkinPreviewModal(skin) {
        console.log(skin)
        this.isShowSkin = true
        this.skinContent = skin.path
        //document.body.classList.add('body-overflow')
      },
      createOrUpdateAccount: async function () {
        if (this.createParamCompanyPass === '') {
          this.errorMsg = this.$t('errors.passErrorEmpty')
          this.isShowError = true
          return false
        }
        if (this.createParamEmail === '') {
          this.errorMsg = this.$t('errors.failEmail')
          this.isShowError = true
          return false
        }

        try {
          const response = await axios.post(`${BACKEND_BASE_URL}/api/account`, {
            email: this.createParamEmail,
            password: getHash(this.createParamCompanyPass),
            brand: this.createParamBrand,
          })
          console.log(response.data)
          this.companies = response.data.companies ? response.data.companies: []
          this.createParamBrand = response.data.brand
          this.createParamLogoPath = response.data.logo

          // show account page
          this.isShowLoginModal = false
          this.prevStep.push(this.step)
          this.step = 21
          this.loadAdditionalInfo()
        } catch (error) {
          this.isShowError = true
          this.errorMsg = this.$t('errors.errorLogin')
        }
      },
      loginAccount: async function (){
         try {
           const response = await axios.post(`${BACKEND_BASE_URL}/api/account/login`, {
             email: this.createParamEmail,
             password: getHash(this.createParamCompanyPass),
           })
           console.log(response.data)
           this.companies = response.data.companies
           this.createParamBrand = response.data.brand
           this.createParamLogoPath = response.data.logo

           // show account page
           this.isShowLoginModal = false
           this.prevStep.push(this.step)
           this.step = 21
           this.loadAdditionalInfo()
         } catch (error) {
           this.isShowError = true
           this.errorMsg = this.$t('errors.errorLogin')
         }
      },
      selectUnlim() {
        this.createParamCount = 'Unlim'
      },
      importEmail: async function () {
        try {
          const response = await axios.get(this.emailTableLink)
          if (response.status === 200) {
            const regexp = RegExp(/>(\S+@\S+\.\S+)<\/td/,'g')
            const matches = response.data.matchAll(regexp)

            this.emailList = []
            for (const match of matches) {
              this.emailList.push(match[1])
            }
            this.createParamCount = this.emailList.length
            this.isShowEmailModal = false
            return false
          }
        } catch (error) {
          console.error(error)
        }
        this.isShowError = true
        this.errorMsg = this.$t('errors.importError')
      },
      getSpendLabelById(spendId) {
        for (const spend of this.spends) {
          if (spend.id === spendId) {
            return this.oneLineLabel(this.$t(spend.label))
          }
        }
      },
      closeCompany: async function () {
        try {
          const response = await axios.post(`${BACKEND_BASE_URL}/api/company/${this.company.uid}/close`, {
            email: this.createParamEmail,
            password: getHash(this.createParamCompanyPass),
          })
          console.log(response.data)
          this.errorMsg = this.$t('successMsg.successClose')
          this.isShowError = true
        } catch (error) {
          this.isShowError = true
          this.errorMsg = this.$t('errors.closeError')
        }
      },
      sendWalletToUser: async function () {
        try {
          const response = await axios.post(`${BACKEND_BASE_URL}/api/company/${this.company.uid}/email_wallets`, {
            email: this.createParamEmail,
            password: getHash(this.createParamCompanyPass),
          })
          console.log(response.data)
          this.errorMsg = this.$t('successMsg.successEmailSending')
          this.isShowError = true
        } catch (error) {
          this.isShowError = true
          this.errorMsg = this.$t('errors.errorSend')
        }
      },
      selectCompany(company) {
        if (company) {
          this.step = 80

          this.addressForFilling = company.warehouseWallet ? company.warehouseWallet.mxaddress : 'empty'
          this.company = company
          this.companyLink = `${BACKEND_BASE_URL}/api/company/${this.company.uid}/get_wallet?count=1`

          const companyParams = this.company.params ? JSON.parse(this.company.params) : {}
          this.createParamTask = companyParams.notice ?? ''
          this.createParamMessage = companyParams.title ?? ''
          this.createParamCount = companyParams.count ?? 'Unlim'
          this.createParamBalance = companyParams.amount ?? ''
          this.createParamSkin = companyParams.skin ?? ''
          this.spendChecks = companyParams.spends ?? ''

          this.checkFilledBalance()
        }
        return false;
      },
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
    z-index: 50;
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
  .footer-static {
    position: static;
    margin-top: auto;
    height: 138px;
    display: flex;
    align-items: flex-end;
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
  main {
    padding-bottom: 50px;
  }
  footer {
    position: relative;
    margin-top: -50px;
    height: 50px;
    clear: both;
    padding-top: 20px;
  }
  skin_item_focus {
    background: var(--green-lighting);
  }
  .content__attach-messege .green{
    color: #63d96e;
  }
</style>
