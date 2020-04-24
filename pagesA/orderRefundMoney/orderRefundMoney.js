// pagesA/orderDetails/orderDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    order:{},
    orderProductId: 0,
    orderId:0,
    refundMoney:0,
    note:'',
    showModalStatus: false,
    showModalStatus2: false,
    productState:-1,
    productStateList:[
      {"name": "未收到货", "val": 0 },
      {"name":"已收到货","val":1}  
    ],
    refundWhy: -1,
    refundWhyList: [
      { "name": "不喜欢/不想要", "val": 0 },
      { "name": "空包裹", "val": 1 },
      { "name": "快递/物流一直未送到", "val": 2 },
      { "name": "快递/物流无跟踪记录", "val": 3 },
      { "name": "货物破损已拒签", "val": 4 }
    ],
    refundWhyList2: [
      { "name": "退运费", "val": 10 },
      { "name": "大小/重量与商品描述不符", "val": 11 },
      { "name": "生产日期/保质期与商品描述不符", "val": 12 },
      { "name": "标签/批次/包装/成分等与商品描述不符", "val": 13 },
      { "name": "商品变质/发霉/有异物", "val": 14 },
      { "name": "质量问题", "val": 15 },
      { "name": "少见/漏发", "val": 16 },
      { "name": "包装/商品破损", "val": 17 },
      { "name": "发票问题", "val": 18 },
      { "name": "卖家发错货", "val": 19 },
      { "name": "预约不到/卖家不给退换", "val": 20 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad options: " + options);
    var that = this;
    wx.request({
      url: app.api_url + '/orders/info/' + options.orderId,
      success(res) {
        var orderDe = res.data.data.orderProductVOList;
        var it = {};
        for (var i in orderDe) {
          if(orderDe[i].id == options.orderProductId){
            it = orderDe[i];
          }
        }
        var money = it.productNum*it.productPrice;
        if(res.data.data.orderState==2){
          //待发货，可以退运费
          money+=res.data.data.freight;
        }
        that.setData({
          order: res.data.data,
          item: it,
          product: res.data.data.orderProductVOList,
          id: res.data.data.id,
          refundMoney:money
        })
      }
    })
  },

 
  
  //申请退款
  orderRefund: function (event) {
    console.log("申请退款 orderId=" + event.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pagesA/orderRefund/orderRefund?orderId=' + event.currentTarget.dataset.id,
    })
  },
  //取值input判断输入框内容修改按钮
  inputvalue: function (e) {
    this.setData({
      refundMoney: e.detail.value
    })
  },
  //提交申请
  submit: function () {
    var that = this;
    if (that.data.productState == -1) {
      wx.showToast({
        title: '请选择货物状态',
        icon: 'none'
      })
      return false;
    }
    if (that.data.refundWhy == -1) {
      wx.showToast({
        title: '请选择退款原因',
        icon: 'none'
      })
      return false;
    }
    if (that.data.refundMoney > that.data.order.payMoney) {
      wx.showToast({
        title: '退款金额不能大于支付金额',
        icon: 'none'
      })
      return false;
    }
    if (that.data.refundMoney < 0) {
      wx.showToast({
        title: '退款金额不能大于0',
        icon: 'none'
      })
      return false;
    }
    var why = that.data.refundWhyList[that.data.refundWhy].name;
    if (that.data.productState==1){
      //收到货的退款原因
      why = that.data.refundWhyList2[that.data.refundWhy].name;
    }
    console.log("orderProductId:" + that.data.item.id + " refundMoney:" + that.data.refundMoney);

    var parm = { 'orderId': that.data.order.id, 'orderProductId': that.data.item.id, 'refundType': 1, 'productState': that.data.productState, 'refundWhy': why, 'refundMoney': that.data.refundMoney, 'note': that.data.note}
    app._ajaxjsontoken(
      'post',
      '/orderRefund/save',
      parm,
      (data) => {
        if (data.code == 200) {
          wx.showToast({
            title: '提交成功',
          })
          wx.navigateTo({
            url: '/pagesA/orderDetails/orderDetails?id=' + that.data.order.id
          })
        }
      }
    )

  },
  //货物状态
  bindProductState: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  //货物状态修改
  bindProductStateUpdate: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    that.setData({
      productState: currentStatu
    })
    that.setData(
      {
        showModalStatus: false
      }
    );
  },
  //货物状态抽屉关闭
  bindProductStateClose: function () {
    var that = this;
    that.setData(
      {
        showModalStatus: false
      }
    );
  },
  //退款原因
  bindRefundWhy: function (e) {
    var that = this;
    if(that.data.productState==-1){
      wx.showToast({
        title: '请先选择货物状态',
        icon: 'none'
      })
      return;
    }
    var currentStatu = e.currentTarget.dataset.statu;
    this.util2(currentStatu)
  },
  //退款原因修改
  bindRefundWhyUpdate: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    that.setData({
      refundWhy: currentStatu
    })
    that.setData(
      {
        showModalStatus2: false
      }
    );
  },
  //退款原因抽屉关闭
  bindRefundWhyClose: function () {
    var that = this;
    that.setData(
      {
        showModalStatus2: false
      }
    );
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },

  util2: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData2: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData2: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus2: false
          }
        );
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus2: true
        }
      );
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