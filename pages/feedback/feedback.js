var app = getApp();
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaVal:'',
    disabledValue:true,
    heightTop: '',
    height:'',
    show:false,
    showIndex:0,
    myPhone:'',
    placeholderText:`我们非常希望听到你的声音！\n并且每一条都会认真看，请详细描述哦～`,
    actions:[
      {
        name:'提建议',
        index:0
      },
      {
        name:'不好用',
        index:1
      },
      {
        name:'挑错误',
        index:2
      },
      {
        name:'其他',
        index:3
      },

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      myPhone:wx.getStorageSync("userPhone")
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  //弹框弹出
  showSheet(){
    var newActions = JSON.parse(JSON.stringify(this.data.actions))
    for(let i = 0 ; i < newActions.length; i++){
      newActions[i].className=''
    }
    newActions[this.data.showIndex].className = 'active'
    this.setData({
      show:true,
      actions:newActions
    })
  },
  onClose(){
    this.setData({
      show:false
    })
  },
  //点击选项
  selectItem(e){
    var index = e.detail.index
    this.setData({
      showIndex:index
    })
  },
  //按钮是否能点
  btnActiveFun(e){
   
    let val = e.detail.value
    if(val != ''){
      this.setData({
          disabledValue:false,
          textareaVal:val
        })
    }else{
      this.setData({
        disabledValue:true,
        textareaVal:val
      })
    }
  },
    //提交
    submitFeedback(){

      let params= {
        accessToken:wx.getStorageSync("accesstoken"),
        phone:wx.getStorageSync("userPhone"),
        content:this.data.textareaVal,
        opinionType:'0'+Number(this.data.showIndex+1)
      }
      util.request(api.javahost + "support/v1.0/feedback/add", params, 'POST')
      .then((res) => {
        if (res.code == 0) {
          wx.showToast({
            title:'提交成功',
            icon:'none',
            success:()=>{
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
             
            }
          })

        }
      })
      .catch((error) => {
        console.log(error);
      });
  

    }
})