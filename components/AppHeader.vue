<template>
    <header :class="{hide: hideHeader }">
        <div id="headerLogo">
            <img alt="logo" src="/images/Logo.svg" />
            <p>Altertone</p>
        </div>
        <transition name="audioPlayer" mode="out-in">
            <div key="headerButtons" id="headerButtons">
                <button class="contacts" v-if="!reserveStore.AudioPlayerOpen" type="button" @click="goToContacts">კონტაქტი</button>
                <button v-if="!reserveStore.AudioPlayerOpen" type="button" @click="openReservation()">დაჯავშნე</button>
                <div @click="closeAudioPlayer()" v-if="reserveStore.AudioPlayerOpen" key="closeAudioPlayer"
                    id="closeAudioPlayer">
                    <img src="/images/icons/modalClose.svg" alt="close" />
                </div>
            </div>
        </transition>

    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { breakpoints } from '@/utils/breakpoints';
const reserveStore = ReserveStore();

const hideHeader = ref(false);

const lastScrollY = ref(0);

const openReservation = async () => {
  reserveStore.toggleModal();
};

const closeAudioPlayer = () => {
  reserveStore.AudioPlayerOpen = false;
};

const goToContacts = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  const isMobile = window.innerWidth <= breakpoints.tablet;

  if (isMobile) {
    if (currentScrollY > lastScrollY.value && currentScrollY > 50) {
      hideHeader.value = true;
    } else if (currentScrollY < lastScrollY.value) {
      hideHeader.value = false;
    }
  } else {
    hideHeader.value = false;
  }

  lastScrollY.value = currentScrollY;
};

onMounted(() => {
  lastScrollY.value = window.scrollY;
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>


<style lang="scss" scoped>
.audioPlayer-enter-active,
.audioPlayer-leave-active {
    transition: opacity 0.5s ease;
}

.audioPlayer-enter-from,
.audioPlayer-leave-to {
    opacity: 0;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 124px;
    width: 100%;
    color: #FFF;
    padding: 40px 56px;
    position: fixed;
    z-index: 25;
    top: 0;
    font-family: 'Neue';
    transition: 600ms;


    &::before {
        content: '';
        position: absolute;
        top: -100%;
        left: 0;
        width: 100%;
        height: 100%;
        transition: 400ms;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 90%);
        z-index: -1;
        backdrop-filter: blur(5px);
    }

    &.hide {
        transform: translateY(-100%);
        transition: transform 0.3s ease-in-out;
    }

    @include respond-to('tablet') {
        padding: 40px 20px;
    }

    #headerLogo {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 17px;

        img {
            cursor: pointer;
            width: 44px;
            height: 44px;
            transition: 5000ms ease-in-out;

            &:hover {
                transform: rotate(1980deg);
            }
        }

        p {
            color: #FFF;
            font-family: Orbitron;
            font-size: 18.526px;
            font-weight: 800;
            line-height: normal;
            letter-spacing: 0.371px;
        }
    }

    #headerButtons,
    #closeAudioPlayer {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;

        @include respond-to('tablet') {
            .contacts {
                display: none;
            }
        }

        button {
            cursor: pointer;
            background-color: transparent;
            border: 0;
            border-radius: 12px;
            width: 111px;
            height: 44px;
            font-size: 14.224px;
            font-weight: 700;
            line-height: 100%;
            letter-spacing: 0.142px;
            color: inherit;
            transition: 200ms;
            font-family: 'Neue';

            &:nth-child(2) {
                border: 1px solid $border-color;
            }

            &:hover {
                background-color: rgba(455, 455, 455, 0.2);
            }
        }
    }

    #closeAudioPlayer {
        cursor: pointer;
    }
}
</style>