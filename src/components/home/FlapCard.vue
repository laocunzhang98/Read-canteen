<template>
  <div class="flap-card-wrapper">
    <div class="flap-card-bg" :class="{'animation':runFlapCardAnimation}">
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
      <div class="point-wrapper">
        <div
          class="point"
          v-for="item in pointList"
          :key="item"
          :class="{'animation':runPointAnimation}"
        ></div>
      </div>
    </div>
    <div class="book-card"
         :class="{'animation': runBookCardAnimation}"
         v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data?data.cover:''">
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{data?data.title:''}}</div>
          <div class="content-author sub-title-medium">{{data?data.author:''}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn"
             @click.stop="showBookDetail(data)">
          {{$t('home.readNow')}}
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
import { flapCardList,categoryText  } from "../../utils/store";
export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      flapCardList,
      front: 0,
      back: 1,
      intervalTime: 25,
      runFlapCardAnimation: false,
      pointList: null,
      runPointAnimation: false,
      runBookCardAnimation: false,
    };
  },
  props: {
    data: Object
  },
  watch: {
    flapCardVisible(v) {
      if (v) {
        this.runAnimation();
      }
    },
  },
  methods: {
    close() {
      this.stopAnimation();
      this.setFlapCardVisible(false);
      console.log(this.data);
    },
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === "left" ? item.imgLeft : item.imgRight,
      };
    },

    rotate(index, type) {
      const item = this.flapCardList[index];
      let dom;
      if (type === "front") {
        dom = this.$refs.right[index];
      } else {
        dom = this.$refs.left[index];
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
      dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`;
    },

    next() {
      const frontFlapCard = this.flapCardList[this.front];
      const backFlapCard = this.flapCardList[this.back];
      frontFlapCard.rotateDegree = 0;
      backFlapCard.rotateDegree = 0;
      frontFlapCard._g = frontFlapCard.g;
      backFlapCard._g = backFlapCard.g;
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");
      this.front++;
      this.back++;
      const len = this.flapCardList.length;
      if (this.front >= len) {
        this.front = 0;
      }
      if (this.back >= len) {
        this.back = 0;
      }
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len);
      });
      this.prepare();
    },
    prepare() {
      const backFlapCard = this.flapCardList[this.back];
      backFlapCard.rotateDegree = 180;
      backFlapCard._g = backFlapCard.g - 5 * 9;
      this.rotate(this.back, "back");
    },
    reset() {
      this.front = 0;
      this.back = 1;
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index;
        item._g = item.g;
        item.rotateDegree = 0;
        this.rotate(index, "front");
        this.rotate(index, "back");
      });
      this.runBookCardAnimation = false;
      this.runFlapCardAnimation = false;
      this.runPointAnimation = false;
    },
    flapCardRotate() {
      const frontFlapCard = this.flapCardList[this.front];
      const backFlapCard = this.flapCardList[this.back];
      frontFlapCard.rotateDegree += 10;
      frontFlapCard._g -= 5;
      backFlapCard.rotateDegree -= 10;
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5;
      }
      if (
        frontFlapCard.rotateDegree === 90 &&
        backFlapCard.rotateDegree === 90
      ) {
        backFlapCard.zIndex += 2;
      }
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");
      if (
        frontFlapCard.rotateDegree === 180 &&
        backFlapCard.rotateDegree === 0
      ) {
        this.next();
      }
    },
    startFlapCardAnimation() {
      this.prepare();
      this.task = setInterval(() => {
        this.flapCardRotate();
      }, this.intervalTime);
    },
    startPointAnimation() {
      this.runPointAnimation = true;
      setTimeout(() => {
        this.runPointAnimation = false;
      }, 750);
    },
    stopAnimation() {
      if (this.task) {
        clearInterval(this.task);
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      if (this.timeout2) {
        clearTimeout(this.timeout2);
      }
      this.reset();
    },
    runAnimation() {
      this.runFlapCardAnimation = true;
      this.timeout = setTimeout(() => {
        this.startFlapCardAnimation();
        this.startPointAnimation();
      }, 300);
      this.timeout2 = setTimeout(() => {
        this.stopAnimation();
        this.runBookCardAnimation = true;
      }, 2500);
    },
    categoryText() {
      if (this.data) {
        return categoryText(this.data.category, this);
      } else {
        return "";
      }
    },
  },
  created() {
    this.pointList = [];
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
@import "../../assets/styles/flapCard.scss";
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
    &.animation {
      animation: flap-card-move 0.3s ease-in;
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
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
          color: red;
          background-repeat: no-repeat;
          backface-visibility: hidden;
          @include center;
        }
        .flap-card-semi-circle-left {
          border-radius: px2rem(48) 0 0 px2rem(48);
          background-position: right;
          transform-origin: right;
        }
        .flap-card-semi-circle-right {
          border-radius: 0 px2rem(48) px2rem(48) 0;
          background-position: left;
          transform-origin: left;
        }
      }
    }
    .point-wrapper {
      z-index: 1500;
      @include absCenter;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
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