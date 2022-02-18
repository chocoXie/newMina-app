var app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const { trackSignup } = require('../../utils/sensorsdata.min.js');
Page({
  data: {
    scrollTop:'',
    dataList:'',
    pageNum:'',
    noMore:false,
    typeIndex: '',
    show: false,
    total: '',
    loading: false,
    checkedBrand:'',
    brandIsCheckId:'',
    backH5UrlInit:'',
    backH5Url01:'',
    backH5Url02:''
  },
  onLoad: function (options) {

    this.initDataList()
    let {brandIsCheckId,backH5UrlInit,backH5Url01,backH5Url02} = this.data;
    let backH5Url = wx.getStorageSync('Imurl');
    let _jcurl = backH5Url.split('?')[1];
        if(_jcurl.split('&/#chat/')[0].indexOf('&selectBrandMsg') != -1){
          backH5Url01 = (_jcurl.split('&/#chat/')[0]).split('&selectBrandMsg')[0]
        }else{
          backH5Url01 = _jcurl.split('&/#chat/')[0]
        }
        backH5Url02 = _jcurl.split('&/#chat/')[1]
    this.setData({
      brandIsCheckId:options.brandId,
      backH5UrlInit : backH5Url.split('?')[0],
      backH5Url01 : backH5Url01,
      backH5Url02 : backH5Url02
    })
  },
  initDataList(type) {
    const {
      dataList,
      pageNum
    } = this.data
    let joinInvestMax
    let joinInvestMin
    let attentionSort
    let amountSort
    this.setData({
      noMore: false
    })
    util.request(api.javaBrandHost + "brand/v1.0/phone/listBrandByTag", {
        cityCode: "",
        amountSort: amountSort,
        attentionSort: attentionSort,
        joinInvestMax: joinInvestMax,
        joinInvestMin: joinInvestMin,
        list: [{
          classifyCode: "BRAND_CATEGORY",
          tagList: []
        }],
        pageNum: pageNum,
        pageSize: 10,
        regionTagId: "",
        searchType: "3",
      }, 'POST')
      .then(res => {
        if (res.code == "0") {
          let newDataList = res.data.list
          let typeIndex
          if (type) {
            newDataList = dataList.concat(res.data.list)
          }
          if (newDataList.length > 0) {
            typeIndex = 1
          } else {
            typeIndex = 2
          }
          wx.hideLoading()
          this.setData({
            dataList: newDataList,
            typeIndex: typeIndex,
            show: false,
            pageNum: res.data.pageNum,
            total: res.data.total,
            loading: false,
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  selectthisBrand(e){
    let _branditem = e.currentTarget.dataset.branditem;
    let {backH5UrlInit,backH5Url01,backH5Url02} = this.data;

    let brandObj = {}
    brandObj.selectTitleName = _branditem.brandName;
    brandObj.selectSendBrandID = _branditem.brandId;
    brandObj.brandCategoryName = _branditem.category
    backH5Url01 += '&selectBrandMsg='+JSON.stringify(brandObj);
    let _url = backH5UrlInit +'?'+backH5Url01+'&/#chat/'+backH5Url02
    let url = '/pages/customerChat/customerChat?backurl=' +  encodeURIComponent(_url);
    wx.reLaunch({
      url
    });
  },
  onPageScroll: function (e) {
    const {
      scrollTop
    } = this.data
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const {
      dataList
    } = this.data
    if (dataList.length <= 5) {
      return
    }
    this.setData({
      loading: true,
      noMore: false
    })
    const {
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
      this.setData({
        pageNum: number
      }, () => {
        this.initDataList(true)
      })
    }
  },
})