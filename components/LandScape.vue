<template>
    <div class="landscape">
        Turn your device to Portrait mode
    </div>
</template>

<style scoped>
.landscape {
    position: fixed;
    width: 100vw;
    height: 100svh;
    z-index: -1;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    background: black;
    align-items: center;
    font-size: 24px;
    font-weight: 700;
    color: white;
    font-feature-settings: 'case';
    display: none;
    pointer-events: none;
    z-index: 100;

    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.5;
        background: radial-gradient(92.22% 89.66% at 0% 100%, rgba(46, 12, 24, 0.70) 0%, rgba(46, 12, 24, 0.00) 100%), rgba(255, 255, 255, 0.04);
    }
}

@media (orientation: landscape) {
    .landscape {
        display: flex;
    }
}
</style>
