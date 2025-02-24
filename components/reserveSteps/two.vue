<template>
    <div class="grid-container">
        <div v-for="(interval, index) in intervals" :key="index" class="grid-item">
            <p class="time-interval">{{ interval.start }} - {{ interval.end }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const intervals = ref([
    { start: "10:00", end: "12:00" },
    { start: "12:00", end: "14:00" },
    { start: "14:00", end: "16:00" },
    { start: "16:00", end: "18:00" },
    { start: "18:00", end: "20:00" },
    { start: "20:00", end: "22:00" },
]);
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
