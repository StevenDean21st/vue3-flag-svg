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
import { createApp } from "vue";
import App from "./App.vue";
import Vue3FlagSVG from "packages/vue3-flag-svg/index";

const app = createApp(App);

app.use(Vue3FlagSVG);
app.mount("#app");
```

### Manually import

```vue
<template>
  <ChinaFlag style="width: 100px" />
  <RussiaFlag style="width: 100px" />
  <UnitedStatesofAmericaFlag style="width: 100px" />
  <UnitedKingdomFlag style="width: 100px" />
  <FranceFlag style="width: 100px" />
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
  * with default inline 'width: 100%; height: auto;' style
*/
</style>
```

### Dynamic component

```vue
<template>
  <component
    :is="ComponentCodeName.cn.component"
    style="width: 100px"
  ></component>
  <component
    :is="ComponentCodeName['gb-sct'].component"
    style="width: 100px"
  ></component>
  <component
    v-for="flag of ComponentCodeName"
    style="width: 100px"
    :is="flag.component"
  />
</template>

<script setup>
import { ComponentCodeName } from "vue3-flag-svg/manifest";
</script>
<style scoped></style>
```

### Use static assets

If you don't want to use vue components, just manually move svg assets in `/assets` to your web server public direct.

The manifest `/manifest/countries.js` provides all assets' file name and its country code name:

```js
export const CountryCodeName = {
  af: { enName: "Afghanistan", asset: "af.svg" },
  // ...
};
```

May use like this:

```vue
<template>
  <!-- if your server hold static assets in '/flags' -->
  <img
    v-for="flag of CountryCodeName"
    :src="'/flags/' + flag.asset"
    :alt="flag.enName"
    style="width: 100px"
  />
</template>

<script setup>
import { CountryCodeName } from "vue3-flag-svg/manifest";
</script>
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
