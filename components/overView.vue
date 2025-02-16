<template>
  <article v-on:wheel="handleWheel" v-on:mouseenter="isHovered = true" v-on:mouseleave="isHovered = false">
    <div class="overViewContainer">
      <div class="bgImage"></div>
      <h1 class="overViewTitle">პროფესიონალური აპარატურა</h1>
    </div>
  </article>
</template>

<script setup lang="ts">
const isHovered = ref(false)
const handleWheel = (event: WheelEvent) => {
  if (event.deltaY > 0) {
    console.log("Scrolling down");
  } else if (event.deltaY < 0) {
    console.log("Scrolling up");
  }
};
</script>

<style lang="scss" scoped>
article {
  width: 100vw;
  height: 400dvh;
  margin: 0;
  padding: 0;
  padding-top: 124px;

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