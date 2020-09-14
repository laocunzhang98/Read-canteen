import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store'
  },
  {
    path: '/ebook',
    component: () => import('../views/ebook/index'),
    children: [
      {
        path: ':fileName',
        component:() => import('../components/ebook/EbookReader.vue'),
      }
    ]
  },
  {
    path: '/store',
    component: () => import("../views/store/index.vue"),
    redirect:"/store/home", 
    children: [
      {
        path: 'home',
        component: () => import("../views/store/StoreHome.vue")
          
        
      }
    ]
    
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
