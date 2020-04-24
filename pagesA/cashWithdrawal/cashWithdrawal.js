// pagesA/cashWithdrawal/cashWithdrawal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasBandCard:false,
    modal:{},
    balance:'',
    amount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      balance: options.balance
    })
    //获取银行卡列表
    this.getBandCardList();
  },

  getBandCardList: function (options) {
    console.log("onLoad userId:" + wx.getStorageSync("userId"));
    var that = this;

    wx.request({
      url: app.api_url + '/userBandCard/list/' + wx.getStorageSync("userId"),
      success(res) {
        console.log("获取银行卡列表返回：");
        console.log(res);
        var data = res.data.data;
        if (data.length>0){
          that.setData({
            modal: data[0],
            hasBandCard:true
          })
        }
      
      }
    })
  },

  phone: function (event) {
    this.setData({
      amount: event.detail.value
    })
  },

  // 添加银行卡
  bindBandCard: function (event) {
    var pid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pagesA/bandInfo/bandInfo?type=' + 'add&path=cashWithdrawal',
    })
  },

  submit: function () {
    var that = this;
    console.log("提交"+that.data.modal.id + '---' + that.data.modal.cardNumber)
    if (that.data.modal.id == '' || that.data.modal.id == undefined) {
      wx.showToast({
        title: '请添加到账银行卡',
        icon: 'none'
      })
      return false;
    }
    if (that.data.balance == '' || that.data.balance == 0) {
      wx.showToast({
        title: '余额不够提现',
        icon: 'none'
      })
      return false;
    }
    if (that.data.amount > that.data.balance) {
      wx.showToast({
        title: '提现金额不能超出余额',
        icon: 'none'
      })
      return false;
    }

    var message = { 'bandId': that.data.modal.id, 'amount': that.data.amount, 'userId': wx.getStorageSync('userId') }
    
      app._ajaxjson(
        'post',
        '/withdrawReviews/save',
        message,
        (data) => {
          console.log("提交申请返回：");
          console.log(data);
          if (data.code == 200) {
            wx.showToast({
              title: '已提交申请',
            })
            setTimeout(function () {
              wx.navigateTo({
                url: '/pagesA/wallet/wallet',
              })
            }, 1500);


          }
        }
      )
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