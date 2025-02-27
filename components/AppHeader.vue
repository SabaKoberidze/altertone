<template>
    <header :class="{ scroll: isScrolled }">
        <div id="headerLogo">
            <img alt='logo' src="/images/Logo.svg" />
            <p>Altertone</p>
        </div>
        <div id="headerButtons">
            <button type="button">კონტაქტი</button>
            <button type="button" @click="openReservation()">დაჯავშნე</button>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
const reserveStore = ReserveStore()
const isScrolled = ref(false);

const handleScroll = () => {
    isScrolled.value = window.scrollY > 0;
};
const openReservation = async () => {
    reserveStore.toggleModal()
}
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 124px;
    width: 100vw;
    color: #FFF;
    padding: 40px 56px;
    position: fixed;
    z-index: 25;
    top: 0;
    font-family: 'Neue';

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
    }

    &.scroll {
        &::before {
            top: 0%;
        }

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
            transition: 5000ms;
            transition-timing-function: ease-in-out;

            &:hover {
                transform: rotate(1980deg);
            }
        }

        p {
            color: #FFF;
            font-family: Orbitron;
            font-size: 18.526px;
            font-style: normal;
            font-weight: 800;
            line-height: normal;
            letter-spacing: 0.371px;
        }
    }

    #headerButtons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;

        @include respond-to('tablet') {
            :nth-child(1) {
                display: none;
            }
        }

        button {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: transparent;
            border: 0;
            border-radius: 12px;
            width: 111px;
            height: 44px;
            font-size: 14.224px;
            font-style: normal;
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
}
</style>