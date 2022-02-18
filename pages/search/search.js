const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    inputValueOne: '',
    searchData: [],
    recommendData: [],
    guessYouData: [],
    isShowInputTag: false,
    isShowRemove: false,
    searchBrand: [],
    everyoneSearch: [],
    searchHistory: [],
    heightTop: '',
    token: wx.getStorageSync('accesstoken') || '',
    yesDataTop:'',
    searchRequest:false,
    searchResult:0,
  },
  cancelBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  cancelFun() {
    const {
      inputValue
    } = this.data
    if (inputValue) {
      this.removeInputTag()
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  getPhoneNum (e) {
    app.getPhoneNumber(e).then(res => {
      if (res) {
        this.setData({
          token: wx.getStorageSync('accesstoken') || ''
        });

      }
    })
  },
  removeInputTag() {
    this.setData({
      isShowInputTag: false,
      isShowRemove: false,
      inputValue: '',
      inputValueOne: '',
      searchBrand: [],
      searchData: [],
      searchDataFun:false,
      searchRequest:false,
      searchResult:0
    })
  },
  goWeChat() {
    if (wx.getStorageSync("accountId")) {
      let data = {
        phone: wx.getStorageSync('userPhone'),
        accountId: wx.getStorageSync('accountId'),
        imId: wx.getStorageSync('nimId'),
        channel: 'xcx',
      }
      util.request(api.javaCustserviceUrl + "custservice/v1.0/huiju/getSaleIm", data, 'POST')
        .then((res) => {
          console.log(res)
          if (res.code == 0) {
            var url = '/pages/customerChat/customerChat?sessionId=p2p-' + res.data.imId
            app.sensors.track('consultationInitiate', {
              click_source: '搜索页',
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
      wx.setStorageSync('accessPath', '14搜索-加盟顾问')
      wx.navigateTo({
        url
      })
      app.sensors.track('registerLoginButtonClick', {
        login_source: '14搜索-加盟顾问'
      })
    }
  },
  removeInput() {
    this.setData({
      inputValue: '',
      inputValueOne: '',
      isShowRemove: false,
      isShowInputTag: false,
      searchBrand: [],
      searchData: [],
      inputFocus: false,
      searchDataFun:false
    })
  },
  getFocus() {
    this.setData({
      inputFocus: true,
      isShowRemove: true,
      isShowInputTag: false,
    })
  },
  inputFocus() {
    const {
      inputValue
    } = this.data
    if (inputValue) {
      this.setData({
        isShowRemove: true,
        isShowInputTag: false,
        noDataModulShow:false
      })
    } else {
      this.setData({
        isShowRemove: false,
        isShowInputTag: false,
        noDataModulShow:false
      })
    }
  },
  inputBlur(e) {
    setTimeout(() => {
      const {
        inputValue,
        searchHistory
      } = this.data
      let newSearchHistory = JSON.parse(JSON.stringify(this.data.searchHistory))
      if (inputValue) {
        newSearchHistory.unshift(inputValue)
        this.searchDataFun(inputValue)
        this.setData({
          isShowInputTag: true,
          isShowRemove: false,
          searchBrand: [],
          searchHistory: [...new Set(newSearchHistory)],
          searchRequest:true
        }, () => {
          let resultarr = [...new Set(this.data.searchHistory)];
          wx.setStorageSync("searchHistory", resultarr);
        })
      } else {
        this.setData({
          isShowInputTag: false,
          searchBrand: [],
          searchRequest:true
        })
      }
    }, 500)
  },
  inputChange(e) {
    if (e.detail) {
      this.setData({
        inputValue: e.detail,
        isShowRemove: true,
        inputValueOne: e.detail.slice(0, 1),
        // searchData: [],
        searchRequest:false
      }, () => {
        this.inputChangeFun(e.detail)
      })
    } else {
      this.setData({
        inputValue: e.detail,
        isShowRemove: false,
        searchBrand: [],
        inputValueOne: '',
        searchRequest:false
      })
    }
  },
  inputChangeFun(txt) {
    let sliceKeyWords = txt
    let brankName = encodeURI(sliceKeyWords)
    util.request(api.javaBrandHost + "brand/v1.0/phone/listBrandName/" + brankName, 'GET')
      .then(res => {
        console.log(res)
        if (res.code == "0") {
          this.setData({
            searchBrand: res.data
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  clickBrand(e) {
    this.setData({
      inputValue: e.currentTarget.dataset.id,
      inputValueOne: e.currentTarget.dataset.id
    }, () => {
      this.searchDataFun(e.currentTarget.dataset.id)
    })
  },
  searchDataFun(value) {
    this.setData({
      searchData: []
    })
    const {
      searchHistory
    } = this.data
    util.request(api.javaBrandHost + "brand/v1.0/phone/listBrandForIndexSearchUpgrade", {
        title: value,
        brandPageNum: 1,
        brandPageSize: 15
      }, 'POST')
      .then(res => {
        if (res.code == "0") {
          if(res.data.searchList){
            this.setData({
              searchData: res.data.searchList,
              noDataModulShow:false,
              searchResult:1
            })
            if(res.data.searchList.length>0){
              this.setData({
                searchResult:1
              })
              
            }else{
              this.setData({
                searchResult:2
              })
            }
          }else{
            this.setData({
              searchData: [],
              noDataModulShow:true,
              searchResult:2
            })
          }
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  // 大家都在搜
  everyoneSearch() {
    util.request(api.javaBrandHost + "brand/v1.0/phone/listHotBrandByNum/5", 'Get')
      .then(res => {
        if (res.code == "0") {
          this.setData({
            everyoneSearch: res.data
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  allSearchFun(e) {
    app.sensors.track('projectDetailBrowse', {
      projetc_detail_source: '搜索',
      project_classification: e.currentTarget.dataset.item.category,
      brand_name: e.currentTarget.dataset.item.brandName,
      brand_id: e.currentTarget.dataset.item.brandId,
    })

    wx.navigateTo({
      url: "/packageA/pages/brandDetail/brandDetail?brandId=" + e.currentTarget.dataset.id,
    });
  },
  // 猜你喜欢
  guessYouFun(title) {
    util.request(api.javaBrandHost + "brand/v1.0/phone/guessLike", {
        title: title || '',
        brandPageNum: 1,
        brandPageSize: 6,
      }, 'POST')
      .then(res => {
        if (res.code == "0") {
          this.setData({
            guessYouData: res.data
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  /*点击猜你喜欢 */
  guessYouClick(e) {
    app.sensors.track('projectDetailBrowse', {
      projetc_detail_source: '搜索',
      project_classification: e.currentTarget.dataset.item.category,
      brand_name: e.currentTarget.dataset.item.brandName,
      brand_id: e.currentTarget.dataset.item.brandId,
    })
    wx.navigateTo({
      url: "/packageA/pages/brandDetail/brandDetail?brandId=" + e.currentTarget.dataset.id,
    });
  },
  searchHistoryFun(e) {
    console.log(e.currentTarget.dataset.name);
    this.setData({
      inputValue: e.currentTarget.dataset.name,
      isShowInputTag: true,
      searchRequest:true
    }, () => {
      this.searchDataFun(this.data.inputValue)
    })
  },
  clearHistory() {
    this.setData({
      searchHistory: []
    })
    wx.setStorageSync("searchHistory", [])
  },
  recommendFunction() {
    util.request(api.javaBrandHost + "brand/v1.0/phone/listBrandByTag", {
        cityCode: "",
        amountSort: '',
        attentionSort: '',
        joinInvestMax: '',
        joinInvestMin: '',
        list: [{
          classifyCode: "BRAND_CATEGORY",
          tagList: []
        }],
        pageNum: 1,
        pageSize: 10,
        regionTagId: "",
        searchType: "3",
      }, 'POST')
      .then(res => {
        if (res.code == "0") {
          let newDataList = res.data.list
          this.setData({
            recommendData: newDataList,
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.everyoneSearch()
    this.recommendFunction()
    if (wx.getStorageSync("searchHistory")) {
      this.guessYouFun(wx.getStorageSync("searchHistory")[0])
      this.setData({
        searchHistory: wx.getStorageSync("searchHistory")
      })
    } else {
      this.guessYouFun()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this;
    wx.createSelectorQuery().select('.searchTitle').boundingClientRect(function (rect) {
      _this.setData({
        yesDataTop:rect.height
      })
    }).exec()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const {
      top,
      height
    } = app.globalData
    this.setData({
      heightTop: (top + height) 
    })
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