<template>
  <h3>Static:</h3>
  __TEST_TARGET__
  <h3>Dynamic:</h3>
  <component v-for="flag of ComponentCodeName" style="width: 100px" :is="flag.component"/>
  <h3>v-for on demand manual public assets:</h3>
  <img v-for="flag of CountryCodeName" :src="'/flags/'+flag.asset" :alt="flag.enName" style="width: 100px">
</template>

<script setup>
import {ComponentCodeName, CountryCodeName} from "vue3-flag-svg/manifest";

__TEST_IMPORT__;
</script>
<style scoped></style>
