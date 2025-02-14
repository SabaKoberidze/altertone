<template>
    <div class="service-viewer">
        <h1>სერვისები</h1>
        <div class="serviceViewContainer">
            <div v-for="(service, index, key) in services" class="serviceOnView"
                :class="{ active: visibleIndex === Number(index) }">
                <p>{{ service.title }}</p>
            </div>
        </div>
        <div class="contacts">
            <p>დამატებითი ინფორმაციისთვის</p>
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
const props = defineProps({
    services: Object,
    visibleIndex: Number
})
onMounted(() => {
    console.log(props.services)
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

    .serviceViewContainer {
        height: 272px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 16px;

        .serviceOnView {


            margin: 0;

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
            }

            &.active {
                p {
                    background-color: #121214;
                    border: 4px solid #1A1B1D;
                    color: white;
                }
            }

        }
    }

    .contacts {
        display: flex;
        flex-direction: column;
        gap: 24px;

        .additionalInfo {
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

            p {
                padding-bottom: 4px;
                font-size: 14px;
            }
        }
    }
}
</style>