<template>
  <div>
    <div class="search-bar" :class="{'hide-title':!titleVisible,'hide-shadow':!shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title':!titleVisible}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title':!titleVisible}">
        <div class="search-bar-blank"
             :class="{'hide-title':!titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input type="text"
                 class="input"
                 :placeholder="$t('home.hint')"
                 v-model="searchText"
                 @click="showHotSearch"
                 @keyup.13.exact="search">
        </div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin'
import HotSearchList from './HotSearchList'

export default {
  name: 'SearchBar',
  components: { HotSearchList },
  mixins: [storeHomeMixin],
  data () {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  watch: {
    offsetY (offsetY) {
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hotSearchOffsetY (offsetY) {
      if (offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    search () {
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    showFlapCard () {
      this.setFlapCardVisible(true)
    },
    back () {
      if (this.offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      if (this.hotSearchVisible) {
        this.hideHotSearch()
      } else {
        this.$router.push('/store/shelf')
      }
    },
    hideHotSearch () {
      this.hotSearchVisible = false
      if (this.offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    showHotSearch () {
      this.hideTitle()
      this.hideShadow()
      this.hotSearchVisible = true
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
    },
    hideTitle () {
      this.titleVisible = false
    },
    showTitle () {
      this.titleVisible = true
    },
    hideShadow () {
      this.shadowVisible = false
    },
    showShadow () {
      this.shadowVisible = true
    }
  }
}
</script>

<style lang="scss"  scoped>
  @import "../../assets/styles/global";
  .search-bar {
    position: relative;
    z-index: 150;
    width: 100%;
    height: px2rem(188);
    box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, .1);

    &.hide-title {
      height: px2rem(84);
    }

    &.hide-shadow {
      box-shadow: none;
    }

    .search-bar-title-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(84);

      .title-text-wrapper {
        width: 100%;
        height: px2rem(84);
        @include center
      }

      .title-icon-shake-wrapper {
        position: absolute;
        right: px2rem(30);
        top: 0;
        height: px2rem(84);
      }
    }

    .title-icon-back-wrapper {
      position: absolute;
      left: px2rem(30);
      top: 0;
      z-index: 200;
      height: px2rem(84);
      transition: height $animationTime $animationType;
      @include center;

      &.hide-title {
        height: px2rem(84);
      }
    }

    .search-bar-input-wrapper {
      position: absolute;
      left: 0;
      top: px2rem(84);
      display: flex;
      width: 100%;
      height: px2rem(84);
      padding: px2rem(10);
      box-sizing: border-box;
      transition: top $animationTime $animationType;

      &.hide-title {
        top: 0;
      }

      .search-bar-blank {
        flex: 0 0 0;
        width: 0;
        transition: all $animationTime $animationType;

        &.hide-title {
          flex: 0 0 px2rem(62);
          width: px2rem(62);
        }
      }

      .search-bar-input {
        flex: 1;
        width: 100%;
        background: #f4f4f4;
        border-radius: px2rem(40);
        padding: px2rem(10) px2rem(30);
        box-sizing: border-box;
        border: px2rem(2) solid #eee;
        @include left;

        .icon-search {
          color: #999;
        }

        .input {
          width: 100%;
          height: px2rem(44);
          border: none;
          background: transparent;
          margin-left: px2rem(20);
          font-size: px2rem(24);
          color: #666;

          &:focus {
            outline: none;
          }

          &::-webkit-input-placeholder {
            color: #ccc;
          }
        }
      }
    }
  }
</style>
