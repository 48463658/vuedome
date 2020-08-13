import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/Login.vue' // 登录页
import Home from './components/Home.vue' // 主页框架
import Welcome from "./components/Welcome.vue" //欢迎页/首页

// 视频预览  VideoPreview/
// 视频预览  VideoPreview/videoPreview.vue
import VidP_videoPreview from "./components/VideoPreview/videopreview.vue"

// 人事管理  ManManage/
// 人事管理-白名单  ManManage/manmessage.vue
import MaM_manmessage from "./components/ManManage/manmessage.vue"
// 人事管理-黑名单  ManManage/manmessage.vue
import BlackList_message from "./components/ManManage/blacklistmessage.vue"
// 人事管理-访客  ManManage/manmessage.vue
import Visitor_message from "./components/ManManage/visitormessage.vue"

// 人事管理-企业信息  ManManage/company.vue
import MaM_company from "./components/ManManage/company.vue"
// 人事管理-角色管理  ManManage/roles.vue
import MaM_roles from "./components/ManManage/roles.vue"
// 人事管理-分配权限  ManManage/authorized.vue
import MaM_authorized from "./components/ManManage/authorized.vue"

// 设备管理  EqManage/
// 设备管理-设备管理  EqManage/eqmessage.vue
import EqM_eqmessage from "./components/EqManage/eqmessage.vue"

//设备配置  EqLayout/
// 设备配置-设备配置  EqLayout/eqlayout.vue
import EqL_eqlayout from "./components/EqLayout/eqlayout.vue"

// 数据管理  DataManage/
// 数据管理-识别记录  DataManage/record.vue
import DaM_record from "./components/DataManage/record.vue"
// 数据管理-操作日志  DataManage/log.vue
import DaM_log from "./components/DataManage/log.vue"

// 数据分析  DataFrom/
// 数据分析-数据分析  DataFrom/record.vue
import DaF_datafrom from "./components/DataFrom/datafrom.vue"

// 系统配置
import Sys_sysconfig from "./components/SysConfig/sysconfig.vue"
//会议管理
import MeetingManage from "./components/ManManage/meetingmanage.vue"

Vue.use(Router)

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}
const router = new Router({
    mode: 'history',
    routes: [
        { path: '/', redirect: '/login' },
        {
            path: '/login',
            component: Login,
            name: 'Login',
            meta: [
                { name: '登录' }
            ]
        },

        {
            path: '/home',
            component: Home,
            name: 'Home',
            meta: [
                { name: '首页' }
            ],
            redirect: "/eqmeqmessage",
            children: [{
                path: "/welcome",
                component: Welcome,
                name: 'Welcome',
                meta: [
                    { name: '首页' }
                ]
            }, {
                path: "/vidpvideopreview",
                component: VidP_videoPreview,
                name: 'VidP_videoPreview',
                meta: [
                    { name: '首页' }, //{ name: '首页', url: '/welcome' },
                    { name: '实时预览' }
                ]
            }, {
                path: "/mammanmessage",
                component: MaM_manmessage,
                name: 'MaM_manmessage',
                meta: [
                    { name: '首页' }, //{ name: '首页', url: '/welcome' },
                    { name: '人事管理' },
                    { name: '内部人员' }
                ]
            }, {
                path: "/visitormessage",
                component: Visitor_message,
                name: 'MaM_visitormanmessage',
                meta: [
                    { name: '首页' }, //{ name: '首页', url: '/welcome' },
                    { name: '人事管理' },
                    { name: '访客人员' }
                ]
            }, {
                path: "/authorized",
                component: MaM_authorized,
                name: 'MaM_authorized',
                meta: [
                    { name: '首页' }, //{ name: '首页', url: '/welcome' },
                    { name: '人事管理' },
                    { name: '人员信息', url: '/mammanmessage' },
                    { name: '分配权限' }
                ]
            }, {
                path: "/mamcompany",
                component: MaM_company,
                name: 'MaM_company',
                meta: [
                    { name: '首页' }, //{ name: '首页', url: '/welcome' },
                    { name: '人事管理' },
                    { name: '企业信息' }
                ]
            }, {
                path: "/mamroles",
                component: MaM_roles,
                name: 'MaM_roles',
                meta: [
                    { name: '首页' }, //{ name: '首页', url: '/welcome' },
                    { name: '人事管理' },
                    { name: '角色管理' }
                ]
            }, {
                path: "/eqmeqmessage",
                component: EqM_eqmessage,
                name: 'EqM_eqmessage',
                meta: [
                    { name: '首页' },
                    { name: '设备管理' }
                ]
            }, {
                path: "/eqleqlayout",
                component: EqL_eqlayout,
                name: 'EqL_eqlayout',
                meta: [
                    { name: '首页' },
                    { name: '设备配置' }
                ]
            }, {
                path: "/damrecord",
                component: DaM_record,
                name: 'DaM_record',
                meta: [
                    { name: '首页' },
                    { name: '数据管理' },
                    { name: '识别记录' }
                ]
            }, {
                path: "/damlog",
                component: DaM_log,
                name: 'DaM_log',
                meta: [
                    { name: '首页' },
                    { name: '数据管理' },
                    { name: '操作日志' }
                ]
            }, {
                path: "/dafdatafrom",
                component: DaF_datafrom,
                name: 'DaF_datafrom',
                meta: [
                    { name: '首页' },
                    { name: '数据分析' }
                ]
            }, {
                path: "/sysconfig",
                component: Sys_sysconfig,
                name: 'Sys_sysconfig',
                meta: [
                    { name: '首页' },
                    { name: '系统设置' }
                ]
            },{
              path: "/Meeting",
              component: MeetingManage,
              name: 'MeetingManage',
              meta: [
                { name: '首页' },
                { name: '会议管理' }
              ]
            }]
        }
    ]
})

router.beforeEach((to, from, next) => {
    next()
})

export default router
