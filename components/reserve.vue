<template>
    <div id="reservation" v-show="show">
        <div class="modalHeader">
            <div class="steps">
                <div class="step" :class="{ active: step === currentStep }" v-for="step in steps">
                    <img v-show="currentStep > step" src="/images/icons/checkmark.svg">
                    <p v-show="currentStep <= step">{{ step }}</p>
                </div>
            </div>
            <div class="modalClose">
                გაუქმება
                <button><img src="/images/icons/modalClose.svg" /></button>
            </div>
        </div>
        <div class="modalContent">
            <div v-for="step in steps">
                <div></div>
            </div>
            <div class="buttonContainer">
                <button v-show="currentStep > 1" class="previousStep" v-on:click="previousStep()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M15.3905 4.80061C15.8458 5.22339 15.8722 5.93521 15.4494 6.39051L10.1602 12L15.4494 17.6095C15.8722 18.0648 15.8458 18.7766 15.3905 19.1994C14.9352 19.6222 14.2234 19.5958 13.8006 19.1405L7.80061 12.7655C7.3998 12.3339 7.3998 11.6661 7.80061 11.2345L13.8006 4.8595C14.2234 4.4042 14.9352 4.37783 15.3905 4.80061Z"
                            fill="white" fill-opacity="0.56" />
                    </svg>
                    უკან
                </button>
                <button class="nextStep" v-on:click="nextStep()">
                    გაგრძელება
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M8.6095 4.80061C8.1542 5.22339 8.12783 5.93521 8.55061 6.39051L13.8398 12L8.55061 17.6095C8.12783 18.0648 8.1542 18.7766 8.6095 19.1994C9.0648 19.6222 9.77662 19.5958 10.1994 19.1405L16.1994 12.7655C16.6002 12.3339 16.6002 11.6661 16.1994 11.2345L10.1994 4.8595C9.77662 4.4042 9.0648 4.37783 8.6095 4.80061Z"
                            fill="#0D0E0F" />
                    </svg>
                </button>
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
const show = ref(true)
const currentStep = ref(1)
const steps = 3
function nextStep() {
    currentStep.value++
}
function previousStep() {
    currentStep.value--
}
</script>
<style lang="scss" scoped>
#reservation {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 10;
    background: #000000d4;
    backdrop-filter: blur(15px);

    .modalHeader {
        display: flex;
        padding: 40px 56px;
        justify-content: space-between;
        align-items: center;
        align-items: center;
        height: 124px;
        width: 100%;
        position: absolute;
        top: 0;

        .steps {
            display: flex;
            gap: 16px;

            .step {
                display: flex;
                width: 32px;
                height: 32px;
                padding: 5px 11px;
                justify-content: center;
                align-items: center;
                border-radius: 26px;
                border: 1px solid rgba(255, 255, 255, 0.04);
                background: rgba(255, 255, 255, 0.04);
                transition: 200ms;

                p {
                    color: var(--colors-invert-invert2-26, rgba(255, 255, 255, 0.26));
                    text-align: center;
                    font-family: "Helvetica Neue LT GEO";
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 150%;
                    transition: 200ms;
                }

                &.active {
                    width: 64px;
                    border: white 1px solid;
                    background-color: black;

                    p {
                        color: white;
                    }
                }
            }
        }

        .modalClose {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 16px;
            color: rgba(255, 255, 255, 0.56);
            font-size: 16px;
            transition: 200ms;

            button {
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.04);
                border-radius: 10px;
                border: 0;
                outline: 0;
                transition: 200ms;
                cursor: pointer;
            }

            &:hover {
                color: white;

                button {
                    background-color: rgba(255, 255, 255, 0.08);
                }
            }
        }
    }

    .modalContent {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;


        .buttonContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;

            .nextStep,
            .previousStep {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                padding: 16px;
                gap: 16px;
                font-weight: 700;
                height: 56px;
                border-radius: 12px;
                border: 0;
                cursor: pointer;
            }


            .nextStep {
                width: 240px;
                background-color: white;
                color: black;
            }

            .previousStep {
                width: 110px;
                color: rgba(255, 255, 255, 0.56);
                background-color: rgba(255, 255, 255, 0.04);
            }
        }

    }
}
</style>