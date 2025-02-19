<template>
  <article ref="scrollContainer">
    <div class="mainOverViewContainer">
      <div class="overViewContainer">
        <div class="bgImage"></div>
        <h1 class="overViewTitle" ref="mainTitle">პროფესიონალური აპარატურა
        </h1>
        <div v-for="(device, index) in devices" :key="index" class="device"
          :class="{ enableInteraction: (scrollProgress <= 40) }"
          :style="{ left: `${device.currentPosition.x}%`, top: `${device.currentPosition.y}%`, opacity: `${device.opacity}` }">
          {{ device.name }}
        </div>
        <h1 class="examplesHeader" :style="{
          left: `${examplesHeader.currentPosition.x}%`,
          top: `${examplesHeader.currentPosition.y}%`,
          opacity: examplesHeader.opacity,
          transform: ` translate(-50%, -50%) scale(${examplesHeader.currentPosition.scale}) `,
        }">ჩვენი ჩაწერილი მუსიკა</h1>
        <div :class="{ enableInteraction: (scrollProgress >= 90) }" class="cardContainer" :style="{
          left: `${exampleContainer.currentPosition.x}%`,
          top: `${exampleContainer.currentPosition.y}%`,
          opacity: exampleContainer.opacity
        }">
          <div class="card" v-for="(example, index) in examples" :style="{
            left: `${example.currentPosition.x}%`,
            top: `${example.currentPosition.y}%`,
            'z-index': example.zIndex,
            transform: `translate(-50%, -50%) rotate(${example.currentPosition.rotation}deg) scale(${example.currentPosition.scale})`
          }">
            <div class="cardHolder"">
              <img class=" vinyl" src="/images/examples/vinyl.png" />
            <div class="cardInnerContainer">
              <img class="cardImage" :src="`images/examples/${example.title}.png`" />
              <div class="cardHole"></div>
              <p :class="{ showTitle: (scrollProgress > 90) }">
                {{ example.title }}
              </p>
            </div>
          </div>
        </div>
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
const mainTitle = ref<HTMLElement | null>(null);
const exampleTitle = ref(null)

let progressIndexes: number[] = [0, 30, 45, 60, 100]

const devices = ref([
  {
    name: 'კომბები',
    startPosition: { x: 15, y: -5 },
    currentPosition: { x: 0, y: 0 },
    endPosition: { x: 50, y: 50 },
    opacity: 0,
  },
  {
    name: 'მიქშერი',
    startPosition: { x: 80, y: 0 },
    currentPosition: { x: 100, y: 0 },
    endPosition: { x: 50, y: 50 },
    opacity: 0,
  },
  {
    name: 'დინამიკები',
    startPosition: { x: -5, y: 55 },
    currentPosition: { x: 0, y: 50 },
    endPosition: { x: 50, y: 50 },
    opacity: 0,
  },
  {
    name: 'მიკროფონები',
    startPosition: { x: 35, y: 100 },
    currentPosition: { x: 30, y: 100 },
    endPosition: { x: 50, y: 50 },
    opacity: 0,
  },
  {
    name: 'დრამები',
    startPosition: { x: 105, y: 75 },
    currentPosition: { x: 100, y: 100 },
    endPosition: { x: 50, y: 50 },
    opacity: 0,
  },
]);
const examplesHeader = ref({
  startPosition: { x: 50, y: 100, scale: 1 },
  currentPosition: { x: 50, y: 100, scale: 1 },
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
    title: 'Punk',
    startPosition: { x: 45, y: 50, scale: 1.9, rotation: -16 },
    endPosition: { x: 16, y: 50, scale: 1, rotation: 0 },
    currentPosition: { x: 45, y: 50, scale: 1.9, rotation: -16 },
    zIndex: 1,
  },
  {
    title: 'Jazz',
    startPosition: { x: 47, y: 48, scale: 2, rotation: -10 },
    endPosition: { x: 33, y: 50, scale: 1, rotation: 0 },
    currentPosition: { x: 47, y: 48, scale: 2, rotation: -10 },
    zIndex: 2,
  },
  {
    title: 'Metal',
    startPosition: { x: 50, y: 48, scale: 2.3, rotation: 0 },
    endPosition: { x: 50, y: 47, scale: 1.3, rotation: 0 },
    currentPosition: { x: 50, y: 48, scale: 2.3, rotation: 0 },
    zIndex: 3,
  },
  {
    title: 'Blues',
    startPosition: { x: 53, y: 48, scale: 2, rotation: 10 },
    endPosition: { x: 67, y: 50, scale: 1, rotation: 0 },
    currentPosition: { x: 53, y: 48, scale: 2, rotation: 10 },
    zIndex: 2,
  },
  {
    title: 'Rock',
    startPosition: { x: 55, y: 50, scale: 1.9, rotation: 16 },
    endPosition: { x: 83, y: 50, scale: 1, rotation: 0 },
    currentPosition: { x: 55, y: 50, scale: 1.9, rotation: 16 },
    zIndex: 1,
  },
])


const isHovered = ref(false)
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

    examplesHeader.value.opacity = 0
  } else if (scrollProgress.value >= progressIndexes[1] && scrollProgress.value <= progressIndexes[2]) {
    const scale = 1 - ((scrollProgress.value - progressIndexes[0]) / (progressIndexes[2] - progressIndexes[0]));
    if (mainTitle.value) {
      mainTitle.value.style.transform = `scale(${scale})`;
    }
    moveDevices(0, 2)
    moveText(1, 3, 1)
    moveCardContainer(1, 3)
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
    moveText(1, 3, 1)
    moveCardContainer(1, 3)

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
    moveText(3, 4, 2)
    spreadCards(3, 4)
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

  if (scrollProgress.value > progressIndexes[2] - progressIndexes[2] / 8) {
    examplesHeader.value.opacity = 1
  }
  else {
    examplesHeader.value.opacity = 0
  }
}

function spreadCards(startIndex: number, endIndex: number) {
  examples.value.forEach((example) => {
    const { startPosition, endPosition } = example;
    const { x: startPositionX, y: startPositionY, scale: startScale, rotation: startRotation } = startPosition;
    const { x: endPositionX, y: endPositionY, scale: endScale, rotation: endRotation } = endPosition;

    example.currentPosition.x = startPositionX +
      (endPositionX - startPositionX) * AnimationProgress(startIndex, endIndex);

    example.currentPosition.y = startPositionY +
      (endPositionY - startPositionY) * AnimationProgress(startIndex, endIndex);

    example.currentPosition.scale = startScale +
      (endScale - startScale) * AnimationProgress(startIndex, endIndex);

    example.currentPosition.rotation = startRotation +
      (endRotation - startRotation) * AnimationProgress(startIndex, endIndex);
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

  if (scrollProgress.value > progressIndexes[2] - progressIndexes[2] / 8) {
    exampleContainer.value.opacity = 1
  }
  else {
    exampleContainer.value.opacity = 0
  }

}
function AnimationProgress(startIndex: number, endIndex: number) {
  return ((scrollProgress.value - progressIndexes[startIndex]) / (progressIndexes[endIndex] - progressIndexes[startIndex]))
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

  .examplesHeader {
    position: absolute;
    font-family: "SF Georgian";
    font-feature-settings: 'case';
    font-size: 96px;
    font-weight: 700;
    text-shadow: 0px 0px 80px rgba(0, 0, 0, 0.50);
    width: 1088px;
    text-align: center;
    transition: 200ms;
    z-index: 10;
    pointer-events: none;
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

          p {
            position: absolute;
            top: calc(100% + 20px);
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: 200ms;

            &.showTitle {
              opacity: 1;
            }
          }

        }

        &:hover {
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
        }

      }
    }
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
    mix-blend-mode: luminosity;
    transform: translate(-50%, -50%);
    background: radial-gradient(125.76% 125.76% at 50% 145.45%, rgba(245, 194, 92, 0) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(180deg, rgba(23, 24, 25, 0.00) 0%, rgba(23, 24, 25, 0.80) 100%), #000;
    transition: 200ms;
    pointer-events: none;

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