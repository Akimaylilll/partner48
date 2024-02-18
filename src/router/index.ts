import { createRouter, createWebHashHistory,  RouteRecordRaw } from 'vue-router'
const Live = ()=> import('../view/Live.vue')
const MemberLiveList = ()=> import('../view/MemberLiveList.vue')
const KeyInput = ()=> import('../components/KeyInput.vue')
const Home = ()=> import('../view/Home.vue')
// const Home = ()=> import('../views/home/home.vue')
// const About = ()=> import('../views/about/about.vue')
const routes: Array<RouteRecordRaw> = [
    {    path: '/',    name: 'home',    component: Home, redirect: '/memberLiveList',
        children:[{
            path:'/memberLiveList',
            component: MemberLiveList
        }, {
          path:'/keyInput',
          component: KeyInput
        }]
    },
    {    path: '/live',    name: 'live',    component: Live},
    {    path: '/keyInput',    name: 'keyInput',    component: KeyInput,  },
    // {    path: '/home',    name: 'home',    component: Home,  }
    // {    path: '/about',    name: 'about',    component: About  },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router