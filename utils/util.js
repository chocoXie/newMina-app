var api = require('../config/api.js');
var app = getApp();

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET",Contenttype = 'application/json') {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': Contenttype,
        'distinctId': getApp().sensors.getAnonymousID() || '',
        'X-Wpmall-Token': wx.getStorageSync('accesstoken'),
        'deviceId': 'wechat_Mini_Program',
        'accessToken': wx.getStorageSync('accesstoken'),
        'deviceType': 3,
        'Authorization': 'Bearer ' + wx.getStorageSync('accesstoken')
      },
      success: function (res) {

        if (res.statusCode == 200) {

          if (res.data.errno == 501) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            wx.navigateTo({
              url: '/pages/login/login'
            });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

function throttle(fn, interval) {
  var enterTime = 0; //触发的时间
  var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

function getCustomer(options = {}) {
  const {
    sendImageUrl,
    titleName,
    mainPoint,
    subTitle,
    city,
    word,
    sendBrandID
  } = options
  const brandObj = {
    sendImageUrl,
    titleName,
    mainPoint,
    subTitle,
    city,
    sendBrandID
  }
  let data = {
    phone: wx.getStorageSync('userPhone'),
    accountId: wx.getStorageSync('accountId'),
    imId: wx.getStorageSync('nimId'),
    channel: 'xcx'
    //  brandName
  }

  request(api.javaCustserviceUrl + "custservice/v1.0/huiju/getSaleIm", data, 'POST').then(res => {

    if (res.code == 0) {
      debugger
      let url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId + '&word=' + (word || '我要咨询该品牌优惠活动') + '&brandObj=' + JSON.stringify(brandObj)

      getApp().sensors.track('consultationInitiate', {
        click_source: '首页-专属客服',
        brand_name: '',
        brand_id: ''
      })

      wx.navigateTo({
        url: url
      });

      wx.removeStorageSync('accessOption')
    }
  })


}

function getnewDateSeconds(){
  return parseInt(new Date().getTime());
}
function login2hoursCoundown(){
  //7200000
  if(wx.getStorageSync('UserCloseLoginTime')){
    let expiredTime =parseInt(wx.getStorageSync('UserCloseLoginTime')) + 7200000;
    let thisDateSeconds = getnewDateSeconds() ;
    let tztime = expiredTime - thisDateSeconds
    let url = "/pages/login/login";
    setTimeout(function(){
      console.log('9655487454')
      wx.navigateTo({
        url
      });
    },tztime)
  }
}

module.exports = {
  formatTime,
  request,
  redirect,
  showErrorToast,
  throttle,
  getCustomer,
  getnewDateSeconds,
  login2hoursCoundown
}