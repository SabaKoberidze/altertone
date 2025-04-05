<template>
    <div class="serviceItem">
        <img :src="bgImage" class="serviceBg" />
        <div class="serviceContent">
            <img :src="icon" class="serviceIcon" />
            <button class="buyOnline">
                <p>დაჯავშნე ონლაინ</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M7.17458 4.00051C6.79516 4.35283 6.7732 4.94601 7.12551 5.32543L11.5332 10L7.12551 14.6746C6.7732 15.054 6.79517 15.6472 7.17458 15.9995C7.554 16.3518 8.14718 16.3298 8.4995 15.9504L13.4995 10.6379C13.8335 10.2782 13.8335 9.72178 13.4995 9.36208L8.4995 4.04958C8.14718 3.67016 7.554 3.6482 7.17458 4.00051Z"
                        fill="white" />
                </svg>
            </button>
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
            <div class="extraInfo">
                <div v-for="includedServices in details?.includedServices">
                    <img src="/public/images/icons/includedFeature.svg">
                    <p>{{ includedServices }}</p>
                </div>
                <div v-for="features in details?.addedFeatures">
                    <img src="/public/images/icons/pricedFeature.svg">
                    <div>
                        <p>{{ features.name }}</p>
                        <p class="price">+ {{ features.price }} GEL</p>
                    </div>
                </div>
                <div v-for="deal in details?.deals">
                    <img src="/public/images/icons/sale.svg">
                    <p>{{ deal }}</p>
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
    details: Object,
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

    @include respond-to('tablet') {
        width: 65vw;
        height: auto;
        aspect-ratio: 3/5;
    }

    .serviceBg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
        z-index: 1;
        transition: 400ms;
    }

    .serviceIcon {
        position: absolute;
    }

    .buyOnline {
        background-color: transparent;
        border: 0;
        width: 214px;
        height: 48px;
        display: flex;
        align-items: center;
        padding: 0 14px;
        justify-content: space-between;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.56);
        position: absolute;
        top: 0;
        right: 0;
        opacity: 0;
        transition: 400ms;

        p {
            font-size: 14px;
        }

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
                opacity: 1;
                transition: 200ms;

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

        .extraInfo {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 0px;
            transition: 400ms;
            max-height: 0;
            opacity: 0;

            p {
                font-size: 14px;
            }

            &>div {
                display: flex;
                gap: 16px;
                align-items: center;

                &>div {
                    display: flex;
                    gap: 16px;

                    .price {
                        color: rgba(255, 255, 255, 0.56);
                    }
                }
            }
        }
    }

    &:hover {
        cursor: pointer;

        .serviceBg {
            filter: blur(12px);
        }

        .serviceInfo {
            .serviceDetails {
                opacity: 0;
            }
        }

        .extraInfo {
            max-height: 168px;
            opacity: unset;
            margin-top: 30px;
        }

        .buyOnline {
            opacity: 1;

            &:hover {
                cursor: pointer;
                background-color: rgba(255, 255, 255, 0.2);
            }
        }
    }
}
</style>