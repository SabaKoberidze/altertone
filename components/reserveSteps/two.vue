<template>
    <div class="grid-container">
        <div v-for="(interval, index) in filteredIntervals" :key="index" class="grid-item" @click="pickItem(interval)"
            :class="{ picked: isPicked(interval) }">
            <p class="time-interval">{{ interval.start }} - {{ interval.end }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
const reserveStore = ReserveStore()
interface TimeInterval {
    start: string;
    end: string;
}

const pickItem = (interval: TimeInterval) => {
    const index = reserveStore.selectedData.time.findIndex(item => item.start === interval.start && item.end === interval.end);
    if (index === -1) {
        reserveStore.selectedData.time.push({ start: interval.start, end: interval.end })
    } else {
        reserveStore.selectedData.time.splice(index, 1);
    }
};

const isPicked = (interval: TimeInterval) => {
    return reserveStore.selectedData.time.some(item => item.start === interval.start && item.end === interval.end);
}

const props = defineProps<{
    intervals: TimeInterval[];
    unavailableHours: TimeInterval[];
}>();

const filteredIntervals = computed(() => {
    return props.intervals.filter(interval =>
        !props.unavailableHours.some(unavailableHour =>
            interval.start === unavailableHour.start && interval.end === unavailableHour.end
        )
    );
});
</script>

<style lang="scss" scoped>
.grid-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    padding: 20px;
    max-width: 550px;
    margin: auto;
    @include respond-to('tablet') {
        height: calc(100vh - 290px);
        overflow-y: auto;
        width: 80%;
    }
}

.grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.04);
    width: 146px;
    padding: 18px 12px;
    gap: 12px;
    border-radius: 16px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: 200ms;
    border: 1px solid rgba(255, 255, 255, 0);

    &.picked {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid white;
    }
}



.time-interval {
    font-size: 16px;
    font-weight: 400;
}
</style>
