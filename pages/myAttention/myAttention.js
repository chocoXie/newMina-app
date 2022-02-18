// pages/myAttention/myAttention.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    loading: false,
    noMore: false,
    pageNum: 1,
    total:'',
    emptyData:-1
  },

  onReachBottom() {
    console.log('上啦加载');
    const {dataList} = this.data
    if(dataList.length==0){
        return
    }
    this.setData({
      loading: true,
      noMore:false
    })
    const {pageNum ,total} = this.data
    let number = pageNum
    if(number==Math.ceil(total/10)){
      this.setData({
        loading: false,
        noMore:true
      })
    }else{
      number = pageNum+1
      this.setData({
        pageNum:number
      },()=>{
          this.initData(true)
      })
    }
  },

  
  
  initData(type) {
    const {pageNum,dataList} = this.data
    util.request(api.javahost + "support/v1.0/focus/list", {
      pageNum: pageNum,
      pageSize: 10,
      userId: wx.getStorageSync('accountId'),
      accessToken:wx.getStorageSync('accesstoken')
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          wx.hideLoading()
          let newDataList=res.data||[]
          if(res.data){
            this.setData({
              emptyData: 1,
            })
          }else{
            this.setData({
              emptyData: 2,
            })
          }
          if(type){
            newDataList=dataList.concat(res.data)
          }
          this.setData({
            dataList: newDataList,
            total:res.total,
            noMore:true
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
    wx.showLoading()
    this.initData()
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
      pageNum:1
    },()=>{
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
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return {
  //     title: '加盟好餐饮，就找餐盟严选！',
  //   }
  // }
})