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
    var that = this;
    //获取问题列表
    wx.request({
      url: app.api_url + '/question/page',
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync("token")
      },
      method: 'GET',
      data: {
        current: 1,
        size:100
      },
      success(res) {
        console.log("获取问题列表");
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
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pagesA/helpPageDetails/helpPageDetails?id=' + id,
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