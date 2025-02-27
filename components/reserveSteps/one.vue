<template>
    <div class="grid-container">
        <template v-for="(row, rowIndex) in groupedDates" :key="rowIndex">
            <div class="grid-row">
                <template v-for="(date, index) in row" :key="index">
                    <div v-if="!unavailableDays.some(unavailable => unavailable.day === date.day && unavailable.month === date.monthNum)"
                        class="grid-item" v-on:click="pickDay(date.day)" :class="{ picked: date.day === pickedDay }">
                        <p class="month">{{ date.month }}</p>
                        <p class="day-number">{{ date.day }}</p>
                        <p class="weekday">{{ date.weekday }}</p>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    unavailableDays: { day: number, month: number }[];
}>();
const emit = defineEmits(['dayPicked'])
const pickedDay = ref<number>(-1)
const monthNames: { [key: string]: string } = {
    "January": "იანვარი",
    "February": "თებერვალი",
    "March": "მარტი",
    "April": "აპრილი",
    "May": "მაისი",
    "June": "ივნისი",
    "July": "ივლისი",
    "August": "აგვისტო",
    "September": "სექტემბერი",
    "October": "ოქტომბერი",
    "November": "ნოემბერი",
    "December": "დეკემბერი"
};

const weekdayNames: { [key: string]: string } = {
    "Monday": "ორშაბათი",
    "Tuesday": "სამშაბათი",
    "Wednesday": "ოთხშაბათი",
    "Thursday": "ხუთშაბათი",
    "Friday": "პარასკევი",
    "Saturday": "შაბათი",
    "Sunday": "კვირა"
};

const getNextDates = (count: number) => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= count; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + i);

        const month = futureDate.toLocaleString("en-US", { month: "long" });
        const weekday = futureDate.toLocaleString("en-US", { weekday: "long" });
        const monthNum = futureDate.getMonth() + 1;
        dates.push({
            monthNum: monthNum,
            month: monthNames[month].slice(0, 3) || month,
            day: futureDate.getDate(),
            weekday: weekdayNames[weekday].slice(0, 3) || weekday
        });
    }

    return dates;
};

const pickDay = (day: number) => {
    pickedDay.value = day
    emit('dayPicked', day)
}

const dates = ref(getNextDates(14));

const availableDates = computed(() =>
    dates.value.filter(
        (date) =>
            !props.unavailableDays.some(
                (unavailable) =>
                    unavailable.day === date.day && unavailable.month === date.monthNum
            )
    )
);


const groupedDates = computed(() => {
    if (availableDates.value.length === 0) return [];
    const rows: typeof availableDates.value[] = [];
    let index = 0;
    const maxColumns = 7;
    while (index < availableDates.value.length) {
        const remaining = availableDates.value.length - index;
        const rowSize = Math.min(remaining, maxColumns);
        rows.push(availableDates.value.slice(index, index + rowSize));
        index += rowSize;
    }
    return rows;
});
onMounted(() => {
})
</script>

<style lang="scss" scoped>
.grid-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    max-width: 800px;
    margin: auto;
}

.grid-row {
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 16px;
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: 0;
    }
}

.grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.04);
    width: 104px;
    height: 117px;
    padding: 18px 12px;
    gap: 12px;
    border-radius: 12px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: 200ms;
    border: 1px solid rgba(255, 255, 255, 0);

    &.picked {
        background-color: transparent;
        border: 1px solid white;
    }
}

.month {
    font-weight: bold;
    font-size: 12px;
    font-weight: 400;
}

.day-number {
    font-size: 24px;
    font-weight: bold;
}

.weekday {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.56);
    font-weight: 400;
}
</style>
