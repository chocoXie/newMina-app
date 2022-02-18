const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
import Toast from '../../../lib/vant-weapp/toast/toast';

const citys = {
  // '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  // '福建': [{name:'福州',code:11111}, {name:'厦门'}],
};

Page({


  /**
   * 页面的初始数据
   */
  data: {
    contentList: [
      {
        name: '我的预估投资：',
        value: '',
        id: 0,
        placeholder: '请选择预估投资',
        gbCode: ''
      },
      {
        name: '我想加盟的行业：',
        value: '',
        id: 1,
        placeholder: '请选择行业',
        gbCode: '',
        index:''
      },
      {
        name: '我想开店的城市：',
        value: '',
        id: 2,
        placeholder: '请选择城市',
        gbCode: ''
      }
    ],
    codeList: [
      "BRAND_CATEGORY",
      "BRAND_INVESTMENT",
      "BRAND_AREA",
      "REGION_TAG"
    ], //获取筛选项的请求参数
    dataList: [],
    isClickSubmit: true,
    areaList1: [],
    areaList2: [],
    areaList3: [],
    popTitle: '12312312',
    isShowPop1: false,
    isShowPop2: false,
    isShowPop3: false,
    gbCode: '',
    isReset:false,
    pageNum:1,
    total:'',
    allDataCitys:[],
    allTagList:[]
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    })
  },
  contentClick(e) {
    const { contentList } = this.data
    let newId = e.currentTarget.dataset.id
    let areaList1
    let gbCode = contentList[0].gbCode
    if (newId == 0) {
      console.log(gbCode, 111111111111);
      areaList1 = [{ name: '10-20万', gbCode: 1 ,}, { name: '20-30万', gbCode: 2 }, { name: '30-50万', gbCode: 3 }, { name: '50万以上', gbCode: 4 }]
      this.setData({
        isShowPop1: true,
        popTitle: '请选择预估投资',
        areaList1: areaList1,
      })
    } else if (newId == 1) {
       this.setData({
        isShowPop2: true,
        popTitle: '请选择行业',
      })
    } else if (newId == 2) {
       this.setData({
        isShowPop3: true,
        popTitle: '请选择城市',
      })
    }
  },
  confirmClick(event) {
    const { popTitle } = this.data
    const { contentList } = this.data
    if (popTitle == '请选择预估投资') {
      console.log(event.detail);
      contentList[0].value = event.detail.value.name
      contentList[0].gbCode = event.detail.value.gbCode
      this.setData({
        contentList: contentList,
        isShowPop1: false,
        isShowPop2: false,
        isShowPop3: false,
      })
    } else if (popTitle == '请选择行业') {
      contentList[1].value = event.detail.value.name
      contentList[1].gbCode = event.detail.value.gbCode
      contentList[1].index = event.detail.index
      this.setData({
        contentList: contentList,
        isShowPop1: false,
        isShowPop2: false,
        isShowPop3: false,
      })
    } else if (popTitle == '请选择城市') {
      console.log(event.detail.value[0], event.detail.value[1].name, event.detail.value[1].gbCode);
      contentList[2].value = event.detail.value[0] + '-' + event.detail.value[1].name
      contentList[2].gbCode = event.detail.value[1].gbCode
      this.setData({
        contentList: contentList,
        isShowPop1: false,
        isShowPop2: false,
        isShowPop3: false,

      })
    }
    this.setData({
      isReset:true
    })
  },
  cancelClick() {
    this.setData({
      isShowPop1: false,
      isShowPop2: false,
      isShowPop3: false,
    })
  },
  nowSubmit() {
    let that = this
    const {contentList,isReset,pageNum,total} = this.data
    if(!contentList[0].value){
      Toast('请选择您的投资预估');
      return
    }
    if(!contentList[1].value){
      Toast('请选择您要加盟的行业');
      return
    }
    if(!contentList[2].value){
      Toast('请选择您要开店的城市');
      return
    }
    let joinInvestMin
    let joinInvestMax
    let newPageNum
    if(contentList[0].gbCode==1){
      joinInvestMin=10
      joinInvestMax=20
    }else if(contentList[0].gbCode==2){
      joinInvestMin=20
      joinInvestMax=50
    }else if(contentList[0].gbCode==3){
      joinInvestMin=30
      joinInvestMax=50
    }else if(contentList[0].gbCode==4){
      joinInvestMin=50
      joinInvestMax=0
    }
    if(isReset){
      newPageNum=1
    }else{
      if(pageNum<total/3){
        newPageNum=pageNum+1
      }else{
        Toast('已展示全部，可更换条件重新匹配～');
        return
      }
    }
    util.request(api.javaBrandHost + "brand/v1.0/phone/brandMatch", {
      "joinInvestMin": joinInvestMin,
      "joinInvestMax": joinInvestMax,
      "brandCategory": contentList[1].gbCode,
      "cityGbCode": contentList[2].gbCode,
      "pageNum": newPageNum
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          console.log(res.data.list);
          that.setData({
            dataList: res.data.list,
            isReset:false,
            pageNum:newPageNum,
            total:res.data.total
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    const { popTitle } = this.data
    if (popTitle == '请选择预估投资') {
    } else if (popTitle == '请选择行业') {
    } else if (popTitle == '请选择城市') {
      picker.setColumnValues(1, citys[value[0]]);
    }

  },
  // 餐饮分类列表
  initCatering() {
    const { codeList, contentList } = this.data
    let newTopTagList = []
    util.request(api.baseUrl + "mobile/brand/listTags", {
      codeList: codeList
    }, 'POST')
      .then(res => {
        if (res.code == "0") {
          newTopTagList = res.data[0].tagList[0].childList
          newTopTagList.map((item) => {
            item.gbCode = item.id
          })
          this.setData({
            areaList2: newTopTagList,
            allTagList:res.data,
            popTitle: '请选择行业',
          },()=>{
            this.getPersonas()
          })
        }
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  cityInit() {
    const { contentList } = this.data
    util.request(api.javaBrandHost + "brand/v1.0/phone/cityList", 'get')
      .then(res => {
        if (res.code == "0") {
          res.data.map((item) => {
            citys[item.name] = item.cityList
          })
        }
        this.setData({
          allDataCitys:res.data
        },()=>{
          this.initCatering()
        })

        
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.cityInit()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  dataProcessing(allData){
    const {allDataCitys,contentList,allTagList} = this.data
    let tagName='北京-东城区'.split('-')
    let defaultIndex0=0
    let defaultIndex1=0
    allData.map((item,indexTop)=>{
      // 城市 
      if(item.tagTypeId=='ADDRESS'){
        tagName=item.tagId.split('-')
        allDataCitys.map((itemCity,indexCity)=>{
          itemCity.cityList.map((itemCityChild,indexChild)=>{
            if(itemCityChild.name==tagName[1]){
              contentList[2].value=item.tagId
              contentList[2].gbCode=itemCityChild.gbCode
              // console.log(indexTop,indexCity,indexChild);
              defaultIndex0=indexCity
              defaultIndex1=indexChild

            }
          })
        })
       
      }
      // 预估投资
      if(item.tagTypeId=='BRAND_INVESTMENT'){
        allTagList.map((itemBrand)=>{
          if(itemBrand.classifyCode=='BRAND_INVESTMENT'){
            itemBrand.tagList.map((itemBrandChild,index)=>{
              if(itemBrandChild.id==item.tagId&&itemBrandChild.name=='10-20万'){
                contentList[0].value=itemBrandChild.name
              }
            })
          }
        })
      }
      // 加盟行业
      if(item.tagTypeId=='BRAND_CATEGORY'){
        allTagList.map((itemBrand)=>{
          if(itemBrand.classifyCode=='BRAND_CATEGORY'){
            itemBrand.tagList[0].childList.map((itemBrandChild,index)=>{
              if(itemBrandChild.id==item.tagId){
                contentList[1].value=itemBrandChild.name
                contentList[1].index=index
                contentList[1].gbCode=itemBrandChild.id
              }
            })
          }
        })
      }

    })
    console.log(defaultIndex0,defaultIndex1,citys);
    this.setData({
      areaList3: [{
        values: Object.keys(citys),
        className: 'column1',
        defaultIndex: defaultIndex0,
      },
      {
        values: citys[tagName[0]],
        className: 'column2',
        defaultIndex: defaultIndex1,
      }],
      popTitle: '请选择城市',
      contentList:contentList
    })
  },

  getPersonas() {
    const { contentList } = this.data
    util.request(api.javaUserHost + "v2.0/app/sys/getPersonas", {
      userId:wx.getStorageSync("userId")
    },'POST')
      .then(res => {
        if (res.code == "0") {
          this.dataProcessing(res.data)
        }
        
      })
      .catch(err => {
        console.log(err.status, err.message);
      });
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