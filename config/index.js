// config/index.js
export default {
    development: {
      baseUrl: '/api' // 开发代理地址
    },
    beta: {
      baseUrl: '//rap2api.taobao.org/app/mock/301449/' // 测试接口域名
    },
    release: {
      baseUrl: '//backend-api-02.newbee.ltd/manage-api/v1' // 正式接口域名
    }
  }