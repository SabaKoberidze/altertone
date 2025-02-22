<template>
  <div class="audioPlayerContainer">
    <div class="playerControls">
      <div class="mainControls">
        <div class="abousMusic">
          <p class="title">როკი</p>
          <p class="description">მუსიკის სახეწლი ვისია რა არი საიდან არი რამე აღწერა</p>
        </div>
        <div class="controls">
          <div class="trackControls">
            <button v-on:click="playAudio()" class="playSong"><img
                src="/images/icons/audioControls/playSong.svg" /></button>
            <div class="line"></div>
            <button v-on:click="changeTrack(true)"><img src="/images/icons/audioControls/nextSong.svg" /></button>
            <button v-on:click="changeTrack(false)"><img src="/images/icons/audioControls/previousSong.svg" /></button>
          </div>
          <div class="sound" v-on:click="toggleMute()"><img src="/images/icons/audioControls/muteSong.svg" /></div>
        </div>
      </div>
      <div class="secondaryControls">
        <div v-for="(type, index) in soundTypes">
          <p>{{ type }}</p>
          <button class="soundToggle" :class="{ off: muted[index] }" v-on:click="toggleSound(index)"></button>
        </div>
      </div>
    </div>
    <div class="playerContainer">
      <div class="audioPlayer" ref="canvasContainer"></div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Application, Graphics } from 'pixi.js';
import { AudioPlayer } from '../classes/AudioPlayer';

// Reference to the container for the PixiJS canvas
let soundTypes = ['Music', 'Vocal', 'Bass', 'Drums']
let muted = ref([false, false, false, false])
const canvasContainer = ref<HTMLDivElement | null>(null);
let app: Application
let audioPlayer: AudioPlayer
let loaded: boolean
function playAudio() {
  audioPlayer.unlockAudio();
}
function changeTrack(next: boolean) {

}
function toggleMute() {

}
function toggleSound(index: number) {
  audioPlayer.toggleSound(index)
  muted.value[index] = !muted.value[index]
}
onMounted(() => {
  if (!canvasContainer.value) {
    console.error('Canvas container not found!');
    return;
  }

  app = new Application();

  (async () => {
    if (!canvasContainer.value) return;

    // Initialize PixiJS application
    await app.init({
      width: canvasContainer.value.clientWidth,
      height: canvasContainer.value.clientHeight,
      antialias: true,
      backgroundColor: 0x000000,
      backgroundAlpha: 0
    });
    // Setup background
    const background = new Graphics();
    background.rect(0, 0, app.screen.width, app.screen.height);
    background.fill({ color: 'transparent' })
    app.stage.addChild(background);
    background.interactive = true;

    canvasContainer.value.appendChild(app.canvas as HTMLCanvasElement);


    audioPlayer = new AudioPlayer(app, () => {
      loaded = true
    })

    const audioFiles = [
      "/audio/examples/Rock/Vocal.mp3",
      "/audio/examples/Rock/Music.mp3",
      "/audio/examples/Rock/Bass.mp3",
      "/audio/examples/Rock/Drums.mp3",
    ]
    audioFiles.forEach((url, index) => {
      audioPlayer.init(url, index);
    });


    window.addEventListener('resize', () => {
      if (canvasContainer.value && loaded) {
        // Resize PixiJS canvas and update the app stage
        app.renderer.resize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
        // Call resize function from AudioPlayer to adjust visual elements
        background.width = app.screen.width
        background.height = app.screen.height
        audioPlayer.resize();
      }
    });

    document.addEventListener('pointerup', () => {
      audioPlayer.dragging = false
    })
  })();
});

// function initApp(app: Application) {
//   const background = new Graphics();
//   background.rect(0, 0, app.screen.width, app.screen.height);
//   background.fill({
//     color: '#444444',
//   })
//   app.stage.addChild(background);
//   background.interactive = true;
//   app.stage.interactive = true;

//   const audio = new Audio("/audio/examples/Rock/drum.mp3");
//   audio.crossOrigin = "anonymous";

//   const audioContext = new AudioContext();
//   const source = audioContext.createMediaElementSource(audio);
//   source.connect(audioContext.destination);

//   async function unlockAudio() {
//     if (audioContext.state === "suspended") {
//       await audioContext.resume();
//     }
//   }
//   document.addEventListener("click", unlockAudio);

//   fetch("/audio/examples/Rock/drum.mp3")
//     .then((res) => res.arrayBuffer())
//     .then((data) => audioContext.decodeAudioData(data))
//     .then((buffer) => visualizeWaveform(buffer));

//   function visualizeWaveform(audioBuffer: AudioBuffer) {
//     const rawData = audioBuffer.getChannelData(0);
//     const samples = 200;
//     const blockSize = Math.floor(rawData.length / samples);
//     const waveform = new Array(samples).fill(0).map((_, i) => {
//       const blockStart = i * blockSize;
//       let sum = 0;
//       for (let j = 0; j < blockSize; j++) {
//         sum += Math.abs(rawData[blockStart + j]);
//       }
//       return sum / blockSize;
//     });

//     // Waveform bars
//     const waveGraphics = new Graphics();
//     const progressLine = new Graphics();
//     app.stage.addChild(waveGraphics, progressLine);

//     function drawWaveform(progress = 0) {
//       waveGraphics.clear();
//       const barWidth = app.screen.width / samples;
//       const maxHeight = app.screen.height / 2;

//       for (let i = 0; i < samples; i++) {
//         const barHeight = waveform[i] * maxHeight;
//         const x = i * barWidth;
//         const y = (app.screen.height - barHeight) / 2;

//         waveGraphics.rect(x, y, barWidth - 2, barHeight);
//         waveGraphics.fill();
//       }
//     }

//     function updateProgressLine() {
//       const progress = audio.currentTime / audio.duration;
//       progressLine.clear();
//       const x = progress * app.screen.width;
//       progressLine.moveTo(x, 0);
//       progressLine.lineTo(x, app.screen.height);
//       progressLine.stroke({ width: 2 })
//     }

//     drawWaveform();
//     app.ticker.add(updateProgressLine); // Update line position on each frame

//     // Seek functionality by dragging
//     let dragging = false;


//     app.stage.on("pointerdown", (event) => {
//       const clickX = event.global.x;
//       const seekRatio = clickX / app.screen.width;
//       audio.currentTime = seekRatio * audio.duration;
//       dragging = true;
//     });

//     app.stage.on("pointermove", (event) => {
//       if (dragging) {
//         const moveX = event.data.global.x;
//         const seekRatio = Math.max(0, Math.min(moveX / app.screen.width, 1));
//         audio.currentTime = seekRatio * audio.duration;
//       }
//     });

//     app.stage.on("pointerup", () => {
//       dragging = false;
//     });
//   }
// }



</script>

<style lang="scss" scoped>
.audioPlayerContainer {
  display: flex;
  width: 100vw;
  height: 100dvh;
  align-items: end;
  top: 0;
  z-index: 1000;
  background: linear-gradient(233deg, rgba(31, 11, 18, 0.50) 0%, rgba(32, 11, 19, 0.00) 71.38%);

  .playerControls {
    height: 50%;
    width: 50vw;
    display: flex;

    .mainControls {
      width: 60%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 56px;
      justify-content: space-between;
      border-radius: 0px 20px 0px 0px;
      background: radial-gradient(92.22% 89.66% at 0% 100%, rgba(46, 12, 24, 0.70) 0%, rgba(46, 12, 24, 0.00) 100%), rgba(255, 255, 255, 0.04);

      .abousMusic {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: start;

        .title {
          font-size: 44px;
          font-weight: 700;
          font-family: 'SF Georgian';
          font-feature-settings: 'case';
          text-shadow: 0px 0px 80px rgba(0, 0, 0, 0.50);
        }

        .description {
          color: $modalText-color;
          font-family: 'SF Georgian';
          font-size: 18px;
          font-weight: 400;
          text-shadow: 0px 0px 80px rgba(0, 0, 0, 0.50);
        }
      }

      .controls {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 72px;

        .trackControls {
          width: 203px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          border-radius: 20px;
          border: rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.04);
          padding: 8px 18px 8px 8px;

          button {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            border: 0;
            background-color: transparent;
            height: 100%;
          }

          .line {
            height: 24px;
            width: 2px;
            border-radius: 1px;
            background-color: rgba(255, 255, 255, 0.16);
          }

          .playSong {
            background-color: white;
            border-radius: 12px;
            width: 56px;
            height: 56px;
            max-width: 56px;
          }

        }

        .sound {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 72px;
          height: 100%;
          border-radius: 20px;
          border: rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
        }

      }
    }

    .secondaryControls {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 56px 56px;

      &>div {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        &::after {
          content: '';
          width: 1px;
          height: 24px;
          background-color: rgba(255, 255, 255, 0.16);
          top: 50%;
          transform: translate(-50%, -50%);
          right: -30%;
          position: absolute;
        }

        button {
          cursor: pointer;
          width: 40px;
          height: 24px;
          border-radius: 20px;
          border: 5px solid white;
          background-color: white;
          position: relative;
          transition: 200ms;

          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 23px;
            background-color: black;
            height: 14px;
            width: 14px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: 200ms;
          }

          &.off {
            border: 1px solid rgba(255, 255, 255, 0.42);
            background: transparent;

            &::after {
              left: 11px;
              background-color: rgba(255, 255, 255, 0.68);
            }
          }
        }
      }
    }
  }

  .playerContainer {
    height: 50dvh;
    width: 50vw;
    display: flex;
    justify-content: center;
    align-items: center;

    .audioPlayer {
      width: calc(100% - 112px);
      height: calc(100% - 112px);
      position: relative;
    }
  }
}
</style>