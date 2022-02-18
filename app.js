var util = require('./utils/util.js');
var user = require('./utils/user.js');
var sensors = require('./utils/sensorsdata.min.js');
const api = require('./config/api.js');
sensors.setPara({
  name: 'sensors',
  server_url: api.sensorsUrl,
  // 全埋点控制开关
  autoTrack: {
    appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
    appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
    appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
    pageShow: true, // 默认为 true，false 则关闭 $MPViewScreen 事件采集
    pageShare: true, // 默认为 true，false 则关闭 $MPShare 事件采集
    mpClick: true, // 默认为 false，true 则开启 $MPClick 事件采集 
    mpFavorite: true // 默认为 true，false 则关闭 $MPAddFavorites 事件采集
  },
  // 自定义渠道追踪参数，如source_channel: ["custom_param"]
  source_channel: [],
  // 是否允许控制台打印查看埋点数据(建议开启查看)
  show_log: true,
  // 是否允许修改 onShareAppMessage 里 return 的 path，用来增加(登录 ID，分享层级，当前的 path)，在 app onShow 中自动获取这些参数来查看具体分享来源、层级等
  allow_amend_share_path: true
});
sensors.registerApp({
  platform_type: '小程序'
})
// sensors.setOpenid('23123123123')

sensors.init()

App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager();
    wx.getUpdateManager().onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  onShow: function (options) {
    // user.checkLogin().then(res => {
    //   this.globalData.hasLogin = true;
    // }).catch(() => {
    //   this.globalData.hasLogin = false;
    // });
    this.globalData.top = wx.getMenuButtonBoundingClientRect().top
    this.globalData.height = wx.getMenuButtonBoundingClientRect().height

    // wx.getSystemInfo({
    //   success: (res) => {
    //     this.globalData.statusBarHeight = res.statusBarHeight;

    //   }
    // })
  },
  globalData: {
    hasLogin: false,
    top: '',
    height: '',
  },
  getPhoneNumber(e) { //直接调用微信授权
    // 通过button定义type，，统一授权埋点
    const trankName = e.target.dataset.type || '';
    const _this = this;
    if (trankName) {
      wx.setStorageSync('accessPath', trankName)
      sensors.track('registerLoginButtonClick', {
        login_source: trankName
      })
    };
    //直接调用wx.login 获取code
    return new Promise((resolve, reject) => {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        let _iv = e.detail.iv;
        let _encryptedData = e.detail.encryptedData
        user.checkLogin().catch(() => {
          if (!wx.getStorageSync('code')) {
            wx.login({
              success: function (res) {
                if (res) {
                  user.loginByWeixin('微信授权登录-页面', _iv, _encryptedData, res.code).then(res => {
                    if (wx.getStorageSync('accessOption')) {
                      util.getCustomer(wx.getStorageSync('accessOption'))
                    }
                    resolve(true);
                    wx.showToast({
                      title: "微信授权成功",
                      icon: "none",
                      duration: 2000,
                    });
                  }).catch((err) => {
                    reject(false)
                    util.showErrorToast('微信登录失败');
                  });
                }
              }
            })
          }else{
            user.loginByWeixin('微信授权登录-页面', _iv, _encryptedData).then(res => {
              if (wx.getStorageSync('accessOption')) {
                util.getCustomer(wx.getStorageSync('accessOption'))
              }
              resolve(true);
              wx.showToast({
                title: "微信授权成功",
                icon: "none",
                duration: 2000,
              });
            }).catch((err) => {
              reject(false)
              util.showErrorToast('微信登录失败');
            });
          }
        })
      } else {
        sensors.track('loginClose', {})
        reject(false)
        wx.showToast({
          title: "用户取消授权",
          icon: "none",
          duration: 2000,
        });
      }
    })
  },
  onHide() {
    wx.removeStorageSync('closeGyloginHtFlag')
    wx.removeStorageSync('isfirstload')
    wx.removeStorageSync('isCloseRefundProup')
  }
})