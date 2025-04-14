<template>
  <AppHeader />
  <hero @scrollToServices="scrollToServices" />
  <div class="servicePage" ref="servicePage">
    <service />
  </div>
  <Reserve class="reserve" v-if="reserveStore.isModalOpen"></Reserve>
  <OverView v-if="isWeb" :audioPlayerComponent="audioPlayerComponent" ref="overView" />
  <OverViewMobile v-else :audioPlayerComponent="audioPlayerComponent" ref="overViewMobile" />
  <Transition name="slide-up">
    <AudioPlayer v-if="reserveStore.AudioPlayerOpen" v-on:songChanged="changeSong" ref="audioPlayerComponent"
      @onPause="(paused: boolean) => { pauseMusic(paused) }" />
  </Transition>
  <Equipments></Equipments>
  <AppFooter />
</template>
<script setup lang="ts">
const reserveStore = ReserveStore()
const route = useRoute()
const servicePage = ref<HTMLElement | null>(null)
const audioPlayerComponent = ref<HTMLElement | any>(null)
let reservedData;
const isWeb = ref(true)
const scrollToServices = () => {
  if (servicePage.value) {
    servicePage.value.scrollIntoView({ behavior: 'smooth' })
  }
}
const overView = ref<HTMLElement | null>(null)
const overViewMobile = ref<HTMLElement | null>(null)

function changeSong(index: number) {
  if (isWeb.value && overView.value) {
    (overView.value as any).changeSong(index)
  } else if (!isWeb.value && overViewMobile.value) {
    (overViewMobile.value as any).changeSong(index)
  }
}

function pauseMusic(paused: boolean) {
  if (isWeb.value && overView.value) {
    (overView.value as any).pauseMusic(paused)
  } else if (!isWeb.value && overViewMobile.value) {
    (overViewMobile.value as any).pauseMusic(paused)
  }
}

onMounted(() => {
  if (window.innerWidth <= breakpoints.tablet) {
    isWeb.value = false
  } else {
    isWeb.value = true
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth <= breakpoints.tablet) {
      isWeb.value = false
    } else {
      isWeb.value = true
    }
  })
})


</script>

<style lang="scss" scoped></style>