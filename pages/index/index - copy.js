const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
// import Dialog from '../../lib/vant-weapp/dialog/dialog';
import Toast from '../../lib/vant-weapp/toast/toast';
let isClick = 1
let timer = null
let clickChat = true

//获取应用实例
const app = getApp();
Page({
  data: {
    news: '', // 是否H5过来
    //轮播图当前的下标
    current: 0,
    // 列表下标
    active: 0,
    // 吸顶变量
    loading: false,
    noMore: false,
    pageNum: 1,
    total: '',
    isCeilingSuction: false,
    listData: [],
    bannerList: [],
    WinningPrize: [
      '5分钟 前李**抽中戴森吹风机',
      '5分钟 前赵**抽中100元现金红包',
      '5分钟 前孙*抽中1对1创业分析师',
      '3分钟 前王**抽中5000抵用券',
      '3分钟 前范*抽中加盟资料大礼包',
      '2分钟 前王**抽中5000抵用券',
      '2分钟 前李*抽中5000抵用券',
      '2分钟 前周**抽中100元现金红包',
      '1分钟 前赵**抽中加盟资料大礼包',
      '1分钟 前冯*抽中戴森吹风机',
      '1分钟 前徐**抽中100元现金红包',
      '1分钟 前张*抽中1对1创业分析师',
      '1分钟 前石**抽中加盟资料大礼包',
      '1分钟 前任*抽中5000元抵用券',
    ],
    liveVideoList: [],
    drinksDessertsList: [{
      name: '饮品甜品',
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeIconFive.png',
    },
    {
      name: '中西快餐',
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeIconOne.png',
    },
    {
      name: '特色小吃',
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeIconTwo.png',
    },
    {
      name: '火锅烧烤',
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeIconThree.png',
    },
    {
      name: '烘焙糕点',
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeIconFour.png',
    },
    ],
    hotNews: [],
    gridList: [],
    paramJson: {
      params: {
        deviceId: 'wechat_Mini_Program',
        info_getNewsHot: {
          userId: ""
        },
        banner_appGet: {
          pid: "0"
        },
        vod_videoList: {
          pageNum: "1",
          sourceType: "0",
          pageSize: "10"
        },
        bus_videoList: {
          pageNum: "1",
          sourceType: "2",
          pageSize: "10"
        },
        brand_list: {
          pageNum: "1",
          pageSize: "10",
          tagIdList: []
        },
        activity_channelList: {
          pageNum: "1",
          pageSize: "5"
        },
        vr_videoList: {
          pageNum: "1",
          pageSize: "10"
        },
        vod_liveVideoList: {
          pageNum: "1",
          sourceType: "1",
          pageSize: "10"
        }
      }
    },
    isShowService: false,
    isShowOne: false,
    scrollTop: false,
    heightTop: '',
    height: '',
    isAutoplay: false,
    luckDrawPop: false,
    luckDrawImage: [{
      id: 1,
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeLuckDraw/makeEfforts.png',
    },
    {
      id: 2,
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeLuckDraw/hairDrier.png',
    },
    {
      id: 3,
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeLuckDraw/coupon.png',
    },
    {
      id: 8,
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeLuckDraw/aBooks.png',
    },
    {
      id: 10,
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeLuckDraw/luckDrawBtn.png',
    },
    {
      id: 4,
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeLuckDraw/oneOnOnene.png',
    },
    {
      id: 7,
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeLuckDraw/BigGift%20ag.png',
    },
    {
      id: 6,
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeLuckDraw/redEnvelopes.png',
    },
    {
      id: 5,
      url: 'http://huiju-new-prod.oss-cn-beijing.aliyuncs.com/weChat_images/homeLuckDraw/iphone.png',
    },
    ],
    animation: '',
    activityRules: false,
    lotteryResults: false,
    aluckyDrawPop: false,
    luckDrawGifShow: false,
    isShowAnalysisServices: false,
    luckDrawNum: 2,
    selectTheLottery: 0,
    token: wx.getStorageSync('accesstoken') || '',
    showHomeBottom: false, //底部登录横条
    platformRankUrl: '',
    platformsaveMoneyUrl: '',
    setTimeoutLogin: '',
    openSTimeoutLogin: false,
    customerServiceIsShow:false,
    homeDataListTop:''
  },
  //去登录
  goLogin() {
    var url = "/pages/login/login";
    wx.navigateTo({
      url
    });
  },
  onLoad: function (options) {
    let { luckDrawGifShow,customerServiceIsShow } = this.data;
    if (wx.getStorageSync("accesstoken")) {
      this.luckDrawFun()
    } else {
      let getUserCloseLoginTime = wx.getStorageSync('UserCloseLoginTime');
      getUserCloseLoginTime = getUserCloseLoginTime ? getUserCloseLoginTime : 0;
      if (!getUserCloseLoginTime) {
        this.setData({
          openSTimeoutLogin: true
        })
      }else{
        this.setData({
          openSTimeoutLogin: false
        })
      }
    }
    // 页面初始化 options为页面跳转所带来的参数
    this.getSwiperList()
    if (options.sendImageUrl) {
      this.openWeChat(options);
    }
  },
  dotsClick(e) {
    console.log(e.currentTarget.dataset.index);
    this.setData({
      current: e.currentTarget.dataset.index
    })
  },
  /*埋点H5*/
  getActivityBrowse(sourceMsg, nameMsg) {
    app.sensors.track('activityBrowse', {
      activity_source: sourceMsg,
      activity_name: nameMsg
    })
  },
  /*客服*/
  openWeChat(options) {
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
            let url = ''
            if (options && options.sendImageUrl) {
              const {
                sendImageUrl,
                titleName,
                mainPoint,
                subTitle,
                city,
                word,
                sendBrandID
              } = options
              const brandObj = {
                sendImageUrl,
                titleName,
                mainPoint,
                subTitle,
                city,
                sendBrandID
              }
              url = '/pages/customerChat/customerChat?sessionId=p2p-' +
                res.data.imId + '&word=' + (word || '我要咨询该品牌优惠活动') + '&brandObj=' + JSON.stringify(brandObj)
              app.sensors.track('consultationInitiate', {
                click_source: word ? '运营活动-榜单' : '运营活动-优惠立减',
                brand_name: titleName,
                brand_id: sendBrandID
              })
            } else {

              url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId
              app.sensors.track('consultationInitiate', {
                click_source: '首页-专属客服',
                brand_name: '',
                brand_id: ''
              })
            }
            wx.navigateTo({
              url: url
            });
            wx.removeStorageSync('accessOption')
          }
        })
        .catch((error) => { });
    } else {
      let url = "/pages/login/login"
      wx.setStorageSync('accessPath', '12首页-加盟顾问')
      if (options) {
        wx.setStorageSync('accessOption', options)
      }
      if (options.word) { //榜单进入
        app.sensors.track('registerLoginButtonClick', {
          login_source: '41运营活动-榜单'
        })
      }

      wx.navigateTo({
        url
      })
      app.sensors.track('registerLoginButtonClick', {
        login_source: '12首页-加盟顾问'
      })

    }
  },
  closeService() {
    this.setData({
      isShowService: false
    })
  },
  /*客服*/
  drinksDessertsClick(e) {
    wx.reLaunch({
      url: '/pages/classificationList/classificationList?name=' + e.currentTarget.dataset.name
    });
  },
  //监听轮播图的下标
  monitorCurrent: function (e) {
    let current = e.detail.current;
    this.setData({
      current: current
    })
  },
  onChangeClick(e) {
    const {
      gridList
    } = this.data
    this.setData({
      active: e.currentTarget.dataset.id,
      pageNum: 1,
      noMore: false
    }, () => {
      this.getProductList(gridList[e.currentTarget.dataset.id].id)
    })
  },
  getSwiperList() {
    const {
      active
    } = this.data
    util.request(api.host + "home/api", this.data.paramJson, 'POST')
      .then(res => {
        if (res.code == "200") {
          this.setData({
            bannerList: res.data.appGet,
            liveVideoList: res.data.liveVideoList.data,
            hotNews: res.data.newsHot.newHots,
            gridList: res.data.tagList,
          })
          setTimeout(() => {
            if (res.data.tagList.length > 0) {
              this.getProductList(res.data.tagList[0].id);
            }
          }, 0)
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  getProductList(id, pageNum) {
    const {
      listData
    } = this.data
    let that = this
    util.request(api.javaBrandHost + "brand/v1.0/phone/listBrand", {
      "pageNum": pageNum || 1,
      "pageSize": "10",
      "tagIdList": [id]
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          if (pageNum) {
            that.setData({
              listData: listData.concat(res.data.list),
              pageNum: pageNum,
              total: res.data.total
            })
          } else {
            that.setData({
              listData: res.data.list,
              pageNum: 1,
              total: res.data.total
            })
          }
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });

  },
  onShareAppMessage: function () {
    return {
      title: '加盟好餐饮，就找餐盟严选！',
    }
  },
  onPullDownRefresh() {
    this.setData({
      active: 0
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    this.getSwiperList()
  },
  onReachBottom() {
    this.setData({
      loading: true,
    })
    const {
      gridList,
      active,
      pageNum,
      total
    } = this.data
    let number = pageNum
    if (number == Math.ceil(total / 10)) {
      this.setData({
        loading: false,
        noMore: true
      })
    } else {
      number = pageNum + 1
      this.getProductList(gridList[active].id, number)
    }
  },
  imgClick(event) {
    let item = event.currentTarget.dataset.value
    if (item.optionType == 'H' || item.optionType == 'M' || item.optionType == 'R' || item.optionType == 'G') {
      if (item.attach.newsType) {
        var url = '/pages/infodetail/main?infoId=' + item.attach.newsId
        wx.navigateTo({
          url
        });
      }
    } else if (item.optionType == 'B') {
      var url = '/packageA/pages/brandDetail/brandDetail?brandId=' + item.attach.brandId
      wx.navigateTo({
        url
      });
      app.sensors.track('projectDetailBrowse', {
        projetc_detail_source: '首页-banner',
        project_classification: '',
        brand_name: event.currentTarget.dataset.item.attach.title,
        brand_id: event.currentTarget.dataset.item.attach.brandId,
      })
    } else if (item.optionType == 'V') {
      // this.informdetailClick('lookInfoVideo', item)

    } else if (item.optionType == 'U') {
      let h5Url = item.h5Url
      if (h5Url.indexOf('timeLimit') != -1) {
        this.getActivityBrowse('首页banner', '优惠立减')
      } else if (h5Url.indexOf('rankingList') != -1) {
        this.getActivityBrowse('首页banner', '榜单')
      }

      // 
      let url = "/pages/webViewList/webView/webView?url=" + h5Url;
      wx.navigateTo({
        url
      });
    } else if (item.optionType == 'ZX') {
      // this.informdetailClick('lookInformdetail', item)
    }
  },
  onPageScroll: function (e) {
    const {
      isCeilingSuction,
      scrollTop,
      heightTop,
      homeDataListTop
    } = this.data
    let _this = this;
    // console.log(e.scrollTop,homeDataListTop-heightTop-5)
    if( e.scrollTop < homeDataListTop-heightTop-4) {
      if (isCeilingSuction) {
        _this.setData({
          isCeilingSuction: false
        })
      }
    }else{
      if (!isCeilingSuction) {
        _this.setData({
          isCeilingSuction: true
        })
      }
    }
    // if (e.scrollTop < 400) {
    //   if (isCeilingSuction) {
    //     this.setData({
    //       isCeilingSuction: false
    //     })
    //   } 
    // } else {
    //   if (!isCeilingSuction) {
    //     this.setData({
    //       isCeilingSuction: true
    //     })
    //   }
    // }
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
  heightFun() {
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.dataListClass').boundingClientRect(function (rect) {
      that.setData({
        height: rect.height + 'px'
      })
    }).exec();
  },
  imageClick(e) {
    let {
      platformRankUrl,
      platformsaveMoneyUrl
    } = this.data
    if (e.currentTarget.dataset.name == 'topRanking') {
      let url = "/pages/webViewList/webView/webView?url=" + api.webViewUrl+"rankingList?type=xcx";
      wx.navigateTo({
        url
      });
      app.sensors.track('registerLoginButtonClick', {
        login_source: '41运营活动-榜单'
      })
      wx.setStorageSync('accessPath', '41运营活动-榜单')
      this.getActivityBrowse('首页-金刚区下方卡片', '榜单')
    } else if (e.currentTarget.dataset.name == 'saveMoneyopen') {
      let url = "/pages/webViewList/webView/webView?url=" + api.webViewUrl+"timeLimit?type=xcx";
      wx.navigateTo({
        url
      });
      app.sensors.track('registerLoginButtonClick', {
        login_source: '38运营活动-优惠立减'
      })
      this.getActivityBrowse('首页-金刚区下方卡片', '优惠立减')
      wx.setStorageSync('accessPath', '38运营活动-优惠立减')
    } else if (e.currentTarget.dataset.name == 'brandEntry') {
      wx.navigateTo({
        url: '/pages/brandEntry/brandEntry'
      })
    }
  },
  myKnow() {
    this.setData({
      activityRules: false
    })
  },
  getPhoneNum(e) {
    user.login();
    app.getPhoneNumber(e).then(res => {
      if (res) {
        this.setData({
          token: wx.getStorageSync('accesstoken') || '',
          showHomeBottom: false
        });
      }
    })
  },
  closeAnalysisServices() {
    wx.setStorageSync('luckDraw', '已经抽过奖')
    wx.setStorageSync('nowTime2', new Date().getTime())
    this.setData({
      isShowAnalysisServices: false,
      luckDrawGifShow: false,
      showHomeBottom: false,
      customerServiceIsShow:true
    })
  },
  nowReceive() {
    if (!clickChat) {
      return
    }
    clickChat = false
    let data = {
      phone: wx.getStorageSync('userPhone'),
      accountId: wx.getStorageSync('accountId'),
      imId: wx.getStorageSync('nimId'),
      channel: 'xcx'
    }
    util.request(api.javaCustserviceUrl + "custservice/v1.0/huiju/getSaleIm", data, 'POST')
      .then((res) => {
        console.log(res)
        if (res.code == 0) {
          var url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId + '&word=1对1创业分析咨询'
          app.sensors.track('consultationInitiate', {
            click_source: '首页-抽奖',
            brand_name: '',
            brand_id: ''
          })
          this.setData({
            luckDrawPop: false,
            lotteryResults: false,
            removeStorageSync: false,
            showHomeBottom: false
          })
          clickChat = true
          wx.removeStorageSync('nowTime')
          wx.removeStorageSync('nowTime2')
          wx.setStorageSync('luckDraw', '已经抽过奖')
          wx.setStorageSync('toUse', '已经使用过')
          wx.navigateTo({
            url: url
          });
        }
      })
      .catch((error) => { });
  },
  closeActivity() {
    /*1 直接关闭 2 登录以后关闭 0 获奖以后关闭*/
    if (isClick == 2) {
      this.setData({
        aluckyDrawPop: true,
        showHomeBottom: false
      })
    } else if (isClick == 1) {
      if (!wx.getStorageSync('accesstoken')) {
        if (wx.getStorageSync('closeGyloginHtFlag')) {
          this.setData({
            showHomeBottom: false
          })
        } else {
          this.setData({
            showHomeBottom: true
          })
        }
      }
      this.setData({
        luckDrawPop: false,
        lotteryResults: false,
        isShowService: false,
        luckDrawGifShow: true,
        customerServiceIsShow:false
      }, () => {
        wx.showTabBar({})
        wx.setStorageSync('nowTime', new Date().getTime())
      })
    } else {
      this.setData({
        luckDrawPop: false,
        lotteryResults: false,
        isShowService: true,
        isShowAnalysisServices: true,
        luckDrawGifShow: false,
        showHomeBottom: false,
        customerServiceIsShow:true
      }, () => {
        wx.showTabBar({})
        wx.setStorageSync('nowTime2', new Date().getTime())
        wx.setStorageSync('luckDraw', '已经抽过奖')
      })
    }
  },
  showActivity() {
    this.setData({
      luckDrawPop: true,
      luckDrawGifShow: false,
      showHomeBottom: false,
      customerServiceIsShow:true
    }, () => {
      wx.hideTabBar({})
    })
  },
  activityRules() {
    this.setData({
      activityRules: true
    })
  },
  animationend() {
    // Toast('距离中奖还差最后一步');
  },
  luckDrawClick(e) {
    const {
      selectTheLottery
    } = this.data
    if (!wx.getStorageSync('accesstoken')) {
      app.sensors.track('registerLoginButtonClick', {
        login_source: '1抽奖活动-点击立即抽奖'
      })
      wx.setStorageSync('accessPath', '1抽奖活动-点击立即抽奖')
      // wx.navigateTo({
      //   url: '/pages/login/login'
      // })
      return
    }
    if (e.currentTarget.dataset.index == 4) {
      if (isClick == 1) {
        this.setData({
          luckDrawNum: 1
        })
        isClick = 0
        let num = 0
        timer = setInterval(() => {
          if (this.data.selectTheLottery == 8) {
            num = num + 1
          }
          if (this.data.selectTheLottery >= 8) {
            this.setData({
              selectTheLottery: 1
            })
          } else {
            this.setData({
              selectTheLottery: this.data.selectTheLottery + 1
            })
          }
          console.log(num);
          if (num == 2) {
            isClick = 2
            clearInterval(timer)
            Toast('距离中奖还差最后一步');
          }
        }, 200)

        // this.animation.translate(96, 0).step()
        // this.animation.translate(192, 0).step()
        // this.animation.translate(192, 96).step()
        // this.animation.translate(192, 192).step()
        // this.animation.translate(96, 192).step()
        // this.animation.translate(0, 192).step()
        // this.animation.translate(0, 96).step()
        // this.animation.translate(0, 0).step()
        // this.animation.translate(96, 0).step()
        // this.animation.translate(192, 0).step()
        // this.animation.translate(192, 96).step()
        // this.animation.translate(192, 192).step()
        // this.animation.translate(96, 192).step()
        // this.animation.translate(0, 192).step()
        // this.animation.translate(0, 96).step()
        // this.animation.translate(0, 0).step()
        // isClick=0
        // this.setData({ animation: this.animation.export(),luckDrawNum:1})
        // setTimeout(()=>{
        //   Toast('距离中奖还差最后一步');
        //   isClick=2
        // },3500)
      } else if (isClick == 2) {
        this.setData({
          luckDrawNum: 0
        })
        isClick = 0
        let num = 0
        timer = setInterval(() => {
          if (this.data.selectTheLottery == 3) {
            num = num + 1
          }
          if (num == 3) {
            clearInterval(timer)
            this.setData({
              lotteryResults: true,
              luckDrawPop: false
            })
            isClick = 0
          }
          if (this.data.selectTheLottery >= 8) {
            this.setData({
              selectTheLottery: 1
            })
          } else {
            this.setData({
              selectTheLottery: this.data.selectTheLottery + 1
            })
          }
        }, 200)
        // this.animation.translate(96, 0).step()
        // this.animation.translate(192, 0).step()
        // this.animation.translate(192, 96).step()
        // this.animation.translate(192, 192).step()
        // this.animation.translate(96, 192).step()
        // this.animation.translate(0, 192).step()
        // this.animation.translate(0, 96).step()
        // this.animation.translate(0, 0).step()
        // this.animation.translate(96, 0).step()
        // this.animation.translate(192, 0).step()
        // this.animation.translate(192, 96).step()
        // this.animation.translate(192, 192).step()
        // this.animation.translate(96, 192).step()
        // this.animation.translate(0, 192).step()
        // this.animation.translate(0, 96).step()
        // this.animation.translate(0, 0).step()
        // this.animation.translate(96, 0).step()
        // this.animation.translate(192, 0).step()
        // this.animation.translate(192, 96).step()
        // isClick = 0
        // this.setData({ animation: this.animation.export() })
        // setTimeout(() => {
        //   this.setData({
        //     lotteryResults: true
        //   })
        //   isClick = 0
        // }, 4300)
      }
    }
  },
  giveUpClick() {
    wx.setStorageSync('luckDraw', '已经抽过奖')
    wx.setStorageSync('toUse', '未使用')
    this.setData({
      aluckyDrawPop: false,
      luckDrawPop: false,
      luckDrawGifShow: false,
      isShowService: true,
      customerServiceIsShow:true
    }, () => {
      wx.showTabBar({})
    })
  },
  submitClick() {
    this.setData({
      aluckyDrawPop: false
    })
  },
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear', //ease
      delay: 200
    });
    this.setData({
      token: wx.getStorageSync('accesstoken') || ''
    })
    let _this = this;
    wx.createSelectorQuery().select('.homeDataList').boundingClientRect(function (rect) {
      _this.setData({
        homeDataListTop:rect.top
      })
    }).exec()
  },
  isShowServiceFun() {
    if (wx.getStorageSync('accesstoken')) {
      this.setData({
        isShowOne: true,
        isShowService: this.data.luckDrawPop ? false : true,
      })
      // wx.showTabBar({})
    } else {
      this.setData({
        isShowService: this.data.luckDrawPop ? false : true,
      })
      // wx.showTabBar({})
    }
  },
  // 抽奖逻辑函数
  luckDrawFun() {
    const {
      luckDrawGifShow,
      customerServiceIsShow
    } = this.data
    // luckDrawGifShow   抽奖小图标
    let luckDrawPop //抽奖弹框
    let lotteryResults //抽奖结果弹框

    // 判断抽奖弹框展示不展示
    if (luckDrawGifShow) {
      luckDrawPop = false
    } else if (wx.getStorageSync('luckDraw')) {
      luckDrawPop = false
      this.setData({
        customerServiceIsShow: true
      })
    } else {
      // if(wx.getStorageSync('nowTime')){
      //   luckDrawPop = false
      //   this.setData({
      //     luckDrawGifShow: true,
      //   })
      // }else{
      luckDrawPop = true
      this.setData({
        showHomeBottom: false
      })
    }
    if (wx.getStorageSync('luckDraw')) {
      luckDrawPop = false
    } else if (!luckDrawPop && wx.getStorageSync('nowTime')) {
      luckDrawPop = new Date().getTime() - wx.getStorageSync('nowTime') > 7200000 ? true : false
      if (luckDrawPop) {
        this.setData({
          luckDrawGifShow: false,
          customerServiceIsShow:true
        })
      }
    }
    // 判断抽奖结果弹框展示不展示
    if (wx.getStorageSync('nowTime2')) {
      lotteryResults = new Date().getTime() - wx.getStorageSync('nowTime2') > 86400000 ? true : false
    }


    // 根据字段值赋值
    this.setData({
      luckDrawPop: luckDrawPop,
    }, () => {
      this.isShowServiceFun()
      if (this.data.luckDrawPop) {
        wx.hideTabBar({})
      }
    })
    if (lotteryResults) {
      wx.hideTabBar({})
      isClick = 0
      this.setData({
        isShowAnalysisServices: false,
      })
    } else {
      wx.showTabBar({})
    }
    if (wx.getStorageSync('luckDraw') && wx.getStorageSync('toUse')) {
      this.setData({
        isShowAnalysisServices: false
      })
    } else if (wx.getStorageSync('luckDraw')) {
      this.setData({
        lotteryResults: lotteryResults,
      })
    }
  },
  onShow: function () {
    // 页面显示
    const {
      top,
      height
    } = app.globalData;
    let {
      luckDrawPop,
      openSTimeoutLogin
    } = this.data;
    this.setData({
      heightTop: (top + height) + 10,
      isAutoplay: true,
      token: wx.getStorageSync('accesstoken') || ''
    })
    // this.luckDrawFun() 
    if (!wx.getStorageSync("accesstoken")) {
      //7200000
      if (openSTimeoutLogin) {
        this.setData({
          showHomeBottom: true,
          setTimeoutLogin: setTimeout(() => {
            wx.setStorageSync('accessPath', '24首次启动-弹出')
            app.sensors.track('registerLoginButtonClick', {
              login_source: '24首次启动-弹出'
            })
            this.goLogin()
          }, 3000)
        })
      } else {
        //定时进入登录弹窗
        const initJump2Hours = 7200000;
        const thisTime = util.getnewDateSeconds();
        let getUserCloseLoginTime = wx.getStorageSync('UserCloseLoginTime');
        getUserCloseLoginTime = getUserCloseLoginTime ? getUserCloseLoginTime : 0;
        if ((thisTime - getUserCloseLoginTime) >= initJump2Hours) {
          this.setData({
            showHomeBottom: true,
            setTimeoutLogin: setTimeout(() => {
              wx.setStorageSync('accessPath', '24首次启动-弹出')
              app.sensors.track('registerLoginButtonClick', {
                login_source: '24首次启动-弹出'
              })
              this.goLogin()
            }, 3000)
          })
        }else{
          let newData = new Date()
          util.login2hoursCoundown()
          this.luckDrawFun()
        }
      }
    } else {
      this.luckDrawFun()
      this.setData({
        showHomeBottom: false
      })
    }
  },
  onHide: function () {
    // 页面隐藏
    clearTimeout(this.data.setTimeoutLogin)
    this.setData({
      isAutoplay: false,
      setTimeoutLogin: null,
      openSTimeoutLogin: false
    })
  },
  onUnload: function () {
    // 页面关闭
    clearTimeout(this.data.setTimeoutLogin)
    this.setData({
      setTimeoutLogin: null,
      openSTimeoutLogin: false
    })
  },
  /*关闭底部登录横条*/
  homeBottomFixedClose: function () {
    wx.setStorageSync('closeGyloginHtFlag', true)
    this.setData({
      showHomeBottom: false
    })
  }
  // imgClick(event) {
  //   console.log(event.currentTarget.dataset);
  //   let url = event.currentTarget.dataset.url
  //   if (url) {
  //     wx.navigateTo({
  //       url: event.currentTarget.dataset.url,//跳转页面的路径，可带参数？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
  //       success: function () { },        //成功后的回调；
  //       fail: function () { },          //失败后的回调；
  //       complete: function () { },      //结束后的回调(成功，失败都会执行)
  //     })
  //   }
  // },
})