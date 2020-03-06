<template>
  <div class="wrapper">
    <!-- Header -->
    <header>
      <a href="/" class="logo"><img src="/assets/img/svg/5sgift.svg" alt=""></a>
      <div class="messege" v-if="companyMsg && !isNeedAction" v-on:click="toggleMessage()" style="top:24px;">
        <img src="assets/img/svg/icon_message.svg" alt="">
      </div>
      <div :class="{'hamburger-active': IsActiveHamburgerClass}" class="hamburger" v-on:click="toggleMenu()">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
    <header class="second-header">
      <img class="message" src="/assets/img/svg/icon_message.svg" alt="">
      <a href="/" class="logo">
        <img src="/assets/img/main-logo.png" alt="" id="main-logo">
        <p class="main-brand">from <span>Mother Minter</span></p>
      </a>
      <div class="hamburger" v-on:click="toggleMenu()">
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
        <li><a v-if="privateKey !== ''" v-on:click="showMnemonic()">{{ $t('menu.mnemonic') }}.</a></li>
        <li><a href="/about/">{{ $t('menu.about') }}.</a></li>
        <!--<li><a href="#">{{ $t('menu.account') }}.</a></li>-->
        <li><a href="/">{{ $t('menu.createWallet') }}.</a></li>
      </ul>
      <div class="lang-block">
        <button class="btn" v-bind:class="{ 'lang-active': currentLang === 'en' }"  v-on:click="changeLocale('en')"><img src="/assets/img/svg/en.svg" alt="">En</button>
        <button class="btn" v-bind:class="{ 'lang-active': currentLang === 'ru' }"  v-on:click="changeLocale('ru')"><img src="/assets/img/svg/rus.svg" alt="">Rus</button>
      </div>
    </div>
    </transition>
    <!-- /Header -->
    <main>
      <div v-if="isShowLoader"  class="louder">
        <!-- <div class="louder-wrap"><div class="lds-ripple"><div></div><div></div></div></div>-->
        <div class="loader-02" style="top: 40%;">
          <div class="inner one"></div>
          <div class="inner two"></div>
          <div class="inner three"></div>
        </div>
      </div>

      <template v-if="screenStart">
        <!-- Start page -->
        <div class="container" style="text-align: center; font-size: 24px">
          <h1 style="padding-top: 36vh; margin-bottom: 32px">{{ $t('password.havePassword') }}</h1>
          <a v-on:click="openPasswordPage">{{ $t('yes') }}</a>
          <a style="margin-left: 50%" v-on:click="login()">{{ $t('no') }}</a>
        </div>
        <!-- /Start page -->
      </template>

      <template v-if="screenPassword">
        <!-- Password -->
        <div class="container">
          <div class="main common-wrap">
            <div class="password">
              <h1>{{ $t('password.enterPassword') }}:</h1>
              <input type="password" v-bind:placeholder="$t('password.passwordPlaceholder')" v-model="password"/>
              <a class="btn" v-on:click="login()">{{ $t('password.accessWallet') }}</a>
            </div>
          </div>
        </div>
        <!-- /Password -->
      </template>

      <template v-if="isShowSkin">
        <iframe style="width: 100%; height: 100%; position: fixed; z-index: 100;" v-bind:src="skinContent"></iframe>
      </template>

      <!-- Main -->
      <div v-show="step === 1" class="container-medium">
        <div class="main">
          <h1>{{ $t('main.youBalance') }}:</h1>
          <p class="balance" v-for="balance in balances">{{ balance.amount }} {{ balance.coin }}</p>
          <p class="currency">~{{ balanceSum }}</p>

          <template  v-if="(spendChecks.includes('games') || spendChecks.includes('phone') || spendChecks.includes('fuel') || spendChecks.includes('transfer') || spendChecks.includes('yourWallet') || spendChecks.includes('fund')) || spendChecks.length === 0">
            <p class="transfer">{{ $t('main.transferSection') }}</p>
            <div class="transfer-items">
              <a class="transfer__item" v-on:click="showTransfer()" v-if="spendChecks.includes('transfer') || spendChecks.length === 0">
                <img src="assets/img/svg/person.svg" alt="">
                <p v-html="newLineLabel($t('main.anotherPerson'))"></p>
              </a>
              <!--<a class="transfer__item" v-on:click="showFund()" v-if="spendChecks.includes('fund') || spendChecks.length === 0">
                <img src="assets/img/svg/charity.svg" alt="">
                <p v-html="newLineLabel($t('main.charityFund'))"></p>
              </a>-->
              <a class="transfer__item" v-on:click="showMobile()" v-if="spendChecks.includes('phone') || spendChecks.length === 0">
                <img src="assets/img/svg/services.svg" alt="">
                <p v-html="newLineLabel($t('main.mobileService'))"></p>
              </a>
              <!--<span class="transfer__item" v-on:click="showFuel()" v-if="spendChecks.includes('fuel') || spendChecks.length === 0">
                <img src="assets/img/svg/fuel.svg" alt="" v-on:click="showFood()">
                <p v-html="newLineLabel($t('main.foodDelivery'))"></p>
              </span>-->

              <template v-for="service in services">
                <template v-if="service.show">
                  <div class="transfer__item transfer__item-img"
                       v-bind:id="service.id"
                       v-bind:style="'background-color:' + service.bgcolor"
                       v-on:click="showServiceAlert(service)">
                    <img v-bind:src="service.ico" alt="" class="logo__item">
                  </div>
                </template>
              </template>

              <a class="transfer__item" v-on:click="showMyTransfer()" v-if="spendChecks.includes('yourWallet') || spendChecks.length === 0">
              <img src="assets/img/svg/wallet.svg" alt="">
              <p v-html="newLineLabel($t('main.youWallet'))"></p>
              </a>
              <a class="transfer__item" v-on:click="showGames()" v-if="spendChecks.includes('games') || spendChecks.length === 0">
              <img src="assets/img/svg/games.svg" alt="">
              <p v-html="newLineLabel($t('main.games'))"></p>
              </a>
            </div>
          </template>

          <template v-if="isCustomWallet">
            <p>Your wallet for fill:</p>
            <div class="copy_link">
              <p style="font-size: 12px;">{{ address }}</p>
              <div class="buttons">
                <button class="btn btn-copy" v-on:click="copyToClipboard(address, $event)">Copy<img src="/assets/img/svg/copy.svg" alt=""></button>
                <button class="btn btn-copy" v-on:click="toggleShowQR(address)">Show QR<img src="/assets/img/svg/qr_link_blue.svg" alt=""></button>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- /Main -->
      <!-- Content__Item-07 -->
      <div v-show="isNeedAction" class="container">
        <div class="feedback feedback-action common-wrap">
          <p v-if="isFeedback">{{ $t('action.toReceive') }} <span>{{ balanceSumBIP }} BIP</span> <template v-if="!isShowBalanceFromCompany">(~ {{ balanceSum }})</template> {{ $t('action.afterReceive') }}:</p>
          <p v-if="!isFeedback">{{ $t('action.toReceive') }} <span>{{ balanceSumBIP }} BIP</span> <template v-if="!isShowBalanceFromCompany">(~ {{ balanceSum }})</template> {{ $t('action.afterReceiveActive') }}:</p>
          <p class="explanation" v-if="companyMsg !== ''" style="font-size: 16px;">{{ companyMsg }}</p>
          <div class="text-wrap">
            <textarea id="ta" v-model="replyMsg" maxlength="140" v-if="isFeedbackText" v-bind:placeholder="$t('action.placeholder')"></textarea>
            <textarea id="ta" v-model="replyMsg" maxlength="140" v-if="!isFeedbackText" v-bind:placeholder="$t('action.placeholderActive')"></textarea>
            <div class="max-lenght" v-if="isFeedback">
              <span v-if="msgSize === maxLen">min {{ minLen }} / max {{ maxLen }}</span>
              <span v-if="msgSize !== maxLen">{{ msgSize }}</span>
              <img v-if="isMinMsgSize" src="/assets/img/svg/like.svg" alt="">
              <img v-if="!isMinMsgSize" src="/assets/img/svg/action_grey.svg" alt="">
            </div>
          </div>
          <button class="btn" v-bind:class="{ 'disabled': !isMinMsgSize }" v-on:click="sendReply()">{{ $t('action.access') }}</button>
        </div>
      </div>
      <!-- /Content__Item-07 -->

      <!-- Another Persone -->
      <div v-show="step === 2" class="container">
        <div class="another-persone common-wrap">
          <h1>{{ $t('main.youBalance') }}:</h1>
          <p class="balance" v-for="balance in balances">{{ balance.amount }} {{ balance.coin }}</p>
          <p class="currency">~{{ balanceSum }}</p>
          <!--<p class="transfer">{{ $t('main.transferSection') }}</p>-->
          <img class="icon" src="/assets/img/svg/person.svg" alt="">
          <p class="insert">{{ $t('main.haveWallet') }}?</p>
          <a class="btn btn-persone" v-on:click="showTransferPart21()">{{ $t('yes') }}</a>
          <a class="btn btn-persone" v-on:click="showTransferPart22()">{{ $t('no') }}</a>
          <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
        </div>
      </div>
      <!-- /Another Persone -->

      <!-- Another Persone (Dont Wallet) -->
      <div v-show="step === 22" class="container">
        <div class="another-persone another-persone__dont-wallet common-wrap">
          <h1>{{ $t('main.youBalance') }}:</h1>
          <p class="balance" v-for="balance in balances">{{ balance.amount }} {{ balance.coin }}</p>
          <p class="currency">~{{ balanceSum }}</p>
          <img class="icon" src="/assets/img/svg/person.svg" alt="">
          <p class="insert">{{ $t('main.createNewPush') }}</p>
          <a class="btn" v-on:click="showTransferPart32()">{{ $t('main.createSend') }}</a>
          <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
        </div>
      </div>
      <!-- /Another Persone (Dont Wallet) -->

      <!-- Another Persone (Have Wallet) -->
      <div v-show="step === 21" class="container">
        <div class="another-persone another-persone__dont-wallet common-wrap">
          <h1>{{ $t('main.youBalance') }}:</h1>
          <p class="balance" v-for="balance in balances">{{ balance.amount }} {{ balance.coin }}</p>
          <p class="currency">~{{ balanceSum }}</p>
          <img class="icon" src="/assets/img/svg/person.svg" alt="">
          <p class="insert">{{ $t('main.insertAddress') }}:</p>
          <input type="text" placeholder="Address" v-model="transfer.address">
          <a class="btn" v-on:click="showTransferPart31()">{{ $t('Send') }}</a>
          <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
        </div>
      </div>
      <!-- /Another Persone (Have Wallet) -->

      <div v-show="step === 42" class="container">
        <div class="content__item content__success content__success-multiple">
          <h1>{{ $t('success') }}!</h1>
          <p>{{ $t('create.willReceive') }}:</p>
          <div class="score">
            <p class="balance">{{ transfer.value }} {{ transfer.symbol }}</p>
            <p class="currency">~{{ balanceSum }}</p>
          </div>
          <p class="share">Share this link or QR:</p>
          <div :class="{'active-copy' : isCopiededSuccess}"  class="copy_link">
            <p>{{ createdLink }}</p>
            <div class="buttons">
              <button id="#copy" class="btn btn-copy btn-link-copy" v-on:click="copyToClipboard(createdLink, $event)">{{ $t('Link') }}<img src="/assets/img/svg/copy.svg" alt=""></button>
              <button class="btn btn-copy btn-qr" v-on:click="toggleShowQR(createdLink)">QR<img src="/assets/img/svg/qr_link_blue.svg" alt=""></button>
              <button class="btn btn-copy btn-share" v-on:click="startShare(createdLink, '', '', $event)">{{ $t('Share') }}<img src="/assets/img/svg/share.svg" alt=""></button>
              <button class="btn btn-copy btn-more" v-on:click="toggleShowDir()">{{ $t('More') }}<span>...</span></button>
            </div>
          </div>
          <div class="back"></div>
        </div>
      </div>

      <!-- Your Wallet -->
      <div v-show="step === 3" class="container">
        <div class="your-wallet another-persone__dont-wallet common-wrap">
          <h1>{{ $t('main.youBalance') }}:</h1>
          <p class="balance" v-for="balance in balances">{{ balance.amount }} {{ balance.coin }}</p>
          <p class="currency">~{{ balanceSum }}</p>
          <img class="icon" src="/assets/img/svg/wallet.svg" alt="">
          <p class="insert">{{ $t('main.insertAddress') }}:</p>
          <input type="text" placeholder="Address" v-model="transfer.address">
          <a class="btn" v-on:click="showTransferPart31()">{{ $t('Send') }}</a>
          <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
        </div>
      </div>
      <!-- /Your Wallet -->

      <!-- Mobile Services -->
      <div v-show="step === 4" class="container">
        <div class="mobile-services common-wrap">
          <h1>{{ $t('main.youBalance') }}:</h1>
          <p class="balance" v-for="balance in balances">{{ balance.amount }} {{ balance.coin }}</p>
          <p class="currency">~{{ balanceSum }}</p>
          <img class="icon" src="/assets/img/svg/services.svg" alt="">
          <p class="insert">{{ $t('main.mobileTitle') }}:</p>
          <input id="phone" type="text" v-model="transfer.address" placeholder="+7 9...">
          <p class='recevie'>{{ $t('main.mobileRecv') }}:<br>
            <span>~{{ balanceSumMobile }}</span>
            <!--<span>~0.01 KZT</span>
            <span>~0.01 UAH</span>
            <span>~0.01 BYN</span>-->
          </p>
          <button class="btn" v-on:click="showMobileRun()">{{ $t('Send') }}</button>
          <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
        </div>
      </div>
      <!-- /Mobile Services -->

      <!-- Games -->
      <div v-show="step === 5" class="container">
        <div class="games common-wrap">
          <h1>{{ $t('main.youBalance') }}:</h1>
          <p class="balance" v-for="balance in balances">{{ balance.amount }} {{ balance.coin }}</p>
          <p class="currency">~{{ balanceSum }}</p>
          <img class="icon" src="/assets/img/svg/games.svg" alt="">
          <p class="description">{{ $t('main.timeloop') }}</p>
          <button class="btn" v-on:click="showGamesRun()">{{ $t('main.timeloopBtn') }}</button>
          <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
        </div>
      </div>
      <!-- /Games -->

      <!-- Charity Fund -->
      <div v-show="step === 6" class="container">
        <div class="charity-fund common-wrap">
          <h1>{{ $t('main.youBalance') }}:</h1>
          <p class="balance" v-for="balance in balances">{{ balance.amount }} {{ balance.coin }}</p>
          <p class="currency">~{{ balanceSum }}</p>
          <img class="icon" src="/assets/img/svg/charity.svg" alt="">
          <p class="description">{{ $t('main.dobro') }}</p>
          <button class="btn" v-on:click="showFundRun()">{{ $t('Send') }}</button>
          <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
        </div>
      </div>
      <!-- /Charity Fund -->

      <!-- fuel Fund -->
      <div v-show="step === 115" class="container">
        <div class="charity-fund common-wrap">
          <h1>{{ $t('main.youBalance') }}:</h1>
          <p class="balance" v-for="balance in balances">{{ balance.amount }} {{ balance.coin }}</p>
          <p class="currency">~{{ balanceSum }}</p>
          <img class="icon" src="/assets/img/svg/fuel.svg" alt="">
          <p class="description">{{ $t('main.gaz') }}</p>
          <a class="btn btn-more btn-back" v-on:click="goBack()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
        </div>
      </div>
      <!-- /fuel Fund -->

    </main>
    <!-- / -->

    <!-- Modal Alert -->
    <div class="modal-alert" v-bind:class="{ 'modal-activation-error': isShowError }" v-if="isShowError">
      <div class="close-modal-alert" v-on:click="closeError()">
        <span></span><span></span>
      </div>
      <p>{{ errorMsg }}</p>
    </div>

    <div class="modal-alert" v-bind:class="{ 'modal-activation-error': isShowMessage }" v-if="isShowMessage">
      <div class="close-modal-alert" v-on:click="closeMessage()">
        <span></span><span></span>
      </div>
      <p class="title">Message:</p>
      <p>{{ companyMsg }}</p>
    </div>
    <!-- /Modal Alert -->

    <!-- Modal -->
    <div v-if="step === 200" class="modal-alert" v-bind:class="{ 'modal-activation-error': (step === 200) }">
      <img v-bind:src="successIcon" alt="">
      <p class="yipe">Yippee!</p>
      <p>
        {{ transfer.value }} {{ transfer.symbol }}
      </p>
      <p class="currency" v-if="!isShowMobile">~{{ balanceSum }}</p>
      <p class="currency" v-if="isShowMobile">~{{ balanceSumMobile }}</p>
      <p>
        {{ $t('main.successSent') }}
        <template v-if="isDobro">
          <br><template v-html="newLineLabel($t('dobroSuccess'))"></template>
        </template>
      </p>
      <template v-if="successLink">
        <p class="pers-link">{{ $t('timeloopLink') }}:</p>
        <a v-bind:href="successLink" target="_blank" class="link">{{ successLink }}</a>
        <a v-bind:href="successLink" class="btn btn-link" target="_blank">{{ $t('playNow') }}</a>
      </template>

      <a class="btn btn-more btn-back" v-on:click="goToMain()"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
    </div>
    <!-- /Modal -->

    <!-- Modal QR -->
    <div class="modal-alert modal-qr" v-bind:class="{ 'modal-activation-qr': isShowModalQR }" v-if="isShowModalQR">
      <div class="close-modal-alert" v-on:click="toggleShowQR()">
        <span></span><span></span>
      </div>
      <qrcode v-bind:value="createdLink" :options="{ width: 250 }" tag="img"></qrcode>
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
          <img v-on:click="startShare(createdLinkGame, 'BIP to game', '')" src="/assets/img/svg/share.svg" alt="">
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
          <img v-on:click="startShare(createdLinkFund, '', '')" src="/assets/img/svg/share.svg" alt="">
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

    <!-- Service -->
    <div class="modal-alert modal-sevices" v-bind:class="{ 'modal-activation-qr': isShowModalService }" v-if="isShowModalService">
      <div class="modal-header" v-bind:style="'background-color:' + service.bgcolor">
        <img v-bind:src="service.ico" alt="">
        <div class="close-modal" v-on:click="isShowModalService = false">
          <span></span><span></span>
        </div>
      </div>
      <div class="container common-wrap">
        <p class="use">{{ $t('main.serviceDesc') }}</p>
        <template v-if="!isShowModalServiceSuccess">
          <div class="wrap-select">
            <select size="1" v-model="selectedServiceValue" v-on:change="changeService(service)">
              <option></option>
              <option v-for="item in service.values_up"
                      v-if="item.show"
                      v-bind:value="item.value"
                      >{{ item.label }}</option>
            </select>
          </div>

          <p class="your-balance">{{ $t('main.youBalance') }}:
            <span v-for="balance in balances">{{ balance.amount }} {{ balance.coin }}</span>
            ~{{ balanceSum }}
          </p>

          <input type="text" class="input" :placeholder="$t('create.yourEmail')" v-model="userEmail">
          <button class="btn" v-on:click="buyService(service)">{{ $t('pay') }}</button>
          <button class="btn btn-more btn-back" v-on:click="isShowModalService = false"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</button>
        </template>
        <p class="congr" v-if="isShowModalServiceSuccess" style="color: #63d96e;">{{ $t('main.serviceSuccess') }}</p>
      </div>
    </div>
    <!-- /Service -->

    <!-- Footer -->
    <footer :class="{'footer-static': step === 4}" class="fixed-footer">
      <a href="https://www.minter.network/" target="_blank" class="copy">Powered by <span>Minter</span></a>
    </footer>
    <!-- /Footer -->
    <!-- /Page -->
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  import VueQrcode from '@chenfengyuan/vue-qrcode'

  import {
    BACKEND_BASE_URL, createCompany,
    createWallet, createWalletV2, DEFAULT_SYMBOL, DEPOSIT_ADDRESS, EXPLORER_GATE_API_URL, generateWalletUid,
    getAddressBalance, getBipPrice,
    getCoinExchangeList, getCoinExchangeListV2, getFiatByLocale,
    getFiatExchangeList, getMnemonic,
    LINK, prettyFormat, PUSH_WALLET_ID_LENGTH, toHex
  } from './core'
  import axios from 'axios'
  import { Decimal } from 'decimal.js'
  import TxDataSend from 'minterjs-tx/src/tx-data/send'
  import { convertToPip, toBuffer } from 'minterjs-util'
  import { coinToBuffer } from 'minterjs-tx/src/helpers'
  import { Tx, TX_TYPE } from 'minterjs-tx'
  import TxSignature from 'minterjs-tx/src/tx-signature'
  import * as cryptoRandomString from 'crypto-random-string'
  import { SHA256 } from 'crypto-js'
  import { SKINS } from './skins'
  import { SPENDS } from './spendings'
  import { SPENDS_SERVICES } from './spendings2'

  if (process.client) {
    Vue.use(VueClipboard)
  }

  export function closeFrame() {
    console.log(this)
  }

  const MAX_UID_LENGTH = 64

  export default {
    data () {
      return {
        isShowLoader: false,
        screenStart: false,
        screenPassword: false,
        isNeedAction: false,
        isFeedback: true,
        isFeedbackText: true,
        isBalanceEmpty: false,
        isCustomWallet: false,

        isShowModalQR: false,
        isShowModalDir: false,
        isDobro: false,
        isShowModalService: false,
        isShowModalServiceSuccess: false,

        qrLink: 'empty',

        prevStep: [],
        step: 0,
        startHash: '',

        password: '',
        uid: '',
        privateKey: '',
        address: '',
        companyMsg: '',
        activateBalance: 0,
        isShowActivateBalance: false,
        isShowBalanceFromCompany: false,
        isShowMessage: false,
        replyMsg: '',
        nonce: 1,

        errorMsg: '',
        isShowError: false,
        isShowMenu: false,
        IsActiveHamburgerClass: false,
        isCopiededSuccess: false,

        createParamUID: '',

        balances: [],
        coins: [],
        bipToUSD: null,
        fiat: [],
        balanceSumUSD: 0,
        balanceSumBIP: 0,
        balanceSumFiat: 0,
        isBalanceUpdated: false,
        isShowMobile: false,

        maxLen: 140,
        minLen: 100,

        transfer: {
          address: '',
          value: '',
          symbol: '',
        },
        successIcon: '/assets/img/svg/person.svg',
        successLink: '',

        skins: SKINS,
        spends: SPENDS,
        services: SPENDS_SERVICES,
        spendChecks: [],
        skin: null,
        service: null,
        selectedServiceValue: null,
        selectedServiceValuePrice: null,
        userEmail: '',

        isShowSkin: false,
        skinContent: '',
      }
    },
    components: {
      qrcode: VueQrcode,
    },
    created () {
      this.uid = this.$route.params.id
      this.startHash = this.$route.hash
      if (this.uid && this.uid.length > PUSH_WALLET_ID_LENGTH && this.uid.length < MAX_UID_LENGTH) {
        this.isCustomWallet = true
        this.openPasswordPage()
        return
      }
      this.checkAuth()
      const self = this
      window.hideSkin = function () {
        self.isShowSkin = false
      }
      window.skinMessage = function () {
        return self.companyMsg
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
        return this.maxLen - this.replyMsg.length
      },
      isMinMsgSize() {
        return this.replyMsg.length > this.minLen
      },
      balanceSum() {
        const fiatVal = getFiatByLocale(this.currentLang)
        const fiatSymbol = fiatVal ? fiatVal.symbol : ''
        if (this.currentLang === 'en') {
          return `${this.balanceSumUSD.toFixed(2)} $`
        }
        return `${this.balanceSumFiat.toFixed(2)} ${fiatSymbol}`
      },
      balanceSumMobile() {
        const fiatVal = getFiatByLocale(this.currentLang)
        const fiatSymbol = fiatVal ? fiatVal.symbol : ''
        const discount = new Decimal(0.8);
        if (this.currentLang === 'en') {
          const sum = new Decimal(this.balanceSumUSD).mul(discount)
          return `${sum.toFixed(2)} $`
        }
        const sum = new Decimal(this.balanceSumFiat).mul(discount)
        return `${sum.toFixed(2)} ${fiatSymbol}`
      }
    },
    // method
    methods: {
      showMnemonic: function () {
        this.errorMsg = getMnemonic(this.uid, this.password)
        this.isShowError = true
      },
      goToMain: function () {
        this.isShowMobile = false
        this.step = 1
        this.prevStep = []
      },
      goBack: function () {
        this.step = this.prevStep.pop()
        return false
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
      toggleMessage: function () {
        this.isShowMessage = !this.isShowMessage
      },
      closeMessage: function () {
        this.companyMsg = ''
        this.isShowMessage = false
      },
      openPasswordPage: function () {
        this.isShowLoader = false
        this.screenPassword = true
        this.screenStart = false
      },
      openMainPage: async function () {
        this.screenPassword = false
        this.screenStart = false
        this.prevStep = []
        if (this.startHash === '#mobile') {
          this.prevStep.push(1)
          this.step = 4
        } else if (this.startHash === '#game') {
          this.prevStep.push(1)
          this.step = 5
        } else if (this.startHash === '#fund') {
          this.prevStep.push(1)
          this.step = 6
        } else {
          this.step = 1
        }
        this.isNeedAction = false

        await this.loadAdditionalInfo()
        await this.loadCoins()
        this.updateBalance()
      },
      checkAuth: async function () {
        let response
        try {
          this.isShowLoader = true
          response = await axios.get(`${BACKEND_BASE_URL}/api/${this.uid}`)
          if (response && response.status === 200) {
            if (response.data.status === 70 || response.data.status === 71) { // new
              // this.isFeedback = (response.data.status === 70)
              this.isFeedback = true
              if (response.data.status === 71) {
                this.isFeedbackText = false
              }

              this.isNeedAction = true
              this.screenPassword = false
              this.screenStart = false

              let wallet
              if (this.startHash === '#old') {
                wallet = await createWallet(this.uid)
              } else {
                wallet = await createWalletV2(this.uid)
              }
              this.address = wallet.address
              this.privateKey = wallet.privateKey

              // load company params
              const afterActivateResponse = await axios.post(`${BACKEND_BASE_URL}/api/${this.uid}/complex`, {
                mxaddress: this.address,
              })

              if (afterActivateResponse.status === 200 && afterActivateResponse.data) {
                this.activateParams = afterActivateResponse.data
                this.companyMsg = this.activateParams.notice
                this.activateBalance = `${this.activateParams.balance}`
                this.isShowActivateBalance = true
              }

              await this.loadAdditionalInfo()
              this.updateBalance()
            } else {
              if (response.data.isProtected) {
                // show password
                this.openPasswordPage()
              }
              else {
                this.login()
              }
            }
          }
        } catch (error) {
          this.isCreateNew = false
          console.error(error)
          this.openPasswordPage()
        }
      },
      login: async function () {
        this.isShowLoader = true
        try {
          let wallet
          if (this.startHash === '#old') {
            wallet = await createWallet(this.uid, this.password)
          } else {
            wallet = await createWalletV2(this.uid, this.password)
          }

          this.privateKey = wallet.privateKey
          this.address = wallet.address

          // try activate
          const response = await axios.post(`${BACKEND_BASE_URL}/api/${this.uid}`, {
            mxaddress: this.address,
            custom: this.isCustomWallet,
          })
          if (response.status === 200) {
            const afterActivateResponse = await axios.post(`${BACKEND_BASE_URL}/api/${this.uid}/after`, {
              mxaddress: this.address,
              custom: this.isCustomWallet,
            })

            if (afterActivateResponse.status === 200 && afterActivateResponse.data) {
              this.companyMsg = afterActivateResponse.data.msg ?? ''
              this.skin = afterActivateResponse.data.skin ?? ''
              this.spendChecks = afterActivateResponse.data.spends ?? []

              if (this.skin !== '') {
                this.loadSkin(this.skin)
              }
            }

            if (response.data.status === 100) {
              // login success
              this.openMainPage()
              return
            }
          }
          // show error
        } catch (error) {
          console.error(error)
          //this.$bvModal.show('modalError')
        }
        this.errorMsg = this.$t('errors.authError')
        this.isShowError = true
        this.isShowLoader = false
      },
      sendReply: async function () {
        if (!this.isMinMsgSize) {
          return false
        }

        if (this.isFeedback && this.replyMsg.length < this.minLen) {
          this.errorMsg = this.$t('errors.params')
          this.isShowError = true
          return false
        }
        if (!this.isFeedback && this.replyMsg.length < 8) {
          this.errorMsg = this.$t('errors.params')
          this.isShowError = true
          return false
        }
        // send reply to company
        let afterActivateResponse = await axios.post(`${BACKEND_BASE_URL}/api/${this.uid}/reply`, {
          mxaddress: this.address,
          reply: this.replyMsg,
        })
        this.companyMsg = this.$t('successMsg.successReply')
        this.isShowActivateBalance = false

        if (afterActivateResponse.status === 200 && afterActivateResponse.data && afterActivateResponse.data.status === 'ok') {
          this.isBalanceEmpty = true;

          try {
            afterActivateResponse = await axios.post(`${BACKEND_BASE_URL}/api/${this.uid}/after`, {
              mxaddress: this.address,
              custom: this.isCustomWallet,
            })

            if (afterActivateResponse.status === 200 && afterActivateResponse.data) {
              this.companyMsg = afterActivateResponse.data.msg ?? ''
              this.skin = afterActivateResponse.data.skin ?? ''
              this.spendChecks = afterActivateResponse.data.spends ?? []

              if (this.skin !== '') {
                this.loadSkin(this.skin)
              }
            }
          } catch (error) {
            console.log(error)
          }
          this.openMainPage()

          const self = this
          setTimeout(() => {
            self.updateBalance()
          }, 10*1000)
        }
        return false
      },
      updateBalance: async function () {
        if (!this.address) {
          return false;
        }
        this.isShowLoader = true

        try {
          this.balanceSumUSD = new Decimal(0)
          this.balanceSumBIP = new Decimal(0)
          this.balanceSumFiat = new Decimal(0)
          const balances = await getAddressBalance(this.address)
          this.balances = balances
            .filter(({ amount }) => {
              return new Decimal(amount).gt(0)
            })
            .map(({ coin, amount }) => {
              let usdAmount = 0
              let bipAmount = 0
              if (new Decimal(amount).gt(0)) {
                const coinToDef = this.coins[coin]
                if (coinToDef || coin === DEFAULT_SYMBOL) {
                  bipAmount = new Decimal(amount)
                    .mul(coinToDef ?? 1)
                  this.balanceSumBIP = this.balanceSumBIP.plus(bipAmount)
                }

                if (this.bipToUSD) {
                  usdAmount = bipAmount
                    .mul(this.bipToUSD)
                  this.balanceSumUSD = this.balanceSumUSD.plus(usdAmount)
                }

                this.transfer.value = amount
                this.transfer.symbol = coin
              }

              return {
                coin,
                amount: prettyFormat(amount),
                usdAmount
              }
            })
          this.recalculateBalance()

          const response = await axios.get(`${EXPLORER_GATE_API_URL}/api/v1/nonce/${this.address}`)
          if (response.data && response.data.data && response.data.data.nonce) {
            this.nonce = Number(response.data.data.nonce) + 1
          }

        /*if (!this.isBalanceEmpty && this.balanceSumBIP.lte(0)) {
          this.isBalanceEmpty = true;
          const self = this
          setTimeout(() => {
            self.updateBalance()
          }, 7*1000)
        }*/
        } catch (error) {
          console.error(error)
          // this.errorMsg = error.message
          // this.isShowError = true
        }
        this.isBalanceUpdated = false
        this.isShowLoader = false

        if (this.balanceSumBIP.lte(0) && this.isShowActivateBalance) {
          this.balanceSumBIP = new Decimal(this.activateBalance)
          this.isShowBalanceFromCompany = true
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
      newLineLabel(label) {
        return label.split('|').join('<br>')
      },
      closeError: function () {
        this.isShowError = false
      },
      loadAdditionalInfo: async function () {
        this.bipToUSD = await getBipPrice()
        if (this.fiat.length === 0) {
          this.fiat = await getFiatExchangeList()
        }
      },
      loadCoins: async function () {
        /*this.isShowLoader = true
        if (this.coins.length === 0) {
          getCoinExchangeList()
            .then((coins) => {
              this.coins = coins
              this.isShowLoader = false
            })
        }*/
        this.coins = await getCoinExchangeListV2()
      },
      // application
      showTransfer: function () {
        this.prevStep.push(this.step)
        this.step = 2

        this.successIcon = '/assets/img/svg/person.svg'
      },
      showTransferPart21: function () {
        this.prevStep.push(this.step)
        this.step = 21
      },
      showTransferPart22: function () {
        this.prevStep.push(this.step)
        this.step = 22
      },
      showTransferPart31: async function () {
        // this.prevStep.push(this.step)
        // this.step = 31

        if (this.transfer.address) {
          this.useMax(1)
          const result = await this.sendTransfer(this.transfer.address, this.transfer.value, this.transfer.symbol)
          if (result) {
            this.step = 200
          }
        } else {
          this.errorMsg = this.$t('errors.params')
          this.isShowError = true
        }
      },
      showTransferPart32: async function () {
        //this.prevStep.push(this.step)
        //this.step = 32

        try {
          // generate wallet, start check balance
          this.createParamUID = await generateWalletUid()
          const wallet = await createWalletV2(this.createParamUID, '')
          // send info to server
          const company = await createCompany({
            type: 'simple',
            uid: this.createParamUID,
            mxaddress: wallet.address,
          })

          this.transfer.address = wallet.address
          this.useMax(2)
          const result = await this.sendTransfer(this.transfer.address, this.transfer.value, this.transfer.symbol)
          if (result) {
            this.step = 42

          }
        } catch (error) {
          //this.errorMsg = error
          console.error(error)
        }
      },
      showMyTransfer: function () {
        this.prevStep.push(this.step)
        this.step = 3
        this.successIcon = '/assets/img/svg/wallet.svg'
      },
      showFund: function () {
        this.prevStep.push(this.step)
        this.step = 6
      },
      showFundRun: async function () {
        this.transfer.address = 'Mxb3a5a735b1cdc88090bbd6c253fba1bc78e1b5d0'
        this.useMax(1)
        if (this.transfer.address) {
          this.useMax(1)
          const result = await this.sendTransfer(this.transfer.address, this.transfer.value, this.transfer.symbol)
          if (result) {
            this.step = 200
            this.successIcon = '/assets/img/svg/charity.svg'
            this.isDobro = true
          }
        } else {
          this.errorMsg = this.$t('errors.params')
          this.isShowError = true
        }
      },
      showMobile: function () {
        this.prevStep.push(this.step)
        this.step = 4
        this.isShowMobile = true
      },
      showMobileRun: async function () {
        // send to bipToPhone
        if (this.transfer.address.length < 11) {
          this.errorMsg = this.$t('errors.params')
          this.isShowError = true
          return false;
        }

        this.isShowLoader = true
        try {
          const response = await axios.post(`${BACKEND_BASE_URL}/api/${this.uid}/services/phone`, {
            mxaddress: this.address,
            phone: this.transfer.address,
            custom: this.isCustomWallet,
          })
          if (response && response.status === 200) {
            if (response.data) {
              this.useMax(3)
              const mxaddress = response.data
              const result = await this.sendTransfer(mxaddress, this.transfer.value, this.transfer.symbol)
              if (result) {
                this.successIcon = '/assets/img/svg/services.svg'
                this.step = 200
              }

            } else {
              this.errorMsg = this.$t('errors.phoneError')
              this.isShowError = true
            }
          } else {
            throw new Error(response.status)
          }
        } catch (error) {
          console.error(error)
        }
        this.isShowLoader = false
      },
      showGames: function () {
        this.prevStep.push(this.step)
        this.step = 5
      },
      showFuel: function () {
        this.prevStep.push(this.step)
        this.step = 115
      },
      showGamesRun: async function () {
        this.isShowLoader = true
        this.transfer.address = '0x0'
        this.useMax(4)
        // create timeloop link
        const secretCode = cryptoRandomString({
          length: 10,
          type: 'hex',
        })
        const secretCodeHash = SHA256(secretCode).toString()
        const timeloopAddress = 'Mx3650064486380210127159872871912061022891'
        const link = `https://timeloop.games/?gift=${secretCode}`
        const result = await this.sendTransfer(timeloopAddress, this.transfer.value, this.transfer.symbol, secretCodeHash)
        if (result) {
          this.successIcon = '/assets/img/svg/games.svg'
          this.successLink = link
          this.step = 200
        }
        this.isShowLoader = false
      },
      showFood: function () {

      },
      showServiceAlert: async function (service) {
        this.isShowLoader = true
        this.service = service

        try {
          const response = await axios.post(`${BACKEND_BASE_URL}/api/${this.uid}/services/bitrefill/${service.slug}`, {
            mxaddress: this.address,
            custom: this.isCustomWallet,
          })
          const variants = response.data

          /*this.service.values_up = this.service.values.map((item) => {
            let label = item.label
            let bipPrice = 0
            for (let index = 0; index < variants.length; index += 1) {
              if (variants[index].value === item.value) {
                if (variants[index].bipPrice) {
                  label = `${item.label} (${variants[index].bipPrice} BIP)`
                  bipPrice = variants[index].bipPrice;
                }
                break
              }
            }
            return {
              value: item.value,
              label,
              bipPrice,
              show: new Decimal(bipPrice).gt(0),
            }
          })*/
          this.service.values_up = variants.map((item) => {
            if (item.bipPrice) {
              item.label = `${item.label} (${item.bipPrice} BIP)`
            }

            return {
              value: item.value,
              label: item.label,
              bipPrice: item.bipPrice,
              show: new Decimal(item.bipPrice).gt(0),
            }
          })

          this.isShowModalService = true
        } catch (error) {
          this.errorMsg = this.$t('errors.internalServerError')
          this.isShowError = true
        }
        this.isShowLoader = false
      },
      changeService: async function (service) {
        this.selectedServiceValuePrice = null
        // console.log(service, this.selectedServiceValue)
        for (let index = 0; index < this.service.values_up.length; index += 1) {
          if (this.service.values_up[index].value === this.selectedServiceValue) {
            if (this.service.values_up[index].bipPrice) {
              this.selectedServiceValuePrice = new Decimal(this.service.values_up[index].bipPrice);
            }
            break
          }
        }
      },
      buyService: async function (service) {
        if (!service || this.userEmail === '') {
          this.errorMsg = this.$t('errors.failEmail')
          this.isShowError = true
          return false;
        }

        if (!this.selectedServiceValuePrice) {
          this.errorMsg = this.$t('errors.priceError')
          this.isShowError = true
          return false;
        }

        // check if balance gte need money
        if (new Decimal(this.balanceSumBIP).lt(this.selectedServiceValuePrice)) {
          this.errorMsg = this.$t('errors.smallBalanceError')
          this.isShowError = true
          return false;
        }

        try {
          let priceSelectedItem = this.selectedServiceValuePrice.toNumber()

          if (this.transfer.symbol !== DEFAULT_SYMBOL) {
            priceSelectedItem = this.convert(priceSelectedItem)
          }

          // send BIP to server
          const hash = await this.sendTransfer(
            DEPOSIT_ADDRESS,
            priceSelectedItem,
            this.transfer.symbol
          )
          if (hash === false) {
            //fail to deposit BIP
            this.errorMsg = this.$t('errors.internalServerError')
            this.isShowError = true
            return false;
          }
          this.isShowLoader = true
          // wait transaction
          // await this.sleep(10 * 1000)

          // try create order
          const order = await axios.post(`${BACKEND_BASE_URL}/api/${this.uid}/services/bitrefill/`, {
            mxaddress: this.address,
            custom: this.isCustomWallet,
            slug: service.slug,
            value: this.selectedServiceValue,
            recipientEmail: this.userEmail,
            hash,
          })
          // success
          this.isShowLoader = false
          this.isShowModalServiceSuccess = true

          this.updateBalance()
        } catch (error) {
          this.errorMsg = this.$t('errors.internalServerError')
          this.isShowError = true
          this.isShowLoader = false
        }
      },
      sendTransfer: async function (to, value, symbol, payload = null) {
        this.isShowLoader = true
        try {
          const txData = new TxDataSend({
            to: toBuffer(to),
            coin: coinToBuffer(symbol),
            value: `0x${convertToPip(value, 'hex')}`,
          })
          const txParams = {
            nonce: String('0x' + toHex(this.nonce)),
            chainId: '0x01',
            gasPrice: '0x01',
            gasCoin: coinToBuffer(symbol),
            type: TX_TYPE.SEND,
            data: txData.serialize(),
            signatureType: '0x01'
          }
          if (payload) {
            txParams.payload = `0x${Buffer.from(payload, 'utf-8').toString('hex')}`
          }

          const tx = new Tx(txParams)
          const privateKeyBuffer = Buffer.from(this.privateKey, 'hex')
          tx.signatureData = (new TxSignature()).sign(tx.hash(false), privateKeyBuffer).serialize()
          const serializedTx = tx.serialize().toString('hex')

          // send to back
          const result = await axios.post(`${BACKEND_BASE_URL}/api/${this.uid}/send`, {
            mxaddress: this.address,
            custom: this.isCustomWallet,
            rawTx: serializedTx,
          })

          if (result.data.hash) {
            this.nonce += 1
            this.isShowLoader = false

            console.log('txHash', result.data.hash)
            return result.data.hash
          }
        } catch (error) {
          console.error(error)
          this.errorMsg = this.$t('errors.sendError')
          this.isShowError = true

          this.isShowLoader = false
          return false
        }
      },
      useMax: function (type = 1) {
        if (this.transfer.symbol === '') {
          return
        }
        let index = 0
        for(index; index < this.balances.length; index +=1 ) {
          if (this.balances[index].coin === this.transfer.symbol) {
            break;
          }
        }

        const coinToBip = this.coins[this.transfer.symbol] ?? 1
        if (type === 1) {// simple transfer
          const fee = new Decimal(0.01).div(coinToBip)
          this.transfer.value = new Decimal(this.balances[index].amount).minus(fee).toString()
        }
        if (type === 2) {// pushwallet
          const fee = new Decimal(0.01).div(coinToBip)
          this.transfer.value = new Decimal(this.balances[index].amount).minus(fee).toString()
        }
        if (type === 3) {// phone
          const fee = new Decimal(0.01).div(coinToBip)
          this.transfer.value = new Decimal(this.balances[index].amount).minus(fee).toString()
        }
        if (type === 4) {// timeloop
          const fee = new Decimal(0.138).div(coinToBip)
          this.transfer.value = new Decimal(this.balances[index].amount).minus(fee).toString()
        }
      },
      convert: function (amountBIP) {
        if (this.transfer.symbol === '') {
          return null
        }
        let index = 0
        for(index; index < this.balances.length; index +=1 ) {
          if (this.balances[index].coin === this.transfer.symbol) {
            break
          }
        }

        const coinToBip = this.coins[this.transfer.symbol] ?? 1

        return new Decimal(amountBIP).div(coinToBip).toNumber()
      },
      copyToClipboard: function (message, event = null) {
        this.$copyText(message).then( (e) => {
          if (event) {
            if (event.target.classList.contains('qr-link') || event.target.closest('.qr-link')) {
              document.querySelectorAll('.active-gr').forEach(function(item) { item.classList.remove('active-gr')})
              event.target.classList.add('active-gr')
              return false
            }
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
      toggleShowDir: function () {
        this.isShowModalDir = !this.isShowModalDir
      },
      toggleShowQR: function (link = 'empty') {
        this.isShowModalQR = !this.isShowModalQR
        this.qrLink = link
      },
      startShare: async function (link = '', title = '', text = '', $event) {
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
      loadSkin: async function (skin) {
        this.isShowSkin = true;

        for(let i = 0; i < this.skins.length; i += 1) {
          if (this.skins[i].id === skin) {
            this.skinContent = this.skins[i].path
            console.log(this.skinContent)
            break
          }
        }
      },
      sleep: async function (ms) {
        await new Promise(resolve => setTimeout(resolve, ms))
      },
    },
    // html header section
    head: {
      meta: [
        // { charset: 'utf-8' },
        // { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
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
  .modal-activation-qr {
    opacity: 1;
    z-index: 12;
    margin-top: 0;
  }
  .modal-activation-dir {
    opacity: 1;
    z-index: 11;
  }
  .header-section {
    margin-bottom: 5px;
  }
  .balances {
    margin-top: 5px;
  }
  .balance-usd {
    font-size: 16pt;
  }
  .balance-fiat {
    font-size: 12pt;
  }
  .balance-token {
    margin-right: 10px;
  }
  .language-box {
    font-size: 10pt;
  }
  .balance-section {
    margin-bottom: 20px;
  }
  .transfer-section {
    margin-bottom: 20px;
  }
  .payment-sections {
    margin-bottom: 20px;
  }
  .pincode {
    margin-bottom: 10px;

  }
  .loader-modal {
    background: transparent;
    border: none;
  }
  .max-btn {
    float: right;
    position: absolute;
    right: 4px;
    top: 38px;
    padding: 2px 10px;
  }
  .menu-visible {
    opacity: 1;
    z-index: 9;
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
    transition: opacity .8s;
  }
  .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  main {
    padding-bottom: 50px;
  }
  footer {
    display: none;
    position: relative;
    margin-top: -50px;
    height: 50px;
    clear: both;
    padding-top: 20px;
  }
  @media screen and (min-height: 410px) {
    .footer-static {
      position: static !important;
    }
  }
</style>
