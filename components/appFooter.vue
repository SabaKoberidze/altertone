<template>
  <section>
    <div class="contactsInfo">
      <div class="contactsHeader">
        <h1>დაგვიკავშირდით</h1>
        <p>სამუშაო საათები: 10:00 - 22:00</p>
      </div>
      <div class="contactOptions">
        <div class="contactOption" v-for="option in contactOptions" :key="option.text">
          <img :src="option.icon" alt="contact icon">
          <div class="contactOptionText">
            <div class="contactOptionTextHeader">
              <p>{{ option.text }}</p>
              <p>{{ option.subText }}</p>
            </div>
            <p>{{ option.link }}</p>
          </div>
        </div>

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
        <p>Developed By <span><img src="/images/terraTech.svg" /><strong>Terra Tech</strong></span></p>
      </div>
    </footer>
  </section>
</template>

<script lang="ts" setup>
const contactOptions = [
  {
    icon: '/images/icons/phone.svg',
    text: 'მოგვწერეთ',
    subText: 'Speak to our friendly team',
    link: 'contact@altertone.ge'
  },
  {
    icon: '/images/icons/phone.svg',
    text: 'გვესტუმრეთ',
    subText: '27 მარშალ გელოვანი, თბილისი, საქართველო',
    link: 'გუგლის რუკაზე ნახვა'
  },
  {
    icon: '/images/icons/phone.svg',
    text: 'დაგვიკავშირდით',
    subText: 'Speak to our friendly team',
    link: '+995 555 22 21 43'
  }
]

</script>

<style lang="scss" scoped>
section {
  width: 100%;
  height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 56px;
  overflow: hidden;

  @include respond-to('tablet') {
    padding: 0 20px;
  }

  .contactsInfo {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    gap: 40px;
    align-items: center;

    @include respond-to('tablet') {
      gap: 0;
    }

    .contactsHeader {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      justify-content: center;

      @include respond-to('tablet') {
        align-items: start;
        width: 100%;
        margin-top: 20%;
      }

      h1 {
        font-size: 44px;
        font-weight: 700;

        @include respond-to('tablet') {
          font-size: 32px;
        }
      }

      p {
        font-size: 18px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.56);
        text-shadow: 0px 0px 80px rgba(0, 0, 0, 0.50);

        @include respond-to('tablet') {
          font-size: 16px;
        }
      }
    }

    .contactOptions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 40px;
      width: 100%;

      @include respond-to('tablet') {
        flex-direction: column;
        align-items: start;
        gap: 0;
        justify-content: space-evenly;
        height: 100%;
      }

      .contactOption {
        display: flex;
        align-items: start;
        flex-direction: column;
        justify-content: space-between;
        justify-content: space-between;
        padding: 40px;
        padding-bottom: 60px;
        height: 328px;
        background-color: #0A0A0A;
        border-radius: 16px;
        width: 416px;

        @include respond-to('tablet') {
          width: 100%;
          height: 15vh;
          padding: 0 5%;
          flex-direction: row;
          justify-content: start;
          align-items: center;
          gap: 5%;
        }

        img {
          background-color: #141414;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 22px;
          width: 60px;
          height: 60px;
        }

        .contactOptionText {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 55%;

          @include respond-to('tablet') {
            height: 100%;
            padding: 20px;
          }

          .contactOptionTextHeader {
            display: flex;
            flex-direction: column;
            gap: 12px;

            p:nth-child(1) {
              font-feature-settings: 'case';
              font-size: 20px;
              font-weight: 700;
              color: rgba(255, 255, 255, 1);

              @include respond-to('tablet') {
                font-size: 20px;
              }
            }

            p:nth-child(2) {
              font-size: 16px;
              font-weight: 400;
              color: rgba(255, 255, 255, 0.68);

              @include respond-to('tablet') {
                font-size: 12px;
              }
            }

          }

          &>p {
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            text-decoration: underline;
          }
        }
      }
    }
  }

  footer {
    height: 100px;
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
      top: -8px;

      .line {
        height: 1px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.26);
      }
    }

    .mainContent {
      display: flex;
      height: 87px;

      .logoContainer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 17px;

        img {
          width: 44px;
          height: 44px;

          @include respond-to('tablet') {
            width: 30px;
            height: 30px;
          }
        }

        p {
          font-family: 'Orbitron';
          font-weight: 700;
          font-size: 18px;

          @include respond-to('tablet') {
            font-size: 12px;
          }
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

          @include respond-to('tablet') {
            display: none;
          }
        }

        &>div {
          display: flex;
          gap: 8px;

          @include respond-to('tablet') {
            gap: 16px;
          }

          img {
            cursor: pointer;
            width: 64px;
            height: 48px;
            padding: 12px;
            background-color: rgba(255, 255, 255, 0.04);
            border-radius: 12px;
            transition: 200ms;

            @include respond-to('tablet') {
              width: 35px;
              height: 35px;
              padding: 5px;
            }

            &:hover {
              background-color: rgba(255, 255, 255, 0.12);
            }
          }
        }
      }
    }

    .additionalInfo {
      height: 80px;

      @include respond-to('tablet') {
        width: 100%;
      }

      p {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.59);
        font-weight: 400;
        display: flex;
        align-items: center;
        gap: 10px;

        @include respond-to('tablet') {
          width: 50%;
          font-size: 10px;
          display: flex;
          justify-content: space-between;
        }

        span {
          padding: 9px 14px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background-color: rgba(255, 255, 255, 0.04);
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          font-weight: 700;

          @include respond-to('tablet') {
            font-size: 12px;
            padding: 9px 10px;
            width: 100px;
            justify-content: center;
          }

          strong {
            font-family: 'Rubik';
            color: unset;
          }
        }
      }

    }
  }
}
</style>