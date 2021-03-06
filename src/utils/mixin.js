import { mapActions, mapGetters } from 'vuex';
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { saveLocation, getBookmark } from './localStorage'

export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible'
    ]),
    showBookDetail (book) {
      gotoBookDetail(this, book)
    }
  }
} 

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
    getSectionName() {
      // section 不为零 获取章节名字
      // if (this.section) {
      //   const sectionInfo = this.currentBook.section(this.section);
      //   if (sectionInfo && sectionInfo.href) {
      //     return this.currentBook.navigation.get(sectionInfo.href).label;
      //   }
      // }
      return this.section ? this.navigation[this.section].label : "";
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
      if (currentLocation && currentLocation.start) {
        let process = Math.floor(currentLocation.start.percentage * 100)
        this.setProgress(process)
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, currentLocation.start.cfi)
        const bookmark = getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === currentLocation.start.cfi)) {
            this.setIsBookmark(true)
          }
        } else {
          this.setIsBookmark(false)
        }
      }

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