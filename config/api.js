// 测试服务器API地址
// var WxApiRoot = 'http://192.168.17.1:8180/wx/';
//生产服务器API地址
var WxApiRoot = 'https://api.950mall.cn/wx/';

// 获取当前帐号信息
const accountInfo = wx.getAccountInfoSync();

// env类型
const envs = accountInfo.miniProgram.envVersion;
// const envs = 'release'

// develop  // 开发版
// trial   // 体验版
// release  // 正式版

let config = null
const configTest = {
  // host: "https://kdwap-api-test.kuaidaoapp.com/",  //test
  // javahost: 'https://kuaidaoservice-support-test.kuaidaoapp.com/',//test
  // javaUserHost: 'https://kuaidaoservice-sys-test.kuaidaoapp.com/', //rest
  // javaBrandHost: 'https://kuaidaoservice-brand-test.kuaidaoapp.com/',//test
  // imgUrl: 'http://wap.kuaidao.cn/static/images/',
  // javaMsgmgrUrl: "https://kuaidaoservice-msgmgr-test.kuaidaoapp.com/",//test
  // javabranderUrl: "https://kuaidaoservice-banner-test.kuaidaoapp.com/",
  // javaInformation: "https://kuaidaoservice-information-test.kuaidaoapp.com/",
  host: 'https://kdwap-api-pre.kuaidaoapp.com/',
  hostUrl: 'http://custservice-pre.kuaidaoapp.com/',
  javahost: "https://support-pre.kuaidaoapp.com/",
  javaUserHost: "https://account-pre.kuaidaoapp.com/",
  javaBrandHost: "https://kuaidaoservice-brand-pre.kuaidaoapp.com/",
  baseUrl: "https://kuaidaoservice-manager-mobile-pre.kuaidaoapp.com/",
  resourceUrl: 'https://static.kuaidao.cn/wap/images/im/',
  newImgUrl: 'https://static.kuaidao.cn/qingteng/mini-program/mini-sj-box/',
  webViewUrl: 'https://cmwap-frontend-pre.kuaidaoapp.com/#/', //
  imWebUrl: 'https://web-im-pre.kuaidaoapp.com/',
  javaCustserviceUrl: 'https://custservice-pre.kuaidaoapp.com/',
  imgUrl: 'https://wap.kuaidao.cn/static/images/',
  javabranderUrl: "https://banner-pre.kuaidaoapp.com/",
  javaMsgmgrUrl: "https://msgmgr-pre.kuaidaoapp.com/",
  javaInformation: "https://information-pre.kuaidaoapp.com/",
  sensorsUrl: "https://canmeng.datasink.sensorsdata.cn/sa?project=default&token=561151e8ccfe43da",
  javaActivityUrl:"https://kuaidaoservice-activity-ad-pre.kuaidaoapp.com/",
}


const configProd = {
  host: "https://mapi.kuaidao.cn/", //online
  hostUrl: 'https://custservice.kuaidao.cn/',
  javahost: 'https://support.kuaidao.cn/', //online
  javaUserHost: 'https://account.kuaidao.cn/', //online
  javaBrandHost: 'https://brand.kuaidao.cn/', //release
  baseUrl: "https://m.kuaidao.cn/",
  imgUrl: 'http://wap.kuaidao.cn/static/images/',
  resourceUrl: 'https://static.kuaidao.cn/wap/images/im/',
  newImgUrl: 'https://static.kuaidao.cn/qingteng/mini-program/mini-sj-box/',
  webViewUrl: 'https://wap.shangji.cn/#/', //online
  imWebUrl: 'https://web-im-prod.kuaidao.cn/',
  javaMsgmgrUrl: "https://msgmgr.kuaidao.cn/", //online
  javaCustserviceUrl: 'https://custservice.kuaidao.cn/',
  javabranderUrl: "https://banner.kuaidao.cn/",
  javaInformation: "https://information.kuaidao.cn/",
  sensorsUrl: 'https://canmeng.datasink.sensorsdata.cn/sa?project=production&token=561151e8ccfe43da',
  javaActivityUrl:"https://activity-ad.kuaidao.cn/",
}
if (envs == 'develop') {
  config = configTest
} else if (envs == 'release') {
  config = configProd
} else if (envs == 'trial') {
  config = configTest
}

module.exports = {
  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号
  ...config
};