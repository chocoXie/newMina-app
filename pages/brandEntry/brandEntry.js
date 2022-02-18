const util = require('../../utils/util.js');
const api = require('../../config/api.js');
// const Toast = require('../../lib/vant-weapp/toast/toast.js');
import Toast from '../../lib/vant-weapp/toast/toast';
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  timer: null,
  data: {
    corporateName: '',
    brandName: '',
    yourName: '',
    iphone: '',
    sms: '',
    errSms: '',
    isSendSms: true,
    isShowDialog: false,
    weChatDialog: false,
    countNumber: 60,
    msgId: '',
    heightTop: ''
  },
  showWeChatDialog() {
    this.setData({
      weChatDialog: true
    })
  },
  backClick() {
    wx.navigateBack({
      delta: 1
    })
  },
  sendSmsFun() {
    const { iphone } = this.data
    if (iphone.length == 11) {
      this.setData({
        isSendSms: false,
      }, () => {
        this.getVerificationCode()
      })
    }
  },

  getVerificationCode() {
    const { iphone } = this.data
    util.request(api.javaUserHost + "v1.0/app/sys/sendCode", {
      mobile: iphone
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          console.log(res);
          this.setData({
            countNumber: 60,
            msgId: res.data
          }, () => {
            this.countNumberFun()
          })
        } else {
          Toast({
            type: 'fail',
            message: res.msg,
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

  countNumberFun(type) {
    this.timer = setInterval(() => {
      const { countNumber } = this.data
      if (countNumber == 1) {
        this.setData({
          isSendSms: true,
          isShowDialog: false,
        })
        clearInterval(this.timer)
        if (type) {
          wx.navigateBack({
            delta: 1
          })
        }
      } else {
        this.setData({
          countNumber: countNumber - 1
        })
      }
    }, 1000)
  },
  myKnowFun() {
    this.setData({
      isShowDialog: false,
      weChatDialog: false
    })
    
  },
  copyWeChat() {
    wx.setClipboardData({ data: '13522114009' })
  },
  btnIphone(){
    wx.makePhoneCall({
      phoneNumber: '13522114009',
    })
  },
  submitFun() {
    const { corporateName, brandName, yourName, iphone, sms } = this.data
    if (!corporateName) {
      Toast('请输入公司名称');
      return
    } else if (!brandName) {
      Toast('请输入品牌名称');
      return
    } else if (!yourName) {
      Toast('请输入您的姓名');
      return
    } else if (!iphone) {
      Toast('请输入手机号码');
      return
    } else if (!sms) {
      Toast('请输入验证码');
      return
    }
    this.submitFunAjax()
  },

  submitFunAjax() {
    const { corporateName, brandName, msgId, yourName, iphone, sms } = this.data
    util.request(api.javaBrandHost + "brand/v1.0/phone/createApply", {
      "applyPerson": yourName,
      "brandName": brandName,
      "code": sms,
      "msgId": msgId,
      "contactPhone": iphone,
      "brandCompany": corporateName
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          console.log(res);
          this.setData({
            isShowDialog: true,
            countNumber: 6
          }, () => {
            this.countNumberFun(true)
          })
        } else {
          Toast(res.msg)
          // wx.showToast({
          //   title: res.msg,
          //   icon: "error",
          // });
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },

  onChange(e) {
    let type = e.target.id
    switch (type) {
      case 'corporateName':
        this.setData({
          corporateName: e.detail
        })
        break;
      case 'brandName':
        this.setData({
          brandName: e.detail
        })
        break;
      case 'yourName':
        this.setData({
          yourName: e.detail
        })
        break;
      case 'iphone':
        this.setData({
          iphone: e.detail
        })
        break;
      case 'sms':
        this.setData({
          sms: e.detail
        })
      default:
        return
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {top,height} = app.globalData
    this.setData({
      heightTop: (height+top)-25
    })
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
    return {
      title: '加盟好餐饮，就找餐盟严选！',
    }
  }
})