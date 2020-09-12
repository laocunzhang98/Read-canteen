<template>
  <div class="ebook-slide-bookmark">
    <div class="slide-bookmark-title">{{$t('book.bookmark')}} · {{bookmark ? bookmark.length : 0}}</div>
    <scroll class="slide-bookmark-list" :top="48" :bottom="48">
      <div class="slide-bookmark-item" v-for="(item, index) in bookmark" :key="index" @click="displayNavigation(item.cfi)">
        <div class="slide-bookmark-item-icon">
          <div class="icon-bookmark"></div>
        </div>
        <div class="slide-bookmark-item-text">{{item.text}}</div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../common/Scroll'
  import { getBookmark } from '../../utils/localStorage'
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin],
    components: {
      Scroll
    },
    data() {
      return {
        bookmark: null
      }
    },
    mounted() {
      this.bookmark = getBookmark(this.fileName)
    },
    methods:{
      displayNavigation(target){
        this.display(target,()=>{
          this.hideTitleAndMenu()
        })
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-slide-bookmark {
    width: 100%;
    .slide-bookmark-title {
      width: 100%;
      height: px2rem(96);
      font-size: px2rem(28);
      font-weight: bold;
      padding: 0 px2rem(30);
      box-sizing: border-box;
      @include left;
    }
    .slide-bookmark-list {
      padding: 0 px2rem(30);
      box-sizing: border-box;
      .slide-bookmark-item {
        display: flex;
        padding: px2rem(30) 0;
        box-sizing: border-box;
        .slide-bookmark-item-icon {
          flex: 0 0 px2rem(60);
          @include left;
          .icon-bookmark {
            width: px2rem(40);
            height: px2rem(40);
            font-size: px2rem(24);
            border-radius: 50%;
            background: #bbb;
            @include center;
          }
        }
        .slide-bookmark-item-text {
          font-size: px2rem(28);
          line-height: px2rem(30);
          max-height: px2rem(90);
          @include ellipsis2(6);
        }
      }
    }
  }
</style>
