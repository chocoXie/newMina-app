const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onlineConsultation() {
    const { allData } = this.data
    if (wx.getStorageSync("accountId")) {
      let data = {
        phone: wx.getStorageSync('userPhone'),
        accountId: wx.getStorageSync('accountId'),
        imId: wx.getStorageSync('nimId'),
        channel: 'xcx',
        brandName: allData.brandName
      }
      util.request(api.javaCustserviceUrl + "custservice/v1.0/huiju/getSaleIm", data, 'POST')
        .then((res) => {
          console.log(res)
          if (res.code == 0) {
            var brandObj = { "sendImageUrl": allData.brandLogo, "titleName": allData.brandName, "mainPoint": allData.mainPoint, "subTitle": allData.joinInvestMin + '-' + allData.joinInvestMax, "city": allData.location, "sendBrandID": allData.brandId }
            var url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId + '&brandObj=' + JSON.stringify(brandObj)
            // var url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId
            wx.navigateTo({
              url: url
            });
          }
        })
        .catch((error) => { });
    } else {
      let url = "/pages/login/login"
      wx.navigateTo({ url })
    }
  },
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: "4000330560" //仅为示例，并非真实的电话号码
    });
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      allData: JSON.parse(options.allData),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})