const util = require('../../utils/util.js');

var api = require('../../config/api');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    urls: '',
    allTimes: '',
    onlineTime: 0,
    brandObj: {},
    telSaleName: '',
    kfzx:false
  },
  sucWeb(e) {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = ''
    this.setData({
      brandObj: options.brandObj
    })
    var getTimestamp = new Date().getTime();
    if (options.brandObj && options.word) {
      url = `${api.imWebUrl}im.html?getTimestamp=${getTimestamp}&nimToken=${wx.getStorageSync('nimToken')}&nimId=${wx.getStorageSync('nimId')}&accessToken=${wx.getStorageSync('accesstoken')}&accountId=${wx.getStorageSync('accountId')}&phone=${wx.getStorageSync('userPhone')}&brandObj=${options.brandObj}&word=${options.word}&/#chat/${options.sessionId}`
    } else if (options.brandObj) {
      url = `${api.imWebUrl}im.html?getTimestamp=${getTimestamp}&nimToken=${wx.getStorageSync('nimToken')}&nimId=${wx.getStorageSync('nimId')}&accessToken=${wx.getStorageSync('accesstoken')}&accountId=${wx.getStorageSync('accountId')}&phone=${wx.getStorageSync('userPhone')}&brandObj=${options.brandObj}&/#chat/${options.sessionId}`
    } else if (options.word) {
      url = `${api.imWebUrl}im.html?getTimestamp=${getTimestamp}&nimToken=${wx.getStorageSync('nimToken')}&nimId=${wx.getStorageSync('nimId')}&accessToken=${wx.getStorageSync('accesstoken')}&accountId=${wx.getStorageSync('accountId')}&phone=${wx.getStorageSync('userPhone')}&word=${options.word}&/#chat/${options.sessionId}`
    } else {
      url = `${api.imWebUrl}im.html?getTimestamp=${getTimestamp}&nimToken=${wx.getStorageSync('nimToken')}&nimId=${wx.getStorageSync('nimId')}&accessToken=${wx.getStorageSync('accesstoken')}&accountId=${wx.getStorageSync('accountId')}&phone=${wx.getStorageSync('userPhone')}&/#chat/${options.sessionId}`
    }
    if(options.backurl){
      this.setData({
        urls: decodeURIComponent(options.backurl)
      })
      wx.setStorageSync('Imurl',decodeURIComponent(options.backurl))
    }else{
      this.setData({
        urls: url
      })
      wx.setStorageSync('Imurl',url)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      urls: ''
    })
    this.data.allTimes = setInterval(() => {
      this.setData({
        onlineTime: ++this.data.onlineTime
      })
    }, 1000)
    // const brandObj = JSON.parse(this.data.brandObj);


    // app.sensors.track('consultationMessageInitiate', {
    //   message_type: '品牌消息',
    // })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data)
    console.log(this.data.onlineTime, 'alltio22');
    console.log('离开');
    const brandObj = JSON.parse(this.data.brandObj);
    
    app.sensors.track('consultationMessageInitiate', {
      message_type: '品牌消息',
    })
    app.sensors.track('consultationResultado', {
      consultation_brand: brandObj.titleName,
      length_of_consultation: this.data.onlineTime + '' || 10,
      consult_times: 1,
      responder: '',
    })
  }
})
