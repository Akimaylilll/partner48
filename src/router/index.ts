import { createRouter, createWebHashHistory,  RouteRecordRaw } from 'vue-router'
const Live = ()=> import('../view/Live.vue')
const AllMember = ()=> import('../view/AllMember.vue')
const FavoriteMember = ()=> import('../view/FavoriteMember.vue')
const Settings = ()=> import('../view/Settings.vue')
const Home = ()=> import('../view/Home.vue')
// const Home = ()=> import('../views/home/home.vue')
// const About = ()=> import('../views/about/about.vue')
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home,
    redirect: "/allMember",
    children: [
			{
        path: "/favorite",
        component: FavoriteMember,
      },
      {
        path: "/allMember",
        component: AllMember,
      },
      {
        path: "/settings",
        component: Settings,
      },
    ],
  },
  {
    name: "live",
    path: "/live",
    component: Live,
  },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router