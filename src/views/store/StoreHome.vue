<template>
  <div class="store-home">
    <search-bar :ifShowSearchPage="ifShowSearchPage" :ifShowHotSearch="ifShowHotSearch" ref="searchBar"></search-bar>
    <scroll :top="188" @onScroll="onScroll">
      <div>
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
      </div>
    </scroll>
  </div>
</template>
<script>
import SearchBar from "../../components/home/SearchBar";
import Scroll from "../../components/common/Scroll";
import { storeHomeMixin } from "../../utils/mixin";
export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
  },
  data() {
    return {
      ifShowSearchPage: false,
      ifShowHotSearch: true,
    };
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
    },
  },
};
</script>
<style lang="scss">
.store-home {
  width: 100%;
  height: 100%;
}
</style>