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
        <!-- Content -->
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
              <a class="btn btn-more btn-back" v-on:click="$router.go(-1)"><img src="/assets/img/svg/back.svg" alt="">{{ $t('back') }}</a>
            </div>
            <!-- /Content Start -->
          </div>
        </div>
        <!-- /Content -->
        <!-- Footer -->
        <footer class="about-footer">
            <a href="https://www.minter.network/" target="_blank" class="copy">Powered by <span>Minter</span></a>
        </footer>
        <!-- /Footer -->
        <!-- /Page -->
        <!-- Scripts -->
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
        isShowMenu: false,
        IsActiveHamburgerClass: false,
      }
    },
    created () {
    },
    computed: {
      currentLang() {
        return this.$i18n.locale
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
    .about-footer {
        position: static;
    }
</style>
