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
        <h1>სერვისები</h1>
    </article>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

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
        title: 'ხმის გახმოვანება კონცერტებზე', icon: '/images/icons/sound.svg', bgImage: '/images/hero.png', price: 0, duration: 0, details: {
            includedServices: ['დარბაზი', 'აპარატურა'],
            addedFeatures: [{ name: 'IEM მონიტორები', price: 10 }],
            deals: ['4 საათზე 12.5% ფასდაკლება']
        }
    }
];
const serviceSection = ref<HTMLElement[]>([]);
const highestVisibleIndex = ref(-1);
const serviceScrollPoint = ref<HTMLElement[]>([]);

const setServiceRef = (el: any, index: number) => {
    if (el && el.rootElement) {
        serviceSection.value[index] = el.rootElement;
    }
};

const scrollToContent = (index: number) => {
    serviceScrollPoint.value[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
    });
};

const getVisibleIndex = () => {
    let visibleIndex = -1;
    const middleZoneTop = window.innerHeight / 2 - 50;  // 50px wiggle room (above middle)
    const middleZoneBottom = window.innerHeight / 2 + 50; // 50px wiggle room (below middle)

    serviceSection.value.forEach((el, index) => {
        if (!el) return;  // Skip if no element is available

        if (el instanceof HTMLElement) {
            const rect = el.getBoundingClientRect(); // Get element's position relative to the viewport

            // Middle of the screen, which is constant
            const middle = window.innerHeight / 2;

            // Log positions for debugging
            console.log('Middle of screen:', middle);
            console.log('Element top:', rect.top);
            console.log('Element bottom:', rect.bottom);

            // Check if the middle of the screen is between the top and bottom of the element
            if (rect.top <= middle && rect.bottom >= middle) {
                visibleIndex = index;
            }
        }
    });

    // Set the highest visible index
    highestVisibleIndex.value = visibleIndex;

};

onMounted(() => {
    nextTick(() => {
        // Initialize visibility check on mount
        getVisibleIndex();

        // Add scroll event listener
        window.addEventListener('scroll', getVisibleIndex);
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', getVisibleIndex);
});
</script>

<style lang="scss" scoped>
article {
    padding: 0 56px;
    width: 100%;
    background: #0D0E0F;
    display: flex;
    justify-content: space-between;

    @include respond-to('tablet') {
        height: 100svh;
        max-height: 1000px;
        padding: 64px 0px 64px 0px;
        gap: 10vh;
        flex-direction: column-reverse;
        justify-content: flex-start;

        @media (max-height: 800px) {
            gap: 20px;
            padding: 32px 0px 32px 0px;
        }
    }

    h1 {
        display: none;
        width: 100%;
        font-size: 24px;
        font-weight: 700;
        justify-content: start;
        align-items: center;
        padding: 0 20px;

        @include respond-to('tablet') {
            display: flex;
        }
    }

    .serviceContainer {
        padding: 220px 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;

        @include respond-to('tablet') {
            padding: 0px 20px 0px 20px;
            gap: 20px;
            min-height: 450px;
            height: 450px;
            flex-direction: row;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;

            &::-webkit-scrollbar {
                display: none;
            }

            .serviceScrollPoint {
                height: 100%;
            }
        }

        @media (max-width: 1300px) and (min-width: 900px) {
            padding: 220px 0px 220px 20px;
        }

        @media (min-width: 1921px) {
            padding: 220px 8% 220px 60px;
        }
    }
}
</style>
