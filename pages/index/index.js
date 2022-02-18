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
    isShowService: false, isShowOne: false,
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
    homeDataListTop: '',
    hasRefundActivity:false,
    refundActivity: false,
    refundGifShow: false,
    activityType: '',
    refundActivityUrl: '',
    refundActivityImg: '',
    refundProupImg: '',
    ceilingSuction: ''
  },
  //去登录
  goLogin() {
    var url = "/pages/login/login";
    wx.navigateTo({
      url
    });
  },
  onLoad: function (options) {
    wx.setStorageSync('isfirstload', true)
    let { luckDrawGifShow } = this.data;
    if (wx.getStorageSync("accesstoken")) {
      // this.luckDrawFun()
      this.setData({
        showHomeBottom:false
      })
    } else {
      let getUserCloseLoginTime = wx.getStorageSync('UserCloseLoginTime');
      getUserCloseLoginTime = getUserCloseLoginTime ? getUserCloseLoginTime : 0;
      if (!getUserCloseLoginTime) {
        this.setData({
          openSTimeoutLogin: true,
          showHomeBottom:false
        })
      } else {
        this.setData({
          openSTimeoutLogin: false,
          showHomeBottom:true
        })
      }
    }
    // 页面初始化 options为页面跳转所带来的参数
    this.getSwiperList()
    if (options.sendImageUrl) {
      this.openWeChat(options);
    }
   //首页活动数据初始化
   this.initRefundActivity()
  },
  dotsClick(e) {
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
    // let current = e.detail.current;
    let {current, source} = e.detail
    if(source === 'autoplay' || source === 'touch'){
      this.setData({
        current: current
      })
    }
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
      // this.getProductList([gridList[e.currentTarget.dataset.id]])
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
              /*首页列表初始化 =》 3项全部获取数据 */
              (async () => {
                let idList = res.data.tagList;
                for (let i = 0; i < idList.length; i++) {
                  if (i > 2) {
                    break;
                  }
                  // let item = [idList[i].id];
                  await this.getProductList(idList[i]);
                }
              })()
            }
          }, 0)
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  getProductList(item, pageNum) {
    const {
      listData,
      active
    } = this.data
    let that = this
    let listdataJson = {};
    let parmasJson = {}
    if(item.name == '低投入'){
      parmasJson = {
        "pageNum": pageNum || 1,
        "pageSize": "20",
        "tagIdList": [item.id]
      }
    }else{
      parmasJson ={
        "pageNum": pageNum || 1,
        "pageSize": "10",
        "tagIdList": [item.id]
      }
    }
    return new Promise((resolve, reject) => {
      util.request(api.javaBrandHost + "brand/v1.0/phone/listBrand", parmasJson, 'POST')
        .then(res => {
          if (res.code == "0") {
            if (pageNum) {
              listData[active].listData = listData[active].listData.concat(res.data.list);
              listData[active].pageNum = pageNum
              listData[active].total = res.data.total;
              that.setData({
                listData
              })
            } else {
              listdataJson.listData = res.data.list;
              listdataJson.pageNum = 1
              listdataJson.total = res.data.total;

              listData.push(listdataJson);
              if (listData.length == 3) {
                that.setData({
                  listData
                })
              }
            }
          }
          resolve();
        })
        .catch(err => {
          console.log(err.status, err.message);
        });
    })
  },
  onShareAppMessage: function () {
    return {
      title: '加盟好餐饮，就找餐盟严选！',
    }
  },
  onPullDownRefresh() {
    this.setData({
      active: 0,
      scrollTop: false
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
      listData,
      gridList,
      active,
      pageNum,
      total
    } = this.data
    console.log(active)
    let number = listData[active].pageNum;
    if(active == 1){
      if (number == Math.ceil(listData[active].total / 20)){
        this.setData({
          loading: false,
          noMore: true
        })
      }else{
        number = listData[active].pageNum + 1
        this.getProductList(gridList[active], number)
      }
    }else{
      if (number == Math.ceil(listData[active].total / 10)) {
        this.setData({
          loading: false,
          noMore: true
        })
      } else {
        number = listData[active].pageNum + 1
        // this.getProductList([gridList[active].id], number)
        this.getProductList(gridList[active], number)
      }
    }
  },
  imgClick(event) {
    let item = event.currentTarget.dataset.value
    if (item.optionType == 'H' || item.optionType == 'M' || item.optionType == 'R' || item.optionType == 'G') {
      if (item.attach.newsType) {
        this.informdetailClick('lookInformdetail', item.attach)
        // var url = '/pages/infodetail/main?infoId=' + item.attach.newsId
        // wx.navigateTo({
        //   url
        // });
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
  informdetailClick(msg,_item){
    if(msg == 'lookInformdetail'){
      let url = "/pages/webViewList/webView/webView?url=" + api.webViewUrl +"lookInformdetail&infoId="+_item.newsId;
      wx.navigateTo({
        url
      });
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
    if (e.scrollTop < homeDataListTop - heightTop - 4) {
      if (isCeilingSuction) {
        _this.setData({
          isCeilingSuction: false
        })
      }
    } else {
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
      let url = "/pages/webViewList/webView/webView?url=" + api.webViewUrl + "rankingList?type=xcx";
      wx.navigateTo({
        url
      });
      app.sensors.track('registerLoginButtonClick', {
        login_source: '41运营活动-榜单'
      })
      wx.setStorageSync('accessPath', '41运营活动-榜单')
      this.getActivityBrowse('首页-金刚区下方卡片', '榜单')
    } else if (e.currentTarget.dataset.name == 'saveMoneyopen') {
      let url = "/pages/webViewList/webView/webView?url=" + api.webViewUrl + "timeLimit?type=xcx";
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
        homeDataListTop: rect.top
      })
    }).exec()
    wx.createSelectorQuery().select('.isCeilingSuctionOther').boundingClientRect(function (rect) {
      _this.setData({
        ceilingSuction: rect.height
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
  onShow: function () {
    // 页面显示 
    const {
      top,
      height
    } = app.globalData;
    let {
      luckDrawPop,
      openSTimeoutLogin,
      refundActivity,
      hasRefundActivity
    } = this.data;
    this.setData({
      heightTop: (top + height) + 10,
      isAutoplay: true,
      token: wx.getStorageSync('accesstoken') || ''
    })
    if (!wx.getStorageSync("accesstoken")) {
      //7200000
      if (openSTimeoutLogin) {
        this.setData({
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
            setTimeoutLogin: setTimeout(() => {
              wx.setStorageSync('accessPath', '24首次启动-弹出')
              app.sensors.track('registerLoginButtonClick', {
                login_source: '24首次启动-弹出'
              })
              this.goLogin()
            }, 3000)
          })
        } else {
          let newData = new Date()
          util.login2hoursCoundown()
          // this.luckDrawFun()
        }
      }
    }else {
      this.setData({
        showHomeBottom: false
      })
    }

    if (wx.getStorageSync('isfirstload') && hasRefundActivity) {
      if (!wx.getStorageSync('isCloseRefundProup')) {
        this.setData({
          refundActivity: true,
          refundGifShow: false,
        }, () => {
          wx.hideTabBar({})
        })
      } else {
        if(!wx.getStorageSync('accesstoken')){
          this.setData({
            showHomeBottom: true
          })
        }else{
          this.setData({
            showHomeBottom: false
          })
        }
        this.setData({
          refundActivity: false,
          refundGifShow: true,
        }, () => {
          wx.showTabBar({})
        })
      }
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
  /*无忧退款活动*/
  initRefundActivity() {
    util.request(api.javaActivityUrl + "v1.0/activity_ad/app/getByParam", {
      "terminal": 1,
      "activeLocation": 2
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          let activityUrlInfo = '';
          if(res.data.jumpType == 1){
            activityUrlInfo = res.data.activityUrl
          }else{
            activityUrlInfo = res.data.busId
          }
          this.setData({
            activityType:res.data.jumpType,
            hasRefundActivity:true,
            refundActivityUrl: activityUrlInfo,
            refundActivityImg: res.data.homeActivitiesUrl,
            refundProupImg: res.data.imgPath
          })
          if(res.data.jumpType)
          if(wx.getStorageSync('UserCloseLoginTime')){
            this.setData({
              refundActivity:true,
              refundGifSho:false
            },()=>{
              wx.hideTabBar()
            })
          }else{
            this.setData({
              refundActivity:false,
              refundGifSho:false
            },()=>{
              wx.showTabBar()
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
  },
  closerefundActivity() {
    wx.setStorageSync('isCloseRefundProup', true)
    if (!wx.getStorageSync("accesstoken")) {
      this.setData({
        showHomeBottom: true
      })
    }
    this.setData({
      refundActivity: false,
      refundGifShow: true
    }, () => {
      wx.showTabBar({})
    })
  },
  /*跳转至H5活动页*/
  goH5RefundPage(e) {
    wx.setStorageSync('isCloseRefundProup', true)
    let { refundActivityUrl,activityType } = this.data;
    let url = '';
    console.log(activityType)
    if(activityType == 1){
      //URL
      url = "/pages/webViewList/webView/webView?url=" + refundActivityUrl;
    }else if(activityType == 2){
      url = "/packageA/pages/brandDetail/brandDetail?brandId=" + refundActivityUrl;
    }else if(activityType == 3){
      url = "/pages/webViewList/webView/webView?url=" + api.webViewUrl + 'lookInformdetail&type=xcx&infoId='+ refundActivityUrl ;
    }
    console.log(url)
    wx.navigateTo({
      url
    });
    this.setData({
      refundActivity: false,
      refundGifShow: true
    })
    this.getActivityBrowse('首页-弹窗', '无忧退款')
  },
  /*homelist 传入的参数 */
  myevent(e) {
    // 这里就是子组件传过来的内容了
    if(e.detail.params.source === 'autoplay' || e.detail.params.source === 'touch'){
      this.setData({
        active: e.detail.params.current
      })
    }

  },
  /*关闭底部登录横条*/
  homeBottomFixedClose: function () {
    wx.setStorageSync('closeGyloginHtFlag', true)
    this.setData({
      showHomeBottom: false
    })
  }
})