// pages/myFootprint/myFootprint.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuActive: 0,
    dataList: [],
    loading: false,
    noMore: false,
    pageNum: 1,
    total: '',
    top:'',
    emptyData:-1
  },

  menuClick(e) {
    this.setData({
      menuActive: e.currentTarget.dataset.id,
      dataList:[],
      loading: false,
      noMore: false,
      pageNum: 1,
      total: '',
      emptyData:-1
    },()=>{
      wx.showLoading()
      this.initData()
    })
  },

  initData(type) {
    const { pageNum, dataList,menuActive } = this.data
    let params={
      pageNum: pageNum,
      pageSize: 10,
      userId: wx.getStorageSync('accountId'),
      accessToken: wx.getStorageSync('accesstoken')
    }
    if(menuActive==0){
      params.busType=1
    }else{
      params.typeList=[2,4]
    }
    util.request(api.javahost + "support/v1.0/userFootprint/list", params, 'POST')
      .then(res => {
        if (res.code == "0") {
          wx.hideLoading()
          let newDataList = res.data || []
          if(res.data){
            this.setData({
              emptyData: 1,
            })
          }else{
            this.setData({
              emptyData: 2,
            })
          }
          if (type) {
            newDataList = dataList.concat(res.data)
          }
          this.setData({
            dataList: newDataList,
            total: res.total,
            noMore: true
          })
        }
      })
      .catch(err => {
        wx.hideLoading()
        console.log(err.status, err.message);
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    const { top, height } = app.globalData
    wx.showLoading()
    this.setData({
      pageNum: 1,
       top: (top + height),
    }, () => {
      this.initData()
     
    })
 
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
  //监听轮播图的下标
  onPullDownRefresh() {
    this.setData({
      pageNum: 1
    }, () => {
      this.initData()
      wx.pageScrollTo({
        scrollTop: 0
      })
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const { dataList,pageNum, total } = this.data
    console.log('上啦加载',dataList,total);
    if (dataList.length == 0) {
      return
    }
    this.setData({
      loading: true,
      noMore: false
    })
    let number = pageNum
    if (number == Math.ceil(total / 10)) {
      this.setData({
        loading: false,
        noMore: true
      })
    } else {
      number = pageNum + 1
      this.setData({
        pageNum: number
      }, () => {
        this.initData(true)
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return {
  //     title: '加盟好餐饮，就找餐盟严选！',
  //   }
  // }
})