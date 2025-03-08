<template>
    <div class="rowContainer" :class="{ extraFeatureAdded: reserveStore.selectedData.feature }">
        <div class="basicFeatures">
            <div class="row">
                <img src="/images/icons/Calendar.svg" />
                <div class="info">
                    <p class="mainText">{{ reserveStore.selectedData.date }} {{ reserveStore.selectedData.month }}</p>
                    <p class="subText">{{ reserveStore.selectedData.weekday }}</p>
                </div>
                <img src="/images/icons/Edit.svg" />
            </div>
            <div class="row">
                <img src="/images/icons/Clock.svg" />
                <div>
                    <p class="mainText">{{ mergedTimeRanges }}</p>
                    <p class="subText">{{ totalDurationHours }} საათი - {{ computedPrice }} GEL</p>
                </div>
                <img src="/images/icons/Edit.svg" />
            </div>
        </div>
        <div class="extraFeature" @click="toggleExtraFeature()">
            <div class="row">
                <img src="/images/icons/Desktop.svg" />
                <div>
                    <p class="mainText">IEM მონიტორები</p>
                    <p class="subText">{{ totalDurationHours }} საათი - {{ computedFeaturePrice }} GEL</p>
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

const weekdayNames: { [key: string]: string } = {
    "Monday": "ორშაბათი",
    "Tuesday": "სამშაბათი",
    "Wednesday": "ოთხშაბათი",
    "Thursday": "ხუთშაბათი",
    "Friday": "პარასკევი",
    "Saturday": "შაბათი",
    "Sunday": "კვირა"
};

const mergedTimeRanges = computed(() => {
    const times = reserveStore.selectedData.time || []

    if (!times.length) return ''

    times.sort((a, b) => a.start.localeCompare(b.start))

    const mergedRanges: { start: string, end: string }[] = []

    for (const range of times) {
        const lastRange = mergedRanges[mergedRanges.length - 1]

        if (lastRange && lastRange.end === range.start) {
            lastRange.end = range.end
        } else {
            mergedRanges.push({ ...range })
        }
    }
    return mergedRanges.map(({ start, end }) => `${start} - ${end}`).join(', ')
})

const totalDurationHours = computed(() => {
    const times = reserveStore.selectedData.time || []

    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }

    const totalMinutes = times.reduce((acc, { start, end }) => {
        return acc + (timeToMinutes(end) - timeToMinutes(start))
    }, 0)

    let hours = totalMinutes / 60
    reserveStore.price = hours * reserveStore.singleHourPrice
    reserveStore.duration = hours
    return hours
})

const computedPrice = computed(() => {
    return reserveStore.price
})
const computedFeaturePrice = computed(() => {
    return reserveStore.singleHourFeaturePrice * totalDurationHours.value
})
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