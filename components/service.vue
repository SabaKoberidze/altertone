<template>
    <article>
        <subComponentsServiceViewer />
        <div class="serviceContainer">
            <template v-for="(service, index) in services" :key="index">
                <subComponentsServiceItem v-bind="service" />
            </template>
        </div>
    </article>
</template>
<style lang="scss" scoped>
article {
    padding: 0 56px;
    width: 100%;
    background: #0D0E0F;
    display: flex;

    .serviceContainer {
        padding: 220px 80px;
        display: flex;
        flex-direction: column;
        gap: 40px;
    }
}
</style>
<script setup lang="ts">
let services = [
    {
        title: 'სარეპეტიციო სივრცე',
        icon: '/images/icons/room.svg',
        bgImage: '/images/hero.png',
        price: 30,
        duration: 2
    },
    {
        title: 'ჩაწერა',
        icon: '/images/icons/mic.svg',
        bgImage: '/images/hero.png',
        price: 100,
        duration: 1
    },
    {
        title: 'ვიდეო გადაღება',
        icon: '/images/icons/vid.svg',
        bgImage: '/images/hero.png',
        price: 400,
        duration: 0
    },
    {
        title: 'ხმის გამოხმოვანება კონცერტებზე',
        icon: '/images/icons/sound.svg',
        bgImage: '/images/hero.png',
        price: 0,
        duration: 0
    }
]
</script>
