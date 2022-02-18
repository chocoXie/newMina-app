// components/publicDataList/publicDataList.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleName: {
      type: String
    },
  },

  ready: function () {
    wx.showLoading()
    const { titleName = '' } = this.properties;
    this.guessYouDataInit()
    this.setData({
      titleName: titleName
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    guessYouList: [],
    titleName: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    guessYouDataInit() {
      const { titleName } = this.data
      let url
      let params
      if (titleName == '品牌'||titleName == '关注') {
        url = api.javaBrandHost + 'brand/v1.0/phone/guessYouLike'
        params = {
          brandPageNum: 1,
          brandPageSize: 10,
        }
      } else if (titleName == '看点' || titleName == '收藏') {
        url = api.javaInformation + 'v1.0/information/app/listQuanZiNew'
        params = {
          offset: 0,
          pageNum: 1,
          pageSize: 20,
        }
      }
      util.request(url, params, 'POST')
        .then(res => {
          if (res.code == "0") {
            wx.hideLoading()
            let newData=res.data
            let newGuessYouList=[]
            if(titleName=='看点' || titleName == '收藏'){
              newData.map((item)=>{
                if(item.contentType=='01'){
                  newGuessYouList.push({'informationInfo':item})
                }
              })
              newGuessYouList=newGuessYouList.slice(0,5)
            }else{
              newGuessYouList=newData
            }
            this.setData({
              guessYouList: newGuessYouList
            })
          }
        })
        .catch(err => {
          wx.hideLoading()
          console.log(err.status, err.message);
        });
    },
    gofenleiTab() {
      const { titleName } = this.data
      let url
      if (titleName == '品牌'||titleName == '关注') {
        url = '/pages/classificationList/classificationList'
      } else if (titleName == '看点' || titleName == '收藏') {
        url = '/pages/lookInfoList/lookInfoList'
      }

    

      wx.reLaunch({
        url: url
      });
    },

  }
})
