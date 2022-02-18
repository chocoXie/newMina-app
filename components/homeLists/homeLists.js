const { nextTick } = require("../../lib/vant-weapp/common/utils");

// components/homeLists/homeLists.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataLists: {
      type: Array
    },
    nowTab:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dataLists:[],
    nowTab:'',
    swiperheight:''
  },
  observers: {
    'nowTab': function (nowTab) {
      let _this = this
      setTimeout(() => {
        _this.queryMultipleNodes();
      }, 500);
    },
    dataLists:function(dataLists){
      let _this = this
      setTimeout(() => {
        _this.queryMultipleNodes();
      }, 200);
    }
  },
  ready: function () {
    const { dataLists,nowTab } = this.properties;
    this.setData({
      dataLists,
      nowTab
    })
    let _this = this
    setTimeout(() => {
      _this.queryMultipleNodes();
    }, 200);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    touchStart:function(e){
      let touchDot = e.touches[0].pageX; // 获取触摸时的原点
    },
    /*子组件向父组件传值*/
    itemChange(e){
      this.triggerEvent('myevent',{params:e.detail},{})
    },
    queryMultipleNodes (){
      let {nowTab} = this.data;
      let _this = this;
      // setTimeout(() => {
        const query = wx.createSelectorQuery().in(_this)
        query.selectAll('.item1').boundingClientRect(function(res){
          _this.setData({
            swiperheight:res[nowTab].height
          })
        }).exec()
      // }, 1000);
      
    },
    dataListsClick(e) {
      const {nowTab} = this.data
      let projetc_detail_source
      let itemData
      if(nowTab==0){
        projetc_detail_source='首页-推荐'
      }
      if(nowTab==1){
        projetc_detail_source='首页-低投入'
      }
      if(nowTab==2){
        projetc_detail_source='首页-网红店'
      }
      if(e.currentTarget.dataset.item){
        itemData=e.currentTarget.dataset.item
      }
      app.sensors.track('projectDetailBrowse',{
        projetc_detail_source:projetc_detail_source,
        project_classification:itemData.category,
        brand_name:itemData.brandName,
        brand_id:itemData.brandId,
      })
      wx.navigateTo({
        url: "/packageA/pages/brandDetail/brandDetail?brandId="+e.currentTarget.dataset.id,
      });
    },
  }
})
