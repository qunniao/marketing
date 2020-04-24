// pagesA/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:0,
    order:[],
    name_focus:true,
    type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.type=options.type;
    console.log("num:"+that.data.num)
    if(that.data.num == 0){
      that.data.num = ''
    }
    if(options.type == 1){
      that.setData({
        num:1
      })
    } else if (options.type == 2) {
      that.setData({
        num: 1
      })
    } else if (options.type == 3) {
      that.setData({
        num: 2
      })
    } else if (options.type == 4) {
      that.setData({
        num: 3
      })
    } else if (options.type == 5) {
      that.setData({
        num: 4
      })
    }
    //获取订单列表
    if(that.data.num != 0){
      wx.request({
        url: app.api_url + '/orders/page',
        data: {
          current: 1,
          size: 20,
          userId: wx.getStorageSync('userId'),
          orderState: that.data.num
        },
        success(res) {
          that.setData({
            order: res.data.data.records
          })
        }
      })
    } else {
      wx.request({
        url: app.api_url + '/orders/page',
        data: {
          current: 1,
          size: 20,
          userId: wx.getStorageSync('userId')
        },
        success(res) {
          that.setData({
            order: res.data.data.records
          })
        }
      })
    }
  },
  //查看物流
  goToLogisticsPage: function (event) {
    var that = this;
    var orderId = event.currentTarget.dataset.id;
    console.log("查看物流 orderId=" + orderId);
    var item = '';
    for (var i = 0; i < that.data.order.length;i++){
      if (that.data.order[i].id == orderId){
        item = that.data.order[i];
      }
    }
   
   /*
    for (var i = 0; i < item.orderLogisticVOList.length;i++){
      console.log(item.orderLogisticVOList[i].orderProductId);
      strs = item.orderLogisticVOList[i].orderProductId.split(",");
    }
    console.log("strs=" + strs);
    */
    if (item.orderLogisticVOList.length==0){
      wx.showToast({
        title: '该订单还没有物流',
        icon: 'none'
      })
      return;
    }
    var id = item.orderLogisticVOList[item.orderLogisticVOList.length-1].id;
    console.log("查看物流 id=" + id);
  
    //如果订单正在退款中，不操作
    wx.navigateTo({
      url: '/pagesA/orderLogisticsDetail/orderLogisticsDetail?id=' + id
    })
  },
  //取消订单
  cancel:function(event){
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
                  icon:'none'
                })
              }
              setTimeout(function () {
                that.onLoad('{"type":' + that.data.type + '}')
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
  deleteOrder: function (event){
    var that = this;
    wx.showModal({
      title: '确认删除该订单吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api_url + '/orders/delete/' + event.currentTarget.dataset.id,
            success(res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '订单删除成功',
                  icon: 'none'
                })
              }
              setTimeout(function () {
                that.onLoad('{"type":' + that.data.type + '}')
              }, 1000);
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
  },

  changeOil: function (e) {
    var that = this
    that.setData({
      num: e.currentTarget.dataset.num
    })
    if(that.data.num == 0){
      wx.request({
        url: app.api_url + '/orders/page',
        data: {
          current: 1,
          size: 20,
          userId: wx.getStorageSync('userId')
        },
        success(res) {
          that.setData({
            order: res.data.data.records
          })
        }
      })
    } else {
      wx.request({
        url: app.api_url + '/orders/page',
        data: {
          current: 1,
          size: 20,
          userId: wx.getStorageSync('userId'),
          orderState:that.data.num
        },
        success(res) {
          that.setData({
            order: res.data.data.records
          })
        }
      })
    }
  },

  orderDetails:function(event){
    wx.navigateTo({
      url: '/pagesA/orderDetails/orderDetails?id='+event.currentTarget.dataset.id,
    })
  },

  //搜索订单
  bindconfirm: function (e) {
    var that = this;
    var discountName = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value
    wx.request({
      url: app.api_url +'/orders/page',
      data:{
        current:1,
        size:20,
        orderNumber: discountName,
        userId:wx.getStorageSync('userId')
      },
      success(res){
        that.setData({
          order: res.data.data.records,
          num:0
        })
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
          var parmsDto = { 'orderId': event.currentTarget.dataset.id, 'userId': wx.getStorageSync('userId')}
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("==onReady==");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("==onShow==");
    this.onLoad('{"type":'+this.data.type+'}');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("==onHide==");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("==onUnload==");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("==onPullDownRefresh==");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("==onReachBottom==");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("==onShareAppMessage==");
  }
})