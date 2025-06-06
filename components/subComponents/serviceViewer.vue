<template>
    <div class="service-viewer">
        <h1>სერვისები</h1>
        <div class="serviceMap">
            <div class="servicePoints">
                <template v-for="(service, index, key) in services" :key="key">
                    <div :class="{ active: visibleIndex === Number(index) }" class="servicePoint">
                        <div class="point"></div>
                    </div>
                    <div ref="navLine" class="navLine">
                        <div class="bus" :style="{ top: getBusPosition() }"></div>
                    </div>
                </template>
            </div>
            <div class="serviceViewContainer">
                <div v-for="(service, index, key) in services" :key="key" class="serviceOnView"
                    @click="handleContentClick(Number(index))" :class="{ active: visibleIndex === Number(index) }">
                    <p>{{ service.title }}</p>
                </div>
            </div>
        </div>
        <div class="contacts">
            <p class="additionalInfo">დამატებითი ინფორმაციისთვის</p>
            <button type="button" class="contactButton">
                <img src="/images/icons/phone.svg" />
                <p @click="goToContacts">
                    დაგვიკავშირდით
                </p>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';

const emit = defineEmits(['contentClicked']);
const props = defineProps({
    services: Object,
    visibleIndex: Number
});

const previousVisibleIndex = ref<number>(-1);
const busPosition = ref('')

watch(() => props.visibleIndex, (newIndex, oldIndex) => {
    if (oldIndex !== undefined) {
        previousVisibleIndex.value = oldIndex;
        busPosition.value = getBusPosition()
    }
});

const handleContentClick = (index: number) => {
    emit('contentClicked', index);
};

const getBusPosition = () => {
    const index = props.visibleIndex;
    if (index !== undefined && index >= 0) {
        const pointHeight = 18;
        const gap = 54;
        const offset = index * (pointHeight + gap);
        return `${offset}px`;
    }
    return busPosition.value;
};
const goToContacts = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};
</script>

<style scoped lang="scss">
.service-viewer {
    position: sticky;
    top: 0;
    padding: 120px 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 48px;
    height: 756px;
    width: 443px;

    @media (max-width: 1300px) {
        width: 330px;
    }

    @media (min-width: 1921px) {
        transform-origin: top left;
        scale: 1.2;
    }

    @include respond-to('tablet') {
        padding: 0px 20px;
        height: unset;
        width: 100%
    }

    h1 {
        font-size: 44px;
        font-weight: 700;
        font-feature-settings: 'case';

        @include respond-to('tablet') {
            display: none;
        }
    }

    .serviceMap {
        height: 272px;
        display: flex;
        justify-content: start;
        gap: 12px;

        .servicePoints {
            height: 272px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 16px;
            position: relative;

            .navLine {
                height: calc(100% - 38px);
                width: 2px;

                position: absolute;
                background-color: #1d1b1b;
                left: 50%;
                transform: translateX(-50%);

                .bus {
                    transition: 300ms;
                    height: 18px;
                    width: 100%;
                    position: absolute;
                    background-color: white;
                }
            }

            .servicePoint {
                display: flex;
                align-items: center;
                height: 100%;
                position: relative;

                .point {
                    z-index: 2;
                    height: 18px;
                    width: 18px;
                    background-color: #0D0E0F;
                    border-radius: 50%;
                    outline: 2px #1B1B1D solid;
                    transition: 400ms;
                    transition-delay: 0.2s;
                }

                &.active {

                    .point {
                        background-color: white;
                        border: 0px;
                    }

                }
            }
        }

        @include respond-to('tablet') {
            display: none;
        }
    }

    .serviceViewContainer {
        height: 272px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 16px;

        .serviceOnView {
            cursor: pointer;
            user-select: none;
            margin: 0;
            transition: 200ms;
            border-radius: 12px;

            p {
                display: flex;
                align-items: center;
                width: 320px;
                height: 56px;
                border: 4px solid #1a1b1d00;
                border-radius: 12px;
                padding: 16px;
                font-size: 15px;
                color: rgba(255, 255, 255, 0.56);
                letter-spacing: 0.32px;
                transition: 400ms;
                transition-delay: 200ms;

                @media (max-width: 1300px) {
                    width: 300px;
                    padding: 16px 8px;
                }
            }

            &.active {
                p {
                    background-color: #121214;
                    border: 4px solid #1A1B1D;
                    color: white;
                }
            }

            &:hover {

                p {
                    color: rgba(255, 255, 255, 0.9);
                    background-color: transparent;
                }

                background-color: rgba(255, 255, 255, 0.15);
            }


        }
    }

    .contacts {
        display: flex;
        flex-direction: column;
        gap: 24px;

        .additionalInfo {
            font-size: 18px;

            @media (max-width: 1300px) {
                font-size: 16px;
            }
        }

        .contactButton {
            cursor: pointer;
            width: 181px;
            height: 44px;
            border-radius: 12px;
            background-color: $modalBorder-color;
            border: 0;
            display: flex;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            transition: 200ms;

            p {
                padding-bottom: 4px;
                font-size: 14px;
            }

            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }


    }
}
</style>