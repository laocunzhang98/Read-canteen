<template>
  <div class="ebook-reader">
    <div class="ebook-reader-mask" @touchmove="move" @touchend="moveEnd" @click="onMaskClick"></div>
    <div id="read"></div>

  </div>
</template>

<script>
import Epub from "epubjs";
import { ebookMixin } from "../../utils/mixin";
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation,
  getLocalStorage,
} from "../../utils/localStorage";
import { flatten } from "../../utils/book";
global.epub = Epub;
export default {
  name: "EbookReader",
  mixins: [ebookMixin],
  mounted() {
    const fileName = this.$route.params.fileName.split("|").join("/");

    // this.$store.dispatch("setFileName", fileName).then(() => {
    //   this.initEpub();
    // });
    this.setFileName(fileName).then(() => {
      this.initEpub();
    });
  },
  methods: {
    onMaskClick(e) {
        if (this.mouseMove === 2) {
        } else if (this.mouseMove === 1 || this.mouseMove === 4) {
          const offsetX = e.offsetX
          const width = window.innerWidth
          if (offsetX > 0 && offsetX < width * 0.3) {
            this.prevPage()
          } else if (offsetX > 0 && offsetX > width * 0.7) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
        }
        this.mouseMove = 4
      },
    move(e) {
      let offsetY = 0;
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
        this.$store.commit("SET_OFFSETY", offsetY);
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY;
      }
      e.preventDefault();
      e.stopPropagation();
    },
    moveEnd(e) {
      this.setOffsetY(0);
      this.firstOffsetY = 0;
    },
    //     ...mapActions在methods中进行混入
    // 上一页
    prevPage() {
      console.log(this);
      console.log(this.rendition);
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
        });
        this.hideTitleAndMenu();
      }
    },
    // 下一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        });
        this.hideTitleAndMenu();
      }
    },
    toggleTitleAndMenu() {
      // console.log("toggleTitleAndMenu");
      // this.$store.dispatch("setMenuVisible", !this.menuVisible);
      this.setMenuVisible(!this.menuVisible);
      this.setFontFamilyVisible(false);
      this.setSettingVisible(-1);
    },
    initFontFamily() {
      let font = getFontFamily(this.fileName);
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily);
      } else {
        this.rendition.themes.font(font);
        this.setDefaultFontFamily(font);
      }
    },
    initFontSize() {
      let fontSize = getFontSize(this.fileName);
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize);
      } else {
        this.rendition.themes.fontSize(fontSize + "px");
        this.setDefaultFontSize(fontSize);
      }
    },
    initTheme() {
      this.themeList.forEach((theme) => {
        this.rendition.themes.register(theme.name, theme.style);
      });
      let defaultTheme = getTheme(this.fileName);
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name;
        saveTheme(this.fileName, defaultTheme);
      }
      this.setDefaultTheme(defaultTheme);
      this.rendition.themes.select(this.defaultTheme);
    },
    initRendition() {
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        height: innerHeight,
        // method: "default",
      });
      // 获取local Storage中的location（cfi）
      const location = getLocation(this.fileName);
      this.display(location, () => {
        this.initGlobalStyle();
      });
      this.rendition.hooks.content.register((contents) => {
        console.log(`${process.env.VUE_APP_RES_URL}`);
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          ),
        ]).then(() => {
          // console.log("字体全部加载完成");
        });
      });
    },
    initGesture() {
      this.rendition.on("touchstart", (event) => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on("touchend", (event) => {
        // console.log(event);
        this.offSetX = event.changedTouches[0].clientX - this.touchStartX;
        this.time = event.timeStamp - this.touchStartTime;
        // console.log(this.touchStartTime);
        // console.log(this.offSetX, this.time);
        if (this.offSetX > 40 && this.time < 500) {
          this.prevPage();
        } else if (this.offSetX < -40 && this.time < 500) {
          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
        // event.preventDefault();
        // event.stopPropagation();
      });
    },
    parseBook() {
      this.book.loaded.cover.then((cover) => {
        this.book.archive.createUrl(cover).then((url) => {
          this.setCover(url);
          // console.log(url);
        });
      });
      this.book.loaded.metadata.then((metadata) => {
        this.setMetadata(metadata);
      });
      this.book.loaded.navigation.then((nav) => {
        // console.log(flatten(nav.toc));
        const navItem = flatten(nav.toc);
        function find(item, level = 0) {
          return !item.parent
            ? level
            : find(
                navItem.filter(
                  (parentItem) => parentItem.id === item.parent
                )[0],
                ++level
              );
        }
        navItem.forEach((item) => {
          item.level = find(item);
        });
        // console.log(navItem);
        this.setNavigation(navItem);
      });
    },
    initEpub() {
      const url = process.env.VUE_APP_RES_URL + "/epub/" + this.fileName;
      console.log(url);
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      // console.log(this.book);
      this.initRendition();
      // this.initGesture();
      this.initTheme();
      this.initFontSize();
      this.parseBook();
      this.initFontFamily();
      // epubjs 手动添加样式文件
      // 规定字数 设置分页
      this.book.ready
        .then(() => {
          return this.book.locations.generate(750);
        })
        .then((locations) => {
          // 加载完成
          this.setBookAvailable(true);
          this.refreshLocation();
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/global";
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    z-index: 150;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>