const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data:{
    QAProupMsgId:'',
    QAInfoList:[]
  },
  onLoad(options){
    this.listMsgInit(options.brandID)
    this.setData({
      QAProupMsgId:options.QAProupMsgId,
    })
  },
  listMsgInit(_brandId){
    let data = {
      type:1,
      businessId:_brandId
    }
    util.request(api.javaBrandHost + "brand/rotation/list", data, 'GET')
    .then(res =>{
      this.setData({
        QAInfoList:res.data
      })
    }).catch((error) => {});
  },
  checkThisQA(e){
    console.log(e.currentTarget)
    let pages = getCurrentPages();
    let prevPage = pages[pages.length-2];
    prevPage.setData({//直接给上移页面赋值
      QAFormProupMsg: e.currentTarget.dataset.item,
    });
    wx.navigateBack({
      delta:1
    })
  }
})