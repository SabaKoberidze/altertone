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
                    <p>{{ price }} ₾</p>
                    <p>{{ duration }} დღე</p>
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
    .serviceIcon{
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

        & > div {
            width: 100%;
            display: flex;
        }

        .serviceIcon {
            position: absolute;
            top: 0;
        }

        .serviceInfo {
            display: flex; 
            justify-content: space-between;

            & > div {
                display: flex;
            }
            .servicePrice,.serviceDetails{
                color:  rgba(255, 255, 255, 0.56);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 150%;
                letter-spacing: 0.28px;
            }
            .serviceDetails{
                display: flex;
                align-items: center;
                gap: 17px;
                cursor: pointer;
            }
        }
    }
}
</style>