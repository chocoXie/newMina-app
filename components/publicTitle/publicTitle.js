// components/publicTitle/publicTitle.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleName: {
      type: String
    },
    backColor: {
      type: String
    },
    type:{
      type: String
    },
    msgColor: {
      type: String
    },
    iconColor: {
      type: String
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    heightTop: '',
    height: '',
    titleName:'',
    type:'',
    backColor:'',
    msgColor:'',
    iconColor:'',
    backHome:false,
    wxPagesinfo:'',
    isSearchPage:false
  },

  ready(){
    const { titleName='',backColor='',type='',msgColor='',iconColor='' } = this.properties;
    const { top, height } = app.globalData
    let pages = getCurrentPages();
    if(type && type=='selectBrand'){
      this.setData({
        backHome:false
      })
    }else{
      if (!pages[pages.length - 2]){
        this.setData({
          backHome:true
        })
      } else {
        this.setData({
          backHome:false
        })
      }
    }
    if(titleName == '搜索'){
      this.setData({
        isSearchPage:true
      })
    }
    
    this.setData({
      heightTop: (top + height),
      height: height,
      titleName:titleName,
      backColor:backColor,
      type:type,
      msgColor:msgColor,
      iconColor:iconColor
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancelBack(e) {
      let pages = getCurrentPages();
      if(e.currentTarget.dataset.type == 'selectBrand'){
        let url = '/pages/customerChat/customerChat?backurl=' +  encodeURIComponent( wx.getStorageSync('Imurl'));
        wx.navigateTo({
          url
        });
      }else{
        if (!pages[pages.length - 2]) {
          var url = "/pages/index/index";
          wx.reLaunch({
            url
          });
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    }
  }
})
