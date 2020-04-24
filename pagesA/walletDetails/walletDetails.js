// pagesA/walletDetails/walletDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mingxi:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取零钱明细
    wx.request({
      url: app.api_url +'/walletHistorys/page',
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync("token")
      },
      method:'GET',
      data: {
        current: 1,
        size: 30,
        userId: wx.getStorageSync('userId')
      },
      success(res){
        console.log("零钱明细回调");
        console.log(res);
        that.setData({
          mingxi: res.data.data.records
        })
      }
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