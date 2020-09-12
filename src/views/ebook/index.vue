<template>
  <div class="ebook" ref="ebookView">
    <ebook-header></ebook-header>
    <ebook-bookmark></ebook-bookmark>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-footer></ebook-footer>
  </div>
</template>
<script>
import EbookReader from "../../components/ebook/EbookReader";
import EbookTitle from "../../components/ebook/EbookTitle";
import EbookMenu from "../../components/ebook/EbookMenu";
import EbookBookmark from "../../components/ebook/EbookBookmark";
import EbookHeader from "../../components/ebook/EbookHeader";
import EbookFooter from "../../components/ebook/EbookFooter";
import { getReadTime, saveReadTime } from "../../utils/localStorage";
import { ebookMixin } from "../../utils/mixin";
export default {
  name: "ebook",
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  watch: {
    offsetY(v) {
      if (this.isPaginating === true && !this.menuVisible) {
        if (v === 0) {
          this.restore();
        } else if (v > 0) {
          this.move(v);
        }
      }
    },
  },
  mixins: [ebookMixin],
  mounted() {
    this.startLoopReadTime();
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
    }
  },
  methods: {
    restore() {
      this.$refs.ebookView.style.top = 0;
      this.$refs.ebookView.style.transition = "all .2s linear";
      setTimeout(() => {
        this.$refs.ebookView.style.transition = "";
      }, 200);
    },
    move(offsetY) {
      this.$refs.ebookView.style.top = offsetY + "px";
    },
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName);
      if (!readTime) {
        readTime = 0;
      }
      this.task = setInterval(() => {
        readTime++;
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime);
        }
      }, 1000);
    },
  },
};
</script>
<style scoped lang="scss">
.ebook {
  background-color: grey;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>