<template>
  <article ref="scrollContainer">
    <div class="mainOverViewContainer">
      <div class="overViewContainer">
        <div class="bgImage"></div>
        <h1 class="overViewTitle" ref="mainTitle">პროფესიონალური აპარატურა {{scrollProgress}}%</h1>
        <div v-for="(device, index) in devices" 
          :key="index" 
          class="device" 
          :style="{left: `${device.currentPosition.x}%`, top: `${device.currentPosition.y}%`, opacity: `${device.opacity}` }">
        {{ device.name }}
      </div>
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
const lastProgress = ref(0)

let progressIndexes: number[] = [0, 30, 60, 100]

const devices = ref([
  {
    name: 'კომბები',
    startPosition: { x: 15, y: -5 },
    currentPosition: reactive({ x: 0, y: 0 }),
    endPosition: { x: 50, y: 50 },
    opacity: reactive(0),
  },
  {
    name: 'მიქშერი',
    startPosition: { x: 80, y: 0 },
    currentPosition: reactive({ x: 100, y: 0 }),
    endPosition: { x: 50, y: 50 },
    opacity: reactive(0),
  },
  {
    name: 'დინამიკები',
    startPosition: { x: -5, y: 55 },
    currentPosition: reactive({ x: 0, y: 50 }),
    endPosition: { x: 50, y: 50 },
    opacity: reactive(0),
  },
  {
    name: 'მიკროფონები',
    startPosition: { x: 35, y: 100 },
    currentPosition: reactive({ x: 30, y: 100 }),
    endPosition: { x: 50, y: 50 },
    opacity: reactive(0),
  },
  {
    name: 'დრამები',
    startPosition: { x: 105, y: 75 },
    currentPosition: reactive({ x: 100, y: 100 }),
    endPosition: { x: 50, y: 50 },
    opacity: reactive(0),
  },
]);


const mainTitle = ref(null)

const isHovered = ref(false)
function handleScroll(event) {
  if (scrollContainer.value) {
    const containerTop = scrollContainer.value.offsetTop;
    const currentScroll = window.scrollY - containerTop;
    const maxScroll = scrollContainer.value.scrollHeight - window.innerHeight;

    scrollProgress.value = currentScroll / maxScroll * 100;
    if (scrollProgress.value > 100) {
      scrollProgress.value = 100
      return
    } else if (scrollProgress.value < 0) {
      scrollProgress.value = 0
      return
    }
    scrollProgress.value = Math.round(scrollProgress.value)
    if(scrollProgress.value !== lastProgress.value){
      scrollAnimation()
    }
    lastProgress.value = scrollProgress.value
  }
};

function scrollAnimation() {
  if (scrollProgress.value >= progressIndexes[0] && scrollProgress.value <= progressIndexes[1]) { 
    const scale = 1 - ((scrollProgress.value - progressIndexes[0]) / (progressIndexes[1] - progressIndexes[0])); 
    mainTitle.value.style.transform = `scale(${scale})`;
    
    devices.value.forEach(device => {   
      device.currentPosition.x = device.startPosition.x + 
        (device.endPosition.x - device.startPosition.x) * ((scrollProgress.value - progressIndexes[0]) / (progressIndexes[1] - progressIndexes[0]));
      
      device.currentPosition.y = device.startPosition.y + 
        (device.endPosition.y - device.startPosition.y) * ((scrollProgress.value - progressIndexes[0]) / (progressIndexes[1] - progressIndexes[0]));
      
        if(scrollProgress.value > progressIndexes[1] / 4){
          device.opacity = 1
        }
        else{
          device.opacity = 0
        }
    });
  }
  else if (scrollProgress.value >= progressIndexes[1] && scrollProgress.value <= progressIndexes[2]) {
    mainTitle.value.style.transform = `scale(0)`;
    devices.value.forEach(device => {
      device.currentPosition.x = device.endPosition.x
      device.currentPosition.y = device.endPosition.y
    })
  }
  else if (scrollProgress.value >= progressIndexes[2] && scrollProgress.value <= progressIndexes[3]) {
    mainTitle.value.style.transform = `scale(0)`;
  }
}

onMounted(() => {
  const isVisible = useElementVisibility(scrollContainer, { rootMargin: `0px 0px 0px 0px` });
  watch(isVisible, (visible) => {
    if (visible) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }
  });
  handleScroll()
  scrollAnimation()
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
    transition: 200ms;
  }
  .device{
    display: flex;
    width: 180px;
    height: 220px;
    //padding: 48px 0px 28px 0px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    position: absolute;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.09);
    mix-blend-mode: luminosity;
    transform: translate(-50%, -50%);
    background: radial-gradient(125.76% 125.76% at 50% 145.45%, rgba(245, 194, 92, 0) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(180deg, rgba(23, 24, 25, 0.00) 0%, rgba(23, 24, 25, 0.80) 100%), #000;
    transition: 200ms;
    &:hover{
      cursor: pointer;
      background: radial-gradient(125.76% 125.76% at 50% 145.45%, rgba(245, 195, 92, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(180deg, rgba(23, 24, 25, 0.00) 0%, rgba(23, 24, 25, 0.80) 100%), #000;
    }
  }
}
</style>