// pagesA/commission/commission.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalMoney:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("佣金页面加载 userId:" + wx.getStorageSync('userId'));
    var that = this;
    //获取佣金
    
    wx.request({
      url: app.api_url + '/awards/queryListByUserId',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      data: { 
        userId: wx.getStorageSync('userId') 
        },
      success(res) {
        console.log("佣金列表回调");
        console.log(res);
        var total = 0;
        for (var i = 0; i < res.data.data.length;i++){
          total += res.data.data[i].awardMoney;
        }
        that.setData({
          list: res.data.data,
          totalMoney:total
        })
      }
    })

/*
    var parmsDto = {'userId': wx.getStorageSync('userId') }
    app._ajaxtoken(
      'post',
      '/awards/queryListByUserId',
      parmsDto,
      (data) => {
        console.log("佣金列表回调");
        console.log(data);
        that.setData({
          list: res.data.data
        })
      }
    )
*/
   
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