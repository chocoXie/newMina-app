// components/titleSearch/titleSearch.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  ready(){
    const {top,height} = app.globalData
  
    this.setData({
      heightTop:(top+height)+15,
      searchInputHeight:height
      
    })
  },
  /**
   * 组件的初始数据
   */
  data: {
    heightTop:""
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
