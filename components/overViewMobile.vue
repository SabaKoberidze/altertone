<template>
    <div class="overViewMobile">
        <div class="devicesMobileContainer">
            <h1>პროფესიონალური აპარატურა</h1>
            <div class="devices">
                <div v-for="(device, index) in devices" :key="index" class="device">
                    <img :src="`/images/devices/${device.img}.png`" />
                    {{ device.name }}
                </div>
            </div>
        </div>
        <div class="examplesMobileContainer" :class="{ AudioPlayerOpen: reserveStore.AudioPlayerOpen }">
            <h1>ჩვენი ჩაწერილი მუსიკა</h1>
            <div class="cardContainer">
                <div class="card" :class="{ spinning: pickedMusicIndex === index, paused: musicPaused }"
                    v-for="(example, index) in examples">
                    <div class="cardHolder" @click="openMusic(index)">
                        <img class="vinyl" src="/images/examples/vinyl.png" />
                        <div class="cardInnerContainer">
                            <img class="cardImage" :src="`images/examples/${example.img}.png`" />
                        </div>
                    </div>
                    <p class="exampleTitle">
                        {{ example.title }}
                    </p>
                </div>
            </div>
            <div class="audioPlayerContainer"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ReserveStore } from '@/stores/reserveStore'

const props = defineProps({
    audioPlayerComponent: {
        type: Object,
        required: true
    }
})
const reserveStore = ReserveStore()
const pickedMusicIndex = ref(-1)
const musicPaused = ref(false)
const devices = ref([
    {
        name: 'კომბები',
        img: 'amp',
    },
    {
        name: 'მიქშერი',
        img: 'mixer',
    },
    {
        name: 'დინამიკები',
        img: 'speakers',
    },
    {
        name: 'მიკროფონები',
        img: 'microphone',
    },
    {
        name: 'დრამები',
        img: 'drum',
    },
]);
const examples = ref([
    {
        img: 'Punk',
        title: 'პანკი',
        zIndex: 1,
    },
    {
        img: 'Jazz',
        title: 'ჯაზი',
        zIndex: 2,
    },
    {
        img: 'Rock',
        title: 'როკი',
        zIndex: 3,
    },
    {
        img: 'Blues',
        title: 'ბლუზი',
        zIndex: 2,
    },
    {
        img: 'Metal',
        title: 'მეტალი',
        zIndex: 1,
    },
])

function openMusic(index: number) {
    if (!reserveStore.AudioPlayerOpen) {
        setTimeout(() => {
            console.log(props.audioPlayerComponent)
            pickedMusicIndex.value = index
            props.audioPlayerComponent.pickMusic(index)
        }, 1000)
    } else {
        pickedMusicIndex.value = index
        props.audioPlayerComponent.pickMusic(index)
    }
    reserveStore.AudioPlayerOpen = true
}

onMounted(() => {
    watch(() => reserveStore.AudioPlayerOpen, (isOpen) => {
        // if (!isOpen) {
        //     pickedMusicIndex.value = -1
        //     props.audioPlayerComponent.stopAudio()
        //     reserveStore.blockScrolling(false)
        // } else {
        //     reserveStore.blockScrolling(true)
        // }
    })
})
</script>

<style lang="scss" scoped>
.overViewMobile {
    width: 100vw;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .devicesMobileContainer {
        height: 404px;
        gap: 28px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        align-self: start;

        h1 {
            padding: 0 20px;

            max-width: 100vw;
        }

        .devices {
            width: 100vw;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            align-items: start;
            justify-content: flex-start;
            align-self: start;

            &::-webkit-scrollbar {
                display: none;
            }

            height: 150px;
            display: flex;
            gap: 12px;

            .device {
                flex: 0 0 140px;
                height: 150px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
                border-radius: 16px;
                font-size: 12px;
                border: 1px solid rgba(255, 255, 255, 0.09);
                background: radial-gradient(125.76% 125.76% at 50% 145.45%, rgba(245, 195, 92, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), linear-gradient(180deg, rgba(23, 24, 25, 0.00) 0%, rgba(23, 24, 25, 0.80) 100%), #000;
                mix-blend-mode: luminosity;

                &:first-child {
                    margin-left: 20px;
                }

                &:last-child {
                    margin-right: 20px;
                }

                img {
                    height: 100px;
                    object-fit: cover;
                }
            }
        }
    }

    .examplesMobileContainer {
        height: 404px;
        gap: 28px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        align-self: start;
        background: radial-gradient(92.22% 89.66% at 0% 100%, rgba(46, 12, 24, 0.70) 0%, rgba(46, 12, 24, 0.00) 100%), var(--colors-invert-invert2-4, rgba(255, 255, 255, 0.04));
        transition: 700ms;

        h1 {
            padding: 0 20px;

            max-width: 100vw;
        }

        .cardContainer {
            width: 100vw;
            max-width: 100vw;
            overflow-x: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
            align-items: start;
            justify-content: flex-start;
            align-self: start;

            &::-webkit-scrollbar {
                display: none;
            }

            height: 150px;
            display: flex;
            gap: 12px;

            .card {
                width: 150px;
                height: 150px;
                min-width: 150px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: 200ms;
                z-index: 21;
                cursor: pointer;

                .cardHolder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: start;
                    position: relative;
                    transition: 200ms;
                    border-radius: 50%;
                    transition: 200ms;

                    .vinyl {
                        width: 150px;
                        height: 100%;
                        z-index: -1;
                        transition: 200ms;
                        right: 0;
                        position: absolute;
                    }

                    .cardInnerContainer {
                        width: 150px;
                        height: 100%;
                        overflow: hidden;
                        transition: 200ms;
                        outline: 0px solid #000000;

                        .cardImage {
                            width: 100%;
                            height: 100%;
                        }

                    }

                }

                &.spinning {
                    width: 230px;
                    min-width: 230px;
                }

                .exampleTitle {
                    position: absolute;
                    opacity: 0;
                    transition: 200ms;
                    font-feature-settings: 'case';
                    font-size: 14px;
                    text-shadow: 0px 0px 20px rgb(0, 0, 0);
                }

                &:first-child {
                    margin-left: 20px;
                }

                &:last-child {
                    margin-right: 20px;
                }
            }

        }

        &.AudioPlayerOpen {
            height: 100dvh;

            .audioPlayerContainer {
                height: 50dvh;
                width: 100%;


            }

        }

    }
}
</style>
