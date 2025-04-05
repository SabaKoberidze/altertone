<template>
    <div class="equipments-container" v-if="false">
        <div class="equipments">
            <p class="equipments-title">აპარატურა</p>
            <div class="equipments-picker">
                <div v-for="(equipment, index) in equipments" class="equipments-picker-item" :key="equipment.name">
                    {{ equipment.name }}
                    <div class="line" v-if="index !== equipments.length - 1"></div>
                </div>
            </div>
            <div class="modalClose">
                დახურვა
                <button><img src="/images/icons/modalClose.svg" /></button>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.equipments-container {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(16px);

    .equipments {
        display: flex;
        justify-content: space-between;
        height: 124px;
        align-items: center;
        width: 100%;
        padding: 0 56px;

        .equipments-title {
            font-weight: 700;
            color: #FFF;
            font-size: 20px;
            text-shadow: 0px 0px 20px rgb(0, 0, 0);
            font-family: "SF Georgian";
            max-width: 10%;
        }

        .equipments-picker {
            display: flex;
            flex-direction: row;
            height: 52px;
            align-items: center;
            border: 1px solid rgba(255, 255, 255, 0.04);
            background: rgba(255, 255, 255, 0.04);
            border-radius: 16px;
            padding: 0 1vw;

            .equipments-picker-item {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                display: flex;
                width: max-content;
                background-color: transparent;
                cursor: pointer;
                font-size: 14px;
                font-weight: 200;
                font-family: "Neue";
                color: rgba(255, 255, 255, 0.56);

                &.active {
                    background-color: white;
                    color: rgb(0, 0, 0);
                }

                .line {
                    margin: 0 1vw;
                    width: 2px;
                    height: 50%;
                    background-color: rgba(255, 255, 255, 0.04);
                }
            }
        }

        .modalClose {
            max-width: 10%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 16px;
            color: $modalText-color;
            font-size: 16px;
            transition: 200ms;

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
            }

            &:hover {
                color: white;

                button {
                    background-color: rgba(255, 255, 255, 0.08);
                }
            }
        }
    }
}
</style>
<script setup lang="ts">
let equipments = [
    {
        name: 'კომბები',
    },
    {
        name: 'დრამები',
    },
    {
        name: 'მიკროფონები',
    },
    {
        name: 'მიქსინგ პადი',
    },
    {
        name: 'დინამიკები',
    },
]

</script>
