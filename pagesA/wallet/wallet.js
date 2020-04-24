// pagesA/wallet/wallet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取钱包
    wx.request({
      url: app.api_url +'/wallets/info/'+wx.getStorageSync('userId'),
      success(res){
        that.setData({
          balance: res.data.data.balance
        })
      }
    })

  },

  mingxi:function(){
    wx.navigateTo({
      url: '/pagesA/walletDetails/walletDetails',
    })
  },

  //提现
  submit:function(){
    var _this = this;
    if (_this.data.balance<=0){
      wx.showToast({
        title: '余额不够提现',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (_this.data.balance <= 100) {
      wx.showToast({
        title: '满100元可提现',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    console.log("余额：" + _this.data.balance);
    /*
    wx.showToast({
      title: '暂未开放',
      icon: 'loading',
      duration: 2000
    });
    return;
    */
    wx.navigateTo({
      url: '/pagesA/cashWithdrawal/cashWithdrawal?balance=' + _this.data.balance,
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