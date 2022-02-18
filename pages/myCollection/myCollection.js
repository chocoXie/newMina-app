const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    pageNum:1,
    total:'',
    loading: false,
    noMore: false,
    pageSize:10,
    emptyData:-1

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
    this.setData({
      pageNum: 1,

    }, () => {
      // wx.pageScrollTo({
      //   scrollTop: 0
      // })
      this.getMyCollectList()
     
    })

  },
  //我的收藏
  getMyCollectList(type){
   
    const {pageNum,dataList,pageSize} = this.data
    let params = {
      accessToken:wx.getStorageSync("accesstoken"),
      pageNum: pageNum,
      pageSize: pageSize,
      userId: wx.getStorageSync("accountId"),
    }
    
    util.request(api.javahost + "support/v1.0/coll/list", params, 'POST')
    .then((res) => {
      wx.hideLoading()
      if (res.code == 0) {
        let data = res.data || []
        if(res.data.length){
          this.setData({
            emptyData: 1,
          })
        }else{
          this.setData({
            emptyData: 2,
          })
        }
     
        if(type){
          data=dataList.concat(data)
        }
        data.map((item)=>{
          if(item.information){
           item.informationInfo = item.information
          }
        })
        console.log('data',data);
        this.setData({
          dataList:data,
          total:res.total,
          noMore:data.length>0?true:false
        })

      }
    })
    .catch((error) => {
      wx.hideLoading()
      console.log(error);
    });
  },

  onPullDownRefresh() {
    this.setData({
      pageNum:1
    },()=>{
      this.getMyCollectList()
      wx.pageScrollTo({
        scrollTop: 0
      })
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
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
    const {pageNum ,total,pageSize} = this.data
    let number = pageNum
    if(number==Math.ceil(total/pageSize)){
      this.setData({
        loading: false,
        noMore:true
      })
    }else{
      number = pageNum+1
      this.setData({
        pageNum:number
      },()=>{
          this.getMyCollectList(true)
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