# read canteen



### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
# read canteen 开发回顾（一）

## 基于vue-cli 脚手架搭建项目 划分目录结构

![](C:\Users\Administrator\Desktop\blog\微信读书\目录结构.png)

## 引入vuex

### 注意在调用state属性时，需使用state.book

```javascript
//store/modules/book.js
// 代码片段
const book = {
  state: {
      // 书名
    fileName: '',
      // 显示菜单栏
    menuVisible: false,
      // 控制菜单栏四个功能按钮
    settingVisible: -1,
      // 默认文字大小
    defaultFontSize: 16,
      // 默认字体
    defaultFontFamily: 'Default',
      // 控制选择字体页面显示
    fontFamilyVisible: false,
      //默认主题
    defaultTheme: 'Default',
      // 判断书籍是否加载/分页完成
    bookAvailable: false,
      //进度条value
    progress: 0,
      // 章节
    section: 0,
	.....
  },
   mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENU_VISIBLE': (state, visible) => {
      state.menuVisible = visible
    },
    'SET_SETTING_VISIBLE': (state, visible) => {
      state.settingVisible = visible
    },
    'SET_DEFAULT_FONT_SIZE': (state, fontSize) => {
      state.defaultFontSize = fontSize
    },
    ......
   }
  export default book
```

```javascript
//store/getter.js
// 代码片段
const getters = {
  fileName: state => state.book.fileName,
  menuVisible: state => state.book.menuVisible,
  settingVisible: state => state.book.settingVisible,
  defaultFontSize: state => state.book.defaultFontSize,
  defaultFontFamily: state => state.book.defaultFontFamily,
  fontFamilyVisible: state => state.book.fontFamilyVisible,
  defaultTheme: state => state.book.defaultTheme,
  bookAvailable: state => state.book.bookAvailable,
  progress: state => state.book.progress,
  section: state => state.book.section,
 .....
}

export default getters
```

```javascript
//store/actions.js
// 代码片段
const actions = {
  setFontFamilyVisible: ({ commit }, visible) => {
    return commit('SET_FONT_FAMILY_VISIBLE', visible)
  },
  setDefaultFontFamily: ({ commit }, font) => {
    return commit('SET_DEFAULT_FONT_FAMILY', font)
  },
  setDefaultFontSize: ({ commit }, fontSize) => {
    return commit('SET_DEFAULT_FONT_SIZE', fontSize)
  },
  setSettingVisible: ({ commit }, visible) => {
    return commit('SET_SETTING_VISIBLE', visible)
  },
  setMenuVisible: ({ commit }, visible) => {
    return commit('SET_MENU_VISIBLE', visible)
  },
}
export default actions
```

```javascript
//store/index,js
// 安装vuex组件 
import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    book
  },
  getters,
  actions
})

```

## vuex数据量比较大 除了使用...mapGetters ...mapActions 在组件中进行调用 我们还可继续将多次调用的代码抽离到mixin中 使代码结构更加清晰



## 通过nginx搭建本地静态资源服务器

```nginx
 server {
        listen       8088;
        server_name   resouce;
        autoindex on;
        location / {
        root  "F://webFrontend//resouce";
        add_header Access-Control-Allow-Origin *;
    }
        add_header Cache-Control "no-cache, must-revalidate";
}
```

## 访问nginx静态资源



## 配置.env.development

```
VUE_APP_RES_URL = http://192.168.0.7:8088
```

## 配置router/index.js

#### mode: 'history' 消除路由自带的#（hash)

```javascript
const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
```

## npm安装epub.js 将书籍渲染到页面

```javascript
npm i epubjs --save
```

### epubjs 基本使用

ePub电子书解析和渲染

##### 生成Book对象

```cpp
  this.book = new Epub(DOWNLOAD_URL)
```

##### 通过Book.renderTo生成Rendition对象

```dart
  this.rendition = this.book.renderTo('read', {
    width: window.innerWidth,
    height: window.innerHeight,
    method: 'default'
  })
```

##### 通过Rendtion.display渲染电子书

```css
  this.rendition.display()
```

## ePub电子书翻页

### 本项目采用手指滑动翻页

##### *上一页*

```jsx
  function prevPage() {
    if (this.rendition) {
      this.rendition.prev()
    }
  }
```

##### *下一页*

```jsx
  function nextPage() {
    if (this.rendition) {
      this.rendition.next()
    }
  }
```

## ePub电子书的字号设置和场景切换

##### *设置主题*

```jsx
  function setTheme(index) {
    this.themes.select(this.themeList[index].name)
    this.defaultTheme = index
  }
```

##### *注册主题*

```jsx
  function registerTheme() {
    this.themeList.forEach(theme => {
      this.themes.register(theme.name, theme.style)
    })
  }
```

##### *设置字号大小*

```jsx
  function setFontSize(fontSize) {
    this.defaultFontSize = fontSize
    if (this.themes) {
      this.themes.fontSize(fontSize + 'px')
    }
  }
```

## ePub电子书生成目录和定位信息

##### *Book对象的钩子函数ready*

```kotlin
  this.book.ready.then(() => {
    // 生成目录
    this.navigation = this.book.navigation
    // 生成Locations对象
    return this.book.locations.generate()
  }).then(result => {
    // 保存locations对象
    this.locations = this.book.locations
    // 标记电子书为解析完毕状态
    this.bookAvailable = true
  })
```

##### *ePub电子书通过百分比进行定位*

```jsx
function onProgressChange(progress) {
  const percentage = progress / 100
  const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
  this.rendition.display(location)
}
```

## HTML5 range控件

```kotlin
<input class="progress" 
       type="range"
       max="100"
       min="0"
       step="1"
       @change="onProgressChange($event.target.value)" 
       @input="onProgressInput($event.target.value)"
       :value="progress"
       :disabled="!bookAvailable"
       ref="progress">
```

## 利用浏览器Local Storage存储字体字号主题等设置

### npm下载web-storage-cache

```javascript
npm i web-storage-cache --save
```

```javascript
//utils/loaclStorage.js
//代码片段
import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function getLocalStorage(key) {
  return localStorage.get(key)
}

export function setLocalStorage(key, value, expire = 30 * 24 * 3600) {
  return localStorage.set(key, value, { exp: expire })
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}
export function setBookObject(fileName, key, value) {
  let book = {}
  if (getLocalStorage(`${fileName}-info`)) {
    book = getLocalStorage(`${fileName}-info`)
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)
}
```

### 这样我们就可以记录我们选择则字体字号等，除了我们手动删除外，这些记录会一直保存在我们本地

## 另外对于css一些公共样式 我们使用sass进行设置，存放到 /assets/styles 目录下

## 对于页面的高频词汇采用国际化vue-i18n

#### npm 下载vue-i18n插件

```javascript
npm i vue-i18n --save
```

#### 1.引入i18n国际化插件

```javascript
import Vue from 'vue'

import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
```

#### 2.注册i18n实例并引入语言文件，文件格式等下解析

```javascript
import en from './en'
import cn from './cn'
const messages = {
  en: en,
  cn: cn
}
// 在localStorage中取默认locale
let locale = getLocale()
if (!locale) {
  locale = 'cn'
  saveLocale(locale)
} 
const i18n = new VueI18N({
  locale,
  messages
})
```

#### 3.在main.js中进行注册

```javascript
new Vue({
  .....
  i18n,
  render: h => h(App)
}).$mount('#app')
```



#### 4.在html或js中进行渲染

```javascript
//html文件需要加{{}}

  {{$t('book.selectFont')}}

//js文件

  $t('book.selectFont')
```
## read-canteen开发回顾（二）

### 书籍目录与书签

### 1.目录实现

```javascript
// epubjs内置方法
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
```

#### navigation数据可能是多级目录

```javascript
this.book.loaded.navigation.then((nav) => {
        // console.log(flatten(nav.toc));
        const navItem = flatten(nav.toc); // 利用一个flatten函数分级
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
```

#### flatten函数

```javascript
export function flatten(array) {
  return [].concat(...array.map(item => {
    return [].concat(item, ...flatten(item.subitems))
  }))
}
```

### 2.文章内容搜索

```javascript
search() {
        this.doSearch(this.searchText).then(result => {
          this.searchList = result.map(item => {
            item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
            return item
          })
          this.$refs.searchInput.blur()
        })
      },
 doSearch(q) {
        return Promise.all(
          this.currentBook.spine.spineItems.map(
            item => item.load(this.currentBook.load.bind(this.currentBook)).then(item.find.bind(item, q)).finally(item.unload.bind(item)))
        ).then(results => Promise.resolve([].concat.apply([], results)))
      }
```

#### 对搜索出的内容进行高亮显示

```javascript
displaySearch(target,highlight=false){
        this.display(target,()=>{
          this.hideTitleAndMenu()
          if(highlight){//高亮显示
            this.currentBook.rendition.annotations.highlight(target)
          }
        })
      },
```

## 3.技术难点书签实现

#### 功能描述

- 下拉页面加入书签，再次下拉页面登出书签

- 在书签页添加书签链接，点击跳转到书签页
- 获取书签页的文本内容

#### 具体实现

- 使用css创建一个书签图标 
- 监听手势操作控制书签各种动画功能 使用了watch进行监听offsetY值得变化

- 创建书签链接 将本文和cfi保存如localstorage中
- 书签页跳转链接并隐藏菜单栏 重写display 方法
- 在连续下拉时出现卡顿情况 需利定时器控制下拉解决卡顿
- 主要还是应用vuex 中的state变量对各种操作进行控制
- epubjs的各种内置方法的使用

```javascript
// 保存文本书签信息
setAndSaveBookmark() {
        this.bookmark = getBookmark(this.fileName)
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '').replace('epubcfi(', '')
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)/, '')
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)/, '')
        const cfiRange = `epubcfi(${cfibase}!,${cfistart},${cfiend})`
        const cfi = currentLocation.start.cfi
        this.currentBook.getRange(cfiRange).then(range => {
          let text = range.toString()
          text = text.replace(/\s\s/g, '')
          text = text.replace(/\r/g, '')
          text = text.replace(/\n/g, '')
          text = text.replace(/\t/g, '')
          text = text.replace(/\f/g, '')
          console.log(text);
          this.bookmark.push({
            cfi: cfi,
            text: text
          })
          this.setIsBookmark(true)
          saveBookmark(this.fileName, this.bookmark)
        })
      },
```
## 搜索框的交互效果

- 下拉时搜索框上移动画
- 推荐书籍动画交互（难点）

```javascript
semiCircleStyle (item, dir) {
      return {
        backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    },
    rotate (index, type) {
      const item = this.flapCardList[index]
      let dom
      if (type === 'front') {
        dom = this.$refs.right[index]
      } else {
        dom = this.$refs.left[index]
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`
    },
    flapCardRotate () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      backFlapCard.rotateDegree -= 10
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5
      }
      if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
        backFlapCard.zIndex += 2
      }
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        this.next()
      }
    },
    next () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree = 0
      backFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard._g = backFlapCard.g
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      this.front++
      this.back++
      const len = this.flapCardList.length
      if (this.front >= len) {
        this.front = 0
      }
      if (this.back >= len) {
        this.back = 0
      }
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len)
      })
      this.prepare()
    },
    prepare () {
      const backFlapCard = this.flapCardList[this.back]
      backFlapCard.rotateDegree = 180
      backFlapCard._g = backFlapCard.g - 5 * 9
      this.rotate(this.back, 'back')
    },
    reset () {
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      this.runBookCardAnimation = false
      this.runFlapCardAnimation = false
      this.runPointAnimation = false
    },
    startFlapCardAnimation () {
      this.prepare()
      this.task = setInterval(() => {
        this.flapCardRotate()
      }, this.intervalTime)
    },
    startPointAnimation () {
      this.runPointAnimation = true
      setTimeout(() => {
        this.runPointAnimation = false
      }, 750)
    },
    stopAnimation () {
      if (this.task) {
        clearInterval(this.task)
      }
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (this.timeout2) {
        clearTimeout(this.timeout2)
      }
      this.reset()
    },
    runAnimation () {
      this.runFlapCardAnimation = true
      this.timeout = setTimeout(() => {
        this.startFlapCardAnimation()
        this.startPointAnimation()
      }, 300)
      this.timeout2 = setTimeout(() => {
        this.stopAnimation()
        this.runBookCardAnimation = true
      }, 2500)
    },
```

## 书城详细页面 （未完待续。。。）





