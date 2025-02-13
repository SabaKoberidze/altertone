<template>
    <header>





        <div id="headerLogo">
            <img alt='logo' src="/images/logo.svg" />
            <p>Altertone</p>
        </div>
        <div id="headerButtons">
            <button type="button">კონტაქტი</button>
            <button type="button">დაჯავშნე</button>
        </div>
    </header>
</template>
<script setup lang="ts">

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
    z-index: 5;
    top: 0;

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