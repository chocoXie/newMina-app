/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
        // wx.login({
        //   success: function (res) {
        //     wx.setStorageSync('code', res.code)
        //     resolve(true);
        //   },
        //   fail: function (err) {
        //     reject(false);
        //   }
        // });
      }
    })
  });
}


/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.setStorageSync('code', res.code)
          resolve(res.code);
        } else {
          reject(false);
        }
      },
      fail: function(err) {
        reject(false);
      }
    });
    // resolve();
  });
}

/**
 * 调用微信登录
 */
function loginByWeixin(type,set_iv,set_encryptedData,set_logincode ) {
  return new Promise(function (resolve, reject) {
    // return login().then((res) => {

    // }).catch((err) => {
    //   reject(err);
    // })
    let getPresetProperties = getApp().sensors.getPresetProperties()
    //登录远程服务器
    let encryptedData = wx.getStorageSync('encryptedData')
    let iv = wx.getStorageSync('iv')
    let code = '';
    if(set_logincode){
      code = set_logincode;
    }else{
      code = wx.getStorageSync('code');
    }
    util.request(api.javaUserHost + 'v2.0/app/sys/wechatAppletLogin', {
      code: code,
      encryptedData: set_encryptedData,
      iv: set_iv,
      // encryptedData:encryptedData,
      // iv:iv,
      // code:code,
      userEntrance: parseInt(wx.getStorageSync('accessPath')) || '',
      method: type || '',
      app_version: getPresetProperties.$lib_version || '',
      os: getPresetProperties.$os || '',
      os_version: getPresetProperties.$os_version || '',
      wifi: getPresetProperties.$network_type == 'WIFI' ? true : false,
      is_first_day: getPresetProperties.$is_first_day || '',
      model: getPresetProperties.$model || '',
    }, 'POST').then(result => {
     if (result.code == 0) {
        //存储用户信息
        wx.setStorageSync("accountId", result.data.accountId);
        wx.setStorageSync("accesstoken", result.data.accessToken);
        wx.setStorageSync("userId", result.data.userId);
        wx.setStorageSync("nimId", result.data.nimId);
        wx.setStorageSync("nimToken", result.data.nimToken);
        wx.setStorageSync("userPhone", result.data.userPhone); 
        getApp().sensors.login(result.data.accountId)
        resolve(result);
      } else {
        reject(result);
      }
    }).catch((err) => {
      reject(err);
    });
  })
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('accountId') && wx.getStorageSync('accesstoken')) {
      // wx.showToast({
      //   title: '我登录过了',
      // })
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      // wx.login({
      //   success: function (res) {
      //     wx.setStorageSync('code', res.code)
      //     resolve(true);
      //   },
      //   fail: function (err) {
      //     reject(false);
      //   }
      // });
      reject(false);
    }
  })
}
function setwechaINitMsg(_encryptedData,_iv){
  return new Promise((resolve,reject)=>{
    wx.setStorageSync('encryptedData',_encryptedData)
    wx.setStorageSync('iv', _iv)
    if(wx.getStorageSync('encryptedData')){
      resolve(true)
    }else{
     reject(false)
    }
  })
}

module.exports = {
  setwechaINitMsg,
  login,
  loginByWeixin,
  checkLogin,
};