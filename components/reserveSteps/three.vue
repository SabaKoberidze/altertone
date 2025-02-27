<template>
    <div class="rowContainer">
        <div class="row">
            <img src="/images/icons/Calendar.svg" />
            <div class="info">
                <p class="mainText">13 სექტემბერი</p>
                <p class="subText">კვირა</p>
            </div>
            <img src="/images/icons/Edit.svg" />
        </div>
        <div class="row">
            <img src="/images/icons/Clock.svg" />
            <div>
                <p class="mainText">12:00 - 14:00, 16:00 - 18:00</p>
                <p class="subText">4 საათ - 120 GEL</p>
            </div>
            <img src="/images/icons/Edit.svg" />
        </div>
        <div class="row">
            <img src="/images/icons/Desktop.svg" />
            <div>
                <p class="mainText">IEM მონიტორები</p>
                <p class="subText">4 საათ - 40 GEL</p>
            </div>
            <img src="/images/icons/Delete.svg" />
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.rowContainer {
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
    width: 448px;
    height: 210px;
    font-size: 14px;
    gap: 16px;
    background-color: rgba(255, 255, 255, 0.04);
    border: 2px solid rgba(255, 255, 255, 0.10);
    border-radius: 12px;

    .row {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        height: 46px;

        img {
            width: 46px;
            height: 46px;
            padding: 10px;
        }

        &>div {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: start;
            flex-direction: column;
            gap: 8px;

            P {
                font-family: 'SF Georgian', sans-serif;
            }

            .mainText {
                font-weight: 700;
            }

            .subText {
                color: rgba(255, 255, 255, 0.56);
                font-weight: 200;
            }
        }
    }
}
</style>