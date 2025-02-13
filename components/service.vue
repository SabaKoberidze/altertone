<template>
    <article>
        <subComponentsServiceViewer/>
        <div>
        <template v-for="(service, index) in services" :key="index">
            <subComponentsServiceItem  v-bind="service" />
        </template>
    </article>
</template>
<style lang="scss" scoped>
    article{
        padding: 0 56px;
        width: 100%;
        background: #0D0E0F;
    }
</style>
<script setup lang="ts">
let services = [
    {
        title: 'მუსიკალური ინსტრუმენტები',
        icon: '/images/icons/room.svg',
        bgImage: '/images/hero.png',
        price: 100,
        duration: 5
    },
    {
        title: 'აუდიო აღჭურვილობა',
        icon: '/images/icons/mic.svg',
        bgImage: '/images/hero.png',
        price: 150,
        duration: 3
    },
    {
        title: 'ლაიტინგი',
        icon: '/images/icons/vid.svg',
        bgImage: '/images/hero.png',
        price: 200,
        duration: 7
    },
    {
        title: 'ლაიტინგი',
        icon: '/images/icons/sound.svg',
        bgImage: '/images/hero.png',
        price: 200,
        duration: 7
    }
]
</script>
