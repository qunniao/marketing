// pagesA/confirmation/confirmation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productItem:[],
    display:"block",
    zid:0,
    znum:0,
    orderPrice:'-',
    discount: 0,
    discountShow:false,
    freight:'-',
    totlePrice: 0
  },

  shouhuo:function(){
    wx.navigateTo({
      url: '/pagesA/address/address',
    })
  },

  xiugai:function(){
    console.log("修改")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.type == 'gwc'){
      that.setData({
        popo:'gwc'
      })
    } else if (options.type == 'det'){
      that.setData({
        popo: 'det'
      })
    }
   
    if (options.id == undefined) {
      wx.setStorageSync('orderId', options.cIds)
      wx.request({
        url: app.api_url + '/userAddress/queryDefault/' + wx.getStorageSync('userId'),
        success: function (res) {
          if(res.data.data == null){
            that.setData({
              you:'none',
              meiyou:"flex"
            })
          } else {
            that.setData({
              name: res.data.data.contactName,
              phone: res.data.data.contactPhone,
              address: res.data.data.contactAddress,
              you:'flex',
              meiyou:'none'
            })
          }
        }
      })
    } else {
      wx.request({
        url: app.api_url + '/userAddress/info/'+options.id,
        success(res){
          that.setData({
            name: res.data.data.contactName,
            phone: res.data.data.contactPhone,
            address: res.data.data.contactAddress,
            display:'none',
            meiyou:'none',
          })
        }
      })
    }
    //结算购物车
    if(options.type == 'gwc'){
      console.log("结算购物车 orderid:"+wx.getStorageSync('orderId'));
      wx.request({
        url: app.api_url+'/carts/info?cIds=' + wx.getStorageSync('orderId'),
        header: {
          'Content-Type': "application/x-www-form-urlencoded",
          'token': wx.getStorageSync("token")
        },
        success(res) {
          console.log(res);
        
          that.setData({
            productItem: res.data.data.data,
            orderPrice: res.data.data.orderPrice,
            discount: res.data.data.discount,
            freight: res.data.data.freight,
            totlePrice: res.data.data.totalPrice
          })
        }
      })
    } else if (options.type == 'det'){
      console.log('立即购买')
      let jsonObj = JSON.parse(options.orderde);

      var productId = 0;
      var productNum = 0;
      for (var i in jsonObj) {
        productNum = jsonObj[i].productNum;
        productId =jsonObj[i].productId;
      }

      wx.request({
        url: app.api_url + '/carts/queryProductOrderPrice',
        header: {
          'Content-Type': "application/x-www-form-urlencoded",
          'token': wx.getStorageSync("token")
        },
        data:{
          userId: wx.getStorageSync('userId'),
          productId: productId,
          productNum: productNum
        },
        success(res) {
          console.log(res);
          that.setData({
            productItem: res.data.data.data,
            orderPrice: res.data.data.orderPrice,
            discount: res.data.data.discount,
            freight: res.data.data.freight,
            totlePrice: res.data.data.totalPrice
          })
        }
      })

    }


  },

  //获取留言
  remark:function(){
    this.setData({
      remark: event.detail.value
    })
  },
  //根据运费模板id获取运费
  /*
  getFreight: function (id,productId,productNum) {
    console.log("id:"+id+" productId:"+productId+" productNum:"+productNum);
    var that = this;
    wx.request({
      url: app.api_url + '/freights/info/' + id,
      data: {
      },
     
      success: function (data) {
        console.log("根据运费模板id获取运费")
        console.log(data);
        console.log(data.data);
        console.log(data.data.data.freightRegionList);
        var f=0;
        var freightRegionList = data.data.data.freightRegionList;
        for (var i = 0; i < freightRegionList.length;i++){
          if (freightRegionList[i].valuationWay==2){
            //按件数
            if (freightRegionList[i].type==1){
              //全部地区运费
              if (freightRegionList[i].firstNumber > productNum)continue;//产品数量小于运费的首件件数，没有运费
              f += freightRegionList[i].firstPrice; //首件运费
              f += ((productNum - freightRegionList[i].firstNumber) / freightRegionList[i].renewNumber) * freightRegionList[i].renewPrice;


             
            }else{
              //部分地区运费
            }
          }else{
            //按重量
          }
        }

        var price = that.data.finallyPrice + f;
        that.setData({
          freight: f,
          finallyPrice: price.toFixed(2)
        })

      }
    })
     
    
  },
  */

  submit:function(){
    var that = this;
    if(that.data.name == undefined){
      wx.showToast({
        title: '请选择收货地址',
        icon:'none'
      })
      return false;
    } else if (that.data.remark == undefined){
      that.data.remark = ''
    }
    if (that.data.popo == 'gwc'){
      var cidList = []
      cidList.push(wx.getStorageSync('orderId'))
      var orderCartDto = { 'cidList': cidList, 'contactAddress': that.data.address, 'contactName': that.data.name, 'contactPhone': that.data.phone, 'deliveryWay': 1, 'freight': that.data.freight, 'remark': that.data.remark, 'userId': wx.getStorageSync('userId')}
      var order = JSON.stringify(orderCartDto)
      app._ajaxjsontoken(
        'post',
        '/carts/submitCart',
        orderCartDto,
        (data) => {
          console.log("提交购物车")
          console.log(data);
          if(data.code==200){
            this.payment(data.data);
          }
        }
      )
    } else if (that.data.popo == 'det'){
      var cidList = []
      cidList.push({ 'productId': that.data.productItem[0].productId, 'productNum': that.data.productItem[0].productNum, 'productPrice': that.data.productItem[0].productPrice,'shareId': wx.getStorageSync('shareId')})
      var orderDto = { 'orderProductDTOList': cidList, 'contactAddress': that.data.address, 'contactName': that.data.name, 'contactPhone': that.data.phone, 'deliveryWay': 1, 'freight': that.data.freight, 'remark': that.data.remark, 'userId': wx.getStorageSync('userId')}
      var order = JSON.stringify(orderDto)
      app._ajaxjsontoken(
        'post',
        '/orders/save',
        orderDto,
        (data) => {
          console.log("提交订单")
          console.log(data);
          if (data.code == 200) {
            this.payment(data.data);
          }
        }
      )
    }
  },
  payment: function (options) {
    console.log("payment options: "+options);
    var that = this;
    wx.request({
      url: app.api_url + '/pay/wxPayOrder',
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync("token")
      },
      data: {
        orderNumber: options,
      },
      method:'post',
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
            console.log(res.data.attach);
            /*
            wx.navigateTo({
              url: '/pagesA/paySuccess/paySuccess?id=' + res.data.orderId
            })
            */
            wx.navigateTo({
              url: '/pagesA/orderDetails/orderDetails?id=' + res.data.orderId
            })
          },
          fail: function (error) {
            // fail
            console.log("支付失败")
            console.log(error)
            wx.navigateTo({
              url: '/pagesA/orderDetails/orderDetails?id=' + res.data.orderId
            })
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