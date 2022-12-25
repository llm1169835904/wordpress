<template>
  <topnav v-if="!$route.meta.show"></topnav>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive" />
  </router-view>
</template>
<script>
import topnav from "@/components/topnav";
export default {
  components: { topnav },
};
</script>
<style lang="scss"></style>
