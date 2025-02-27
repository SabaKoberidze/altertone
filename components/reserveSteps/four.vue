<template>
    <div class="rowContainer">
        <div class="username">
            <p>სახელი</p>
            <div>
                <img />
                <input placeholder="შეიყვანეთ სახელი" />
            </div>
        </div>
        <div class="email">
            <p>ელ ფოსტა</p>
            <div>
                <img />
                <input placeholder="შეიყვანეთ ელ-ფოსტა" />
            </div>
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
    border: 2px solid rgba(255, 255, 255, 0.10);
    border-radius: 12px;

    .username,
    .email {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        height: 50%;
        gap: 8px;

        &>div {
            display: flex;
            width: 100%;
        }
    }

}
</style>