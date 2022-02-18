const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
//获取应用实例
const app = getApp();
Page({
  data: {
    url: ''
  },
  onLoad: function (options) {
    var accesstoken = wx.getStorageSync("accesstoken");
    var accountId = wx.getStorageSync("accountId");
    let url
    if (accesstoken && accountId) {
      url = api.webViewUrl + 'lookInfo?type=xcx&accesstoken=' + accesstoken + '&accountId=' + accountId
    } else {
      url = api.webViewUrl + 'lookInfo?type=xcx'
    }
    this.setData({
      url: url
    }, () => {
      console.log(this.data.url, '访问的地址');
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    if (!wx.getStorageSync('accesstoken')) {
      //定时进入登录弹窗
      // this.setTimeOpenLogin()
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },


})