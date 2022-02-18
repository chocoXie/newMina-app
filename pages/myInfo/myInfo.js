var app = getApp();
const util = require('../../utils/util.js');
const user = require('../../utils/user.js');
const api = require('../../config/api.js');
Page({
  data: {
    heightTop: '',
    token: wx.getStorageSync('accesstoken') || '',
    info: {
      focusNum: '',
      footprintNum: '',
      collNum: '',
    },
    showHeaderType: '-1',
    brandList: []
  },
  onLoad: function (options) {
    user.login();
    if (!wx.getStorageSync("accesstoken")) {
      setTimeout(() => {
        wx.setStorageSync('accessPath', '39我的-首次进入弹出')
        app.sensors.track('registerLoginButtonClick', {
          login_source: '39我的-首次进入弹出'
        })
        this.goLogin()
      }, 0);
    }

  },

  onShow: function () {
    const {
      top,
      height
    } = app.globalData

    this.setData({
      heightTop: (top + height),
      token: wx.getStorageSync('accesstoken') || '',

    })
    let newInfo = JSON.parse(JSON.stringify(this.data.info))
    if (wx.getStorageSync("accesstoken")) {
      this.getMyInfo()
    } else {
      newInfo.focusNum = 0
      newInfo.footprintNum = 0
      newInfo.collNum = 0
      this.setData({
        showHeaderType: '2',
        info: newInfo

      })
    }
    this.getBrandList()
  },
  getMyInfo() {
    let params = {
      deviceId: "wechat_Mini_Program",
      deviceType: 0,
      accessToken: wx.getStorageSync("accesstoken"),
      userId: wx.getStorageSync("userId"),
    }
    util.request(api.javaUserHost + "v1.0/app/sys/userGet", params, 'POST')
      .then((res) => {
        console.log('rs', res)
        if (res.code == 0) {
          this.setData({
            showHeaderType: '1',
            info: res.data,

          })

        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  getPhoneNum(e) {
    app.getPhoneNumber(e).then(res => {
      if (res) {
        this.setData({
          token: wx.getStorageSync('accesstoken') || ''
        });
        this.getMyInfo();

      }
    })
  },
  //去登录
  goLogin() {
    var url = "/pages/login/login";
    wx.navigateTo({
      url
    });
  },
  //去分类
  goClassificationList() {
    var url = "/pages/classificationList/classificationList";
    wx.switchTab({
      url
    });
  },
  //去入住
  goBrandEntry() {
    var url = "/pages/brandEntry/brandEntry";
    wx.navigateTo({
      url
    });
  },
  goMyInformation() {
    var url = "/pages/myInformation/myInformation";
    wx.navigateTo({
      url
    });
  },
  goCallPhone(e) {
    wx.makePhoneCall({
      phoneNumber: '4000330560'
    }).catch((e)=>{
      console.log(e)
    })
  },
  goPage(e) {

    if (!wx.getStorageSync("accesstoken")) {
      // this.goLogin()
      return
    }
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url
    });

  },
  openWeChat() {
    if (wx.getStorageSync("accesstoken")) {
      app.sensors.track('consultationInitiate', {
        click_source: '我的-加盟手册',
        brand_name: '',
        brand_id: ''
      })
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
            wx.navigateTo({
              url: url
            });
          }
        })
        .catch((error) => { });
    }
    // else {
    //   let url = "/pages/login/login"
    //   wx.navigateTo({ url })
    // }
  },
  getBrandList() {
    let params = {
      id: wx.getStorageSync("userId"),
    }
    util.request(api.javaBrandHost + "brand/v1.0/phone/guessYouLike", params, 'POST')
      .then((res) => {
        if (res.code == 0) {
          this.setData({
            brandList: res.data

          })

        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  goH5ranking(){
      // app.sensors.track('consultationInitiate', {
      //   click_source: '我的-榜单',
      //   brand_name: '',
      //   brand_id: ''
      // })
      let url = "/pages/webViewList/webView/webView?url=" + api.webViewUrl+"rankingList?type=xcx";
      wx.navigateTo({
        url
      });
      this.getActivityBrowse('个人中心-banner','榜单')
  },
  /*埋点H5*/
  getActivityBrowse(sourceMsg, nameMsg) {
    app.sensors.track('activityBrowse', {
      activity_source: sourceMsg,
      activity_name: nameMsg
    })
  },
})