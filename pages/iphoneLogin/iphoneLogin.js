const util = require('../../utils/util.js');
const hexMD5 = require('../../utils/md5.js');
const api = require('../../config/api.js');
import Toast from '../../lib/vant-weapp/toast/toast';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  timer: null,

  data: {
    iphone: '',
    sms: '',
    isSendSms: true,
    countNumber: 60,
    msgId: ''
  },
  goPage(e){
    var url = '/pages/webViewList/userAgreement/userAgreement?type=' + e.currentTarget.dataset.id
    wx.navigateTo({ url });
  },
  submitLogin() {
    const { iphone, sms, msgId } = this.data
    let getPresetProperties=app.sensors.getPresetProperties()
    util.request(api.javaUserHost + "v2.0/app/sys/fastMobileLogin", {
      mobile: iphone,
      code: sms,
      msgId: msgId,
      userEntrance:parseInt(wx.getStorageSync('accessPath'))||'',
      method:'验证码登录',
      app_version:getPresetProperties.$lib_version||'',
      os:getPresetProperties.$os||'',
      os_version:getPresetProperties.$os_version||'',
      wifi:getPresetProperties.$network_type=='WIFI'?true:false,
      is_first_day:getPresetProperties.$is_first_day||'',
      model:getPresetProperties.$model||'',
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
           //存储用户信息
           wx.setStorageSync("accountId", res.data.accountId);
           wx.setStorageSync("accesstoken", res.data.accessToken);
           wx.setStorageSync("userId", res.data.userId);
           wx.setStorageSync("nimId", res.data.nimId);
           wx.setStorageSync("nimToken", res.data.nimToken);
           wx.setStorageSync("userPhone", iphone);
           if(wx.getStorageSync('accessOption')) {
            Toast({
              type: 'success',
              message: '登录成功',
            })
            util.getCustomer(wx.getStorageSync('accessOption'))
           } else {
            Toast({
              type: 'success',
              message: '登录成功',
              onClose: () => {
                wx.navigateBack({
                  delta: 2
                })
              },
            });
           }
         
  

        } else {
          
          Toast({
            message: res.msg,
            onClose: () => {
              this.setData({
                isSendSms: true,
              })
            },
          });
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  onChange(e) {
    this.setData({
      iphone: e.detail
    })
  },
  onChangeSms(e) {
    this.setData({
      sms: e.detail
    })
  },
  smsSend() {
    const { iphone } = this.data
    if (iphone.length == 11) {
      this.getVerificationCode()
      // this.setData({
      //   isSendSms: false,
      // }, () => {
      //   this.getVerificationCode()
      // })
    }else {
      Toast('请输入正确的手机号')
    }
  },
  getVerificationCode() {
    const { iphone } = this.data;
    let md5String = hexMD5.md5(iphone + '3#7@2&8*10' + iphone.slice(6));
    util.request(api.javaUserHost + "v1.0/app/sys/sendCode", {
      mobile: iphone,
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
          // Toast({
          //   type: 'fail',
          //   message: res.msg,
          //   onClose: () => {
          //     this.setData({
          //       isSendSms: true
          //     })
          //   },
          // });
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },

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

  }
})