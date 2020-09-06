# vue-imooc-ebook



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



