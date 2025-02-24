<template>
  <AppHeader />
  <hero @scrollToServices="scrollToServices" />
  <div class="servicePage" ref="servicePage">
    <service />
  </div>
  <OverView ref="overView"></OverView>

  <Reserve class="reserve"></Reserve>

</template>
<script setup lang="ts">
const route = useRoute()
const servicePage = ref<HTMLElement | null>(null)
let reservedData;
const scrollToServices = () => {
  if (servicePage.value) {
    servicePage.value.scrollIntoView({ behavior: 'smooth' })
  }
}
const overView = ref<HTMLElement | null>(null)
</script>

<style lang="scss" scoped></style>