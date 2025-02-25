<template>
    <div class="grid-container">
        <div v-for="(interval, index) in filteredIntervals" :key="index" class="grid-item">
            <p class="time-interval">{{ interval.start }} - {{ interval.end }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
interface TimeInterval {
    start: string;
    end: string;
}
const props = defineProps<{
    intervals: TimeInterval[];
    unavailableHours: TimeInterval[]
}>();

const filteredIntervals = computed(() => {
    return props.intervals.filter(interval =>
        !props.unavailableHours.some(unavailableHour =>
            interval.start === unavailableHour.start && interval.end === unavailableHour.end
        )
    );
});

onMounted(() => {
    const isAnyUnavailableHourIncluded = props.unavailableHours.some(unavailableHour =>
        props.intervals.some(interval =>
            interval.start === unavailableHour.start && interval.end === unavailableHour.end
        )
    );
});

</script>

<style lang="scss" scoped>
p {
    font-family: "SF Georgian";
}

.grid-container {
    display: grid;
    /* Change the number of columns as needed; for example, 3 columns creates two rows */
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    justify-content: center;
    align-items: center;
    padding: 20px;
    max-width: 800px;
    margin: auto;
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

    &.picked {
        background-color: transparent;
        border: 1px solid white;
    }
}

.time-interval {
    font-size: 16px;
    font-weight: 400;
}
</style>
