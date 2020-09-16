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
    <flap-card v-show="flapCardVisible" :data="random"></flap-card>
  </div>
</template>
<script>
import SearchBar from "../../components/home/SearchBar";
import Scroll from "../../components/common/Scroll";
import FlapCard from "../../components/home/FlapCard"
import { storeHomeMixin } from "../../utils/mixin";
import {home} from "../../api/store"
export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard
  },
  mounted(){
    home().then(response=>{
      if(response && response.status==200){
        const data = response.data
        console.log(data.random.length);
        const randomIndex = Math.floor(Math.random()*data.random.length)
        this.random = data.random[randomIndex]
      }
    })
  },
  data() {
    return {
      ifShowSearchPage: false,
      ifShowHotSearch: true,
      bookListOffsetY: 0,
      scrollTop: 188,
      random:null
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