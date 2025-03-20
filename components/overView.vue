<template>
  <article ref="scrollContainer" :class="{ playerOpen: reserveStore.AudioPlayerOpen }">
    <div class="mainOverViewContainer">
      <div class="overViewContainer">
        <div class="bgImage"></div>
        <h1 class="overViewTitle" ref="mainTitle">პროფესიონალური აპარატურა
        </h1>
        <div v-for="(device, index) in devices" :key="index" class="device"
          :class="{ enableInteraction: (scrollProgress <= 40) }"
          :style="{ left: `${device.currentPosition.x}%`, top: `${device.currentPosition.y}%`, opacity: `${device.opacity}` }">
          <img :src="`/images/devices/${device.img}.png`" />
          {{ device.name }}
        </div>
        <h1 class="examplesHeader" :style="{
          left: `${examplesHeader.currentPosition.x}%`,
          top: `${reserveStore.AudioPlayerOpen ? 10 : examplesHeader.currentPosition.y}%`,
          opacity: reserveStore.AudioPlayerOpen ? 0 : examplesHeader.opacity,
          transform: ` translate(-50%, -50%) scale(${examplesHeader.currentPosition.scale}) `,
        }">ჩვენი ჩაწერილი მუსიკა</h1>
        <div :class="{ enableInteraction: (scrollProgress >= 80), playerOpen: reserveStore.AudioPlayerOpen }"
          class="cardContainer" :style="{
            left: `${exampleContainer.currentPosition.x}%`,
            top: `${reserveStore.AudioPlayerOpen ? 25 : exampleContainer.currentPosition.y}%`,
            opacity: exampleContainer.opacity
          }">
          <div class="card" v-for="(example, index) in examples" :style="{
            left: `${example.currentPosition.x}%`,
            top: `${example.currentPosition.y}%`,
            'z-index': example.zIndex,
            transform: `translate(-50%, -50%) rotate(${example.currentPosition.rotation}deg) scale(${example.currentPosition.scale})`
          }">
            <div class="cardHolder" ref="cardHolder"
              :class="{ spinning: pickedMusicIndex === index, paused: musicPaused }" @click="openMusic(index)">
              <img class="vinyl" src="/images/examples/vinyl.png" />
              <div class="cardInnerContainer">
                <img class="cardImage" :src="`images/examples/${example.img}.png`" />
                <div class="cardHole"></div>
              </div>
            </div>
            <p class="exampleTitle" :style="{ opacity: pickedMusicIndex === index || scrollProgress < 90 ? 0 : 1 }">
              {{ example.title }}
            </p>
          </div>
        </div>
        <Transition name="slide-up">
          <AudioPlayer v-if="reserveStore.AudioPlayerOpen" v-on:songChanged="changeSong" ref="audioPlayerComponent"
            @onPause="(paused: boolean) => { musicPaused = paused }" />
        </Transition>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core';
import { toRef } from 'vue'
const scrollContainer = ref<HTMLElement | null>(null);
let scrollTop = 0;
let maxScroll = 0;
const scrollProgress = ref(0)
const lastProgress = ref(0)
const mainTitle = ref<HTMLElement | null>(null);
const audioPlayerComponent = ref()
const reserveStore = ReserveStore()
const pickedMusicIndex = ref(-1)
const cardHolder = ref([])
const musicPaused = ref(false)
let progressIndexes: number[] = [0, 25, 45, 46, 60, 90]

const devices = ref([
  {
    name: 'კომბები',
    img: 'amp',
    startPosition: { x: 15, y: -5 },
    currentPosition: { x: 0, y: 0 },
    endPosition: { x: 50, y: 50 },
    opacity: 0,
  },
  {
    name: 'მიქშერი',
    img: 'mixer',
    startPosition: { x: 80, y: 0 },
    currentPosition: { x: 100, y: 0 },
    endPosition: { x: 50, y: 50 },
    opacity: 0,
  },
  {
    name: 'დინამიკები',
    img: 'speakers',
    startPosition: { x: -5, y: 55 },
    currentPosition: { x: 0, y: 50 },
    endPosition: { x: 50, y: 50 },
    opacity: 0,
  },
  {
    name: 'მიკროფონები',
    img: 'microphone',
    startPosition: { x: 35, y: 100 },
    currentPosition: { x: 30, y: 100 },
    endPosition: { x: 50, y: 50 },
    opacity: 0,
  },
  {
    name: 'დრამები',
    img: 'drum',
    startPosition: { x: 105, y: 75 },
    currentPosition: { x: 100, y: 100 },
    endPosition: { x: 50, y: 50 },
    opacity: 0,
  },
]);
const examplesHeader = ref({
  startPosition: { x: 50, y: 120, scale: 1 },
  currentPosition: { x: 50, y: 120, scale: 1 },
  middlePosition: { x: 50, y: 50, scale: 1 },
  endPosition: { x: 50, y: 20, scale: 0.6 },
  opacity: 0
})
const exampleContainer = ref({
  startPosition: JSON.parse(JSON.stringify(examplesHeader.value.startPosition)),
  endPosition: JSON.parse(JSON.stringify(examplesHeader.value.middlePosition)),
  currentPosition: { x: 50, y: 100 },
  opacity: 0
})
const examples = ref([
  {
    img: 'Punk',
    title: 'პანკი',
    startPosition: { x: 45, y: 50, scale: 1.9, rotation: -16 },
    endPosition: { x: 16, y: 50, scale: 1, rotation: 0 },
    currentPosition: { x: 45, y: 50, scale: 1.9, rotation: -16 },
    zIndex: 1,
  },
  {
    img: 'Jazz',
    title: 'ჯაზი',
    startPosition: { x: 47, y: 48, scale: 2, rotation: -10 },
    endPosition: { x: 33, y: 50, scale: 1, rotation: 0 },
    currentPosition: { x: 47, y: 48, scale: 2, rotation: -10 },
    zIndex: 2,
  },
  {
    img: 'Rock',
    title: 'როკი',
    startPosition: { x: 50, y: 48, scale: 2.3, rotation: 0 },
    endPosition: { x: 50, y: 50, scale: 1, rotation: 0 },
    currentPosition: { x: 50, y: 48, scale: 2.3, rotation: 0 },
    zIndex: 3,
  },
  {
    img: 'Blues',
    title: 'ბლუზი',
    startPosition: { x: 53, y: 48, scale: 2, rotation: 10 },
    endPosition: { x: 67, y: 50, scale: 1, rotation: 0 },
    currentPosition: { x: 53, y: 48, scale: 2, rotation: 10 },
    zIndex: 2,
  },
  {
    img: 'Metal',
    title: 'მეტალი',
    startPosition: { x: 55, y: 50, scale: 1.9, rotation: 16 },
    endPosition: { x: 84, y: 50, scale: 1, rotation: 0 },
    currentPosition: { x: 55, y: 50, scale: 1.9, rotation: 16 },
    zIndex: 1,
  },
])


function handleScroll() {
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
    if (scrollProgress.value !== lastProgress.value) {
      scrollAnimation()
    }
    lastProgress.value = scrollProgress.value
  }
};
function scrollAnimation() {
  if (scrollProgress.value >= progressIndexes[0] && scrollProgress.value <= progressIndexes[1]) {
    const scale = 1 - ((scrollProgress.value - progressIndexes[0]) / (progressIndexes[2] - progressIndexes[0]));
    if (mainTitle.value) {
      mainTitle.value.style.transform = `scale(${scale})`;
    }
    moveDevices(0, 2)
    moveCardContainer(1, 4)
    examplesHeader.value.opacity = 0
  } else if (scrollProgress.value >= progressIndexes[1] && scrollProgress.value <= progressIndexes[2]) {
    const scale = 1 - ((scrollProgress.value - progressIndexes[0]) / (progressIndexes[2] - progressIndexes[0]));
    if (mainTitle.value) {
      mainTitle.value.style.transform = `scale(${scale})`;
    }
    moveDevices(0, 2)
    moveCardContainer(1, 4)
    moveText(0, 0, 1)
  }
  else if (scrollProgress.value >= progressIndexes[2] && scrollProgress.value <= progressIndexes[3]) {
    if (mainTitle.value) {
      mainTitle.value.style.transform = `scale(0)`;
    }
    devices.value.forEach(device => {
      device.currentPosition.x = device.endPosition.x
      device.currentPosition.y = device.endPosition.y
      device.opacity = 0
    })
    exampleContainer.value.opacity = 1
    examples.value.forEach(example => {
      example.currentPosition.x = example.startPosition.x
      example.currentPosition.y = example.startPosition.y
      example.currentPosition.scale = example.startPosition.scale
      example.currentPosition.rotation = example.startPosition.rotation
    })
    moveCardContainer(1, 4)
    moveText(0, 0, 1)
  }
  else if (scrollProgress.value >= progressIndexes[3] && scrollProgress.value <= progressIndexes[4]) {
    if (mainTitle.value) {
      mainTitle.value.style.transform = `scale(0)`;
    }
    exampleContainer.value.opacity = 1
    exampleContainer.value.currentPosition.y = exampleContainer.value.endPosition.y
    devices.value.forEach(device => {
      device.currentPosition.x = device.endPosition.x
      device.currentPosition.y = device.endPosition.y
      device.opacity = 0
    })
    moveCardContainer(1, 4)
    moveText(3, 4, 1)
  }
  else if (scrollProgress.value >= progressIndexes[4] && scrollProgress.value <= progressIndexes[5]) {
    if (mainTitle.value) {
      mainTitle.value.style.transform = `scale(0)`;
    }
    exampleContainer.value.opacity = 1
    exampleContainer.value.currentPosition.y = exampleContainer.value.endPosition.y
    devices.value.forEach(device => {
      device.currentPosition.x = device.endPosition.x
      device.currentPosition.y = device.endPosition.y
      device.opacity = 0
    })
    moveText(4, 5, 2)
    spreadCards(4, 5)
  }
  else if (scrollProgress.value >= progressIndexes[5] && scrollProgress.value <= 100) {
    if (mainTitle.value) {
      mainTitle.value.style.transform = `scale(0)`;
    }
    exampleContainer.value.opacity = 1
    exampleContainer.value.currentPosition.y = exampleContainer.value.endPosition.y


    examplesHeader.value.currentPosition.x = examplesHeader.value.endPosition.x
    examplesHeader.value.currentPosition.y = examplesHeader.value.endPosition.y
    examplesHeader.value.opacity = 1

    devices.value.forEach(device => {
      device.currentPosition.x = device.endPosition.x
      device.currentPosition.y = device.endPosition.y
      device.opacity = 0
    })
    spreadCards(4, 5, true)
  }
}

function moveDevices(startIndex: number, endIndex: number) {
  devices.value.forEach(device => {
    device.currentPosition.x = device.startPosition.x +
      (device.endPosition.x - device.startPosition.x) * AnimationProgress(startIndex, endIndex);

    device.currentPosition.y = device.startPosition.y +
      (device.endPosition.y - device.startPosition.y) * AnimationProgress(startIndex, endIndex);

    if (scrollProgress.value > progressIndexes[2] / 4) {
      device.opacity = 1
    }
    else {
      device.opacity = 0
    }
  });
}
function moveText(startIndex: number, endIndex: number, stage: number) {
  const { startPosition, middlePosition, endPosition } = examplesHeader.value;
  const [start, end] = stage === 1
    ? [startPosition, middlePosition]
    : [middlePosition, endPosition];
  const { x: startPositionX, y: startPositionY, scale: startScale } = start;
  const { x: endPositionX, y: endPositionY, scale: endScale } = end;


  examplesHeader.value.currentPosition.x = startPositionX +
    (endPositionX - startPositionX) * AnimationProgress(startIndex, endIndex);
  examplesHeader.value.currentPosition.y = startPositionY +
    (endPositionY - startPositionY) * AnimationProgress(startIndex, endIndex);
  examplesHeader.value.currentPosition.scale = startScale +
    (endScale - startScale) * AnimationProgress(startIndex, endIndex);

  examplesHeader.value.opacity = 1 * AnimationProgress(startIndex, endIndex);

  if (scrollProgress.value > progressIndexes[3] + progressIndexes[3] / 32) {
    examplesHeader.value.opacity = 1
  }
  else {
    examplesHeader.value.opacity = 0
  }
}

function spreadCards(startIndex: number, endIndex: number, finish?: boolean) {
  examples.value.forEach((example, index) => {

    const { startPosition, endPosition } = example;
    const { x: startPositionX, y: startPositionY, scale: startScale, rotation: startRotation } = startPosition;
    const { x: endPositionX, y: endPositionY, scale: endScale, rotation: endRotation } = endPosition;
    let progress = (finish ? 1 : AnimationProgress(startIndex, endIndex))

    example.currentPosition.x = startPositionX +
      (endPositionX - startPositionX) * (progress);

    example.currentPosition.y = startPositionY +
      (endPositionY - startPositionY) * progress;

    example.currentPosition.scale = startScale +
      (endScale - startScale) * progress;

    example.currentPosition.rotation = startRotation +
      (endRotation - startRotation) * progress;
  })
}

function moveCardContainer(startIndex: number, endIndex: number) {
  const { startPosition, endPosition } = exampleContainer.value;
  const { x: startPositionX, y: startPositionY } = startPosition;
  const { x: endPositionX, y: endPositionY } = endPosition;

  exampleContainer.value.currentPosition.x = startPositionX +
    (endPositionX - startPositionX) * AnimationProgress(startIndex, endIndex);

  exampleContainer.value.currentPosition.y = startPositionY +
    (endPositionY - startPositionY) * AnimationProgress(startIndex, endIndex);

  exampleContainer.value.opacity = 1 * AnimationProgress(startIndex, 3);
  // if (scrollProgress.value > progressIndexes[1]) {
  //   exampleContainer.value.opacity = 1
  // }
  // else {
  //   exampleContainer.value.opacity = 0
  // }
}
function AnimationProgress(startIndex: number, endIndex: number) {
  return ((scrollProgress.value - progressIndexes[startIndex]) / (progressIndexes[endIndex] - progressIndexes[startIndex]))
}


function openMusic(index: number) {
  if(!reserveStore.AudioPlayerOpen){
    spreadCards(4, 5, true)
    setTimeout(() => {
      pickedMusicIndex.value = index
      audioPlayerComponent.value.pickMusic(index)
    }, 1000)
  }else{
    pickedMusicIndex.value = index
    audioPlayerComponent.value.pickMusic(index)
  }
  reserveStore.AudioPlayerOpen = true
}


onMounted(() => {
  const isVisible = useElementVisibility(scrollContainer, { rootMargin: `0px 0px 0px 0px` });
  watch(isVisible, (visible) => {
    if (visible) {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener('resize', handleResize)
    } else {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('resize', handleResize)
    }
  });

  handleScroll()
  scrollAnimation()
  watch(() => reserveStore.AudioPlayerOpen, (isOpen) => {
    if (!isOpen) {
      pickedMusicIndex.value = -1
      audioPlayerComponent.value.stopAudio()
      reserveStore.blockScrolling(false)
    } else {
      reserveStore.blockScrolling(true)
    }
  })
});

function handleResize() {
  if (!reserveStore.AudioPlayerOpen) {
    handleScroll()
  }
}

function changeSong(index: number) {
  pickedMusicIndex.value = index
}

function scrollToTop() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollIntoView({
      behavior: 'instant',
      inline: 'nearest'
    });
  }
}

</script>

<style lang="scss" scoped>
@keyframes vinylPlaying {
  0% {
    rotate: 0;
  }

  100% {
    rotate: 360deg;
  }
}

article {
  width: 100vw;
  height: 400dvh;
  margin: 0;
  padding: 0;

  &.playerOpen {
    position: relative;
    z-index: 20;

    //sticky urevs
    .overViewContainer {
      position: fixed;

      &::after {
        opacity: 1;
      }

    }
  }

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

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 0;
      transition: 1000ms;
      pointer-events: none;
    }
  }

  .bgImage {
    width: 100vw;
    height: 100dvh;
    background-image: url('/images/hero.png');
    background-size: cover;
    background-position: center;
    position: absolute;
    -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%);
    mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%);
    top: 0;
    left: 0;
    z-index: -1;
  }

  .overViewTitle {
    font-feature-settings: 'case';
    font-size: 96px;
    font-weight: 700;
    text-shadow: 0px 0px 20px rgb(0, 0, 0);
    width: 1088px;
    text-align: center;
    transition: 200ms;
  }

  .examplesHeader {
    position: absolute;
    font-feature-settings: 'case';
    font-size: 96px;
    font-weight: 700;
    text-shadow: 0px 0px 20px rgb(0, 0, 0);
    width: 1088px;
    text-align: center;
    z-index: 10;
    pointer-events: none;
    transition: 200ms;
  }

  .cardContainer {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    justify-content: center;
    align-items: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: 200ms;
    pointer-events: none;
    z-index: 5;


    &.enableInteraction {
      pointer-events: unset;
      transition: 1000ms;
    }

    .card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: 200ms;
      position: absolute;



      .cardHolder {
        width: 180px;
        height: 180px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: 200ms;
        border-radius: 50%;
        box-shadow: 0px 0px 15px black;

        @include respond-to('mediumDesktop') {
          transform: scale(0.8);
        }

        @include respond-to('smallDesktop') {
          transform: scale(0.6);
        }

        @include respond-to('tablet') {
          transform: scale(0.45);
        }

        @include respond-to('desktop') {
          transform: scale(1.1);
        }



        .vinyl {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: -1;
          transition: 200ms;
        }

        .cardInnerContainer {
          width: 100%;
          height: 100%;
          overflow: hidden;
          transition: 200ms;
          outline: 0px solid #000000;

          .cardImage {
            width: 100%;
            height: 100%;
          }

          .cardHole {
            width: 0;
            height: 0;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border: 0px solid #952532;
            background-color: black;
            transition: 200ms;
            border-radius: 50%;
          }
        }

        &:hover,
        &.spinning {
          cursor: pointer;
          width: 240px;
          height: 240px;

          .cardInnerContainer {
            width: 51%;
            height: 51%;
            border-radius: 50%;
            outline: 3px solid #952532;

            .cardHole {
              width: 16px;
              height: 16px;
              border: 2px solid #952532;
            }
          }

          p {
            opacity: 1;
          }
        }

        &.spinning {
          animation-name: vinylPlaying;
          animation-duration: 5s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;

          &.paused {
            animation-play-state: paused;
          }
        }


      }

      .exampleTitle {
        position: absolute;
        top: 110%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: 200ms;
        font-feature-settings: 'case';
        font-size: 14px;
        text-shadow: 0px 0px 20px rgb(0, 0, 0);

        @include respond-to('mediumDesktop') {
          top: 100%;
        }

        @include respond-to('smallDesktop') {
          top: 90%;
          font-size: 12px;
        }

        @include respond-to('tablet') {
          top: 80%;
          font-size: 8px;
        }

        @include respond-to('desktop') {
          top: 120%;
          font-size: 16px;
        }
      }
    }

    &.playerOpen {
      transition: 1000ms;
      height: 50%;
    }


  }

  .device {
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
    transform: translate(-50%, -50%);
    background: radial-gradient(125.76% 125.76% at 50% 145.45%, rgba(245, 194, 92, 0) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(180deg, rgba(23, 24, 25, 0.00) 0%, rgba(23, 24, 25, 0.80) 100%), #000;
    transition: 200ms;
    pointer-events: none;
    font-size: 12px;
    font-feature-settings: 'case' on;
    font-weight: 700;

    &.enableInteraction {
      pointer-events: unset;
    }

    &:hover {
      cursor: pointer;
      background: radial-gradient(125.76% 125.76% at 50% 145.45%, rgba(245, 195, 92, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(180deg, rgba(23, 24, 25, 0.00) 0%, rgba(23, 24, 25, 0.80) 100%), #000;
    }
  }
}
</style>