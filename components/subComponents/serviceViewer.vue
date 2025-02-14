<template>
    <div class="service-viewer">
        <h1>სერვისები</h1>
        <div class="contacts">
            <p>დამატებითი ინფორმაციისთვის</p>
            <button type="button" class="contactButton">
                <img src="/images/icons/phone.svg" />
                <p>
                    დაგვიკავშირდით
                </p>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
.service-viewer {
    position: sticky;
    top: 0;
    padding: 120px 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 48px;
    height: 756px;
    width: 443px;

    h1 {
        font-feature-settings: 'case';
    }

    .contacts {
        display: flex;
        flex-direction: column;
        gap: 24px;

        .additionalInfo {
            font-size: 18px;
        }

        .contactButton {
            cursor: pointer;
            width: 181px;
            height: 44px;
            border-radius: 12px;
            background-color: rgba(255, 255, 255, 0.04);
            border: 0;
            display: flex;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;

            p {
                padding-bottom: 4px;
                font-size: 14px;
            }
        }
    }
}
</style>