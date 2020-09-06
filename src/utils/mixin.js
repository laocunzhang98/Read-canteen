import { mapActions, mapGetters } from 'vuex';
import { themeList, addCss, removeAllCss,getReadTimeByMinute } from './book'
import { saveLocation } from './localStorage'
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark',
      'speakingIconBottom'
    ]),
    themeList() {
      return themeList(this);
    },

  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark',
      'setSpeakingIconBottom'
    ]),
    initGlobalStyle() {
      // console.log(this.defaultTheme);
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`);
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`);
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`);
          break
      }

    },
    refreshLocation() {
      // 为了获取cfi
      const currentLocation = this.currentBook.rendition.currentLocation();
      // console.log(this.currentBook.locations);
      // console.log(currentLocation);
      // const startCfi = this.currentBook.locations.percentageFromCfi(
      //   currentLocation.start.cfi
      // );
      let process = Math.floor(currentLocation.start.percentage * 100)
      console.log(process);
      this.setProgress(process)
      this.setSection(currentLocation.start.index)
      saveLocation(this.fileName, currentLocation.start.cfi)
    },
    display(target, callback) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (callback) {
            callback()
          }
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (callback) {
            callback()
          }
        })
      }
    },
    hideTitleAndMenu() {
      // this.$store.dispatch("setMenuVisible", false);
      this.setFontFamilyVisible(false);
      this.setSettingVisible(-1)
      this.setMenuVisible(false);
    },
    getReadTimeText() {
      // let readTime = getReadTime(this.fileName)
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    },
  }
}