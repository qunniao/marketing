// pagesA/orderDetails/orderDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.api_url +'/orders/info/'+options.id,
      success(res){
        var orderDe = res.data.data.orderProductVOList;
        var totle = 0;
        for (var i in orderDe){
          totle += orderDe[i].productNum * orderDe[i].productPrice
        }
        that.setData({
          item: res.data.data,
          product: res.data.data.orderProductVOList,
          id:res.data.data.id
        })
      }
    })
  },

  //取消订单
  cancel: function (event) {
    var that = this;
    wx.showModal({
      title: '确认取消该订单吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api_url + '/orders/cancel/' + event.currentTarget.dataset.id,
            success(res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '订单取消成功',
                  icon: 'none'
                })
              }
              setTimeout(function () {
                that.onLoad(that.data.item)
              }, 1000);
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
  },

  //删除订单
  deleteOrder: function () {
    var that = this;
    wx.showModal({
      title: '确认删除该订单吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api_url + '/orders/delete/' + that.data.id,
            success(res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '订单删除成功',
                  icon: 'none'
                })
              }
              setTimeout(function () {
                wx.navigateBack({
                })
              }, 1000);
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
  },

  //支付订单
  payment: function () {
    var orderNumber = this.data.item.orderNumber;
    console.log("payment orderNumber: " + orderNumber);
    var that = this;
    wx.request({
      url: app.api_url + '/pay/wxPayOrder',
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync("token")
      },
      data: {
        orderNumber: orderNumber,
      },
      method: 'post',
      success(res) {

        console.log(res);

        //小程序发起微信支付
        wx.requestPayment({
          timeStamp: res.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.sign,
          success: function (event) {
            // success
            console.log(event);
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            });
            wx.removeStorageSync("wupin")
          },
          fail: function (error) {
            // fail
            console.log("支付失败")
            console.log(error)
          },
          complete: function () {
            // complete
            console.log("pay complete")
          }
        });

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