<template>
    <div class="service-viewer">
        <h1>სერვისები</h1>

        <div class="serviceMap">
            <div class="servicePoints">
                <template v-for="(service, index, key) in services">
                    <div :class="{ active: visibleIndex === Number(index) }" class="servicePoint">
                        <div class="point"></div>
                        <div ref="lines" v-if="Number(index) < ((services?.length ?? 0) - 1)"" class=" line">
                            <div class="movingLine" :class="getLineStyle(Number(index))"></div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="serviceViewContainer">
                <div v-for="(service, index, key) in services" class="serviceOnView"
                    @click="handleContentClick(Number(index))" :class="{ active: visibleIndex === Number(index) }">
                    <p>{{ service.title }}</p>
                </div>
            </div>
        </div>
        <div class="contacts">
            <p class="additionalInfo">დამატებითი ინფორმაციისთვის</p>
            <button type="button" class="contactButton">
                <img src="/images/icons/phone.svg" />
                <p>
                    დაგვიკავშირდით
                </p>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['contentClicked'])
const props = defineProps({
    services: Object,
    visibleIndex: Number
})
const lines = ref<HTMLElement[]>([]);
const previousVisibleIndex = ref<number>(-1);
const animationDirection = ref<"topToBottom" | "bottomToTop">("topToBottom");
watch(() => props.visibleIndex, (newIndex, oldIndex) => {
    if (oldIndex !== undefined) {
        previousVisibleIndex.value = oldIndex;
    }
});
const handleContentClick = (index: number) => {
    emit('contentClicked', index)
}
const getLineStyle = (index: number) => {
    if (props.visibleIndex === undefined) {
        return
    }
    let isAnimating
    if (props.visibleIndex > previousVisibleIndex.value) {
        isAnimating = index === previousVisibleIndex.value;
        if (index === previousVisibleIndex.value) {
            return 'topToBottom'

        }
    } else if (props.visibleIndex < previousVisibleIndex.value) {
        isAnimating = index === props.visibleIndex;
        if (index === props.visibleIndex) {
            return 'bottomToTop'
        }
    }
};

onMounted(() => {
    console.log(props.services)
    console.log(lines.value)
})
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

    h1 {
        font-family: 'SF Georgian';
        font-size: 44px;
        font-weight: 700;
        font-feature-settings: 'case';
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

            .servicePoint {
                display: flex;
                align-items: center;
                height: 100%;
                position: relative;

                .point {
                    height: 18px;
                    width: 18px;
                    background-color: rgba(0, 0, 0, 0);
                    border-radius: 50%;
                    outline: 2px #1B1B1D solid;
                    transition: 400ms;
                    transition-delay: 0.2s;
                }

                .line {
                    position: absolute;
                    height: 54px;
                    width: 2px;
                    background-color: #1d1b1b;
                    top: calc(100% + 8px);
                    left: 50%;
                    transform: translate(-50%, -50%);
                    overflow: hidden;

                    .movingLine {
                        width: 2px;
                        height: 40px;
                        background-color: white;
                        position: absolute;
                        display: none;
                    }

                    .topToBottom {
                        display: unset;
                        animation: moveTopToBottom 0.3s linear forwards;
                        transform: translateY(100%);
                    }

                    .bottomToTop {
                        display: unset;
                        animation: moveBottomToTop 0.3s linear forwards;
                    }

                    @keyframes moveTopToBottom {
                        from {
                            top: -80px;
                        }

                        to {
                            top: 54px;
                        }
                    }

                    @keyframes moveBottomToTop {
                        from {
                            top: 54px;
                        }

                        to {
                            top: -54px;
                        }
                    }
                }

                &.active {

                    .point {
                        background-color: white;
                        border: 0px;
                    }

                }
            }
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
                font-family: "SF Georgian";
                color: rgba(255, 255, 255, 0.56);
                letter-spacing: 0.32px;
                transition: 400ms;
                transition-delay: 200ms;
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
            font-family: 'SF Georgian';
            font-size: 18px;
        }

        .contactButton {
            cursor: pointer;
            width: 181px;
            height: 44px;
            border-radius: 12px;
            background-color: rgba(255, 255, 255, 0.04);
            border: 0;
            display: flex;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            transition: 200ms;

            p {
                font-family: 'SF Georgian';
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