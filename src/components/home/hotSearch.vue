<template>
  <div>
    <div class="hot-search-title">
      <span class="label">{{label}}</span>
      <span class="btn">{{btn}}</span>
    </div>
    <div class="hot-search-list">
      <div class="hot-search-item" v-for="(item, index) in hotSearch" :key="index">
        <div class="icon-wrapper">
          <span class="icon-book icon" v-if="item.type === 1"></span>
          <span class="icon-search icon" v-if="item.type === 2"></span>
        </div>
        <div class="hot-search-text-wrapper">
          <div class="text" ref="searchText">{{item.text}}</div>
          <div class="num" v-if="item.num">{{item.num}}人搜索</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { realPx } from '../../utils/utils'

export default {
  props: {
    label: String,
    btn: String,
    hotSearch: Array
  },
  mounted () {
    this.$refs.searchText.forEach(item => {
      item.style.width = window.innerWidth - realPx(20) - realPx(40) + 'px'
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .hot-search-title {
    display: flex;
    width: 100%;
    font-size: px2rem(26);
    padding: px2rem(20);
    box-sizing: border-box;

    .label {
      flex: 1;
      text-align: left;
      font-weight: bold;
      color: #666;
    }

    .btn {
      flex: 1;
      text-align: right;
      font-weight: bold;
      color: #409EFF;
    }
  }

  .hot-search-list {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;

    .hot-search-item {
      padding: px2rem(20) 0;
      display: flex;

      .icon-wrapper {
        flex: 0 0 px2rem(80);
        @include center;

        .icon-book {
          font-size: px2rem(32);
        }

        .icon-search {
          font-size: px2rem(32);
        }
      }

      .hot-search-text-wrapper {
        flex: 1;
        height: px2rem(70);
        @include columnLeft;

        .text {
          flex: 1;
          height: 100%;
          font-size: px2rem(28);
          font-weight: bold;
          color: #666;
          @include ellipsis;
          @include left;
        }

        .num {
          font-size: px2rem(24);
          color: #999;
          margin-top: px2rem(10);
        }
      }
    }
  }
</style>
