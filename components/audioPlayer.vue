<template>
  <div class="audioPlayerContainer" :class="{ deployed: onPlayerMounted }">
    <div class="playerControls">
      <div class="mainControls">
        <div class="abousMusic">
          <p class="title">{{ audioGenres[genreIndex] }}</p>
          <p class="description">მუსიკის სახეწლი ვისია რა არი საიდან არი რამე აღწერა</p>
        </div>
        <div class="controls">
          <div class="trackControls">
            <button :class="{ loaded: loaded }" v-on:click="playAudio()" class="playSong"><img
                :src="audioIcon" /></button>
            <div class="line"></div>
            <button v-on:click="changeTrack(false)"><img src="/images/icons/audioControls/nextSong.svg" /></button>
            <button v-on:click="changeTrack(true)"><img src="/images/icons/audioControls/previousSong.svg" /></button>
          </div>
          <div class="sound">
            <img v-on:click.stop="toggleMute()" src="/images/icons/audioControls/muteSong.svg" />
            <div class="soundSettings">
              <input type="range" :min="0" :max="1" :step="0.005" v-model="volume" @input="onVolumeChange" />
              <div class="styledSlider">
                <div :style="{ width: `${volume * 100}%`, opacity: volume }"></div>
              </div>
            </div>
          </div>
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
      <div class="audioPlayer" ref="canvasContainer">
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Application, Graphics } from 'pixi.js';
import { AudioPlayer } from '../classes/AudioPlayer';
const reserveStore = ReserveStore()
const emit = defineEmits(['onPause', 'songChanged']);
let soundTypes = ['Music', 'Vocal', 'Bass', 'Drums']
let muted = ref([false, false, false, false])
const canvasContainer = ref<HTMLDivElement | null>(null);
let app: Application
let audioPlayer: AudioPlayer
const onPlayerMounted = ref(false)
const loaded = ref(false)
const genreIndex = ref(0)
const audioIcon = ref('')
const volume = ref(0.5)

const audioGenres = ["punk", "jazz", "rock", "blues", "metal"]
const audioTypes = ['vocal', 'drums', 'music', 'bass']


const pickMusic = (index: number) => {
  setTimeout(async () => {
    let genre = audioGenres[index]
    genreIndex.value = index
    await loadAudio(genre);
  }, 100);
}


const setAudioIcon = () => {
  if (!audioPlayer) return '/images/icons/audioControls/Loading.svg'
  let icon = '/images/icons/audioControls/'
  if (audioPlayer.audioPlayerState.loading) {
    icon += 'Loading.svg'
  } else if (audioPlayer.audioPlayerState.playing) {
    icon += 'Pause.svg'
  } else {
    icon += 'Play.svg'
  }
  audioIcon.value = icon
}
setAudioIcon()

function playAudio() {
  if (!loaded.value) {
    return
  }
  else if (!audioPlayer.audioPlayerState.playing) {
    audioPlayer.playAudio();
    emit('onPause', false)
  } else {
    audioPlayer.pauseAudio();
    emit('onPause', true)
  }
}
function changeTrack(next: boolean) {
  setTimeout(async () => {
    if (next) {
      genreIndex.value += 1
    } else {
      genreIndex.value -= 1
    }
    if (genreIndex.value < 0) {
      genreIndex.value = audioGenres.length - 1
    } else if (genreIndex.value > audioGenres.length - 1) {
      genreIndex.value = 0
    }
    let genre = audioGenres[genreIndex.value]
    emit('songChanged', genreIndex.value)
    await loadAudio(genre);
  }, 100);
}
function toggleMute() {
  audioPlayer.toggleMute()
}
function toggleSound(index: number) {
  audioPlayer.toggleSound(index)
  muted.value[index] = !muted.value[index]
}

function onVolumeChange() {
  audioPlayer.changeVolume(volume.value)
}

onMounted(() => {
  if (!canvasContainer.value) {
    console.error('Canvas container not found!');
    return;
  }
  reserveStore.AudioPlayerOpen = true
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


    audioPlayer = new AudioPlayer(app, (isLoaded: boolean) => {
    }, (audioState: { playing: boolean, paused: boolean, loading: boolean }) => {
      if (!audioState.loading) {
        loaded.value = true
        audioPlayer.changeVolume()
      } else {
        loaded.value = false
      }
      setAudioIcon()
    })

    audioTypes.forEach((url, index) => {
      audioPlayer.init(index);
    });
    await audioPlayer.loadAssets()
    window.addEventListener('resize', () => {
      if (canvasContainer.value) {
        app.renderer.resize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
        background.width = app.screen.width
        background.height = app.screen.height
        audioPlayer.resize(loaded.value);
      }
    });
  })();
  setTimeout(() => {
    onPlayerMounted.value = true
  }, 200)
});

let loadAudio = async (genre: string) => {
  for (const [index, type] of soundTypes.entries()) {
    setTimeout(() => {
      audioPlayer.setAudio(genre, type, index);
    }, 100 * index)
  }
  return
}

let stopAudio = () => {
  audioPlayer.stopAudio()
}
defineExpose({
  pickMusic,
  stopAudio
})
</script>

<style lang="scss" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.audioPlayerContainer {
  display: flex;
  width: 100vw;
  height: 100dvh;
  align-items: end;
  top: 0;
  background: linear-gradient(233deg, rgba(31, 11, 18, 0.50) 0%, rgba(32, 11, 19, 0.00) 71.38%);
  position: fixed;
  bottom: 0;
  z-index: 1;

  .playerControls {
    height: 50%;
    width: 50vw;
    display: flex;


    .mainControls {
      flex-grow: 1;
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
          font-family: 'SF Georgian', sans-serif;
          font-feature-settings: 'case';
          text-shadow: 0px 0px 80px rgba(0, 0, 0, 0.50);
        }

        .description {
          color: $modalText-color;
          font-family: 'SF Georgian', sans-serif;
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

            // img {
            //   display: none;
            // }
            img {
              animation: rotate 1s linear infinite;
            }

            &.loaded {
              img {
                animation: none;
              }
            }
          }

        }

        .sound {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 72px;
          height: 100%;
          border-radius: 20px;
          //border: rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
          position: relative;
          transition: 200ms;
          transition-delay: 100ms;

          &>img {
            padding: 25px;
          }

          .soundSettings {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: start;
            width: 200%;
            height: 100%;
            top: -50%;
            left: 50%;
            border: rgba(255, 255, 255, 0.04);
            background: rgba(255, 255, 255, 0.04);
            rotate: -90deg;
            border-radius: 0 20px 20px 0;
            overflow: hidden;
            transition: 200ms;
            transition-delay: 0ms;
            scale: 0 1;
            transform-origin: left center;
            padding: auto;

            input {
              cursor: pointer;
              width: 100%;
              height: 100%;
              z-index: 1;
              opacity: 0;
            }

            .styledSlider {
              width: calc(100% - 10px);
              height: calc(100% - 20px);
              position: absolute;
              overflow: hidden;
              border-radius: 16px;
              border: 2px solid rgba(255, 255, 255, 0.1);

              &>div {
                transform-origin: left;
                height: 100%;
                width: 100%;
                background-color: white;
              }
            }
          }

          &:hover {
            border-radius: 0 0 20px 20px;
            transition-delay: 0ms;

            .soundSettings {
              width: 200%;
              transition-delay: 100ms;
              scale: 1 1;
            }
          }
        }
      }
    }

    .secondaryControls {
      width: 300px;
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
    padding: 0px 0px 56px 0px;

    .audioPlayer {
      width: 100%;
      height: 100%;
      position: relative;

    }
  }

  .playerControls,
  .playerContainer {
    transition: transform 1s;
    transform: translateY(100%);
    opacity: 0;
  }

  &.deployed {

    .playerControls,
    .playerContainer {
      transform: translateY(0%);
      opacity: 1;
    }
  }
}
</style>