<template>
  <div class="flap-card-wrapper">
    <div class="flap-card-bg">
      <div
        class="flap-card"
        v-for="(item,index) in flapCardList"
        :key="index"
        :style="{zIndex:item.zIndex}"
      >
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            :style="semiCircleStyle(item,'left')"
            ref="left"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            :style="semiCircleStyle(item,'right')"
            ref="right"
          ></div>
        </div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <div class="icon-close"></div>
    </div>
  </div>
</template>
<script>
import { storeHomeMixin } from "../../utils/mixin";
import { flapCardList } from "../../utils/store";
export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      flapCardList,
    };
  },
  methods: {
    close() {
      this.setFlapCardVisible(false);
    },
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === "left" ? item.imgLeft : item.imgRight,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.flap-card-wrapper {
  @include absCenter;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  @include center;
  .flap-card-bg {
    position: relative;
    width: px2rem(128);
    height: px2rem(128);
    border-radius: px2rem(10);
    background-color: #fff;
    .flap-card {
      @include absCenter;
      width: px2rem(96);
      height: px2rem(96);
      margin: auto;
      .flap-card-circle {
        display: flex;
        width: 100%;
        height: 100%;
        .flap-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          color:red;
        }
        .flap-card-semi-circle-left {
          border-radius: px2rem(48) 0 0 px2rem(48);
        }
        .flap-card-semi-circle-right {
          border-radius: 0 px2rem(48) px2rem(48) 0;
        }
      }
    }
  }
  .close-btn-wrapper {
    position: absolute;
    bottom: 10%;
    width: 100%;
    z-index: 1100;
    @include center;
    .icon-close {
      height: px2rem(90);
      width: px2rem(90);
      border-radius: 50%;
      background-color: #333;
      color: #fff;
      @include center;
    }
  }
}
</style>