<template>
    <div class="rowContainer">
        <div class="username inputField">
            <p>სახელი</p>
            <div>
                <img src="/images/icons/Person.svg" />
                <input placeholder="შეიყვანეთ სახელი" />
            </div>
        </div>
        <div class="email inputField">
            <p>ელ-ფოსტა</p>
            <div>
                <img src="/images/icons/Mail.svg" />
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
    padding: 20px 28px;
    width: 448px;
    height: 254px;
    font-size: 14px;
    gap: 16px;
    border: 2px solid rgba(255, 255, 255, 0.10);
    border-radius: 12px;

    .inputField {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        p {
            font-size: 12px;
        }

        &>div {
            padding: 0 10px;
            border-radius: 12px;
            border: 2px solid rgba(255, 255, 255, 0.04);
            background-color: #121214;
            width: 100%;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2px;



            input {
                padding: 8px;
                border: 0;
                outline: none;
                background-color: transparent;
                font-family: 'Neune';
                font-weight: 400;
                height: 100%;
                width: 100%;
                font-size: 16px;
            }
        }

    }

    .username,
    .email {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        height: 50%;
        gap: 12px;

        p {
            font-size: 14px;
        }

        &>div {
            display: flex;
            width: 100%;
        }
    }

}
</style>