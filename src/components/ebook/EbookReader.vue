<template>
  <div class="ebook-reader">
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
  getLocalStorage
} from "../../utils/localStorage";
import { addCss } from "../../utils/book";
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
    //     ...mapActions在methods中进行混入
    // 上一页
    prevPage() {
      console.log(this);
      console.log(this.rendition);
      if (this.rendition) {
        this.rendition.prev().then(()=>{
          this.refreshLocation()
        });
        this.hideTitleAndMenu();
        
      }
    },
    // 下一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(()=>{
          this.refreshLocation()
        });
        this.hideTitleAndMenu();
      }
    },
    hideTitleAndMenu() {
      // this.$store.dispatch("setMenuVisible", false);
      this.setFontFamilyVisible(false);
      this.setMenuVisible(false);
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
      let defaultTheme = getTheme(this.fileName)
      if (defaultTheme) { 
        this.setDefaultTheme(defaultTheme);
      } else {
        saveTheme(this.fileName, theme.name);
      }
      this.rendition.themes.select(defaultTheme);
    },
    initRendition(){
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        height: innerHeight,
        // method: "default",
      });
      // 获取local Storage中的location（cfi）
      const location = getLocation(this.fileName)
      this.display(location,()=>{

      })
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
    
    initGesture(){
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
    initEpub() {
      const url = process.env.VUE_APP_RES_URL + "/epub/" + this.fileName;
      console.log(url);
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      // console.log(this.book);
      this.initRendition()
      this.initGesture()
      // epubjs 手动添加样式文件
      // 规定字数 设置分页
      this.book.ready.then(()=>{
        return this.book.locations.generate(750)
      }).then(locations=>{
        // 加载完成
        this.setBookAvailable(true)
        this.refreshLocation()
      })
      
    },
  },
};
</script>

<style scoped>
</style>