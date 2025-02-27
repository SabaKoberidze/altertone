<template>
  <section>
    <div class="contactsInfo">
      <div class="contactsHeader">
        <h1>დაგვიკავშირდით</h1>
        <p>სამუშაო საათები: 10:00 - 22:00</p>

      </div>
    </div>
    <footer>
      <div class=" graphics">
        <img src="/images/icons/plusIcon.svg" />
        <div class="line"></div>
        <img src="/images/icons/plusIcon.svg" />
        <div class="line"></div>
        <img src="/images/icons/plusIcon.svg" />
      </div>
      <div class="mainContent">
        <div class="logoContainer">
          <img src="/images/Logo.svg">
          <p>Altertone</p>
        </div>
        <div class="contactsContainer">
          <p>გამოგვყევით:</p>
          <div class="socialMedia">
            <img src="/images/socialMedia/facebook.svg" />
            <img src="/images/socialMedia/instagram.svg" />
            <img src="/images/socialMedia/tiktok.svg" />
          </div>
        </div>
      </div>
      <div class="additionalInfo">
        <p>© Copyright 2023 Happy Bat LLC.</p>
        <p>Developed By <strong>Terratech</strong></p>
      </div>
    </footer>
  </section>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
section {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 56px;

  .contactsInfo {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-items: center;

    .contactsHeader {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      justify-content: center;

      h1 {
        font-size: 44px;
        font-weight: 700
      }

      p {
        font-size: 18px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.56);
        text-shadow: 0px 0px 80px rgba(0, 0, 0, 0.50);
      }
    }
  }

  footer {
    height: 160px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;

    &>div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .graphics {
      gap: 10px;
      position: absolute;
      top: -1px;

      .line {
        height: 1px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.26);
      }
    }

    .mainContent {
      display: flex;
      height: 100px;

      .logoContainer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 17px;

        img {
          width: 44px;
          height: 44px;
        }

        p {
          font-family: 'Orbitron';
          font-weight: 700;
          font-size: 18px;
        }
      }

      .contactsContainer {
        display: flex;
        justify-content: center;
        align-content: center;
        gap: 8px;


        &>p {
          display: flex;
          align-items: center;
        }

        &>div {
          display: flex;
          gap: 8px;

          img {
            cursor: pointer;
            width: 64px;
            height: 48px;
            padding: 12px;
            background-color: rgba(255, 255, 255, 0.04);
            border-radius: 12px;
            transition: 200ms;

            &:hover {
              background-color: rgba(255, 255, 255, 0.12);
            }
          }
        }
      }
    }

    .additionalInfo {
      height: 60px;

      p {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.59);
        font-weight: 500;

        strong {
          color: unset;
        }
      }

    }
  }
}
</style>