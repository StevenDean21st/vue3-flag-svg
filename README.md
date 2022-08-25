# Vue 3 Flag SVG

National and regional SVG flag icon components for Vue 3.x, including 266 flags.

<img src="./packages/assets/cn.svg" width="80" alt="China Flag" title="China"/>
<img src="./packages/assets/us.svg" width="80" alt="U.S. Flag" title="U.S."/>
<img src="./packages/assets/gb.svg" width="80" alt="U.K. Flag" title="U.K."/>
<img src="./packages/assets/fr.svg" width="80" alt="France Flag" title="France"/>
<img src="./packages/assets/ru.svg" width="80" alt="Russia Flag" title="Russia"/>
<img src="./packages/assets/un.svg" width="80" alt="U.N. Flag" title="U.N."/>

## Installation

```bash
npm install vue3-flag-svg
```

## Usage

Sample of Vue 3.x SFC:

```vue
<template>
  <ChinaFlag/>
  <RussiaFlag/>
  <UnitedStatesofAmericaFlag/>
  <UnitedKingdomFlag/>
  <FranceFlag/>
</template>

<script setup>
// import the flags wherever you want
import {
  UnitedStatesofAmericaFlag,
  ChinaFlag,
  RussiaFlag,
  UnitedKingdomFlag,
  FranceFlag
} from "vue3-flag-svg";
</script>

<style>
/* 
  * the flag component only includes a <img> element
  * customize it as you wish 
*/
</style>
```

## Generator Icons

This package is based on [flag-icons](https://www.npmjs.com/package/flag-icons).

If you download this repository from GitHub, and want to update flag components, run:

```bash
npm update flag-icons
npm install

npm run generate
# or
node generator/generator.js
```

To preview all icons, run:

```bash
npm run test
# or
vite test
```