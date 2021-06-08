import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/layout.vue'
Vue.use(VueRouter)
/*
meta: {
  title: '智能终端', header components title
  hasFooter: true, 如果设置为true,显示是footer components， 反之亦然
  hasHeader: true, 如果设置为true,显示是header components， 反之亦然
  leftArrow: false, 如果设置为true,header components左侧显示icon ，反之亦然
  hiddenBack: true, 如果设置为true， header components返回上一次历史history功能隐藏， 反之亦然
  leftIcon: '', header components左侧icon名称， String
  rightIcon: ['question-o', 'scan'], header components右侧icon， Arrray
  animate: 0 动画方向
}
*/
const routes = [
  // 重定向
  {
    path: '/redirect',
    component: Layout,
    meta: {
      animate: 0
    },
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import(/* webpackChunkName: "group-foo" */ '@/views/redirect/index'),
        meta: {
        }
      }
    ]
  },
  // 智能终端
  {
  // LAYOUT
    path: '/',
    component: Layout,
    meta: {
      title: '智能终端',
      animate: 0
    },
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "about" */ '@/views/device/device.vue'),
        meta: {
          title: '智能终端',
          hasFooter: true,
          hasHeader: true,
          leftArrow: false,
          hiddenBack: true,
          leftIcon: '',
          rightIcon: ['add-o'], // 'question-o'
          animate: 0
        }
      },
      {
        path: '/details',
        component: () => import(/* webpackChunkName: "about" */ '@/views/device/details.vue'),
        meta: {
          title: '智能终端详情',
          hasFooter: false,
          hasHeader: true,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: ['edit'], // question-o
          animate: 1
        }
      },
      {
        path: '/deviceAddorEdit',
        component: () => import(/* webpackChunkName: "about" */ '@/views/device/deviceAddorEdit.vue'),
        meta: {
          title: '智能终端认证',
          hasFooter: false,
          hasHeader: true,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: [],
          animate: 2
        }
      },
      // playList
      {
        path: '/playList',
        component: () => import(/* webpackChunkName: "about" */ '@/views/device/playList.vue'),
        meta: {
          title: '播放列表',
          hasFooter: false,
          hasHeader: true,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: [], // question-o
          animate: 2
        }
      }
    ]
  },
  {
    path: '/qrscanner',
    component: () => import(/* webpackChunkName: "about" */ '@/views/device/qrscanner.vue'),
    meta: {
      title: '播放列表',
      hasFooter: false,
      hasHeader: false,
      leftArrow: false,
      hiddenBack: true,
      leftIcon: 'arrow-left',
      rightIcon: [], // question-o
      animate: 2
    }
  },
  // 媒体
  {
    // LAYOUT
    path: '/media',
    component: Layout,
    meta: {
      title: '媒体',
      animate: 0
    },
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "about" */ '../views/media/media.vue'),
        meta: {
          title: '媒体',
          hasHeader: true,
          hasFooter: true,
          leftArrow: false,
          hiddenBack: true,
          leftIcon: '',
          rightIcon: ['orders-o', 'add-o'], // question-o
          animate: 0
        }
      },
      {
        // 上传文件
        path: '/uploader',
        name: 'uploader',
        component: () => import(/* webpackChunkName: "about" */ '../views/media/uploader.vue'),
        meta: {
          title: '素材上传',
          hasHeader: true,
          hasFooter: false,
          leftArrow: false,
          hiddenBack: true,
          leftIcon: 'arrow-left',
          rightIcon: ['scan'], // question-o
          animate: 1
        }
      },
      {
        // 媒体详情
        path: '/mediaDetails',
        name: 'mediaDetails',
        component: () => import(/* webpackChunkName: "about" */ '../views/media/details.vue'),
        meta: {
          title: '媒体',
          hasHeader: true,
          hasFooter: false,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: [],
          animate: 2
        }
      },
      {
        // 媒体发布
        path: '/release',
        name: 'release',
        component: () => import(/* webpackChunkName: "about" */ '../views/media/release.vue'),
        meta: {
          title: '媒体发布',
          hasHeader: true,
          hasFooter: false,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: [],
          animate: 1
        }
      }
    ]
  },
  // 任务
  {
    // LAYOUT
    path: '/task',
    component: Layout,
    meta: {
      title: '任务',
      animate: 5
    },
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "about" */ '../views/task/task.vue'),
        meta: {
          title: '任务',
          hasHeader: true,
          hasFooter: true,
          leftArrow: false,
          hiddenBack: true,
          leftIcon: '',
          rightIcon: ['delete'], // question-o
          animate: 0
        }
      }
    ]
  },
  // 我的
  {
    // LAYOUT
    path: '/mine',
    component: Layout,
    meta: {
      title: '我的',
      animate: 0
    },
    children: [
      {
        path: '/mine',
        component: () => import(/* webpackChunkName: "about" */ '../views/mine/mine.vue'),
        meta: {
          title: '我的',
          hasHeader: false,
          hasFooter: true,
          leftArrow: false,
          hiddenBack: true,
          leftIcon: '',
          rightIcon: [],
          animate: 0
        }
      },
      {
        // 使用手册
        path: '/manual',
        name: 'manual',
        component: () => import(/* webpackChunkName: "about" */ '../views/mine/manual.vue'),
        meta: {
          title: '使用手册',
          hasHeader: true,
          hasFooter: false,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: [],
          animate: 1
        }
      },
      {
        // 使用手册
        path: '/manualDetails',
        name: 'manualDetails',
        component: () => import(/* webpackChunkName: "about" */ '../views/mine/manualDetails.vue'),
        meta: {
          title: '手册详情',
          hasHeader: true,
          hasFooter: false,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: [],
          animate: 2
        }
      },
      {
        // 意见建议
        path: '/suggestions',
        name: 'suggestions',
        component: () => import(/* webpackChunkName: "about" */ '../views/mine/suggestions.vue'),
        meta: {
          title: '意见建议',
          hasHeader: true,
          hasFooter: false,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: [],
          animate: 1
        }
      },
      {
        // 密码修改
        path: '/resetPassword',
        name: 'resetPassword',
        component: () => import(/* webpackChunkName: "about" */ '../views/mine/resetPassword.vue'),
        meta: {
          title: '修改密码',
          hasHeader: true,
          hasFooter: false,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: [],
          animate: 1
        }
      },
      {
        // 关于软件
        path: '/software',
        name: 'software',
        component: () => import(/* webpackChunkName: "about" */ '../views/mine/software.vue'),
        meta: {
          title: '关于软件',
          hasHeader: true,
          hasFooter: false,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: [],
          animate: 1
        }
      }
    ]
  },
  // 登录
  {
    // LAYOUT
    path: '/login',
    component: Layout,
    meta: {
      title: '登录',
      animate: 0
    },
    children: [
      {
        path: '/',
        name: 'Login',
        component: () => import(/* webpackChunkName: "about" */ '../views/login/login.vue'),
        meta: {
          title: '登录',
          hasHeader: false,
          hasFooter: false,
          leftArrow: false,
          hiddenBack: true,
          leftIcon: '',
          rightIcon: [],
          animate: 0
        }
      },
      {
        path: '/signUp',
        name: 'signUp',
        component: () => import(/* webpackChunkName: "about" */ '../views/login/signUp.vue'),
        meta: {
          title: '注册',
          hasHeader: false,
          hasFooter: false,
          leftArrow: false,
          hiddenBack: true,
          leftIcon: '',
          rightIcon: [],
          animate: 1
        }
      },
      {
        path: '/forgetWord',
        name: 'forgetWord',
        component: () => import(/* webpackChunkName: "about" */ '../views/login/forgetWord.vue'),
        meta: {
          title: '忘记密码',
          hasHeader: false,
          hasFooter: false,
          leftArrow: false,
          hiddenBack: true,
          leftIcon: '',
          rightIcon: [],
          animate: 2
        }
      },
      {
        path: '/code',
        name: 'code',
        component: () => import(/* webpackChunkName: "about" */ '../views/login/code.vue'),
        meta: {
          title: '验证码登录',
          hasHeader: false,
          hasFooter: false,
          leftArrow: false,
          hiddenBack: true,
          leftIcon: '',
          rightIcon: [],
          animate: 2
        }
      }
    ]
  },
  // 问题
  {
    // LAYOUT
    path: '/question',
    component: Layout,
    meta: {
      title: '帮助',
      animate: 0
    },
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "about" */ '@/views/question/question.vue'),
        meta: {
          title: '帮助',
          hasFooter: false,
          hasHeader: true,
          leftArrow: true,
          hiddenBack: false,
          leftIcon: 'arrow-left',
          rightIcon: [],
          animate: 0
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
