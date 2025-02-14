<template>
    <div class="serviceItem">
        <img :src="bgImage" class="serviceBg" />
        <div class="serviceContent">
            <img :src="icon" class="serviceIcon" />
            <div class="serviceTitle">
                <h3>{{ title }}</h3>
            </div>
            <div class="serviceInfo">
                <div class="servicePrice">
                    <p>{{ price ? (price + ' ' + 'GEL') : 'ფასი შეთანხმებით' }}</p>
                    <p v-if="price">-</p>
                    <p v-if="price">{{ duration ? (duration + ' ' + 'სთ') : 'საწყისი ფასი' }}</p>
                </div>
                <div class="serviceDetails">
                    <p>დეტალები</p>
                    <img src="/images/icons/eye.svg" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps({
    title: String,
    icon: String,
    bgImage: String,
    price: Number,
    duration: Number,
})
</script>
<style lang="scss" scoped>
.serviceItem {
    width: 725px;
    height: 480px;
    position: relative;
    border-radius: 28px;
    overflow: hidden;
    color: white;
    padding: 30px;

    .serviceBg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
        z-index: 1;
    }

    .serviceIcon {
        position: absolute;
    }

    .serviceContent {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 2;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: flex-end;
        gap: 10px;

        &>div {
            width: 100%;
            display: flex;
        }

        .serviceIcon {
            position: absolute;
            top: 0;
        }

        .serviceTitle {
            font-size: 24px;
            font-feature-settings: "case";
        }

        .serviceInfo {
            display: flex;
            justify-content: space-between;

            &>div {
                display: flex;
            }

            .servicePrice,
            .serviceDetails {
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 150%;
                letter-spacing: 0.28px;

                p {
                    color: rgba(255, 255, 255, 0.56);
                }
            }

            .servicePrice {
                display: flex;
                gap: 3px
            }

            .serviceDetails {
                display: flex;
                align-items: center;
                gap: 17px;
                cursor: pointer;
            }
        }
    }
}
</style>