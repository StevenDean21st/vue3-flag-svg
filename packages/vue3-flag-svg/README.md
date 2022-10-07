# Vue 3 Flag SVG

National and regional SVG flag icon components for Vue 3.x, including 266 flags.

<img src="./assets/cn.svg" width="80" alt="China Flag" title="China"/>
<img src="./assets/us.svg" width="80" alt="U.S. Flag" title="U.S."/>
<img src="./assets/gb.svg" width="80" alt="U.K. Flag" title="U.K."/>
<img src="./assets/fr.svg" width="80" alt="France Flag" title="France"/>
<img src="./assets/ru.svg" width="80" alt="Russia Flag" title="Russia"/>
<img src="./assets/un.svg" width="80" alt="U.N. Flag" title="U.N."/>

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
import Vue3FlagSVG from "vue3-flag-svg";

const app = createApp(App);

app.use(Vue3FlagSVG);
app.mount("#app");
```

### Manually import

```vue
<template>
  <ChinaFlag />
  <RussiaFlag />
  <UnitedStatesofAmericaFlag />
  <UnitedKingdomFlag />
  <FranceFlag />
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
