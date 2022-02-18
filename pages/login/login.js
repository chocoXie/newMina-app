var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');

var app = getApp();
Page({
  data: {
    heightTop: '',
    type: false,
    loginStayPop: false,
    closeStayPropFlag: false,
    token: wx.getStorageSync('accesstoken') || '',
    checkTken:''
  },
  onLoad(options) {
    if (this.options.type) {
      this.setData({
        type: true
      })
    }
  },
  stayGiveUpLogin(e) {
    const {
      type
    } = this.data
    if (type) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
    let closeLoginTime = util.getnewDateSeconds()
    wx.setStorageSync('UserCloseLoginTime', closeLoginTime)
    this.registerClickFun(e.currentTarget.dataset.typsmsg)
  },
  registerClickFun(msg) {
    app.sensors.track('registerClick', {
      click_source: msg
    })
  },
  cancelBack(e) {
    const {
      closeStayPropFlag
    } = this.data
    if (!closeStayPropFlag) {
      this.setData({
        loginStayPop: true
      })
    } else {
      this.stayGiveUpLogin()
    }
    this.registerClickFun(e.currentTarget.dataset.typsmsg)
  },
  closeLoginStayPop(e) {
    this.setData({
      loginStayPop: false,
      closeStayPropFlag: true
    })
    this.registerClickFun(e.currentTarget.dataset.typsmsg)
  },
  goPage(e) {
    console.log(e.currentTarget.dataset.id);
    var url = '/pages/webViewList/userAgreement/userAgreement?type=' + e.currentTarget.dataset.id
    wx.navigateTo({
      url
    });
  },
  getPhoneNumber(e) {
    let {checkTken} = this.data;
    this.registerClickFun(e.target.dataset.typsmsg)
    // user.login();
     //直接调用wx.login 获取code
     if (e.detail.errMsg == "getPhoneNumber:ok") {
      let _iv = e.detail.iv;
      let _encryptedData = e.detail.encryptedData
      user.checkLogin().catch(() => {
        if (!wx.getStorageSync('code')) {
          wx.login({
            success: function (res) {
              if (res) {
                user.loginByWeixin('微信授权登录-页面', _iv, _encryptedData, res.code).then(res => {
                  if (wx.getStorageSync('accessOption')) {
                    util.getCustomer(wx.getStorageSync('accessOption'))
                  }
                  resolve(true);
                  wx.showToast({
                    title: "微信授权成功",
                    icon: "none",
                    duration: 2000,
                  });
                  wx.navigateBack({
                    delta: 1
                  })
                  // clearInterval(this.checkTken) 
                }).catch((err) => {
                  // reject(false)
                  util.showErrorToast('微信登录失败');
                });
              }
            }
          })
        }else{
          user.loginByWeixin('微信授权登录-页面', _iv, _encryptedData).then(res => {
            if (wx.getStorageSync('accessOption')) {
              util.getCustomer(wx.getStorageSync('accessOption'))
            }
            wx.showToast({
              title: "微信授权成功",
              icon: "none",
              duration: 2000,
            });
            wx.navigateBack({
              delta: 1
            })
          }).catch((err) => {
            util.showErrorToast('微信登录失败');
          });
        }
      })
    } else {
      app.sensors.track('loginClose', {})
      wx.showToast({
        title: "用户取消授权",
        icon: "none",
        duration: 2000,
      });
    }
  },
  onReady: function () { },
  onShow: function () {
    const {
      top,
      height
    } = app.globalData
    this.setData({
      heightTop: (top + height)
    })
    // 页面显示
    wx.login({
      success: function (res) {
        wx.setStorageSync('code', res.code)
      },
      fail: function (err) {

      }
    });
  },
  onHide: function () {
  },
  onUnload: function () {
    // 页面关闭
    app.sensors.track('loginClose', {})
  },
  accountLogin: function (e) {
    wx.navigateTo({
      url: "/pages/iphoneLogin/iphoneLogin"
    });
    this.registerClickFun(e.currentTarget.dataset.typsmsg)
  }
})