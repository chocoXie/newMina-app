// components/brandComponents/brandComponents.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object
    },
    type:{
      type:String
    },
    source:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    itemData:{},
    isType:'',
    source:''
  },
  ready: function () {
   if(this.properties.itemData){
     this.setData({
      itemData:this.properties.itemData,
      isType:this.properties.type||'',
      source:this.properties.source||''
     })
   }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    brandComponentClick(){
      const {itemData,isType,source} = this.data
      console.log(itemData,isType,source);
      let projetc_detail_source
      let project_classification
      if(isType){
        projetc_detail_source='匹配品牌'
        project_classification=itemData.brandCategory
      }else{
        projetc_detail_source=source||''
        project_classification=itemData.category
      }
      app.sensors.track('projectDetailBrowse',{
        projetc_detail_source:projetc_detail_source,
        project_classification:project_classification,
        brand_name:itemData.brandName,
        brand_id:itemData.brandId,
      })
      wx.navigateTo({
        url: "/packageA/pages/brandDetail/brandDetail?brandId="+itemData.brandId,
      });
    }
  }
})
