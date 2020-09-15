<template>
  <div class="store-home">
    <search-bar
      :ifShowSearchPage="ifShowSearchPage"
      :ifShowHotSearch="ifShowHotSearch"
      :bookListOffsetY="bookListOffsetY"
      @back="onBack"
      ref="searchBar"
    ></search-bar>
    <scroll :top="188" @onScroll="onScroll" ref="scroll">
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
      <div>111111</div>
    </scroll>
    <flap-card v-show="flapCardVisible"></flap-card>
  </div>
</template>
<script>
import SearchBar from "../../components/home/SearchBar";
import Scroll from "../../components/common/Scroll";
import FlapCard from "../../components/home/FlapCard"
import { storeHomeMixin } from "../../utils/mixin";
export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard
  },
  data() {
    return {
      ifShowSearchPage: false,
      ifShowHotSearch: true,
      bookListOffsetY: 0,
      scrollTop: 188,
    };
  },
  methods: {
    onBack() {
      this.isBack = true;
    },
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
      if (offsetY > 0) {
        this.scrollTop = 104
      } else {
        this.scrollTop = 188
      }
      this.$refs.scroll.refresh()
    }
  },
};
</script>
<style lang="scss">
.store-home {
  width: 100%;
  height: 100%;
}
</style>