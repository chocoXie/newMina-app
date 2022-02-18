import * as echarts from '../../libA/ec-canvas/echarts';
import geoJson from './chart.js';
const util = require('../../../utils/util.js');
const user = require('../../../utils/user.js');
const api = require('../../../config/api.js');
const hexMD5 = require('../../../utils/md5.js');

const app = getApp();
import Toast from '../../../lib/vant-weapp/toast/toast';
import { nextTick } from '../../../lib/vant-weapp/common/utils';

let dataList = [{
    name: '南海诸岛',
    value: 0,
  },
  {
    name: '北京',
    value: 54,
  },
  {
    name: '天津',
    value: 13,
  },
  {
    name: '上海',
    value: 40,
  },
  {
    name: '重庆',
    value: 75,
  },
  {
    name: '河北',
    value: 13,
  },
  {
    name: '河南',
    value: 83,
  },
  {
    name: '云南',
    value: 11,
  },
  {
    name: '辽宁',
    value: 19,
  },
  {
    name: '黑龙江',
    value: 15,
  },
  {
    name: '湖南',
    value: 69,
  },
  {
    name: '安徽',
    value: 60,
  },
  {
    name: '山东',
    value: 39,
  },
  {
    name: '新疆',
    value: 4,
  },
  {
    name: '江苏',
    value: 31,
  },
  {
    name: '浙江',
    value: 104,
  },
  {
    name: '江西',
    value: 36,
  },
  {
    name: '湖北',
    value: 1052,
  },
  {
    name: '广西',
    value: 33,
  },
  {
    name: '甘肃',
    value: 7,
  },
  {
    name: '山西',
    value: 9,
  },
  {
    name: '内蒙古',
    value: 7,
  },
  {
    name: '陕西',
    value: 22,
  },
  {
    name: '吉林',
    value: 4,
  },
  {
    name: '福建',
    value: 18,
  },
  {
    name: '贵州',
    value: 5,
  },
  {
    name: '广东',
    value: 98,
  },
  {
    name: '青海',
    value: 1,
  },
  {
    name: '西藏',
    value: 0,
  },
  {
    name: '四川',
    value: 44,
  },
  {
    name: '宁夏',
    value: 4,
  },
  {
    name: '海南',
    value: 22,
  },
  {
    name: '台湾',
    value: 3,
  },
  {
    name: '香港',
    value: 5,
  },
  {
    name: '澳门',
    value: 5,
  },
];
let newBrandId
let maxName

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  echarts.registerMap('china', geoJson);

  const option = {
    tooltip: {
      triggerOn: "click",
      formatter: function (e, t, n) {
        if (maxName != e.name) {
          chart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            name: maxName
          })
        }
        return e.name + '\n' + e.seriesName + ":" + e.value
      },
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: [5, 10],
      borderRadius: [0, 10, 10, 10, ],
      textStyle: {
        color: "rgba(255, 255, 255, 1)",
        textBorderColor: "rgba(0, 0, 0, 0.5)",
      },
    },
    visualMap: {
      min: 0,
      max: 1000,
      right: 0,
      bottom: 50,
      showLabel: !0,
      pieces: [{
        gt: 500,
        label: "> 500",
        color: "#0073C2"
      }, {
        gte: 100,
        lte: 499,
        label: "100 - 499",
        color: "#0898FB"
      }, {
        gte: 50,
        lt: 99,
        label: "50 - 99",
        color: "#63C0FE"
      }, {
        gte: 10,
        lt: 49,
        label: "10 - 49",
        color: "#98DEFF"
      }, {
        gte: 0,
        lt: 9,
        label: "0 - 9",
        color: "#CCEAFF"
      }],
      show: !0
    },

    geo: {
      map: 'china', //一定要用字符串
      roam: false,
      scaleLimit: {
        min: 1,
        max: 2
      },
      // zoom: 1.23,
      top: 30,
      left: 20,
      label: {
        normal: {
          show: !0,
          fontSize: "8",
          color: "rgba(0,0,0,0.7)"
        }
      },
      itemStyle: {
        normal: {
          //shadowBlur: 50,
          //shadowColor: 'rgba(0, 0, 0, 0.2)',
          borderColor: "rgba(0, 0, 0, 0.2)",
        },
        emphasis: {
          areaColor: "#ffd62d",
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          borderWidth: 0
        }
      }
    },
    series: [{
      name: "门店数",
      type: "map",
      geoIndex: 0,
      data: dataList,
      label: {
        normal: {
          textStyle: {
            fontSize: 5,
            fontWeight: 'bold',
            color: 'red'
          }
        }
      },
    }],

  }

  util.request(api.javaBrandHost + "brand/v1.0/brandStore/getStoreNumForMap", {
      brandId: newBrandId
    }, 'POST')
    .then(res => {
      if (res.code == "0") {
        // console.log(res.data);
        if (res.data.length > 0) {
          let maxNum = Math.max.apply(Math, res.data.map(item => {
            return item.num
          }))
          dataList.map((item) => {
            item.value = 0
            res.data.map((itemChild) => {
              if (itemChild.province.indexOf(item.name) > -1) {
                item.value = itemChild.num
              }
              if (maxNum == item.value) {
                maxName = item.name
              }
            })
          })
          chart.setOption(option);
          chart.dispatchAction({
            type: 'showTip', //默认显示江苏的提示框
            seriesIndex: 0, //这行不能省
            name: maxName
          });
          chart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            name: maxName
          })
        } else {
          dataList.map((item) => {
            item.value = 0
          })
          chart.setOption(option);
        }
      }
    })
    .catch(err => {
      console.log(err.status, err.message);
    });

  return chart;
}
const citys = {
  // '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  // '福建': [{name:'福州',code:11111}, {name:'厦门'}],
};
let timer = null
Page({
  data: {
    ec: {
      onInit: initChart
    },
    brandInformationYnamicList: [], //品牌动态和看点列表
    sourceType: '',
    imgSrc: '',
    swiperList: [],
    indicatorDots: true,
    forecastSta: false,
    countBut: false, //测算弹窗是否弹出过
    onLoadTime: 0, //进入页面时间
    timeInterval: null,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    showWifiModal: false,
    isShowVideo: false,
    isShowNumber: 1,
    swiperItemIndex: 0,
    isShowAutoplay: false,
    videoCtx: '',
    swiperAllData: '',
    joinDetailsInitData:'',
    joinDetailsAllData:'',
    attention: false,
    from: '',
    titleList: [{
        name: '加盟详情',
        isActive: false,
        id: 0
      },
      {
        name: '成功案例',
        isActive: false,
        id: 1
      },
      {
        name: '品牌动态',
        isActive: true,
        id: 2
      },
      {
        name: '相似推荐',
        isActive: false,
        id: 3
      }
    ],
    isShowTabBar: false,
    isShowUninterestedPop: false,
    reasonActive: [],
    inputInterested: '',
    time: '',
    timeData: {},
    differenceDay: '',
    isShowTitle: false,
    areaList: [],
    isShowStoreCity: false,
    storeCityTxt: '选择开店城市',
    isShowStoreCityResult: false,
    brandId: '',
    gbCode: '',
    strongLogin: false,
    model: '',
    version: '',
    showInterestModule: false,
    heightTop: '',
    token: wx.getStorageSync('accesstoken') || '',
    timeAllData: '',
    showBrandImgDetail:false,
    imgSwiperHei:"",
    windowWidth:'',
    imgSwiperItemIndex:0,
    showImgDetaillist:'',
    imgDetailMore:true,
    imgSwiperZoom:true,
    shopIsDistributed:'',
    isBackHome:false,
    brandQAList:[],
    QAFormProupMsg:'',
    brandQACheckNum:0,
    brandQAClickNum:0,
    showQAPopup:false,
    showReservePriceProup:false,
    ReserveList:[
      '2分钟前 吴女士 获取了优惠政策',
      '7分钟前 孙女士 获取了优惠政策',
      '9分钟前 何先生 获取了优惠政策',
      '13分钟前 何女士 获取了优惠政策',
      '15分钟前 李女士 获取了优惠政策',
      '16分钟前 张先生 获取了优惠政策',
      '25分钟前 李先生 获取了优惠政策',
      '26分钟前 李女士 获取了优惠政策',
      '29分钟前 周先生 获取了优惠政策',
      '30分钟前 王先生 获取了优惠政策',
      '41分钟前 徐女士 获取了优惠政策',
      '43分钟前 周先生 获取了优惠政策',
      '46分钟前 张先生 获取了优惠政策',
      '1小时前 吴先生 获取了优惠政策',
      '1小时前 孙先生 获取了优惠政策',
      '1小时前 徐先生 获取了优惠政策',
      '3小时前 吴先生 获取了优惠政策',
      '5小时前 赵先生 获取了优惠政策',
      '8小时前 何先生 获取了优惠政策'
    ],
    isSendSms: true,
    countNumber: 60,
    msgId: '',
    userPhone:'',
    phoneSMS:'',
    popupBHSMCheck:true
  },
  openRankingWeb(e){
    let toptype = 0;
    switch (e.currentTarget.dataset.toptype) {
      case '饮品甜品':
        toptype = 1;
        break;
      case '特色小吃':
        toptype = 2;
        break;
      case '中西快餐':
        toptype = 3;
        break;
      default:
        toptype = 0;
        break;
    }
    let url = "/pages/webViewList/webView/webView?url="+api.webViewUrl+"rankingList&toptype="+toptype;
    wx.navigateTo({
      url: url,
      name:'typeTop'
    });
  },
  goWeChat(e) {
    const {
      timeAllData
    } = this.data
    this.buryingPointFun(e.currentTarget.dataset.type)
    if (wx.getStorageSync("accountId")) {
      let data = {
        phone: wx.getStorageSync('userPhone'),
        accountId: wx.getStorageSync('accountId'),
        imId: wx.getStorageSync('nimId'),
        channel: 'xcx',
        brandName: timeAllData.brandName
      }
      util.request(api.javaCustserviceUrl + "custservice/v1.0/huiju/getSaleIm", data, 'POST')
        .then((res) => {
          if (res.code == 0) {
            var brandObj = {
              "sendImageUrl": timeAllData.brandLogo,
              "titleName": timeAllData.brandName,
              "mainPoint": timeAllData.mainPoint,
              "subTitle": timeAllData.joinInvestMin + '-' + timeAllData.joinInvestMax,
              "city": timeAllData.location,
              "sendBrandID": timeAllData.brandId,
              "categoryName":timeAllData.categoryName
            }
            var url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId + '&brandObj=' + JSON.stringify(brandObj)
            wx.navigateTo({
              url: url
            });
          }
        })
        .catch((error) => {});
    }
  },
  getPhoneNum(e) {
    user.login();
    app.getPhoneNumber(e).then(res => {
      if (res) {
        this.setData({
          token: wx.getStorageSync('accesstoken') || '',
          strongLogin: false,
          userPhone:wx.getStorageSync('userPhone').replace(/^(\d{3})\d+(\d{4})$/, "$1****$2")
        });
      }
    })
  },
  /*getSelectSensorsType*/
  getSelectSensorsType(e){
    const {
      timeAllData
    } = this.data
    let login_source = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.id || ''
    let typemsg = e.currentTarget.dataset.typemsg;
    let sensorsSource = ''
    if (wx.getStorageSync("accountId")) {
      let click_source
      if (login_source == '35') {
        click_source = '品牌详情页-帮我选品'
      }
      if (login_source == '37') {
        click_source = '品牌详情页-活动横幅' 
      }
      app.sensors.track('consultationInitiate', {
        click_source: click_source,
        brand_name: timeAllData.brandName,
        brand_id: timeAllData.brandId
      })
      this.buryingPointFun(click_source)
    } else {
      if (login_source == '35') {
        login_source = '35品牌详情页-帮我选品'
        wx.setStorageSync('accessPath', '35品牌详情页-帮我选品')
      }
      if (login_source == '37') {
        login_source = '37品牌详情页-活动横幅'
        wx.setStorageSync('accessPath', '37品牌详情页-活动横幅')
      }
      app.sensors.track('registerLoginButtonClick', {
        login_source: login_source
      })
    }
  },
  forecastClose() {
    this.setData({
      forecastSta: false,
      countBut: true
    })
  },
  mineAttention() {
    this.buryingPointFun('关注')
    const {
      swiperAllData,
      brandId,
      attention
    } = this.data
    var accesstoken = wx.getStorageSync("accesstoken");
    if (!accesstoken) {
      var url = "/pages/login/login";
      wx.setStorageSync('accessPath', '2品牌详情页-关注')
      // wx.navigateTo({
      //   url
      // });
      app.sensors.track('registerLoginButtonClick', {
        login_source: '2品牌详情页-关注'
      })
      return
    }
    if (attention) {
      var params = {
        userId: wx.getStorageSync("accountId"),
        busId: brandId
      };
      util.request(api.javahost + "support/v1.0/focus/brand/down", params, 'POST')
        .then(res => {
          // console.log('取消关注',res)
          if (res.code == 0) {
            this.setData({
              attention: false
            })
            Toast("取消关注");
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            var url = "/pages/login/login";
            wx.navigateTo({
              url
            });
          } else {
            Toast("取消关注失败，请稍后重试");
          }
        });
    } else {
      var params = {
        userId: wx.getStorageSync("accountId"),
        busId: brandId
      };
      util.request(api.javahost + "support/v1.0/focus/brand/up", params, 'POST')
        .then(res => {
          if (res.code == 0) {
            this.setData({
              attention: true
            })
            Toast("关注成功");
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            wx.clearStorage();
            // var url = "/pages/login/login";
            // wx.navigateTo({
            //   url
            // });
          } else {
            Toast("关注失败，请稍后重试");
          }
        });
    }
  },
  getPhoneNumber(e) {
    let that = this
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: function (res) {
          if (res) {
            let _iv = e.detail.iv;
            let _encryptedData = e.detail.encryptedData
            user.loginByWeixin('微信授权登录-页面', _iv, _encryptedData, res.code).then(res => {
              that.setData({
                strongLogin: false,
                token: wx.getStorageSync('accesstoken') || '',
                userPhone:wx.getStorageSync('userPhone').replace(/^(\d{3})\d+(\d{4})$/, "$1****$2")
              })
              wx.showToast({
                title: "微信授权成功",
                icon: "none",
                duration: 2000,
              });
            }).catch((err) => {
              util.showErrorToast('微信登录失败');
            });
          }
        }
      })
    } else {
      app.sensors.track('loginClose', {})
      wx.showToast({
        title: "用户取消授权",
        icon: "none",
        duration: 2000,
      });
    }


  },
  matchBrandClick() {
    this.buryingPointFun('匹配品牌')
    let url = '/packageA/pages/matchBrand/matchBrand'
    if (!wx.getStorageSync('accesstoken')) {
      url = '/pages/login/login'
      wx.setStorageSync('accessPath', '25品牌详情页-匹配品牌')
      app.sensors.track('registerLoginButtonClick', {
        login_source: '25品牌详情页-匹配品牌'
      })
    }
    if (wx.getStorageSync('accesstoken')) {
      wx.navigateTo({
        url: url
      })
    };

  },
  interestedChange(e) {
    this.setData({
      inputInterested: e.detail
    })
  },
  clickBrandMatching(e) {
    app.sensors.track('projectDetailBrowse', {
      projetc_detail_source: '开店城市推荐',
      project_classification: e.currentTarget.dataset.item.brandCategory,
      brand_name: e.currentTarget.dataset.item.brandName,
      brand_id: e.currentTarget.dataset.item.brandId,
    })
    wx.navigateTo({
      url: "/packageA/pages/brandDetail/brandDetail?brandId=" + e.currentTarget.dataset.id,
    });
  },
  clickBrand_item(e) {
    this.buryingPointFun('相似推荐')
    app.sensors.track('projectDetailBrowse', {
      projetc_detail_source: '详情页-相似推荐',
      project_classification: e.currentTarget.dataset.item.brandCategory,
      brand_name: e.currentTarget.dataset.item.brandName,
      brand_id: e.currentTarget.dataset.item.brandId,
    })
    wx.navigateTo({
      url: "/packageA/pages/brandDetail/brandDetail?brandId=" + e.currentTarget.dataset.id,
    });
  },
  userAgreement() {
    var url = '/pages/webViewList/userAgreement/userAgreement?type=1'
    wx.navigateTo({
      url
    });
  },
  privacyPolicy() {
    var url = '/pages/webViewList/userAgreement/userAgreement?type=2'
    wx.navigateTo({
      url
    });
  },
  goBrandinformation() {
    const {
      brandId
    } = this.data
    let url = {
      routeName: 'brandinformation',
      name: 'brandId',
      id: brandId,
    }
    this.buryingPointFun('品牌认证')
    wx.navigateTo({
      url: "/pages/webViewList/brandDetail/brandDetail?url=" + JSON.stringify(url)
    });
  },
  goSuccessCase(e) {
    // console.log('flag', e)
    let informationFlag = e.currentTarget.dataset.flag
    let informationId = e.currentTarget.dataset.informationid
    if (e.currentTarget.dataset.type && e.currentTarget.dataset.type == 'successCase') {
      this.buryingPointFun('成功案例-图文')
    } else {
      this.buryingPointFun('品牌动态-图文')
    }
    let url = {
      routeName: e.currentTarget.dataset.type,
      name: 'id',
      id: e.currentTarget.dataset.id,
    }
    if (informationFlag == 0) {
      wx.navigateTo({
        url: "/pages/webViewList/brandDetail/brandDetail?url=" + JSON.stringify(url)
      });
    } else if (informationFlag == 1) {
      wx.navigateTo({
        url: '/pages/webViewList/lookInformdetail/lookInformdetail?infoId=' + informationId
      });
    }

  },
  submitInterested(e) {
    const {
      swiperAllData,
      brandId,
      model,
      version,
      inputInterested,
      reasonActive,
      titleList
    } = this.data
    let newReason = []
    // console.log('提交不感兴趣原因');
    reasonActive.map((item) => {
      if (item == 1) {
        newReason.push('加盟费用高')
      }
      if (item == 2) {
        newReason.push('扶持政策少')
      }
      if (item == 3) {
        newReason.push('产品类少')
      }
    })
    newReason.push(inputInterested)
    util.request(api.javaBrandHost + "brand/v1.0/phone/saveUserIntention", {
        brandName: swiperAllData.brandName,
        brandId: brandId,
        userId: wx.getStorageSync('userId') || '',
        intention: e.currentTarget.dataset.id,
        reason: newReason.toString(),
        channel: 2,
        deviceName: model,
        osVersion: version,
        deviceId: wx.getStorageSync('accesstoken') || '',
      }, 'POST')
      .then(res => {
        if (res.code == "0") {
          let brandListId = wx.getStorageSync('brandListId') || []
          brandListId.map((item) => {
            if (item.id == brandId) {
              item.isShow = false
            }
          })
          titleList[titleList.length - 1].rectTop = titleList[titleList.length - 1].rectTop - 159
          wx.setStorageSync('brandListId', brandListId)
          this.setData({
            titleList: titleList
          }, () => {
            if (e.currentTarget.dataset.id == 0) {
              Toast('感谢您的反馈！')
              this.setData({
                isShowUninterestedPop: false,
                showInterestModule: false,
              })
            } else {
              this.getImId(true, true)
            }
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });


  },
  noInterested() {
    this.buryingPointFun('不感兴趣')
    this.setData({
      isShowUninterestedPop: true
    })
  },
  reasonClick(e) {
    let newIndex = e.currentTarget.dataset.index
    const {
      reasonActive
    } = this.data
    if (reasonActive.indexOf(Number(newIndex)) > -1) {
      reasonActive.splice(reasonActive.indexOf(newIndex), 1)
    } else {
      reasonActive.push(Number(newIndex))
    }
    this.setData({
      reasonActive: reasonActive
    })
  },
  uninterestedClose() {
    this.setData({
      isShowUninterestedPop: false
    })
  },
  tableBarClick(e) {
    const {
      titleList
    } = this.data
    let newIndex = e.currentTarget.dataset.index
    titleList.map((item) => {
      if (item.id == newIndex) {
        if (item.name == '加盟详情') {
          this.buryingPointFun('导航-加盟详情')
        }
        if (item.name == '成功案例') {
          this.buryingPointFun('导航-成功案例')
        }
        if (item.name == '品牌动态') {
          this.buryingPointFun('导航-品牌动态')
        }
        if (item.name == '相似推荐') {
          this.buryingPointFun('导航-相似推荐')
        }
        wx.pageScrollTo({
          scrollTop: item.rectTop - 140,
          duration: 300
        });
      }
    })

    this.setData({
      titleList: titleList
    })
  },
  test(event) {
    videoNumber = event.detail.currentTime
  },
  /*视频全屏 退出全屏 bindfullscreenchange="videoScreenChange" */
  videoScreenChange(e){
    let fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏
    if (!fullScreen ){ //退出全屏
    //  console.log('退出')
    }else{ //进入全屏
      // console.log('进入全屏')
    }
  },
  videoPlayOne() {
    this.buryingPointFun('成功案例-视频')
  },
  videoPlayTwo() {
    this.buryingPointFun('品牌动态-视频')
  },
  goSwiperDetails(e) {
    const {
      swiperAllData
    } = this.data
    let newAllData = {
      categoryName: swiperAllData.categoryName,
      product: swiperAllData.product,
      shopTypeimgs: swiperAllData.shopTypeimgs,
      hotSpotImgList: swiperAllData.hotSpotImgList,
      video: swiperAllData.video,
      imgUrl: e.currentTarget.dataset.url,
      brandName: swiperAllData.brandName,
      brandLogo: swiperAllData.brandLogo,
      mainPoint: swiperAllData.mainPoint,
      joinInvestMin: swiperAllData.joinInvestMin,
      joinInvestMax: swiperAllData.joinInvestMax,
      location: swiperAllData.location,
      brandId: swiperAllData.brandId,
    }
    this.buryingPointFun(e.currentTarget.dataset.type)
    wx.navigateTo({
      url: "/packageA/pages/swiperDetails/swiperDetails?allData=" + JSON.stringify(newAllData),
    });
  },
  swiperChange(event) {
    const {
      isShowVideo
    } = this.data
    // console.log(event.detail.current, '当前轮播index');
    let newIsShowNumber
    if (isShowVideo) {
      newIsShowNumber = event.detail.current != 0 ? 2 : 1
    } else {
      newIsShowNumber = 2
    }
    this.setData({
      swiperItemIndex: event.detail.current,
      isShowNumber: newIsShowNumber,
    }, () => {
      setTimeout(() => {
        if (event.detail.current != 0) {
          this.data.videoCtx.pause()
        } else {
          this.data.videoCtx.play()
          // setTimeout(()=>{
          // this.data.videoCtx.seek(parseInt(videoNumber))
          // },1000)
        }
      }, 100)
    })
  },
  continuePlaying() {
    this.setData({
      isShowAutoplay: true,
      showWifiModal: false
    })
  },
  videoOrimgClick(e) {
    const {
      swiperList
    } = this.data
    let index = e.currentTarget.dataset.index
    if (swiperList.length <= 1) {
      return
    }
    if (index == 1) {
      this.buryingPointFun('banner视频按钮')
    }
    if (index == 2) {
      this.buryingPointFun('banner图片按钮')
    }
    this.setData({
      isShowNumber: index,
      swiperItemIndex: index - 1
    })
  },
  initSwiper() {
    let that = this
    const {
      swiperList
    } = this.data
    if (swiperList.length > 0 && swiperList[0].isVideo) {
      this.setData({
        isShowVideo: true,
        videoCtx: wx.createVideoContext('myVideo', this),
        isShowNumber: 1
      })
      wx.getNetworkType({
        success: function (res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType
          if (networkType == 'wifi') {
            that.setData({
              showWifiModal: false,
              isShowAutoplay: true,
            })
          } else {
            that.setData({
              showWifiModal: true,
              isShowAutoplay: false
            })
          }
        }
      })
    } else {
      this.setData({
        isShowVideo: false,
        videoCtx: wx.createVideoContext('myVideo', this),
        isShowNumber: 2,
      })
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          model: res.model,
          version: res.version,
        })
      }
    })

  },
  getPhone() {
    this.buryingPointFun('底部-拨打电话')
    wx.makePhoneCall({
      phoneNumber: "4000330560" //仅为示例，并非真实的电话号码
    });
  },
  getImId(e, type) {
    const {
      swiperAllData,
      brandId
    } = this.data
    let login_type = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.type || ''
    let login_source = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.id || ''
    if (login_source == '26') {
      this.buryingPointFun('底部-在线咨询')
    }
    if (login_source == '30') {
      this.buryingPointFun('顶部-询底价')
    }
    if (login_source == '31') { //马上测算弹窗
      if (wx.getStorageSync("accesstoken")) {
        this.setData({
          forecastSta: false,
          countBut: true
        })
        this.buryingPointFun('品牌详情页-马上测算')
      }

    }

    if (type) {
      wx.setStorageSync('accessPath', '33品牌详情页-感兴趣')
      this.buryingPointFun('感兴趣')
    }
    if (wx.getStorageSync("accountId")) {
      let data = {
        phone: wx.getStorageSync('userPhone'),
        accountId: wx.getStorageSync('accountId'),
        imId: wx.getStorageSync('nimId'),
        channel: 'xcx',
        brandName: swiperAllData.brandName
      }
      util.request(api.javaCustserviceUrl + "custservice/v1.0/huiju/getSaleIm", data, 'POST')
        .then((res) => {
          // console.log(res)
          if (res.code == 0) {
            var brandObj = {
              "sendImageUrl": swiperAllData.brandLogo,
              "titleName": swiperAllData.brandName,
              "mainPoint": swiperAllData.mainPoint,
              "subTitle": swiperAllData.joinInvestMin + '-' + swiperAllData.joinInvestMax,
              "city": swiperAllData.location,
              "sendBrandID": swiperAllData.brandId,
              "categoryName":swiperAllData.categoryName
            }
            var url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId + '&brandObj=' + JSON.stringify(brandObj)
            let click_source
            if (login_source == '26') {
              click_source = '品牌详情页-底部在线咨询'
            }
            if (login_source == '30') {
              click_source = '品牌详情页-询底价'
            }
            if (login_source == '31') {
              if(login_type.indexOf('马上测算')!=-1){
                click_source = '品牌详情页-马上测算'
              }else{
                click_source = '品牌详情页-开店城市查询'
              }
            }
            if (type) {
              click_source = '品牌详情页-感兴趣'
              Toast('感谢您的反馈！')
              setTimeout(() => {
                this.setData({
                  isShowUninterestedPop: false,
                  showInterestModule: false,
                }, () => {
                  wx.navigateTo({
                    url: url
                  });
                })
              }, 1000)
            } else {
              wx.navigateTo({
                url: url
              });
            }
            app.sensors.track('consultationInitiate', {
              click_source: click_source,
              brand_name: swiperAllData.brandName,
              brand_id: brandId
            })
          }
        })
        .catch((error) => {});
    } else {
      let url = "/pages/login/login"
      if (login_source == '26') {
        login_source = '26品牌详情页-底部在线咨询'
        wx.setStorageSync('accessPath', '26品牌详情页-底部在线咨询')
      }
      if (login_source == '30') {
        login_source = '30品牌详情页-询底价'
        wx.setStorageSync('accessPath', '30品牌详情页-询底价')
      }

      app.sensors.track('registerLoginButtonClick', {
        login_source: type ? '33品牌详情页-感兴趣' : login_source
      })
      // wx.navigateTo({
      //   url
      // })
    }
  },
  backClick() {
    const {
      sourceType,
      from
    } = this.data
    let pages = getCurrentPages()
    if (sourceType) {
      var url = "/pages/newsMessage/newsMessage";
      wx.reLaunch({
        url
      });
    } else {
      if (!pages[pages.length - 2]) {
        var url = "/pages/index/index";
        wx.reLaunch({
          url
        });
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },
  initData(brandId) {
    util.request(api.javaBrandHost + "brand/v1.0/phone/getBrandInfo2.0", {
        brandId: brandId,
        userId: wx.getStorageSync("accountId"),
      }, 'POST')
      .then(res => {
        if (res.code == "0") {
          let newImgList = res.data.imgList
          let newVideoList = [];
          let initJoinDetailModule = [];
          if (res.data.video && res.data.video.length > 0) {
            newVideoList.push(res.data.video[0])
            newVideoList[0].isVideo = true
          }
          let initData = JSON.parse(JSON.stringify(res.data));
          let newData = initData;
          let allJoinDetailModule = JSON.parse(JSON.stringify(res.data)).joinDetailModuleList;
          for (var i in newData.takeOutStatics) {
            if (typeof (newData.takeOutStatics[i]) == 'number' && (newData.takeOutStatics[i] + '').indexOf('.') > -1) {
              newData.takeOutStatics[i] = newData.takeOutStatics[i].toFixed(1)
            }
          }
          let newBrandInformationYnamicList = newData.brandDynamicList.concat(newData.brandInformationList)
          /*图文详情下，品牌详情模块超过2条做处理*/
          if(initData.joinDetailsType == 1){
            initData.joinDetailModuleList.forEach(function(item){
              if(item.joinDetailList.length>2){
                item.joinDetailList = item.joinDetailList.splice(0,2)
              }
              initJoinDetailModule.push(item)
            })
          }else if(initData.joinDetailsType == 2 && initData.joinDetailsBrandFile != null){
            if(initData.joinDetailsBrandFile.picList.length>5){
              this.setData({
                showImgDetaillist:JSON.parse(JSON.stringify(res.data)).joinDetailsBrandFile.picList.slice(0,5),
                imgDetailMore:true
              })
            }else{
              this.setData({
                showImgDetaillist:JSON.parse(JSON.stringify(res.data)).joinDetailsBrandFile.picList,
                imgDetailMore:false
              })
            }
          }
          this.setData({
            swiperList: newVideoList.concat(newImgList),
            swiperAllData: newData,
            joinDetailsInitData:initJoinDetailModule,
            joinDetailsAllData:allJoinDetailModule,
            attention: newData.attention,
            brandInformationYnamicList: newBrandInformationYnamicList,
            timeAllData : res.data
          }, () => {
            this.initSwiper()
            this.couponFun(res.data)

            this.heightTreatment(res.data)
          })
        }else if(res.code == "21105"){
          wx.hideLoading()
          Toast('页面已下线')
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 2000);
        }
      })
      .catch(err => {
        console.log(err);
      });
    util.request(api.javaBrandHost + "brand/v1.0/brandStore/getStoreNumForMap", {
      brandId: newBrandId
    }, 'POST').then(res=>{
      if (res.code == "0"){
        this.setData({
          shopIsDistributed:res.data.length
        })
      }
    })
  },
  heightTreatment(allData) {
    const {
      joinDetailModuleList,
      brandSuccessCaseList,
      brandDynamicList,
      likeBrandList,
      joinDetailsBrandFile,
      joinDetailsType
    } = allData;
    let newTitleList = []
    wx.createSelectorQuery().select('#brandInfo').boundingClientRect(function (rect) {
      newTitleList.push({
        name: '品牌信息',
        isActive: false,
        id: 0,
        rectTop: rect.top
      })
    }).exec()
    if(joinDetailsType == 1){
      if (joinDetailModuleList.length > 0) {
        setTimeout(() => {
          wx.createSelectorQuery().select('#brandDetail').boundingClientRect(function (rect) {
            newTitleList.push({
              name: '品牌详情',
              isActive: false,
              id: 1,
              rectTop: rect.top,
              imgheight:rect.height
            })
          }).exec()
        }, 1000);
      }
    }else if(joinDetailsType == 2){
      if(joinDetailsBrandFile != null){
        setTimeout(() => {
          wx.createSelectorQuery().select('#brandDetail').boundingClientRect(function (rect) {
            newTitleList.push({
              name: '品牌详情',
              isActive: false,
              id: 1,
              rectTop: rect.top,
              imgheight:rect.height
            })
          }).exec()
        }, 1000)
      }
    }
    if (brandDynamicList.length > 0) {
      setTimeout(() => {
        wx.createSelectorQuery().select('#brandNews').boundingClientRect(function (rect) {
          newTitleList.push({
            name: '品牌动态',
            isActive: false,
            id: 2,
            rectTop: rect.top,
            initRectTop: rect.top
          })
        }).exec()
      }, 1100);
    }
    if (likeBrandList.length > 0) {
      setTimeout(() => {
        wx.createSelectorQuery().select('#similarRecommendation').boundingClientRect(function (rect) {
          newTitleList.push({
            name: '相似推荐',
            isActive: false,
            id: 3,
            rectTop: rect.top,
            initRectTop: rect.top
          })
        }).exec()
      }, 1100);
    }

    setTimeout(() => {
      if (newTitleList[0]) newTitleList[0].isActive = newTitleList[0].isActive ? true : ''
      this.setData({
        titleList: newTitleList
      }, () => {
        wx.hideLoading()
      })
    }, 1500)
  },
  pageScrollToBottom: function (newScroll) {
    const _this = this;
    if (_this.data.countBut) return;
    wx.createSelectorQuery().select('#wrapperBar').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.getSystemInfo({
        success(res) {
          const boxHeight = res.windowHeight;
          const scrollBot = rect.height - boxHeight;
          if (scrollBot - (newScroll || 0) < 5) { //滑到到底部
            if (_this.data.token) {
              _this.setData({
                forecastSta: true,
                countBut: true
              })
            } else if (!_this.data.strongLogin && _this.data.onLoadTime > 4) {
              _this.setData({
                forecastSta: true,
                countBut: true
              })
            }
          }
        }
      })
    }).exec()
  },
  onShow: function () {
    this.setData({
      token: wx.getStorageSync('accesstoken') || ''
    })
  },
  onPageScroll: function (e) {
    const {
      isShowTabBar,
      isShowTitle,
      swiperAllData
    } = this.data
    // 展示顶部返回返回按钮
    if (e.scrollTop > 50) {
      if (!isShowTitle) {
        this.setData({
          isShowTitle: true,
          isShowTabBar: true
        })
        this.data.videoCtx.pause()
      }
    } else {
      if (isShowTitle) {
        this.setData({
          isShowTitle: false,
          isShowTabBar: false
        })
      }
    }
    /* 展示几个品牌title */
    // let scrollTopNumber
    // if (swiperAllData.joinDetailModuleList.length > 0) {
    //   scrollTopNumber = 710
    // } else {
    //   scrollTopNumber = 1118
    // }
    
    // if (e.scrollTop >= scrollTopNumber) {
    //   if (!isShowTabBar) {
    //     this.setData({
    //       isShowTabBar: true
    //     })
    //   }
    // } else {
    //   if (isShowTabBar) {
    //     this.setData({
    //       isShowTabBar: false
    //     })
    //   }
    // }
    this.showTabBar(e.scrollTop)
    this.pageScrollToBottom(e.scrollTop)
  },
  showTabBar(distance) {
    distance = distance + 220
    const {
      titleList
    } = this.data
    titleList.map((item, index) => {
      item.isActive = false
    })
    if (titleList.length == 1) {
      titleList[0].isActive = true
    }
    if (titleList.length == 2) {
      // console.log(distance, titleList[0].rectTop, titleList[1].rectTop);
      if (
        parseInt(distance) >= titleList[0].rectTop &&
        parseInt(distance) < titleList[1].rectTop
      ) {
        titleList[0].isActive = true;
      }
      if (
        parseInt(distance) >= titleList[1].rectTop
      ) {
        titleList[1].isActive = true
      }
    }
    if (titleList.length == 3) {
      // console.log(distance, titleList[0].rectTop, titleList[1].rectTop, titleList[2].rectTop);

      if (
        parseInt(distance) >= titleList[0].rectTop &&
        parseInt(distance) < titleList[1].rectTop
      ) {
        titleList[0].isActive = true;
      }
      if (
        parseInt(distance) >= titleList[1].rectTop &&
        parseInt(distance) < titleList[2].rectTop
      ) {
        titleList[1].isActive = true
      }
      if (
        parseInt(distance) >= titleList[2].rectTop
      ) {
        titleList[2].isActive = true;
      }
    }
    if (titleList.length == 4) {
      // console.log(distance, titleList[0].rectTop, titleList[1].rectTop, titleList[2].rectTop, titleList[3].rectTop);
      if (parseInt(distance) < titleList[1].rectTop) {
        titleList[0].isActive = true
      }
      if (
        parseInt(distance) >= titleList[1].rectTop &&
        parseInt(distance) < titleList[2].rectTop
      ) {
        titleList[1].isActive = true
      }
      if (
        parseInt(distance) >= titleList[2].rectTop &&
        parseInt(distance) < titleList[3].rectTop

      ) {
        titleList[2].isActive = true
      }
      if (
        parseInt(distance) >= titleList[3].rectTop
      ) {
        titleList[3].isActive = true
      }
    }

    this.setData({
      titleList: titleList
    })
  },
  countChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  couponFun(allData) {
    // console.log(allData.nowTimestamp)
    let startDate = allData.nowTimestamp
    let endDate = allData.discardActivityEndTime
    let differenceDate = endDate - new Date().getTime()
    //计算出相差天数  
    var days = Math.floor(differenceDate / (24 * 3600 * 1000))

    //计算出小时数  

    var leave1 = differenceDate % (24 * 3600 * 1000) //计算天数后剩余的毫秒数  
    if (allData.nowTimestamp > allData.discardActivityStartTime && allData.nowTimestamp < endDate) {
      this.setData({
        time: leave1,
        differenceDay: days
      })
    }
  },
  confirmClick(event) {
    // console.log(event.detail.value[0], event.detail.value[1].name, event.detail.value[1].gbCode);
    this.setData({
      storeCityTxt: event.detail.value[0] + '-' + event.detail.value[1].name,
      gbCodeName: event.detail.value[1].name,
      gbCode: event.detail.value[1].gbCode,
      isShowStoreCity: false
    })
  },
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    picker.setColumnValues(1, citys[value[0]]);
  },
  closeStoreCity() {
    app.sensors.track('loginClose', {})
    this.setData({
      isShowStoreCityResult: false,
      strongLogin: false
    })
  },
  nowSubmit() {
    const {
      brandId,
      gbCode
    } = this.data
    this.buryingPointFun('立即查询开店城市')
    var accesstoken = wx.getStorageSync("accesstoken");
    if (!accesstoken) {
      Toast({
        message: '请先登录后可查询！',
        duration: 2000
      })
      app.sensors.track('registerLoginButtonClick', {
        login_source: '31品牌详情页-查询开店城市'
      })
      wx.setStorageSync('accessPath', '31品牌详情页-查询开店城市')

      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }, 2000)
      return
    }
    if (!gbCode) {
      Toast('请选择您要开店的城市')
      return
    }
    util.request(api.javaBrandHost + "brand/v1.0/brandArea/brandJoinAreaQuery", {
        brandId: brandId,
        code: gbCode,
        searchType: 2,
      }, 'POST')
      .then(res => {
        if (res.code == "0") {
          console.log(res.data);
          this.setData({
            storeCityData: res.data,
            isShowStoreCityResult: true
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  openStoreCity() {
    var accesstoken = wx.getStorageSync("accesstoken");
    this.buryingPointFun('选择开店城市')
    if (accesstoken) {
      this.setData({
        isShowStoreCity: true
      })
    } else {
      Toast({
        message: '请先登录后可查询！',
        duration: 2000
      })
      app.sensors.track('registerLoginButtonClick', {
        login_source: '31品牌详情页-查询开店城市'
      })
      wx.setStorageSync('accessPath', '31品牌详情页-查询开店城市')
      // setTimeout(() => {
      //   wx.navigateTo({
      //     url: '/pages/login/login'
      //   })
      // }, 2000)

    }

  },
  cancelClick() {
    this.setData({
      isShowStoreCity: false
    })
  },
  cityInit() {
    util.request(api.javaBrandHost + "brand/v1.0/phone/cityList", 'get')
      .then(res => {
        if (res.code == "0") {
          res.data.map((item) => {
            citys[item.name] = item.cityList
          })
        }

        this.setData({
          areaList: [{
              values: Object.keys(citys),
              className: 'column1',
            },
            {
              values: citys['北京'],
              className: 'column2',
              defaultIndex: 0,
            }
          ],
        }, () => {
          console.log(this.data.areaList, '城市列表');
        })
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  loginIsShowForTime(uuid) {
    let params = {
      channel: 3,
      iDen: uuid,
    };
    util.request(api.javaBrandHost + "brand/v1.0/force/getLoginTipTime", params, 'POST').then((res) => {
      if (res.code == 0) {
        var dataTime = res.data.time;
        if (dataTime != -1) {
          var ejecTime = dataTime * 1000;
          setTimeout(() => {
            this.setData({
              strongLogin: true
            })
            wx.setStorageSync('accessPath', '15品牌详情页-弹框登录')
            app.sensors.track('registerLoginButtonClick', {
              login_source: '15品牌详情页-弹框登录'
            })
          }, ejecTime);
        }
      }
    });

  },
  forcelSignIn() {
    let userId = wx.getStorageSync('accountId');
    let getUuid = wx.getStorageSync("randomNumber");
    //判断是否3秒强制登录
    if (!userId) {
      if (!getUuid) {
        util.request(api.javaBrandHost + "brand/v1.0/force/getUUid", {}, 'POST').then((res) => {
          if (res.code == 0) {
            wx.setStorageSync("randomNumber", res.data);
          }
        });
      }
      this.loginIsShowForTime(wx.getStorageSync("randomNumber"))
    }
  },
  brandListIdFun(brandId) {
    let brandListId = wx.getStorageSync('brandListId') || []
    if (brandListId.length == 0) {
      brandListId.push({
        id: brandId,
        isShow: true
      })
      wx.setStorageSync('brandListId', brandListId)
      this.setData({
        showInterestModule: true,
      })
    } else {
      for (let i = 0; i < brandListId.length; i++) {
        if (brandListId[i].id == brandId) {
          this.setData({
            showInterestModule: brandListId[i].isShow,
          })
          return
        }
      }
      for (let i = 0; i < brandListId.length; i++) {
        if (brandListId[i].id == brandId) {} else {
          brandListId.push({
            id: brandId,
            isShow: true
          })
          wx.setStorageSync('brandListId', brandListId)
          return
        }
      }
    }
  },
  onHide: function () {
    clearInterval(this.data.timeInterval);
    wx.removeStorageSync('shopIsDistributed')
  },
  onLoad: function (options) {
    wx.login({
      success: function (res) {
        wx.setStorageSync('code', res.code)
      },
      fail: function (err) {}
    });
    this.data.timeInterval = setInterval(() => {
      this.setData({
        onLoadTime: ++this.data.onLoadTime
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(this.data.timeInterval);
      if (!this.data.countBut && !this.data.strongLogin) {
        this.setData({
          forecastSta: true,
          countBut: true
        })
      }
    }, 60000);
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({
      brandId: options.brandId,
      showInterestModule: true,
      sourceType: options.type ? options.type : '',
      from: options.from || ''
    })
    newBrandId = options.brandId //页面全局变量
    this.initData(options.brandId)
    this.QAlistMsgInit(options.brandId)
    this.cityInit()
    this.forcelSignIn()
    this.brandListIdFun(options.brandId)
    this.MyfootFun(options.brandId)
    const {
      top,
      height
    } = app.globalData
    this.setData({
      heightTop: (top + height)
    })
    if(wx.getStorageSync('accesstoken')){
      this.setData({ 
        userPhone:wx.getStorageSync('userPhone').replace(/^(\d{3})\d+(\d{4})$/, "$1****$2")
      })
    }
  },
  // 埋点函数
  buryingPointFun(type) {
    const {
      swiperAllData
    } = this.data
    app.sensors.track('projectDetailClick', {
      button_name: type,
      brand_classification: swiperAllData.categoryName,
      brand_name: swiperAllData.brandName,
      brand_id: swiperAllData.brandId,
    })
  },
  //足迹
  MyfootFun(brandId) {
    var params = {
      userId: wx.getStorageSync("accountId"),
      busId: brandId,
      busType: 1,
    };
    util.request(api.javahost + "support/v1.0/userFootprint/scan", params, 'POST')
      .then(res => {
        if (res.code == 0) {

        }
      })
      .catch(error => {

      });
  },
  onReady(options) {
    /*判断是否有上一父级页面更换返回图标 */
    let pages = getCurrentPages();
    if (!pages[pages.length - 2]) {
      this.setData({
        isBackHome:true
      })
    } else {
      this.setData({
        isBackHome:false
      })
    }
  },
  /*分享 */
  onShareAppMessage: function () {
    return {
      title: '加盟好餐饮，就找餐盟严选！',
    }
  },
  /*招商手册点击展开收起 */
  imgDetailOpera(e){
    let _type = e.currentTarget.dataset.operatype;
    let {swiperAllData,titleList} = this.data;
    if(_type == 'open'){
      /*点击的时候获取图片列表展开的完整高度，再用展开之前的高度取差值，将 剩下的模块top加上差值即可*/
      setTimeout(function(){
        wx.createSelectorQuery().select('#brandDetail').boundingClientRect(function (rect) {
          if(titleList[1].name="品牌详情"){
            if(titleList[2]){
              titleList[2].rectTop = titleList[2].rectTop + (rect.height - titleList[1].imgheight )
            }
            if(titleList[3]){
              titleList[3].rectTop = titleList[3].rectTop + (rect.height - titleList[1].imgheight )
            }
          }
        }).exec()
      },1000)
      this.setData({
        showImgDetaillist:swiperAllData.joinDetailsBrandFile.picList,
        imgDetailMore:false
      })
    }else if(_type == 'close'){
       /*点击的时候获取图片列表展开的完整高度，再用展开之前的高度取差值，将 剩下的模块top加上差值即可*/
      wx.createSelectorQuery().select('#brandDetail').boundingClientRect(function (rect) {
        if(titleList[1].name="品牌详情"){
          if(titleList[2]){
            titleList[2].rectTop = titleList[2].rectTop - (rect.height - titleList[1].imgheight )
          }
          if(titleList[3]){
            titleList[3].rectTop = titleList[3].rectTop - (rect.height - titleList[1].imgheight )
          }
        }
        wx.pageScrollTo({
          scrollTop: titleList[1].rectTop,
          duration: 300
        });
      }).exec()
      this.setData({
        showImgDetaillist:swiperAllData.joinDetailsBrandFile.picList.slice(0,5),
        imgDetailMore:true
      })
    }
  },
  /*图文详情点击展开收起 */
  joinDetailsOpera(e){
    let {swiperAllData,joinDetailsAllData,joinDetailsInitData,titleList} = this.data;
    let _indexid = e.currentTarget.dataset.indexid;
    let _operatype = e.currentTarget.dataset.operatype;
    if(_operatype == 'open'){
      /*点击的时候获取图片列表展开的完整高度，再用展开之前的高度取差值，将 剩下的模块top加上差值即可*/
      setTimeout(function(){
        wx.createSelectorQuery().select('#brandDetail').boundingClientRect(function (rect) {
          if(titleList[1].name="品牌详情"){
            if(titleList[2]){
              titleList[2].rectTop = titleList[2].initRectTop + (rect.height - titleList[1].imgheight )
            }
            if(titleList[3]){
              titleList[3].rectTop = titleList[3].initRectTop + (rect.height - titleList[1].imgheight )
            }
          }
        }).exec()
      },1000)
      swiperAllData.joinDetailModuleList[_indexid] = joinDetailsAllData[_indexid]
    }else if(_operatype == 'close'){
      /*获取折叠前的高度 */
      wx.createSelectorQuery().select('#brandDetail').boundingClientRect(function (rect) {
        titleList[1].operaHeight = rect.height
      }).exec()
      /*通过时间差，获取折叠后的高度*/
      setTimeout(() => {
        wx.createSelectorQuery().select('#brandDetail').boundingClientRect(function (rect) {
          if(titleList[1].name="品牌详情"){
            if(titleList[2]){
              titleList[2].rectTop = titleList[2].rectTop - (titleList[1].operaHeight-rect.height )
            }
            if(titleList[3]){
              titleList[3].rectTop = titleList[3].rectTop - (titleList[1].operaHeight-rect.height )
            }
          }
        }).exec()
      }, 500);
      swiperAllData.joinDetailModuleList[_indexid] = joinDetailsInitData[_indexid]
    }
    this.setData({
      swiperAllData:swiperAllData
    })
  },
 /*利用小程序的原生api 点击图片全屏展示，可缩小放大 */
  previewImage:function(e){
    let {swiperAllData} = this.data;
    var src = e.target.dataset.itemurl;
    if(swiperAllData.joinDetailsType == 2){
      let imgList = swiperAllData.joinDetailsBrandFile.picList;
      let perevList = [];
      imgList.forEach(function(item,index){
        perevList.push(item.picUrl)
      })
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: perevList // 需要预览的图片http链接列表
      })
    }
  },
  /*品牌提问列表*/
  QAlistMsgInit(_brandid){
    let data = {
      type:1,
      businessId:_brandid
    }
    util.request(api.javaBrandHost + "brand/rotation/list", data, 'GET')
    .then(res =>{
      let _num = 0
      let _initNUm = 0
      res.data.forEach(function(item){
        _num += item.clickCount;
        _initNUm += item.clickCount;
      })
      if(_num > 9999){
        _num = _num / 10000
        /*保留一位小数并且不四舍五入*/
        _num = parseInt(_num * 10) / 10 +'W'
      }
      this.setData({
        brandQAList:res.data,
        brandQACheckNum:_num,
        brandQAClickNum:_initNUm
      })
    }).catch((error) => {});
  },
  /*品牌提问弹窗 */
  openQAPopup(e){
    let {brandQAList,brandQACheckNum,brandQAClickNum,swiperAllData} = this.data;
    let _item = e.currentTarget.dataset.item;
    brandQAClickNum += 1;
    let _brandQAClickNum = brandQAClickNum;
    
    if(_brandQAClickNum > 9999){
      _brandQAClickNum = _brandQAClickNum / 10000
      /*保留一位小数并且不四舍五入*/
      brandQACheckNum = parseInt(_brandQAClickNum * 10) / 10 +'W'
    }
    this.setData({
      showQAPopup:true,
      QAFormProupMsg:_item,
      brandQACheckNum:brandQACheckNum,
      brandQAClickNum:brandQAClickNum
    })
    let data ={
      id:_item.id,
      businessId:swiperAllData.brandId
    }
    util.request(api.javaBrandHost + "brand/rotation/addClickCount", data, 'POST','application/x-www-form-urlencoded')
    .then(res =>{
      // console.log(res)
    }).catch((error) => {});
    /*神策*/
    this.buryingPointFun('提问轮播')
  },
  closeQAPopup(){
    let {token} = this.data;
    if(!token){
      this.setData({
        userPhone:''
      });
    }
    this.setData({
      showQAPopup:false,
      phoneSMS:'',
      isSendSms:true,
      countNumber: 60,
      msgId: ''
    });
    clearInterval(this.timer)
    this.questionMessageClickFun('关闭弹窗','1详情页-轮播提问');
  },
  /*跳转到问题选择页*/
  checkQA(e){
    let {swiperAllData} = this.data;
    var url = `/packageA/pages/brandQAlist/brandQAlist?QAProupMsgId=${e.currentTarget.dataset.qaformproupmsg.id}&brandID=${swiperAllData.brandId}`
    wx.navigateTo({
      url: url
    });
    this.questionMessageClickFun('选择问题','1详情页-轮播提问');
  },
  /*获取底价弹窗*/
  openReservePrice(){
    this.setData({
      showReservePriceProup:true
    })
    // if(wx.getStorageSync('accesstoken')){
    //   this.setData({
    //     userPhone:wx.getStorageSync('userPhone').replace(/^(\d{3})\d+(\d{4})$/, "$1****$2"),
    //   })
    // }
    /*神策*/
    this.buryingPointFun('底部-获取底价')
  },
  closeReservePriceProup(){
    let {token} = this.data;
    if(!token){
      this.setData({
        userPhone:''
      });
    }
    this.setData({
      showReservePriceProup:false,
      phoneSMS:'',
      isSendSms:true,
      countNumber: 60,
      msgId: ''
    })
    clearInterval(this.timer)
    this.messageSensorsClickFun('关闭弹窗','1详情页底部-获取底价');
  },
  /*获取手机号码 与 发送验证码*/
  onChangePhone(e) {
    this.setData({
      userPhone: e.detail.value
    })  
  },
  propFormPhoneFocus(e){
    if(e.currentTarget.dataset.type == 'hqdj'){
      this.messageSensorsClickFun('手机号','1详情页底部-获取底价');
    }else if(e.currentTarget.dataset.type == 'twSwiper'){
      this.questionMessageClickFun('手机号','1详情页-轮播提问');
    }
  },
  onChangeSms(e) {
    this.setData({
      phoneSMS: e.detail.value
    })
  },
  smsSend(e) {
    const { userPhone } = this.data
    if (userPhone.length == 11) {
      this.getVerificationCode()
    }else {
      Toast('请输入正确的手机号')
    };
    if(e.currentTarget.dataset.type == 'hqdj'){
      this.messageSensorsClickFun('验证码','1详情页底部-获取底价');
    }else if(e.currentTarget.dataset.type == 'twSwiper'){
      this.questionMessageClickFun('验证码','1详情页-轮播提问');
    }
  },
  getVerificationCode() {
    const { userPhone } = this.data
    let md5String = hexMD5.md5(userPhone + '3#7@2&8*10' + userPhone.slice(6));
    util.request(api.javaUserHost + "v1.0/app/sys/sendCode", {
      mobile: userPhone,
      token: md5String
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          this.setData({
            isSendSms: false,
            countNumber: 60,
            msgId: res.data
          }, () => {
            this.countNumberFun()
          })
        } else {
          let toastMsg = ''
          if(res.msg.indexOf('系统错误') != -1){
            toastMsg = res.msg.split(':')[1]
          }else{
            toastMsg = res.msg
          }
          Toast({
            // type: 'fail',
            message: toastMsg,
            onClose: () => {
              this.setData({
                isSendSms: true
              })
            },
          });
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  /*60s倒计时 */
  countNumberFun() {
    this.timer = setInterval(() => {
      const { countNumber } = this.data
      if (countNumber == 1) {
        this.setData({
          isSendSms: true,
        })
        clearInterval(this.timer)
      } else {
        this.setData({
          countNumber: countNumber - 1
        })
      }
    }, 1000)
  },
  /*信息保护协议 */
  popupFormBHSM(e){
    let {popupBHSMCheck} = this.data;
    if(popupBHSMCheck){
      this.setData({
        popupBHSMCheck:false
      })
    }else{
      this.setData({
        popupBHSMCheck:true
      })
    }
    if(e.currentTarget.dataset.type == 'hqdj'){
      this.messageSensorsClickFun('个人信息保护声明','1详情页底部-获取底价');
    }else if(e.currentTarget.dataset.type == 'twSwiper'){
      this.questionMessageClickFun('个人信息保护声明','1详情页-轮播提问');
    }
  },
  /*跳转到信息保护页面 */
  secretcardPage(e){
    if(e.currentTarget.dataset.type == 'hqdj'){
      this.messageSensorsClickFun('个人信息保护声明','1详情页底部-获取底价');
    }else if(e.currentTarget.dataset.type == 'twSwiper'){
      this.questionMessageClickFun('个人信息保护声明','1详情页-轮播提问');
    }
    wx.nextTick(()=>{
      let url = "/pages/webViewList/webView/webView?url="+api.webViewUrl+"personalState?from=appa";
      wx.navigateTo({
        url: url
      });
    })
  },
  /*神策埋点 1.留言点击 2.留言成功 3.提问留言点击*/
  messageSensorsClickFun(clickSource,messageName){
    let {swiperAllData} = this.data;
    app.sensors.track('messageClick', {
      button_name: clickSource,
      message_name: messageName,
      brand_name: swiperAllData.brandName,
      brand_id: swiperAllData.brandId,
      brand_classification:swiperAllData.categoryName
    })
  },
  messageSensorsSuccessFun(messageName){
    let {swiperAllData,userPhone} = this.data;
    app.sensors.track('messageSuccess', {
      name:'',
      phone: userPhone.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2"),
      message_name:messageName,
      brand_name: swiperAllData.brandName,
      brand_id: swiperAllData.brandId,
      brand_classification:swiperAllData.categoryName
    })
  },
  questionMessageClickFun(clickSource,messageName){
    let {swiperAllData,QAFormProupMsg} = this.data;
    app.sensors.track('questionMessageClick', {
      button_name:clickSource,
      submit_questions: QAFormProupMsg.content,
      message_name:messageName,
      brand_name: swiperAllData.brandName,
      brand_id: swiperAllData.brandId,
      brand_classification:swiperAllData.categoryName
    })
  },
  /*弹窗表单提交 */
  popupFormSubmit(e){
    let data;
    let toastmsg = '';const { userPhone ,phoneSMS ,msgId,popupBHSMCheck,token} = this.data
    /*判断是否需要校验验证码*/
    if(e.currentTarget.dataset.type == 'checkcode'){
      if(userPhone == ''){
        Toast('请输入手机号')
        return false;
      }else if(phoneSMS == ''){
        Toast('请输入验证码')
        return false;
      }else if(phoneSMS.length < 6){
        Toast('请输入正确的验证码')
        return false;
      }else if(!popupBHSMCheck){
        Toast('请同意《个人信息保护声明》')
        return false;
      }else{
        if(e.currentTarget.dataset.laizi == 'hqdj'){ 
          /*获取底价表单 */
          data ={
            brandId:e.currentTarget.dataset.brandinfo.brandId,
            brandName:e.currentTarget.dataset.brandinfo.brandName,
            phoneNumber:userPhone,
            name:'获取底价',
            isCheckCode:1,
            code:phoneSMS,
            msgId:msgId,
            businessType:1,
            source:0
          }
          toastmsg = '询价成功，加盟顾问会尽快与您联系！';
          this.messageSensorsClickFun('立即获取底价','1详情页底部-获取底价');
        }else{ 
          /*用户提问表单 */
          data ={
            content:e.currentTarget.dataset.qamsg,
            brandId:e.currentTarget.dataset.brandinfo.brandId,
            brandName:e.currentTarget.dataset.brandinfo.brandName,
            phoneNumber:userPhone,
            name:'用户提问',
            isCheckCode:1,
            code:phoneSMS,
            msgId:msgId,
            businessType:0,
            source:0
          }
          toastmsg = '提问成功，加盟顾问会尽快与您联系！';
          this.questionMessageClickFun('立即提问','1详情页-轮播提问');
        }
      }
    }else{
      if(!popupBHSMCheck){
        Toast('请同意《个人信息保护声明》')
        return false;
      }
      if(e.currentTarget.dataset.laizi == 'hqdj'){ 
        /*获取底价表单 */
        data ={
          accountId:wx.getStorageSync('accountId'),
          brandId:e.currentTarget.dataset.brandinfo.brandId,
          brandName:e.currentTarget.dataset.brandinfo.brandName,
          phoneNumber:wx.getStorageSync('userPhone'),
          name:'获取底价',
          businessType:1,
          source:0
        }
        toastmsg = '询价成功，加盟顾问会尽快与您联系！'
        this.messageSensorsClickFun('立即获取底价','1详情页底部-获取底价');
      }else{
        /*用户提问表单 */
        data ={
          accountId:wx.getStorageSync('accountId'),
          content:e.currentTarget.dataset.qamsg,
          brandId:e.currentTarget.dataset.brandinfo.brandId,
          brandName:e.currentTarget.dataset.brandinfo.brandName,
          phoneNumber:wx.getStorageSync('userPhone'),
          name:'用户提问',
          businessType:0,
          source:0
        }
        toastmsg = '提问成功，加盟顾问会尽快与您联系！';
        this.questionMessageClickFun('立即提问','1详情页-轮播提问');
      }
    }
    //提交表单
    util.request(api.javaUserHost + "v1.0/sys/saveMessageAndPushClue", data, 'POST')
    .then(res =>{
      if(res.code == '0'){
        Toast(toastmsg)
        if(toastmsg.indexOf('询价成功')!=-1){
          this.messageSensorsSuccessFun('1详情页底部-获取底价')
        }else if(toastmsg.indexOf('提问成功')!=-1){
          this.messageSensorsSuccessFun('6详情页-轮播提问')
        }
        if(!token){
          this.setData({
            userPhone:''
          });
        }
        this.setData({
          showReservePriceProup:false,
          showQAPopup:false,
          phoneSMS:'',
          isSendSms:true,
          countNumber: 60,
          msgId: ''
        })
        clearInterval(this.timer)
      }else  {
        let toastMsg = ''
        if(res.msg.indexOf('系统错误') != -1){
          toastMsg = res.msg.split(':')[1]
        }else{
          toastMsg = res.msg
        }
        Toast({
          // type: 'fail',
          message: toastMsg,
          onClose: () => {
            this.setData({
              isSendSms: true
            })
          },
        });
      }
    }).catch((error) => {});
  }
});