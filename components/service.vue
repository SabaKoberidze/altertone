<template>
    <article>
        <subComponentsServiceViewer :services="services" :visibleIndex="highestVisibleIndex"
            @contentClicked='scrollToContent' />
        <div class="serviceContainer">
            <template v-for="(service, index) in services" :key="index">
                <div ref="serviceScrollPoint" class="serviceScrollPoint">
                    <subComponentsServiceItem v-bind="service" :ref="el => setServiceRef(el, index)" />
                </div>
            </template>
        </div>
    </article>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useElementVisibility } from '@vueuse/core';

let services = [
    {
        title: 'სარეპეტიციო სივრცე', icon: '/images/icons/room.svg', bgImage: '/images/hero.png', price: 30, duration: 2, details: {
            includedServices: ['დარბაზი', 'აპარატურა'],
            addedFeatures: [{ name: 'IEM მონიტორები', price: 10 }],
            deals: ['4 საათზე 12.5% ფასდაკლება']
        }
    },
    {
        title: 'ჩაწერა', icon: '/images/icons/mic.svg', bgImage: '/images/hero.png', price: 100, duration: 1, details: {
            includedServices: ['დარბაზი', 'აპარატურა'],
            addedFeatures: [{ name: 'IEM მონიტორები', price: 10 }],
            deals: ['4 საათზე 12.5% ფასდაკლება']
        }
    },
    {
        title: 'ვიდეო გადაღება', icon: '/images/icons/vid.svg', bgImage: '/images/hero.png', price: 400, duration: 0, details: {
            includedServices: ['დარბაზი', 'აპარატურა'],
            addedFeatures: [{ name: 'IEM მონიტორები', price: 10 }],
            deals: ['4 საათზე 12.5% ფასდაკლება']
        }
    },
    {
        title: 'ხმის გამოხმოვანება კონცერტებზე', icon: '/images/icons/sound.svg', bgImage: '/images/hero.png', price: 0, duration: 0, details: {
            includedServices: ['დარბაზი', 'აპარატურა'],
            addedFeatures: [{ name: 'IEM მონიტორები', price: 10 }],
            deals: ['4 საათზე 12.5% ფასდაკლება']
        }
    }
];

const serviceSection = ref<HTMLElement[]>([]);
const visibleBlocks = ref<boolean[]>([]);
const highestVisibleIndex = ref(-1);
const serviceScrollPoint = ref<HTMLElement[]>([]);
const setServiceRef = (el: any, index: number) => {
    if (el) serviceSection.value[index] = el;
};
const scrollToContent = (index: number) => {
    serviceScrollPoint.value[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
    });
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
