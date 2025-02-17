<template>
  <article ref="scrollContainer">
    <div class="mainOverViewContainer">
      <div class="overViewContainer">
        <div class="bgImage"></div>
        <h1 class="overViewTitle">პროფესიონალური აპარატურა {{scrollProgress}}%</h1>
      </div>

    </div>
  </article>
</template>

<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core';
const scrollContainer = ref<HTMLElement | null>(null);

let scrollTop = 0;
let maxScroll = 0;
const scrollProgress = ref(0)

const isHovered = ref(false)
function handleScroll(event) {
  if (scrollContainer.value) {
    const containerTop = scrollContainer.value.offsetTop;
    const currentScroll = window.scrollY - containerTop;
    const maxScroll = scrollContainer.value.scrollHeight - window.innerHeight;

    // Calculate scroll progress as a percentage
    scrollProgress.value = currentScroll / maxScroll * 100;
    if (scrollProgress.value > 100) {
      scrollProgress.value = 100
      return
    } else if (scrollProgress.value < 0) {
      scrollProgress.value = 0
      return
    }
    scrollProgress.value = Math.round(scrollProgress.value)
  }
};

onMounted(() => {
  const isVisible = useElementVisibility(scrollContainer, { rootMargin: `0px 0px 0px 0px` });
  watch(isVisible, (visible) => {
    if (visible) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }
  });
});

onUnmounted(() => {

});

</script>

<style lang="scss" scoped>
article {
  width: 100vw;
  height: 400dvh;
  margin: 0;
  padding: 0;

  .mainOverViewContainer {
    width: 100vw;
    height: 400dvh;
    margin: 0;
    padding: 0;
  }

  .overViewContainer {
    width: 100vw;
    height: 100dvh;
    position: sticky;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .bgImage {
    width: 100vw;
    height: 100dvh;
    background-image: url('/images/hero.png');
    background-size: cover;
    background-position: center;
    position: absolute;
    -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.9) 5%, rgba(0, 0, 0, 0) 70%);
    mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%);
    top: 0;
    left: 0;
    z-index: -1;
  }

  .overViewTitle {
    font-family: "SF Georgian";
    font-feature-settings: 'case';
    font-size: 96px;
    font-weight: 700;
    text-shadow: 0px 0px 80px rgba(0, 0, 0, 0.50);
    width: 1088px;
    text-align: center;
  }
}
</style>