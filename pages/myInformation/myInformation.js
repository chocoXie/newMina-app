// pages/myInformation/myInformation.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
var moment = require('../../lib/moment/moment.min.js')
import Toast from '../../lib/vant-weapp/toast/toast';
const citys = {};
var app = getApp();
Page({
  data: {
    heightTop: '',
    height: '',
    files: [],
    picUrls: [],
    valueName: '',
    valueEmail: '',
    valueWeChat: '',
    popupSelectShow: false,
    lyoutPop:false,
    valueIphone: '',
    gender: '',
    genderColumns: ['男', '女'],
    dateBirth: '',
    location: '',
    locationColumns: [],
    occupation: '',
    popSelectId: '',
    allDataCitys: [],
    occupationData: [],
    currentDate: new Date().getTime(),
    minDate: new Date(0).getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  // 选择图片
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res, '图片上传');
        that.upload(res.tempFilePaths[0]);
      }
    })
  },
  // 上传图片
  upload: function (imgUrl) {
    console.log(imgUrl, '调上传接口');
    var that = this;
    let newUrl = 'sys/' + moment(new Date()).format("YYYY-MM-DD") + '/' + new Date().getTime() + wx.getStorageSync('userId') + '.jpeg'
    util.request('https://ossfile-pre.kuaidaoapp.com/v1.0/OSS/policyAndCallBack?serviceType=sys', 'get')
      .then(res => {
        let newData = res
        newData.host = newData.host.replace("http:", "https:")
        wx.uploadFile({
          url: res.host,
          filePath: imgUrl,
          name: 'file',
          formData: {
            key: newData.key,
            policy: newData.policy,
            signature: newData.signature,
            success_action_status: 200,
            OSSAccessKeyId: newData.accessid,
            key: newUrl
          },
          success: function (res) {
            console.log(res, newData.host + '/' + newUrl, 44444444);
            that.setData({
              files: [newData.host + '/' + newUrl]
            });
          },
          fail: function (e) {
          },
        })
      })
      .catch(err => {
        console.log(err.status, err.message);
      });

  },
  onChangeCity(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, citys[value[0]]);
  },

  // 获取城市列表数据
  cityInit() {
    util.request(api.javaBrandHost + "brand/v1.0/phone/cityList", 'get')
      .then(res => {
        if (res.code == "0") {
          res.data.map((item) => {
            citys[item.name] = item.cityList
          })
        }
        this.setData({
          allDataCitys: res.data || []
        }, () => {
          this.dataProcessing()
          this.initOccupationData()
        })
      })
      .catch(err => {
        console.log(err.status, err.message);
        this.initOccupationData()
        wx.hideLoading()
      });
  },

  dataProcessing() {
    const { allDataCitys, allTagList } = this.data
    let tagName = '北京-东城区'.split('-')
    let defaultIndex0 = 0
    let defaultIndex1 = 0

    this.setData({
      locationColumns: [{
        values: Object.keys(citys),
        className: 'column1',
        defaultIndex: defaultIndex0,
      },
      {
        values: citys[tagName[0]],
        className: 'column2',
        defaultIndex: defaultIndex1,
      }],
    })
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  onConfirm(e) {
    const { popSelectId } = this.data
    // 六月 29日 2021, 2:16:44 下午
    console.log(e);
    switch (popSelectId) {
      case 'gender':
        this.setData({
          gender: e.detail.value
        })
        break;
      case 'dateBirth':
        this.setData({
          dateBirth: moment(e.detail).format("YYYY-MM-DD")
        })
        break;
      case 'location':
        this.setData({
          location: e.detail.value[1].name
        })
        break;
      case 'occupation':
        this.setData({
          occupation: e.detail.value.name
        })
        break;
      default:
        break;
    }
    this.setData({
      popupSelectShow: false
    })
  },
  onCancel() {
    this.setData({
      popupSelectShow: false
    })
  },
  cancelPage(){
    console.log('点错了');
    this.setData({
      lyoutPop: false
    })
  },
  lyoutClick() {
    this.setData({
      lyoutPop: true
    })
    console.log('退出登录');
  },
  submitLyout(){
    this.cancelBack()
    wx.removeStorageSync('accesstoken')
    wx.removeStorageSync('code')
    wx.removeStorageSync('userId')
    wx.removeStorageSync('accountId')
    wx.removeStorageSync('userPhone')
  },
  openSelect(e) {
    // this.setData({
    //   [e.currentTarget.dataset.type]: event.detail
    // })
    this.setData({
      popSelectId: e.currentTarget.dataset.type,
      popupSelectShow: true
    })

  },
  submitClick() {
    const { allDataCitys, occupationData, valueName, valueEmail, valueIphone, valueWeChat, files, gender, dateBirth, location, occupation } = this.data
    console.log(valueName, valueEmail, valueIphone, valueWeChat, files, gender, dateBirth, location, occupation);
    let isTrue = true
    let newAddress = location
    let newVocation = occupation
    if (valueEmail) {
      isTrue = this.checkEmail(valueEmail)
    }
    if (!isTrue) {
      return
    }
    allDataCitys.map((item, index) => {
      item.cityList.map((itemChild) => {
        if (itemChild.name == newAddress) {
          newAddress = itemChild.gbCode
        }
      })
    })
    occupationData.map((item, index) => {
      if (item.name == newVocation) {
        newVocation = item.value
      }
    })
    util.request(api.javaUserHost + "v1.0/app/sys/userUpdate", {
      userId: wx.getStorageSync("userId"),
      name: valueName,
      phoneNumber: valueIphone,
      gender: gender ? (gender == '男' ? '0' : (gender == '女'?'1':'2')) : '2',
      userAvatar: files[0],
      email: valueEmail,
      birthDay: dateBirth?moment(dateBirth).format("YYYYMMDD"):'',
      address: newAddress,
      qq: '',
      weixin: valueWeChat,
      nation: '',
      vocation: newVocation,
      edu: '',
      cardType: '',
      cardNumber: '',
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          console.log(res.data, '提交个人信息');
          wx.showToast({
            title: "保存成功",
            duration: 2000,
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          },2000)
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });

  },
  onChange(event) {
    // event.detail 为当前输入的值
    if(event.currentTarget.dataset.type=='valueEmail'){
      if(event.detail.length>=30){
        Toast('不能再输入了哦')
      }
    }
    if(event.currentTarget.dataset.type=='valueWeChat'){
      if(event.detail.length>=20){
        Toast('不能再输入了哦')
      }
    }
    if(event.currentTarget.dataset.type=='valueName'){
      if(event.detail.length>=8){
        Toast('请输入1-8位的汉字或英文')
      }
    }
    this.setData({
      [event.currentTarget.dataset.type]: event.detail
    })
  },
  // 邮箱验证
  checkEmail(email) {
    const { valueWeChat } = this.data
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(email)) {
      return true
    } else {
      Toast('请填写正确的邮箱号')
      this.setData({
        valueEmail: ''
      })
      return false
    }

  },
  initData() {
    const { allDataCitys, occupationData } = this.data
    util.request(api.javaUserHost + "v1.0/app/sys/userGet", {
      deviceId: "wechat_Mini_Program",
      deviceType: 3,
      accessToken: wx.getStorageSync("accesstoken"),
      userId: wx.getStorageSync("userId"),
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          console.log(res.data, '获取个人信息');
          let newAddress = res.data.address
          let newVocation = res.data.vocation
          if (newAddress === null) {
            newAddress = ''
          } else {
            allDataCitys.map((item, index) => {
              item.cityList.map((itemChild) => {
                if (itemChild.gbCode == newAddress) {
                  newAddress = itemChild.name
                }
              })
            })
          }
          if (newVocation === null) {
            newVocation = ''
          } else {
            occupationData.map((item, index) => {
              if (item.value == newVocation) {
                newVocation = item.name
              }
            })
          }
          this.setData({
            valueName: res.data.name === null ? '' : res.data.name,
            valueIphone: res.data.phoneNumber === null ? '' : res.data.phoneNumber,
            valueEmail: res.data.email === null ? '' : res.data.email,
            valueWeChat: res.data.weixin === null ? '' : res.data.weixin,
            gender: res.data.gender === null ? '' : (res.data.gender == 0 ? '男' :(res.data.gender == 1?'女':'')),
            dateBirth: res.data.birthDay === null || res.data.birthDay === ''? '' : moment(res.data.birthDay).format("YYYY-MM-DD"),
            location: newAddress,
            occupation: newVocation,
            files: res.data.userAvatar === null ? [] : [res.data.userAvatar]
          },()=>{
            wx.hideLoading()
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
        wx.hideLoading()

      });
  },
  initOccupationData() {
    util.request(api.javaUserHost + "v1.0/app/sys/configInformation", {
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          this.setData({
            occupationData: res.data.vocationList
          }, () => {
            this.initData()
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
        this.initData()
        wx.hideLoading()
      });
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.cityInit()
  },
  cancelBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  onReady: function () {
  },
  onShow: function () {
    const { top, height } = app.globalData
    this.setData({
      heightTop: (top + height),
      height: height
    })
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  accountLogin: function () {

  }
})