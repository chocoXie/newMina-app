// components/newsVideo/newsVideo.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object
    },
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    itemData: {},
    informationInfo:{}
  },
  ready: function () {
    const { itemData={}} = this.properties;
    // console.log(itemData,'每条数据');
    this.setData({
      itemData:itemData,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    newsVideoBarClick(){
      const {itemData} = this.data
      wx.navigateTo({
        url: '/pages/webViewList/lookInfoVideo/lookInfoVideo?infoId='+itemData.vod.belong+'&videoId='+itemData.vod.uuid
      });
    }
  }
})
