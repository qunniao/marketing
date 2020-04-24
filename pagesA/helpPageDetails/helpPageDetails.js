// pagesA/newsDetails/newsDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("onLoad " + options.id);
    console.log(options);
    //获取问题列表
    wx.request({
      url: app.api_url + '/question/info/' + options.id,
      method: 'GET',
      success(res) {
        console.log("获取问题详情");
        console.log(res);
        console.log(res.data.data);
        that.setData({
          modal: res.data.data
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