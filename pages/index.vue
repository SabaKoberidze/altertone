<template>
  <AppHeader />
  <hero @scrollToServices="scrollToServices" />
  <div class="servicePage" ref="servicePage">
    <service />
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const servicePage = ref<HTMLElement | null>(null)
const scrollToServices = () => {
  if (servicePage.value) {
    servicePage.value.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style lang="scss"></style>