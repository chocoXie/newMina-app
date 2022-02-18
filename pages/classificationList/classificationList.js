const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
import Dialog from '../../lib/vant-weapp/dialog/dialog';
//获取应用实例
const app = getApp();
Page({
  data: {
    show: false,
    token: wx.getStorageSync('accesstoken') || '',
    codeList: [
      "BRAND_CATEGORY",
      "BRAND_INVESTMENT",
      "BRAND_AREA",
      "REGION_TAG"
    ], //获取筛选项的请求参数
    topTagList: [{
        name: ['餐饮分类'],
        direction: false,
        active: 1,
        select: [1],
        cateringList: []
      },
      {
        name: '投资区间',
        direction: false,
        active: 2,
        select: 0,
        cateringList: [{
            name: '全部',
            id: 0
          },
          {
            name: '10-20万',
            id: 1
          },
          {
            name: '20-30万',
            id: 2
          },
          {
            name: '30-50万',
            id: 3
          },
          {
            name: '50万以上',
            id: 4
          },
        ]

      }, {
        name: '智能排序',
        direction: false,
        active: 3,
        select: 0,
        cateringList: [{
            name: '智能排序',
            id: 0
          },
          {
            name: '项目关注度',
            id: 1
          },
          {
            name: '投资额由低到高',
            id: 2
          },
          {
            name: '投资额由高到低',
            id: 3
          },
        ]
      }
    ],
    cateringList: [],
    dataList: [],
    guessYouList: [],
    loading: false,
    noMore: false,
    pageNum: 1,
    total: '',
    isShowService: true,
    isShowOne: false,
    scrollTop: false,
    heightTop: '',
    typeIndex: 0
  },
  getPhoneNum (e) {
    user.login();
    app.getPhoneNumber(e).then(res => {
      if (res) {
        this.setData({
          token: wx.getStorageSync('accesstoken') || ''
        })
      }
    })
  },
  openWeChat() {
    if (wx.getStorageSync("accountId")) {
      let data = {
        phone: wx.getStorageSync('userPhone'),
        accountId: wx.getStorageSync('accountId'),
        imId: wx.getStorageSync('nimId'),
        channel: 'xcx'
        //  brandName
      }
      util.request(api.javaCustserviceUrl + "custservice/v1.0/huiju/getSaleIm", data, 'POST')
        .then((res) => {
          console.log(res)
          if (res.code == 0) {
            var url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId
            app.sensors.track('consultationInitiate', {
              click_source: '品牌列表页',
              brand_name: '',
              brand_id: ''
            })
            wx.navigateTo({
              url: url
            });
          }
        })
        .catch((error) => {});
    } else {
      let url = "/pages/login/login"
      wx.setStorageSync('accessPath', '13品牌列表-加盟顾问')
      wx.navigateTo({
        url
      })
      app.sensors.track('registerLoginButtonClick', {
        login_source: '13品牌列表-加盟顾问'
      })
    }
  },
  closeService() {
    this.setData({
      isShowService: false
    })
  },
  //监听轮播图的下标
  onPullDownRefresh() {
    this.setData({
      pageNum: 1
    }, () => {
      this.initDataList()
      wx.pageScrollTo({
        scrollTop: 0
      })
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  showPopup(e) {
    console.log('点击标签');
    const {
      topTagList
    } = this.data
    let newTopTagList = JSON.parse(JSON.stringify(topTagList))
    let newItem = e.currentTarget.dataset.item
    let number = 0
    newTopTagList.map((item) => {
      if (item.active == newItem.active) {
        item.direction = !item.direction
      } else {
        item.direction = false
      }
      if (!item.direction) {
        number = number + 1
      }
    })
    setTimeout(() => {
      this.setData({
        topTagList: newTopTagList,
      })
    }, 200)
    this.setData({
      show: number == 3 ? false : true
    })
  },
  onCloseAfter() {
    const {
      topTagList
    } = this.data
    let newTopTagList = JSON.parse(JSON.stringify(topTagList))
    newTopTagList.map((item) => {
      item.direction = false
    })
    this.setData({
      topTagList: newTopTagList
    })
  },
  onClose() {
    this.setData({
      show: false,
    });
  },
  onPageScroll: function (e) {
    const {
      scrollTop
    } = this.data
    if (e.scrollTop > 10) {
      if (!scrollTop) {
        this.setData({
          scrollTop: true
        })
      }
    } else {
      if (scrollTop) {
        this.setData({
          scrollTop: false
        })
      }
    }

  },

  cateringClick(e) {
    let newId = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    const {
      topTagList
    } = this.data
    let newTopTagList = JSON.parse(JSON.stringify(topTagList))
    // 餐饮分类
    if (type == 'classification') {
      if (newId == 0) {
        newTopTagList[0].select = [1]
      } else if (newId == 'reset') {
        newTopTagList[0].select = [1]
      } else if (newId == 'confirm') {
        this.setData({
          pageNum: 1
        }, () => {
          this.initDataList()
          wx.pageScrollTo({
            scrollTop: 0
          })
        })
      } else {
        if (newTopTagList[0].select.indexOf(newId) > -1) {
          newTopTagList[0].select.splice(newTopTagList[0].select.indexOf(newId), 1)
        } else {
          newTopTagList[0].select.push(newId)
        }
        if (newTopTagList[0].select.length > 0) {
          if (newTopTagList[0].select[0] == 1) {
            newTopTagList[0].select.splice(0, 1)
          }
        } else {
          newTopTagList[0].select.push(1)
        }

      }
      this.setData({
        topTagList: this.wordHandle(newTopTagList)
      })
    } else if (type == 'investmentRange') { //投资区间
      newTopTagList[1].select = newId
      this.setData({
        topTagList: this.wordHandle(newTopTagList),
        pageNum: 1
      }, () => {
        this.initDataList()
        wx.pageScrollTo({
          scrollTop: 0
        })
      })
    } else if (type == 'sort') {
      newTopTagList[2].select = newId
      this.setData({
        topTagList: this.wordHandle(newTopTagList),
        pageNum: 1
      }, () => {
        this.initDataList()
        wx.pageScrollTo({
          scrollTop: 0
        })
      })
    }


  },

  wordHandle(data) {
    let newData = JSON.parse(JSON.stringify(data))
    newData.map((item) => {
      if (typeof (item.select) == 'number') {
        item.cateringList.map((itemChild) => {
          if (itemChild.id == item.select) {
            item.name = itemChild.name == '全部' ? '投资区间' : itemChild.name
          }
        })
      } else {
        let newName = []
        item.cateringList.map((itemTwo) => {
          item.select.map((itemThree) => {
            if (itemTwo.id == itemThree) {
              newName.push(itemTwo.name)
            }
          })
        })
        item.name = newName.join() ? newName.join() : '餐饮分类'
      }
    })
    return newData
  },

  onReachBottom() {
    const {
      dataList,
      pageNum,
      total
    } = this.data
    if (dataList.length <= 5) {
      return
    }
    let number = pageNum
    if (number == Math.ceil(total / 10)) {
      this.setData({
        loading: false,
        noMore: true
      })
    } else {
      number = pageNum + 1
      this.setData({
        pageNum: number,
        loading: true,
        noMore: false
      }, () => {
        this.initDataList(true)
      })
    }
  },

  // 餐饮分类列表
  initCatering(name) {
    const {
      codeList,
      topTagList
    } = this.data
    let newTopTagList = JSON.parse(JSON.stringify(topTagList))
    util.request(api.baseUrl + "mobile/brand/listTags", {
        codeList: codeList
      }, 'POST')
      .then(res => {
        if (res.code == "0") {
          newTopTagList[0].cateringList = res.data[0].tagList[0].childList
          if (name) {
            newTopTagList[0].name = name
            newTopTagList[0].cateringList.map((item, index) => {
              if (item.name == name) {
                newTopTagList[0].select = [item.id]
              }
            })
          } else {
            newTopTagList[0].name = '餐饮分类'
            newTopTagList[0].select = [1]
          }
          this.setData({
            topTagList: newTopTagList
          }, () => {
            wx.showLoading()
            this.initDataList()
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },

  initDataList(type) {
    const {
      topTagList,
      dataList,
      pageNum
    } = this.data
    let joinInvestMax
    let joinInvestMin
    let attentionSort
    let amountSort
    let tagList
    // 餐饮分类
    if (topTagList[0].select[0] == 1) {
      // tagList = [topTagList[0].cateringList[0].id]
      tagList = []
    } else {
      tagList = topTagList[0].select
    }
    // 投资区间
    switch (topTagList[1].select) {
      case 0:
        joinInvestMax = ""
        joinInvestMin = ""
        break;
      case 1:
        joinInvestMax = "20"
        joinInvestMin = "10"
        break;
      case 2:
        joinInvestMax = "30"
        joinInvestMin = "20"
        break;
      case 3:
        joinInvestMax = "50"
        joinInvestMin = "30"
        break;
      case 4:
        joinInvestMax = "1000"
        joinInvestMin = "50"
        break;
      default:
        break;
    }
    // 排序方式
    switch (topTagList[2].select) {
      case 0:
        attentionSort = ''
        amountSort = ''
        break;
      case 1:
        attentionSort = 2
        amountSort = ''

        break;
      case 2:
        attentionSort = ''
        amountSort = 1

        break;
      case 3:
        attentionSort = ''
        amountSort = 2
        break;
      default:
        break;
    }
    this.setData({
      noMore: false
    })
    util.request(api.javaBrandHost + "brand/v1.0/phone/listBrandByTag", {
        cityCode: "",
        amountSort: amountSort,
        attentionSort: attentionSort,
        joinInvestMax: joinInvestMax,
        joinInvestMin: joinInvestMin,
        list: [{
          classifyCode: "BRAND_CATEGORY",
          tagList: tagList
        }],
        pageNum: pageNum,
        pageSize: 10,
        regionTagId: "",
        searchType: "3",
      }, 'POST')
      .then(res => {
        if (res.code == "0") {
          let newDataList = res.data.list
          let typeIndex
          if (type) {
            newDataList = dataList.concat(res.data.list)
          }
          if (newDataList.length > 0) {
            typeIndex = 1
          } else {
            typeIndex = 2
          }
          wx.hideLoading()
          this.setData({
            dataList: newDataList,
            typeIndex: typeIndex,
            // dataList: [],
            show: false,
            pageNum: res.data.pageNum,
            total: res.data.total,
            loading: false,
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  // 猜你喜欢
  guessYouDataInit() {
    util.request(api.javaBrandHost + "brand/v1.0/phone/guessYouLike", {
        brandPageNum: 1,
        brandPageSize: 10,
      }, 'POST')
      .then(res => {
        if (res.code == "0") {
          this.setData({
            guessYouList: res.data
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  onLoad: function (options) {
    this.initCatering(options.name)
    this.guessYouDataInit()
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    const {
      top,
      height
    } = app.globalData
    this.setData({
      heightTop: (top + height) + 10,
      token: wx.getStorageSync('accesstoken') || ''
    })
    // 页面显示
    if (wx.getStorageSync('accesstoken')) {
      this.setData({
        isShowOne: true
      })
    }
    // else{
    //   //定时进入登录弹窗
    //   // this.setTimeOpenLogin()
    // }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },


})