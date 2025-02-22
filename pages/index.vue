<template>
  <AppHeader />
  <hero @scrollToServices="scrollToServices" />
  <div class="servicePage" ref="servicePage">
    <service />
  </div>
  <OverView ref="overView"></OverView>
  <Reserve></Reserve>

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



interface ReservedData {
  success: boolean;
  data: any;
}
async function getReservedData() {
  const { data, error } = await useFetch<ReservedData>('/api/reserve');

  if (data.value && data.value.success) {
    console.log(data.value.data);
  } else if (error.value) {
    console.error('Error fetching reserved data:', error.value);
  }
}
//getReservedData()
</script>

<style lang="scss"></style>