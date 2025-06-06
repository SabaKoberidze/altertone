<template>
    <div id="reservation">
        <div class="modalHeader">
            <div class="steps">
                <div class="step" :class="{ active: step - 1 === currentStep }" v-for="step in stepInfo.length">
                    <img v-show="currentStep > step - 1" src="/images/icons/checkmark.svg">
                    <p v-show="currentStep <= step - 1">{{ step }}</p>
                </div>
            </div>
            <div class="modalClose" v-on:click="reserveStore.toggleModal()">
                გაუქმება
                <button><img src="/images/icons/modalClose.svg" /></button>
            </div>
        </div>
        <div class="modalContent" v-if="dataLoaded">
            <transition :name="transitionName" mode="out-in">
                <div :key="currentStep" class="currentStep">
                    <div class="contentHeader">
                        <p class="mainText">{{ stepInfo[currentStep].title }}</p>
                        <p class="subText">{{ stepInfo[currentStep].subText }}</p>
                    </div>
                    <div v-if="currentStep === 0" class="date">
                        <ReserveStepsOne ref="stepOne" :unavailableDays="unavailableDays" @dayPicked="dayPicked" />
                    </div>
                    <div v-else-if="currentStep === 1" class="time">
                        <ReserveStepsTwo :intervals="reserveHours" :unavailableHours="unavailableHours" />
                    </div>
                    <div v-else-if="currentStep === 2" class="info">
                        <ReserveStepsThree />
                    </div>
                    <div v-else-if="currentStep === 3" class="submit">
                        <ReserveStepsFour @editDate="editDate" @editTime="editTime" />
                    </div>
                </div>
            </transition>
            <div class="buttonContainer">
                <button v-show="currentStep > 0" class="previousStep" v-on:click="previousStep()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M15.3905 4.80061C15.8458 5.22339 15.8722 5.93521 15.4494 6.39051L10.1602 12L15.4494 17.6095C15.8722 18.0648 15.8458 18.7766 15.3905 19.1994C14.9352 19.6222 14.2234 19.5958 13.8006 19.1405L7.80061 12.7655C7.3998 12.3339 7.3998 11.6661 7.80061 11.2345L13.8006 4.8595C14.2234 4.4042 14.9352 4.37783 15.3905 4.80061Z"
                            fill="white" fill-opacity="0.56" />
                    </svg>
                    უკან
                </button>
                <button class="nextStep" v-on:click="currentStep === 3 ? reserve() : nextStep()"
                    :class="{ disabled: isNextDisabled }">
                    <p v-if="currentStep === 3">გადახდა - {{ reserveStore.getPrice }} ლარი</p>
                    <p v-else>გაგრძელება</p>

                    <svg v-if="currentStep !== 3" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none">
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
import type { ReserveStepsOne } from '#components';
import { formatTimeAgo } from '@vueuse/core';
interface TimeInterval {
    start: string;
    end: string;
}
const reserveStore = ReserveStore()
const show = ref(false)
const currentStep = ref(0)
const transitionName = ref("fade-slide-forward");
const reservation = ref<Record<string, any> | undefined>({})
const stepOne = ref<InstanceType<typeof ReserveStepsOne> | null>(null)
const unavailableDays = ref<{ day: number, month: number }[]>([])
const unavailableHours = ref<TimeInterval[]>([])
const reserveInfo: { [key: number]: any } = {}
const dataLoaded = ref(false)
watch(currentStep, (newVal, oldVal) => {
    if (oldVal === undefined) {
        transitionName.value = "fade-slide-forward";
    } else {
        transitionName.value = newVal > oldVal ? "fade-slide-forward" : "fade-slide-backward";
    }
}, { immediate: true });

const isNextDisabled = computed(() => {
    return (
        (currentStep.value === 0 && reserveStore.selectedData.date === '') ||
        (currentStep.value === 1 && reserveStore.selectedData.time.length === 0) ||
        (currentStep.value === 2 && (
            reserveStore.selectedData.name === '' ||
            !(/\S+@\S+\.\S+/.test(reserveStore.selectedData.email || ''))
        ))
    );
});
const getMonth = (date: string) => {
    return Number(date.split('-')[1])
}

const getDay = (date: string) => {
    return Number(date.split('-')[2])
}

const formatHours = (hours: any[]) => {
    const formatted = [];
    for (let i = 0; i <= hours.length - 1; i++) {
        let currentHours = hours[i].split('-')
        formatted.push({
            start: currentHours[0],
            end: currentHours[1]
        });
    }
    return formatted;
};

const getReservedDates = (reserveds: any[]) => {
    reservation.value = [...reserveds]
    reservation.value.forEach((reservation: any) => {
        let month = getMonth(reservation.day)
        let day = getDay(reservation.day)
        let reservedHours = formatHours(reservation.reserved)
        reserveInfo[day] = reservedHours
        if (isFullDayBooked(reservedHours)) {
            unavailableDays.value.push({ day: day, month: month })
        }
    })
}

function isFullDayBooked(currentReservedHours: any) {
    if (currentReservedHours.length === reserveHours.value.length) {
        return true
    } else {
        true
    }
}
function dayPicked(day: number) {
    unavailableHours.value = reserveInfo[day] || []
}

onMounted(async () => {
    let data = await reserveStore.getReservedData()
    reservation.value = data;
    unavailableDays.value = []
    unavailableHours.value = []
    if (Array.isArray(reservation.value)) {
        getReservedDates(reservation.value)
    }
    dataLoaded.value = true
});

const reserve = () => {
    console.log('reserved')
}

interface StepInfoItem {
    title: string;
    subText: string;
}

const stepInfo: StepInfoItem[] = [{
    title: 'მონიშნეთ სასურველი დრო',
    subText: 'თავისუფალი დღეები მომდევნო 2 კვირის განმავლობაში'
},
{
    title: 'მშეარჩიეთ დროის ინტერვალი',
    subText: 'შეგიძლიათ მონიშნოთ რამდენიმე'
},
{
    title: 'საკონტაქტო ინფორმაცია',
    subText: 'მიუთითეთ სახელი, გვარი და ელ-ფოსტა საკონტაქტოდ'
},
{
    title: 'ჯავშნის დეტალები',
    subText: '1 საათის ღირებულება შეადგენს 30 ლარს და არ მოიცავს IEM მონიტორებს'
},
]

const reserveHours = ref([
    { start: "10:00", end: "12:00" },
    { start: "12:00", end: "14:00" },
    { start: "14:00", end: "16:00" },
    { start: "16:00", end: "18:00" },
    { start: "18:00", end: "20:00" },
    { start: "20:00", end: "22:00" },
]);

function nextStep() {
    currentStep.value++
}
function previousStep() {
    currentStep.value--
    if (currentStep.value === 0) {
        reserveStore.selectedData.date = ''
        reserveStore.selectedData.time = []
    }
}

function editDate() {
    currentStep.value = 0
    reserveStore.selectedData.date = ''
    reserveStore.selectedData.time = []
}

function editTime() {
    currentStep.value = 1
    reserveStore.selectedData.time = []
}

</script>
<style lang="scss" scoped>
.fade-slide-forward-enter-active,
.fade-slide-forward-leave-active {
    transition: opacity 600ms ease, transform 600ms ease;
}

.fade-slide-forward-enter-from {
    opacity: 0;
    transform: translateX(50%);
}

.fade-slide-forward-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.fade-slide-forward-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.fade-slide-forward-leave-to {
    opacity: 0;
    transform: translateX(-50%);
}

.fade-slide-backward-enter-active,
.fade-slide-backward-leave-active {
    transition: opacity 300ms ease, transform 300ms ease;
}

.fade-slide-backward-enter-from {
    opacity: 0;
    transform: translateX(-50%);
}

.fade-slide-backward-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.fade-slide-backward-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.fade-slide-backward-leave-to {
    opacity: 0;
    transform: translateX(50%);
}


#reservation {
    position: fixed;
    width: 100%;
    height: 100svh;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 30;
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

        @include respond-to('tablet') {
            padding: 20px 20px;
            height: 80px;
        }

        .steps {
            display: flex;
            gap: 16px;

            @include respond-to('tablet') {
                gap: 8px;
            }

            .step {
                display: flex;
                width: 32px;
                height: 32px;
                padding: 5px 11px;
                justify-content: center;
                align-items: center;
                border-radius: 26px;
                border: 1px solid $modalBorder-color;
                background: $modalBorder-color;
                transition: 200ms;

                @include respond-to('tablet') {
                    width: 26px;
                    height: 26px;
                    padding: 0;
                }

                p {
                    color: rgba(255, 255, 255, 0.26);
                    text-align: center;
                    font-family: "Helvetica Neue LT GEO";
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 150%;
                    transition: 200ms;

                    @include respond-to('tablet') {
                        font-size: 12px;
                    }
                }

                &.active {
                    width: 64px;
                    border: white 1px solid;
                    background-color: black;

                    @include respond-to('tablet') {
                        width: 50px;
                    }

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
            color: $modalText-color;
            font-size: 16px;
            transition: 200ms;

            @include respond-to('tablet') {
                gap: 8px;
                font-size: 12px;
            }

            button {
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: $modalBorder-color;
                border-radius: 10px;
                border: 0;
                outline: 0;
                transition: 200ms;
                cursor: pointer;

                @include respond-to('tablet') {
                    width: 32px;
                    height: 32px;

                    img {
                        width: 32px;
                        height: 32px;
                    }
                }

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
        flex-direction: column;
        gap: 43px;
        transition: 200ms;

        @include respond-to('tablet') {
            justify-content: end;
            padding-bottom: 20px;
            gap: 20px;
        }

        .currentStep {
            display: flex;
            justify-content: center;
            flex-direction: column;
            gap: 43px;
            transition: 200ms;

            @include respond-to('tablet') {
                gap: 20px;
            }

            &>div {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .contentHeader {
                display: flex;
                flex-direction: column;
                gap: 12px;

                @include respond-to('tablet') {
                    width: 100%;
                }

                p {
                    font-weight: 400;
                    text-align: center;

                    @include respond-to('tablet') {
                        padding: 0 20px;
                        width: 100%;
                    }
                }

                .mainText {
                    font-size: 20px;
                    font-weight: 700;
                }

                .subText {
                    color: rgba(255, 255, 255, 0.56);
                    text-shadow: 0px 0px 80px rgba(0, 0, 0, 0.50);
                    font-size: 14px;
                    font-weight: 400;


                }
            }
        }

        .buttonContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;

            @include respond-to('tablet') {
                width: 100%;
                margin-bottom: 20px;
                padding: 0 20px;
            }

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
                transition: 200ms;
            }


            .nextStep {
                width: 240px;
                background-color: white;

                @include respond-to('tablet') {
                    max-width: 60%;
                }

                p {
                    color: black;
                }

                &.disabled {
                    background-color: rgba(255, 255, 255, 0.56);
                    pointer-events: none;
                }
            }

            .previousStep {
                width: 110px;
                color: $modalText-color;
                background-color: $modalBorder-color;

                @include respond-to('tablet') {
                    max-width: 40%;
                }
            }
        }

    }
}
</style>