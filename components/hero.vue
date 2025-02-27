<template>
    <article>
        <div class="graphics">
            <div v-for="(item, index) in sets" :key="index" class="set">
                <div v-for="(icon, iconIndex) in item" :key="iconIndex" class="image-container"
                    :class="{ icon: icon.src }">
                    <img v-if="icon.src" :src="icon.src" />
                    <div class="line" v-else></div>
                </div>
            </div>
        </div>

        <div class="mainContent">
            <h1>შექმენი ხარისხიანი მუსიკა</h1>
            <p>პროფესიონალური აპარატურა, მოქნილი ცხრილი და საუკეთესო პირობები მუსიკოსებისთვის.</p>
        </div>
        <div class="nextPage">
            <div @click="$emit('scrollToServices')">
                <button type="button" class="nextPageButton"></button>
                <p>სერვისები</p>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
const sets = [
    [
        { src: '/images/icons/plusIcon.svg' },
        { src: '' }, // Empty div placeholder
        { src: '/images/icons/plusIcon.svg' },
        { src: '' }, // Empty div placeholder
        { src: '/images/icons/plusIcon.svg' }
    ],
    [
        { src: '/images/icons/plusIcon.svg' },
        { src: '' }, // Empty div placeholder
        { src: '/images/icons/plusIcon.svg' }
    ],
    [
        { src: '/images/icons/plusIcon.svg' },
        { src: '' }, // Empty div placeholder
        { src: '/images/icons/plusIcon.svg' }
    ]
];
</script>

<style lang="scss" scoped>
article {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    padding-top: 124px;
    overflow: hidden;
    background-image: url('/images/hero.png');
    background-size: cover;
    background-position: center;
    display: grid;
    grid-template-rows: 2fr 124px;

    .graphics {
        padding: 124px 56px;
        position: absolute;
        top: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: space-between;

        .set {
            display: flex;
            align-items: center;
            width: 100%;

            .image-container {
                width: 100%;
            }

            .icon {
                width: 7px;
            }

            .line {
                height: 1px;
                background-color: $border-color;
                width: 100%;
                border-radius: 1px;
            }

            &:nth-child(2),
            &:nth-child(3) {
                //width: calc(100vw - 665px);
                width: 50%;
            }
        }
    }

    .set {
        display: flex;
        gap: 10px;
    }

    .image-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .mainContent {
        width: 655px;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 16px;
        padding: 0 56px;

        h1 {
            height: 345px;
            color: #FFF;
            text-shadow: 0px 0px 80px rgba(0, 0, 0, 0.50);
            font-family: 'SF Georgian', sans-serif;
            font-size: 96px;
            font-style: normal;
            font-weight: 700;
            letter-spacing: -1.92px;
            text-transform: uppercase;
            font-feature-settings: 'case';

        }

        p {
            height: 54px;
            color: #FFF;
            text-shadow: 0px 0px 80px rgba(0, 0, 0, 0.50);
            font-family: 'SF Georgian', sans-serif;
            font-size: 18px;
            font-style: normal;
            font-weight: 300;
            line-height: 150%;
            letter-spacing: -0.36px;
        }
    }

    .nextPage {
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100vw;
        height: 124px;
        padding: 0 56px;
        z-index: 1;

        &>div {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 17px;
            height: 44px;
            // padding: 0 15px;
            // border-radius: 8px;
            // transition: 200ms;

            &:hover {
                //background-color: rgba(255, 255, 255, 0.15);

                p {
                    color: #FFF;
                }
            }

            .nextPageButton {
                cursor: pointer;
                width: 20px;
                height: 20px;
                background: transparent;
                border: none;
                background-image: url('/images/icons/arrowDown.svg');
                background-position: center;
                background-repeat: no-repeat;
                background-size: 13px 7px;
            }

            p {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.56);
                font-weight: 500;
                font-family: 'SF Georgian', sans-serif;
                transition: 200ms;
            }

        }
    }
}
</style>