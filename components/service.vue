<template>
    <article>
        <subComponentsServiceViewer :services="services" :visibleIndex="highestVisibleIndex" />
        <div class="serviceContainer">
            <template v-for="(service, index) in services" :key="index">
                <subComponentsServiceItem v-bind="service" :ref="el => setServiceRef(el, index)" />
            </template>
        </div>
    </article>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useElementVisibility } from '@vueuse/core';

let services = [
    { title: 'სარეპეტიციო სივრცე', icon: '/images/icons/room.svg', bgImage: '/images/hero.png', price: 30, duration: 2 },
    { title: 'ჩაწერა', icon: '/images/icons/mic.svg', bgImage: '/images/hero.png', price: 100, duration: 1 },
    { title: 'ვიდეო გადაღება', icon: '/images/icons/vid.svg', bgImage: '/images/hero.png', price: 400, duration: 0 },
    { title: 'ხმის გამოხმოვანება კონცერტებზე', icon: '/images/icons/sound.svg', bgImage: '/images/hero.png', price: 0, duration: 0 }
];

const serviceSection = ref<HTMLElement[]>([]);
const visibleBlocks = ref<boolean[]>([]);
const highestVisibleIndex = ref(-1);

const setServiceRef = (el: any, index: number) => {
    if (el) serviceSection.value[index] = el;
};

onMounted(() => {
    serviceSection.value.forEach((el, index) => {
        const isVisible = useElementVisibility(ref(el), { rootMargin: `0px 0px ${-window.innerHeight / 2}px 0px` });

        watch(isVisible, (visible) => {
            visibleBlocks.value[index] = visible;

            const visibleIndices = visibleBlocks.value
                .map((isVis, i) => (isVis ? i : -1))
                .filter(i => i !== -1);

            highestVisibleIndex.value = visibleIndices.length ? Math.max(...visibleIndices) : -1;
            console.log(`Current Highest Visible Index: ${highestVisibleIndex.value}`);
        });
    });
});
</script>

<style lang="scss" scoped>
article {
    padding: 0 56px;
    width: 100%;
    background: #0D0E0F;
    display: flex;
    justify-content: space-between;

    .serviceContainer {
        padding: 220px 80px;
        display: flex;
        flex-direction: column;
        gap: 40px;
    }
}
</style>
