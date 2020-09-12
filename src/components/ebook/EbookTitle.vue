<template>
  <transition name="slide-down">
      <div class="title-wrapper" v-show="menuVisible">
        <div class="left">
          <span class="icon-back icon" @click="back"></span>
        </div>
        <div class="right">
          <div class="icon-wrapper">
            <span class="icon-shelf icon"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-cart icon"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-more icon"></span>
          </div>
        </div>
      </div>
    </transition>
</template>

<script>
import {ebookMixin} from '../../utils/mixin'
export default {
  mixins:[ebookMixin],
  props: {
    ifTitleAndMenuShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    back(){
      console.log('点击了back事件');
    }
  },
}
</script>

<style lang='scss' scoped>
@import '../../assets/styles/global';
.title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 220;
    display: flex;
    width: 100%;
    height: px2rem(108);
    background: white;
    box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, .15);
    font-size: px2rem(60);
    .left {
      flex: 0 0 px2rem(60);
      @include center;
      .icon-back{
        margin-left: 5px;
      }
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .icon-wrapper {
        flex: 0 0 px2rem(60);
        @include center;
        .icon-cart {
          font-size: px2rem(60);
          margin: 0 8px;
        }
        
      }
    }
  }
</style>