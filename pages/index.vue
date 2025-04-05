<template>
  <AppHeader />
  <hero @scrollToServices="scrollToServices" />
  <div class="servicePage" ref="servicePage">
    <service />
  </div>
  <Reserve class="reserve" v-if="reserveStore.isModalOpen"></Reserve>
  <OverView ref="overView"></OverView>
  <Equipments></Equipments>
  <AppFooter />
</template>
<script setup lang="ts">
const reserveStore = ReserveStore()
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