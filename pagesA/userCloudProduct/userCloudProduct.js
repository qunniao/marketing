// pagesA/commission/commission.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("云产品列表页面加载 userId:" + wx.getStorageSync('userId'));
    var that = this;
    //获取云产品列表
    wx.request({
      url: app.api_url + '/userCloudProduct/list',
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync("token")
      },
      method: 'GET',
      data: {
        userId: wx.getStorageSync('userId')
      },
      success(res) {
        console.log("获取云产品列表");
        console.log(res);
        console.log(res.data.data);
        that.setData({
          list: res.data.data
        })
      }
    })
  },
  //跳转商品详情
  goDetails: function (event) {
    var pid = event.currentTarget.dataset.pid
    wx.navigateTo({
      url: '/pagesA/details/details?pid=' + pid,
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