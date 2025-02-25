<template>
    <div class="grid-container">
        <div v-for="(date, index) in dates" :key="index" class="grid-item">
            <p class="month">{{ date.month }}</p>
            <p class="day-number">{{ date.day }}</p>
            <p class="weekday">{{ date.weekday }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
const reservations = ref<any[]>([])
interface TimeInterval {
    start: string;
    end: string;
}


const props = defineProps<{
    intervals: TimeInterval[];
}>();



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


        dates.push({
            month: monthNames[month].slice(0, 3) || month,
            day: futureDate.getDate(),
            weekday: weekdayNames[weekday].slice(0, 3) || weekday
        });
    }

    return dates;
};

const dates = ref(getNextDates(14));
const getDay = (date: string) => {
    return date.split('-')[2]
}

const formatHours = (hours: any[]) => {
    if (!hours || !hours.length) {
        return [
            { start: "10:00", end: "12:00" },
            { start: "12:00", end: "14:00" },
            { start: "14:00", end: "16:00" },
            { start: "16:00", end: "18:00" },
            { start: "18:00", end: "20:00" },
            { start: "20:00", end: "22:00" },
        ];
    }

    const formatted = [];
    for (let i = 0; i < hours.length - 1; i += 2) {
        formatted.push({
            start: hours[i],
            end: hours[i + 1]
        });
    }
    return formatted;
};

const getReservedDates = (reseveds: any[]) => {
    reservations.value = [...reseveds]
    reservations.value.forEach((reservation) => {
        console.log(getDay(reservation.day))
        console.log(formatHours(reservation.reserved))

    })
}

onMounted(() => {
    console.log(props.intervals)
})
defineExpose({
    getReservedDates
})
</script>

<style lang="scss" scoped>
p {
    font-family: "SF Georgian";
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
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
    display: flex;
    width: 104px;
    height: 117px;
    padding: 18px 12px;
    gap: 12px;
    align-items: center;
    border-radius: 12px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: 200ms;

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