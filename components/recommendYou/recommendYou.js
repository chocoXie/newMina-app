// components/brandComponents/brandComponents.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommendData: {
      type: Array
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    recommendData:[]
  },
  ready: function () {
    console.log(this.properties.recommendData,222222222);
   if(this.properties.recommendData){
     this.setData({
      recommendData:this.properties.recommendData
     })
   }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
