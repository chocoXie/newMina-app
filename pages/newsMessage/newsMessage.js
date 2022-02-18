var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');

const app = getApp();

Page({
  data: {
    url: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数




  },
  onReady: function () {
    // 页面渲染完成
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onShow: function () {
    let getTimestamp = new Date().getTime();
    //  https://vine-static.kuaidao.cn/wapIM/
    if (wx.getStorageSync('accesstoken')) {
      this.isLogin = true
      var url = `${api.imWebUrl}im.html?getTimestamp=${getTimestamp}&nimToken=${wx.getStorageSync('nimToken')}&nimId=${wx.getStorageSync('nimId')}&accessToken=${wx.getStorageSync('accesstoken')}&accountId=${wx.getStorageSync('accountId')}&phone=${wx.getStorageSync('userPhone')}#/session`
      app.sensors.track('consultationInitiate',{
        click_source:'消息',
        brand_name:'',
        brand_id:''
      })
      this.setData({
        url: url
      })
    }
    else {
      var url = "/pages/login/login?type=message";
      wx.setStorageSync('accessPath','3消息')
      wx.navigateTo({ url });
      app.sensors.track('registerLoginButtonClick',{
        login_source:'3消息'
      })
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

})