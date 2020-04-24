// pagesA/editAddress/editAddress.js
var calls = require("../../utils/city.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal: {},
    cardNumber: '',
    realName:'',
    isEdit:false,
    id:0,
    path:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.type == 'edit'){
      that.setData({
        isEdit: true,
        id: options.id
      })
      wx.setNavigationBarTitle({
        title: '修改银行卡'
      })
      wx.request({
        url: app.api_url +'/userBandCard/info/'+options.id,
        success(res){
          console.log("bandInfo onload 获取银行卡信息返回：");
          console.log(res);
          that.setData({
            modal:res.data.data,
            realName: res.data.data.realName,
            cardNumber: res.data.data.cardNumber
          })
        }
      })
    }
    if (options.path =="cashWithdrawal"){
      console.log("从钱包提现页面过来的 path:" + options.path);
      //从钱包提现页面过来的
      that.setData({
        path: "cashWithdrawal"
      })
   
    }
    console.log(that.data.realName)
  },

  userName: function (event) {
    console.log(event.detail.value);
    this.setData({
      realName: event.detail.value
    })
  },

  phone: function (event) {
    this.setData({
      cardNumber: event.detail.value
    })
  },


  submit:function(){
    var that = this;
    console.log(that.data.realName + '---' + that.data.cardNumber)
    if (that.data.realName == ''){
      wx.showToast({
        title: '请输入真实姓名',
        icon:'none'
      })
      return false;
    }
    if (that.data.cardNumber == '') {
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none'
      })
      return false;
    }


    var message = { 'realName': that.data.realName, 'cardNumber': that.data.cardNumber,'userId': wx.getStorageSync('userId') }
    var messagea = { 'realName': that.data.realName, 'cardNumber': that.data.cardNumber, 'id':that.data.id, 'userId': wx.getStorageSync('userId') }
    if (that.data.type == 'edit') {
      app._ajaxjson(
        'put',
        '/userBandCard/update',
        messagea,
        (data) => {
          wx.showToast({
            title: '修改成功',
          })
          setTimeout(function () {
            if (that.data.path == "cashWithdrawal") {
              //从钱包提现页面过来的
              wx.navigateTo({
                url: '/pagesA/cashWithdrawal/cashWithdrawal',
              })
            }else{
              wx.navigateTo({
                url: '/pagesA/band/band',
              })
            }
            
          }, 1500);
          
        
        }
      )
    } else {
      app._ajaxjson(
        'post',
        '/userBandCard/save',
        message,
        (data) => {
          if (data.code == 200) {
            wx.showToast({
              title: '添加成功',
            })
            setTimeout(function () {
              if (that.data.path == "cashWithdrawal") {
                //从钱包提现页面过来的
                wx.navigateTo({
                  url: '/pagesA/cashWithdrawal/cashWithdrawal',
                })
              } else {
                wx.navigateTo({
                  url: '/pagesA/band/band',
                })
              }
            }, 1500);
            
           
          }
        }
      )
    }
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

  }
})