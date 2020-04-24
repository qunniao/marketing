// pagesA/address/address.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      addressType:options.type
    })
    wx.request({
      url: app.api_url +'/userAddress/list/'+wx.getStorageSync("userId"),
      success(res){
        that.setData({
          address:res.data.data
        })
      }
    })
  },

  // 编辑
  edit: function (event) {
    var pid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pagesA/editAddress/editAddress?type=' + 'edit&id=' + pid,
    })
  },

  //删除
  delete: function (event){
    var that = this;
    var pid = event.currentTarget.dataset.id
    wx.showModal({
      title: '确定删除该地址？',
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api_url + '/userAddress/delete/' + pid,
            method: 'delete',
            success(res) {
              wx.showToast({
                title: '地址删除成功',
              })
              setTimeout(function () {
                that.onLoad();
              }, 1000);
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
  },

  //添加新地址
  addRess:function(){
    console.log(2313)
    wx.navigateTo({
      url: '/pagesA/editAddress/editAddress?type='+'add',
    })
  },

  queren:function(event){
    var that = this;
    if (that.data.addressType == 'setup'){
      return false;
    } else {
      var path = wx.getStorageSync("confirmPath");
      console.log("path:"+path);
      wx.navigateTo({
        url: path
      })
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