<template>
    <div class="rowContainer" :class="{ extraFeatureAdded: reserveStore.selectedData.feature }">
        <div class="basicFeatures">
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
        </div>
        <div class="extraFeature" @click="toggleExtraFeature()">
            <div class="row">
                <img src="/images/icons/Desktop.svg" />
                <div>
                    <p class="mainText">IEM მონიტორები</p>
                    <p class="subText">4 საათ - 40 GEL</p>
                </div>
                <img class="featureToggle"
                    :src="`/images/icons/${reserveStore.selectedData.feature ? 'Delete.svg' : 'Add.svg'}`" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const reserveStore = ReserveStore()
const toggleExtraFeature = () => {
    reserveStore.selectedData.feature = !reserveStore.selectedData.feature
}
</script>

<style lang="scss" scoped>
.rowContainer {
    display: flex;
    flex-direction: column;
    width: 448px;
    min-height: 210px;
    gap: 10px;
    font-size: 14px;
    transition: 200ms;
    border-radius: 12px;
    outline: 0px solid rgba(255, 255, 255, 0);
    transition: 200ms;

    .basicFeatures,
    .extraFeature {
        padding: 20px 16px;
        border-radius: 12px;
        outline: 2px solid rgba(255, 255, 255, 0.10);
        background-color: rgba(255, 255, 255, 0.04);
        display: flex;
        gap: 16px;
        flex-direction: column;
        transition: 200ms;
    }

    .row {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        height: 46px;

        img {
            width: 36px;
            height: 36px;
            padding: 6px;
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

    .extraFeature {
        background-color: rgba(0, 0, 0, 0);
        outline: 1px solid rgba(255, 255, 255, 0.10);
        cursor: pointer;

        .featureToggle {
            border-radius: 12px;
            width: 36px;
            height: 36px;
            background-color: rgba(255, 255, 255, 0.04);
            padding: 10px;
        }
    }

    &.extraFeatureAdded {
        outline: 2px solid rgba(255, 255, 255, 0.10);
        background-color: rgba(255, 255, 255, 0.04);

        gap: 0px;

        .basicFeatures,
        .extraFeature {
            background-color: rgba(0, 0, 0, 0);
            outline: 2px solid rgba(0, 0, 0, 0)
        }

        .basicFeatures {
            padding-bottom: 16px;
        }

        .extraFeature {
            padding-top: 0;

            .featureToggle {
                padding: 6px;
            }
        }
    }


}
</style>