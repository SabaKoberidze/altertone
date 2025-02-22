<template>
  <AppHeader />
  <hero @scrollToServices="scrollToServices" />
  <div class="servicePage" ref="servicePage">
    <service />
  </div>
  <OverView ref="overView"></OverView>
  <Reserve></Reserve>
  <AudioPlayer />
</template>
<script setup lang="ts">
const route = useRoute();
const servicePage = ref<HTMLElement | null>(null);
const scrollToServices = () => {
  if (servicePage.value) {
    servicePage.value.scrollIntoView({ behavior: "smooth" });
  }
};
const overView = ref<HTMLElement | null>(null);
</script>

<style lang="scss"></style>
