const api = require('../../config/api.js');
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    title: "通知",
    noticeData: [],
    imgShow: '-1',
  },
  getNoticeNewsList() {
    let params = {
      accountId: wx.getStorageSync('accountId'),
      pageNum: 1,
      pageSize: 100
    };
    util.request(api.javaMsgmgrUrl + "v1.0/noticeMsg/app/msgList", params, 'POST')
      .then((res) => {
        console.log('rs', res)
        if (res.code == 0) {
          let imgShow
          if (res.data.length > 0) {
            imgShow = '1'
          } else {
            imgShow = '2'
          }
          this.setData({
            noticeData: res.data,
            imgShow: imgShow
          })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNoticeNewsList()
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