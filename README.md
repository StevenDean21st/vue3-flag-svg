# Vue 3 Flag SVG

![npm](https://img.shields.io/npm/v/vue3-flag-svg)
![npm](https://img.shields.io/npm/dm/vue3-flag-svg)
![npm](https://img.shields.io/bundlephobia/min/vue3-flag-svg)
![license](http://img.shields.io/github/license/StevenDean21st/vue3-flag-svg.svg)
![github](https://img.shields.io/github/stars/StevenDean21st/vue3-flag-svg?style=social)

National and regional SVG flag icon components for Vue 3.x, including 266 flags.

<p align="center">
    <img style="display: inline" src="https://raw.githubusercontent.com/StevenDean21st/vue3-flag-svg/main/packages/vue3-flag-svg/assets/cn.svg" width="80" alt="China Flag" title="China"/>
    <img style="display: inline" src="https://raw.githubusercontent.com/StevenDean21st/vue3-flag-svg/main/packages/vue3-flag-svg/assets/us.svg" width="80" alt="U.S. Flag" title="U.S."/>
    <img style="display: inline" src="https://raw.githubusercontent.com/StevenDean21st/vue3-flag-svg/main/packages/vue3-flag-svg/assets/gb.svg" width="80" alt="U.K. Flag" title="U.K."/>
    <img style="display: inline" src="https://raw.githubusercontent.com/StevenDean21st/vue3-flag-svg/main/packages/vue3-flag-svg/assets/fr.svg" width="80" alt="France Flag" title="France"/>
    <img style="display: inline" src="https://raw.githubusercontent.com/StevenDean21st/vue3-flag-svg/main/packages/vue3-flag-svg/assets/ru.svg" width="80" alt="Russia Flag" title="Russia"/>
    <img style="display: inline" src="https://raw.githubusercontent.com/StevenDean21st/vue3-flag-svg/main/packages/vue3-flag-svg/assets/un.svg" width="80" alt="U.N. Flag" title="U.N."/>
</p>

## Installation

```bash
npm install vue3-flag-svg
```

## Usage

### Fully import

```js
//main.ts or main.js
import {createApp} from "vue";
import App from "./App.vue";
import Vue3FlagSVG from "packages/vue3-flag-svg/index";

const app = createApp(App);

app.use(Vue3FlagSVG);
app.mount("#app");
```

### Manually import

```vue

<template>
  <ChinaFlag/>
  <RussiaFlag/>
  <UnitedStatesofAmericaFlag/>
  <UnitedKingdomFlag/>
  <FranceFlag/>
</template>

<script setup>
import {
  UnitedStatesofAmericaFlag,
  ChinaFlag,
  RussiaFlag,
  UnitedKingdomFlag,
  FranceFlag,
} from "vue3-flag-svg";
</script>

<style>
/* 
  * the flag component only includes a <img> element
  * with default 100% width and auto height
  * customize it as you wish 
*/
</style>
```

## Generator Icons

This package is based on [flag-icons](https://www.npmjs.com/package/flag-icons).

If you want to clone the whole mono-repository and update flag svg assets, run:

```bash
# at monorepo root
npm install pnpm -D # if not installed

pnpm update flag-icons
pnpm run install-all
pnpm run build
```

To preview all icons, run:

```bash
pnpm run test
```
