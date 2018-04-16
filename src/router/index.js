import Vue from 'vue'
import Router from 'vue-router'
// 登录页面
import Login from 'views/login/login'
// 注册页面
import signUp from 'views/signUp/signUp'
import enterpriseInfo from 'components/enterpriseInfo/enterpriseInfo'
import loginIndex from 'components/loginIndex/loginIndex'
// 管理员主页
import adminIndex from 'views/adminIndex/adminIndex'

import addressBook from 'components/addressBook/addressBook'

import amount from 'components/amount/amount'
import giveOut from 'components/giveOut/giveOut'
import checkDetail from 'components/checkDetail/checkDetail'

import setting from 'components/setting/setting'


Vue.use(Router)



export default new Router({
  routes: [{
      path: '/',
      redirect: '/adminIndex'
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'signUp',
      path: '/signUp',
      component: signUp,
      children: [{
        name: 'enterpriseInfo',
        path: '/signUp/enterpriseInfo',
        component: enterpriseInfo
      }]
    },
    {
      name: 'adminIndex',
      path: '/adminIndex',
      component: adminIndex,
      children: [{
          name: 'addressBook',
          path: '/adminIndex/addressBook',
          component: addressBook
        },
        {
          name: 'amount',
          path: '/adminIndex/amount',
          component: amount,
          children: [{
            name: 'giveOut',
            path: '/adminIndex/giveOut',
            component: giveOut,
            children: [{
              name: 'checkDetail',
              path: '/adminIndex/giveOut/checkDetail',
              component: checkDetail
            }]
          }]
        },
        {
          name: 'setting',
          path: '/adminIndex/setting',
          component: setting
        }
      ]
    }
  ]
})
