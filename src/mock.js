const Mock = require('mockjs')
const Random = Mock.Random

const Result = {
  code: 200,
  msg: 'succes',
  data: null
}
Mock.mock('/captcha', 'get', () => {
  Result.data = {
    token: Random.string(32),
    captchaImg: Random.dataImage('90x40', 'i8df9')
  }
  return Result
})

Mock.mock('/login', 'post', () => {
  // Result.code = 400
  // Result.msg = 'verification code is not correct'
  return Result
})

Mock.mock('/logout', 'post', () => {
  Result.code = 200
  return Result
})

Mock.mock('/sys/user', 'get', () => {
  Result.data = {
    id: '1',
    username: 'Hao Lu',
    avatar: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
  }
  return Result
})

Mock.mock('/sys/menu/list', 'get', () => {
  const menus = [
    {
      id: 1,
      created: '2021-01-15T18:58:18',
      updated: '2021-01-15T18:58:20',
      status: 1,
      parentId: 0,
      name: '系统管理',
      path: '',
      perms: 'sys:manage',
      component: '',
      type: 0,
      icon: 'el-icon-s-operation',
      sequence: 1,
      children: [
        {
          id: 2,
          created: '2021-01-15T19:03:45',
          updated: '2021-01-15T19:03:48',
          status: 1,
          parentId: 1,
          name: '用户管理',
          path: '/sys/users',
          perms: 'sys:user:list',
          component: 'sys/User',
          type: 1,
          icon: 'el-icon-s-custom',
          sequence: 1,
          children: [
            {
              id: 9,
              created: '2021-01-17T21:48:32',
              updated: null,
              status: 1,
              parentId: 2,
              name: '添加用户',
              path: null,
              perms: 'sys:user:save',
              component: null,
              type: 2,
              icon: null,
              sequence: 1,
              children: []
            },
            {
              id: 10,
              created: '2021-01-17T21:49:03',
              updated: '2021-01-17T21:53:04',
              status: 1,
              parentId: 2,
              name: '修改用户',
              path: null,
              perms: 'sys:user:update',
              component: null,
              type: 2,
              icon: null,
              sequence: 2,
              children: []
            },
            {
              id: 11,
              created: '2021-01-17T21:49:21',
              updated: null,
              status: 1,
              parentId: 2,
              name: '删除用户',
              path: null,
              perms: 'sys:user:delete',
              component: null,
              type: 2,
              icon: null,
              sequence: 3,
              children: []
            },
            {
              id: 12,
              created: '2021-01-17T21:49:58',
              updated: null,
              status: 1,
              parentId: 2,
              name: '分配角色',
              path: null,
              perms: 'sys:user:role',
              component: null,
              type: 2,
              icon: null,
              sequence: 4,
              children: []
            },
            {
              id: 13,
              created: '2021-01-17T21:50:36',
              updated: null,
              status: 1,
              parentId: 2,
              name: '重置密码',
              path: null,
              perms: 'sys:user:repass',
              component: null,
              type: 2,
              icon: null,
              sequence: 5,
              children: []
            }
          ]
        },
        {
          id: 3,
          created: '2021-01-15T19:03:45',
          updated: '2021-01-15T19:03:48',
          status: 1,
          parentId: 1,
          name: '角色管理',
          path: '/sys/roles',
          perms: 'sys:role:list',
          component: 'sys/Role',
          type: 1,
          icon: 'el-icon-rank',
          sequence: 2,
          children: []
        }

      ]
    },
    {
      id: 5,
      created: '2021-01-15T19:06:11',
      updated: null,
      status: 1,
      parentId: 0,
      name: '系统工具',
      path: '',
      perms: 'sys:tools',
      component: null,
      type: 0,
      icon: 'el-icon-s-tools',
      sequence: 2,
      children: [
        {
          id: 6,
          created: '2021-01-15T19:07:18',
          updated: '2021-01-18T16:32:13',
          status: 1,
          parentId: 5,
          name: '数字字典',
          path: '/sys/dicts',
          perms: 'sys:dict:list',
          component: 'sys/Dict',
          type: 1,
          icon: 'el-icon-s-order',
          sequence: 1,
          children: []
        }
      ]
    }
  ]

  Result.data = menus
  return Result
})

Mock.mock(RegExp('/sys/menu/info/*'), 'get', () => {
  Result.data = {
    id: 3,
    statue: 1,
    parentId: 1,
    name: '角色管理',
    path: '/sys/roles',
    perms: 'sys:role:list',
    component: 'sys/Role',
    type: 1,
    icon: 'el-icon-rank',
    sequence: 2,
    children: []
  }

  return Result
})

Mock.mock('/sys/menu/nav', 'get', () => {
  const nav = [
    {
      name: 'SysManga',
      title: 'System',
      icon: 'el-icon-s-operation',
      path: '',
      component: '',
      children: [
        {
          name: 'SysUser',
          title: 'User',
          icon: 'el-icon-s-custom',
          path: '/sys/users',
          component: 'system/User',
          children: []
        },
        {
          name: 'SysRole',
          title: 'Role',
          icon: 'el-icon-rank',
          path: '/sys/role',
          component: 'system/Role',
          children: []
        },
        {
          name: 'SysMenu',
          title: 'Menu',
          icon: 'el-icon-menu',
          path: '/sys/menu',
          component: 'system/Menu',
          children: []
        }
      ]
    },
    {
      name: 'SysTools',
      title: 'Tool',
      icon: 'el-icon-s-tools',
      path: '',
      component: '',
      children: [
        {
          name: 'SysDict',
          title: 'Dictionary',
          icon: 'el-icon-s-order',
          path: '/sys/dicts',
          component: '',
          children: []
        }
      ]
    }]
  const authorization = []

  Result.data = {
    nav: nav,
    authorization: authorization
  }
  return Result
})

Mock.mock(RegExp('/sys/role/list*'), 'get', () => {
  Result.data = {
    records: [
      {
        id: 3,
        created: '2021-01-04T10:09:14',
        updated: '2021-01-30T08:19:52',
        status: 1,
        name: '普通用户',
        code: 'normal',
        remark: '只有基本查看功能',
        menuIds: []
      },
      {
        id: 6,
        created: '2021-01-16T13:29:03',
        updated: '2021-01-17T15:50:45',
        status: 1,
        name: '超级管理员',
        code: 'admin',
        remark: '系统默认最高权限，不可以编辑和任意修改',
        menuIds: []
      }
    ],
    total: 2,
    size: 10,
    current: 1,
    orders: [],
    optimizeCountSql: true,
    hitCount: false,
    countId: null,
    maxLimit: null,
    searchCount: true,
    pages: 1
  }

  return Result
})
Mock.mock(RegExp('/sys/role/info/*'), 'get', () => {
  Result.data = {
    id: 6,
    created: '2021-01-16T13:29:03',
    updated: '2021-01-17T15:50:45',
    status: 1,
    name: '超级管理员',
    code: 'admin',
    remark: '系统默认最高权限，不可以编辑和任意修改',
    menuIds: [3]
  }

  return Result
})

Mock.mock(RegExp('/sys/role/*'), 'post', () => {
  return Result
})

Mock.mock(RegExp('/sys/user/list*'), 'get', () => {
  Result.data = {
    records: [
      {
        id: 1,
        created: '2021-01-12T22:13:53',
        updated: '2021-01-16T16:57:32',
        statu: 1,
        username: 'admin',
        password: '$2a$10$R7zegeWzOXPw871CmNuJ6upC0v8D373GuLuTw8jn6NET4BkPRZfgK',
        avatar: 'https://image-1300566513.cos.ap-guangzhou.myqcloud.com/upload/images/5a9f48118166308daba8b6da7e466aab.jpg',
        email: '123@qq.com',
        city: '广州',
        lastLogin: '2020-12-30T08:38:37',
        roles: [
          {
            id: 6,
            created: '2021-01-16T13:29:03',
            updated: '2021-01-17T15:50:45',
            statu: 1,
            name: '超级管理员',
            code: 'admin',
            remark: '系统默认最高权限，不可以编辑和任意修改',
            menuIds: []
          },
          {
            id: 3,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-30T08:19:52',
            statu: 1,
            name: '普通用户',
            code: 'normal',
            remark: '只有基本查看功能',
            menuIds: []
          }
        ]
      },
      {
        id: 2,
        created: '2021-01-30T08:20:22',
        updated: '2021-01-30T08:55:57',
        statu: 1,
        username: 'test',
        password: '$2a$10$0ilP4ZD1kLugYwLCs4pmb.ZT9cFqzOZTNaMiHxrBnVIQUGUwEvBIO',
        avatar: 'https://image-1300566513.cos.ap-guangzhou.myqcloud.com/upload/images/5a9f48118166308daba8b6da7e466aab.jpg',
        email: 'test@qq.com',
        city: null,
        lastLogin: null,
        roles: [
          {
            id: 3,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-30T08:19:52',
            statu: 1,
            name: '普通用户',
            code: 'normal',
            remark: '只有基本查看功能',
            menuIds: []
          }
        ]
      }
    ],
    total: 2,
    size: 10,
    current: 1,
    orders: [],
    optimizeCountSql: true,
    hitCount: false,
    countId: null,
    maxLimit: null,
    searchCount: true,
    pages: 1
  }

  return Result
})
