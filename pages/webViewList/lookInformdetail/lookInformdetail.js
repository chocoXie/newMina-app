// pages/webViewList/lookInformdetail/lookInformdetail.js
const api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面传入的'+JSON.stringify(options),'lookInformdetail');
    let url
    if(wx.getStorageSync("accesstoken")){
        url = api.webViewUrl+'lookInformdetail?type=xcx&infoId='+options.infoId+'&accesstoken='+wx.getStorageSync("accesstoken")+'&accountId='+wx.getStorageSync("accountId")
    }else{
      if(options.infoId){
          url = api.webViewUrl+'lookInformdetail?type=xcx&infoId='+options.infoId
      }else{
          url = api.webViewUrl+'lookInformdetail?type=xcx'
      }
    }
    this.setData({
      url:url
    },()=>{
      console.log('访问的'+this.data.url,'lookInformdetail');
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
    return {
      title: '加盟好餐饮，就找餐盟严选！',
    }
  }
})