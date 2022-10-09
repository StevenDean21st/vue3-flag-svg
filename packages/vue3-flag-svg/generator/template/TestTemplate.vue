<template>
  <h3>Static:</h3>
  __TEST_TARGET__
  <h3>Dynamic:</h3>
  __H_TEST_TEMPLATE_TARGET__
  <h3>v-for</h3>
  <component v-for="flag of FlagCodeName" style="width: 100px" :is="flag.component"/>
</template>

<script setup>
import { FlagCodeName } from "vue3-flag-svg/manifest";
__TEST_IMPORT__;
</script>
<style scoped></style>
