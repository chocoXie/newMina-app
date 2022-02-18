let lastId
let isGo = false
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [
      // {
      //   imgUrl: 'http://vodloylvqpr.vod.126.net/vodloylvqpr/75e27741-7c51-4d37-8409-31a13af17b23.mp4',
      //   isVideo: true,
      //   imgUrl2: 'http://static.kuaidao.cn/vod/e2k7YbMYPY.jpg'
      // },
      // {
      //   imgUrl: 'http://static.kuaidao.cn/banner/kyNmF3C525.jpg',
      //   isVideo: false
      // },
      // {
      //   imgUrl: 'http://static.kuaidao.cn/banner/CMWPkMnti5.jpg',
      //   isVideo: false
      // },
    ],
    titleList: [
      // {
      //   name: '视频',
      //   value: 0,
      //   isActive: false,
      //   id:0
      // },
      // {
      //   name: '店面',
      //   value: 2,
      //   isActive: false,
      //   id:1
      // },
      // {
      //   name: '产品',
      //   value: 4,
      //   isActive: true,
      //   id:2
      // },
      // {
      //   name: '火爆现场',
      //   value: 6,
      //   isActive: false,
      //   id:3
      // }
    ],
    currentIndex: 0,
    allData: '',
    interval: 2000,
    duration: 500,
    showIndexBottom: 0,
    showIndexBotList: [],
    videoPlay: true,
    videoCtx: '',
    isShowLastImage: false,
    heightTop: '',
    token: wx.getStorageSync('accesstoken') || ''

  },
  playClick() {
    this.setData({
      videoPlay: false
    })
    this.data.videoCtx.play()
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    })
  },
  tableBarClick(e) {
    const {
      titleList,
      swiperList
    } = this.data
    let newIndex = e.currentTarget.dataset.index
    let newImgUrl
    titleList.map((item) => {
      if (item.id == newIndex) {
        item.isActive = true
        newImgUrl = item.dataList[0].imgUrl
        if (item.name == '视频') {
          this.buryingPointFun('图片详情-视频')
        }
        if (item.name == '店面') {
          this.buryingPointFun('图片详情-店面')
        }
        if (item.name == '产品') {
          this.buryingPointFun('图片详情-产品')
        }
        if (item.name == '火爆现场') {
          this.buryingPointFun('图片详情-火爆现场')
        }
      } else {
        item.isActive = false
      }
    })
    this.setData({
      titleList: titleList
    }, () => {
      swiperList.map((item, index) => {
        if (item.imgUrl == newImgUrl) {
          this.swiperChangeNext(index)
        }
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  slideEnd(event) {
    const {
      swiperList,
      currentIndex,
      allData
    } = this.data
    console.log(event, currentIndex, 11111);
    if (isGo && currentIndex == swiperList.length - 1) {
      var url = '/packageA/pages/swiperDetailsLast/swiperDetailsLast?allData=' + JSON.stringify(allData)
      wx.navigateTo({
        url
      });
    }
    if (currentIndex == swiperList.length - 1) {
      isGo = true
    } else {
      isGo = false
    }

  },
  swiperChange(event) {
    const {
      titleList,
      isShowLastImage,
      currentIndex,
      swiperList,
      allData
    } = this.data
    console.log(event.detail.current);
    let isBlooe = false
    if (event.detail.current == swiperList.length - 1) {
      isBlooe = true
    } else {
      isBlooe = false
    }
    this.setData({
      isShowLastImage: isBlooe
    }, () => {
      if (isBlooe) {
        return
      } else {
        this.swiperChangeNext(event.detail.current)
      }
    })
  },

  swiperChangeNext(currentIndex) {
    const {
      titleList,
      swiperList,
      allData
    } = this.data
    titleList.map((item, index) => {
      item.dataList.map((itemChild, indexChild) => {
        item.isActive = false
        if (itemChild.imgUrl == swiperList[currentIndex].imgUrl) {
          this.setData({
            showIndexBottom: indexChild,
            showIndexBotList: titleList[index].dataList,
            currentIndex: currentIndex,
          }, () => {
            titleList[index].isActive = true
            this.setData({
              titleList: titleList,
            })
            setTimeout(() => {
              if (currentIndex != 0) {
                this.data.videoCtx.pause()
                // this.setData({
                //   videoPlay:false
                // })
              } else {
                // this.setData({
                //   videoPlay:true
                // })
              }
            }, 100)
          })
          lastId = currentIndex
        }
      })
    })
  },
  makeCall() {
    this.buryingPointFun('图片详情末尾-拨打电话')
    wx.makePhoneCall({
      phoneNumber: "4000330560" //仅为示例，并非真实的电话号码
    });
  },
  swiperHandle(newTitleList, imgUrl) {
    const {
      allData
    } = this.data
    let newSwiperList = []
    let showIndex = 1
    let showIndexBottom
    let showIndexBotList
    newTitleList.map((item, indexBar) => {
      newSwiperList = newSwiperList.concat(item.dataList)
      if (item.isActive) {
        item.dataList.map((itemChild, index) => {
          if (itemChild.imgUrl == imgUrl) {
            showIndexBottom = index

          }
        })
        showIndexBotList = newTitleList[indexBar].dataList
      }
    })
    newSwiperList.map((itemss, index) => {
      if (itemss.imgUrl == imgUrl) {
        showIndex = index
      }
    })
    newSwiperList.push({
      idShowLast: true,
      imgUrl: ''
    })
    console.log(newSwiperList, showIndex, showIndexBottom, showIndexBotList);
    this.setData({
      swiperList: newSwiperList,
      currentIndex: showIndex,
      showIndexBottom: showIndexBottom,
      showIndexBotList: showIndexBotList
    })
  },

  dataHandle() {
    const {
      allData
    } = this.data
    let newTitleList = []
    if (allData.video && allData.video.length > 0) {
      newTitleList.push({
        name: '视频',
        value: 0,
        isActive: false,
        id: 0,
        dataList: allData.video.splice(0, 1)
      }, )
    }
    if (allData.shopTypeimgs && allData.shopTypeimgs.length > 0) {
      let newProduct = allData.shopTypeimgs
      let newobj = {
        name: '店面',
        value: allData.shopTypeimgs.length,
        isActive: false,
        id: 1,
        dataList: allData.shopTypeimgs
      }
      newProduct.map((item) => {
        if (item.imgUrl == allData.imgUrl) {
          newobj.isActive = true
        }
      })
      newTitleList.push(newobj)
    }
    if (allData.product && allData.product.length > 0) {
      let newProduct = allData.product
      let newobj = {
        name: '产品',
        value: allData.product.length,
        isActive: false,
        id: 2,
        dataList: allData.product
      }
      newProduct.map((item) => {
        if (item.imgUrl == allData.imgUrl) {
          newobj.isActive = true
        }
      })
      newTitleList.push(newobj)
    }
    if (allData.hotSpotImgList && allData.hotSpotImgList.length > 0) {
      let newProduct = allData.hotSpotImgList
      let newobj = {
        name: '火爆现场',
        value: allData.hotSpotImgList.length,
        isActive: false,
        id: 3,
        dataList: allData.hotSpotImgList
      }
      newProduct.map((item) => {
        if (item.imgUrl == allData.imgUrl) {
          newobj.isActive = true
        }
      })
      newTitleList.push(newobj)
    }

    this.swiperHandle(newTitleList, allData.imgUrl)
    this.setData({
      titleList: newTitleList
    })
  },

  goWeChat(e) {
    const {
      allData
    } = this.data
    this.buryingPointFun(e.currentTarget.dataset.type)
    console.log(123)
    if( wx.getStorageSync('accesstoken') ){
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
              var brandObj = {
                "sendImageUrl": allData.brandLogo,
                "titleName": allData.brandName,
                "mainPoint": allData.mainPoint,
                "subTitle": allData.joinInvestMin + '-' + allData.joinInvestMax,
                "city": allData.location,
                "sendBrandID": allData.brandId,
                "categoryName":allData.categoryName
              }
              var url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId + '&brandObj=' + JSON.stringify(brandObj)
              app.sensors.track('consultationInitiate', {
                click_source: '品牌详情页-相册咨询',
                brand_name: allData.brandName,
                brand_id: allData.brandId
              })
              // var url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId
              wx.navigateTo({
                url: url
              });
            }
          })
          .catch((error) => {});
      } else {
        let url = "/pages/login/login"
        wx.setStorageSync('accessPath', '28品牌详情页-相册咨询')
        // wx.navigateTo({url})
        app.sensors.track('registerLoginButtonClick', {
          login_source: '28品牌详情页-相册咨询'
        })
      }
    }
  },
  getPhoneNum(e) {
    user.login();
    app.getPhoneNumber(e).then(res => {
      if (res) {
        this.setData({
          token: wx.getStorageSync('accesstoken') || ''
        });
      }
    })
  },
  onLoadFunction(options) {
    this.setData({
      allData: JSON.parse(options.allData),
      videoCtx: wx.createVideoContext('myVideoTwo', this),
    }, () => {
      this.dataHandle()
    })
    console.log(JSON.parse(options.allData), '地址栏传的参数');

  },

  onLoad: function (options) {
    const {
      top,
      height
    } = app.globalData
    this.setData({
      heightTop: (top + height)
    })
    this.onLoadFunction(options)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff'
    })
  },
  // 埋点函数
  buryingPointFun(type) {
    const {
      allData
    } = this.data
    app.sensors.track('projectDetailClick', {
      button_name: type,
      brand_classification: allData.categoryName,
      brand_name: allData.brandName,
      brand_id: allData.brandId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

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
    console.log(99999999);
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