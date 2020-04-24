// pagesA/orderDetails/orderDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:[],
    order:{},
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
          order: res.data.data,
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
                that.onLoad(that.data.order)
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
    var orderNumber = this.data.order.orderNumber;
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
            wx.removeStorageSync("wupin");
            that.onLoad('{"type":' + that.data.type + '}');
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

  //转入云库存
  changeToCloudStore: function (event) {
    console.log("转入云库存 orderId:" + event.currentTarget.dataset.id + " userId:" + wx.getStorageSync('userId'))
    var that = this;
    wx.showModal({
      title: '转入云库存后订单将已完成并且不可退款，请慎重操作',
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          var parmsDto = { 'orderId': event.currentTarget.dataset.id, 'userId': wx.getStorageSync('userId') }
          wx.request({
            url: app.api_url + '/orders/changeToCloudStore',
            header: {
              'Content-Type': "application/x-www-form-urlencoded",
              'token': wx.getStorageSync("token")
            },
            method: "post",
            data: parmsDto,
            success: function (res) {
              console.log("返回");
              console.log(res);
              if (res.data.code === 200) {
                wx.showToast({
                  title: '请前往云库存页面查看云产品',
                  icon: 'none'
                })
                that.onLoad('{"type":' + that.data.type + '}');
              } else {
                wx.showToast({
                  title: '操作失败',
                  icon: 'none'
                })
                that.onLoad('{"type":' + that.data.type + '}');
              }
              return;
            },
            fail: function (res) {
              fail && fail("网络状况不佳,请稍后再试");

            },
            complete: function (res) {

            }
          });

        } else if (res.cancel) {
          return;
        }
      }
    })
  },

  //申请退款
  orderRefund: function (event) {
    var that = this;
    var orderId = event.currentTarget.dataset.id;
    var orderProductId = event.currentTarget.dataset.pid;
    console.log("申请退款 orderId=" + orderId + " orderProductId=" + orderProductId);
    //如果订单正在退款中，不操作
    if(that.data.order.orderState==5){
      wx.showToast({
        title: '订单已在退款中，请耐心等待',
        icon: 'none'
      })
      return;
    }
    /*
    跳到选择服务页面
    wx.navigateTo({
      url: '/pagesA/orderRefund/orderRefund?orderId=' + orderId,
    })
    */
    //直接跳转到我要退款页面
    wx.navigateTo({
      url: '/pagesA/orderRefundMoney/orderRefundMoney?orderId=' + orderId + "&orderProductId=" + orderProductId,
    })
  },
  //取消退款
  cancelOrderRefund: function (event) {
    var that = this;
    var orderId = event.currentTarget.dataset.id;
    var orderProductId = event.currentTarget.dataset.pid;
    console.log("申请退款 orderId=" + orderId + " orderProductId=" + orderProductId);
    //如果订单正在退款中，不操作
    if (that.data.order.orderState == 5) {
      wx.showToast({
        title: '订单已在退款中，请耐心等待',
        icon: 'none'
      })
      return;
    }
    /*
    跳到选择服务页面
    wx.navigateTo({
      url: '/pagesA/orderRefund/orderRefund?orderId=' + orderId,
    })
    */
    //直接跳转到我要退款页面
    wx.navigateTo({
      url: '/pagesA/orderRefundMoney/orderRefundMoney?orderId=' + orderId + "&orderProductId=" + orderProductId,
    })
  },
  //确认收货
  finishOrder: function (event) {
    console.log("finishOrder orderId:" + event.currentTarget.dataset.id + " userId:" + wx.getStorageSync('userId'))
    var that = this;

    var parmsDto = { 'orderId': event.currentTarget.dataset.id, 'userId': wx.getStorageSync('userId') }
    app._ajaxtoken(
      'post',
      '/orders/finishOrder',
      parmsDto,
      (data) => {

        console.log(data);
        if (data.code == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })
        }
        that.onLoad('{"type":' + that.data.type + '}');
      }
    )
  },
  //查看物流
  goToLogisticsPage: function (event) {
    var that = this;
    var orderId = event.currentTarget.dataset.id;
    console.log("查看物流 orderId=" + orderId);
    var item = that.data.order;
    

    /*
     for (var i = 0; i < item.orderLogisticVOList.length;i++){
       console.log(item.orderLogisticVOList[i].orderProductId);
       strs = item.orderLogisticVOList[i].orderProductId.split(",");
     }
     console.log("strs=" + strs);
     */
    if (item.orderLogisticVOList.length == 0) {
      wx.showToast({
        title: '该订单还没有物流',
        icon: 'none'
      })
      return;
    }
    var id = item.orderLogisticVOList[item.orderLogisticVOList.length - 1].id;
    console.log("查看物流 id=" + id);

    //如果订单正在退款中，不操作
    wx.navigateTo({
      url: '/pagesA/orderLogisticsDetail/orderLogisticsDetail?id=' + id
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