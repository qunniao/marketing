// pagesA/editAddress/editAddress.js
var calls = require("../../utils/city.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customItem: [],
    detailed: '请选择',
    contactName:'',
    isDefault:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.type == 'edit'){
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
      wx.request({
        url: app.api_url +'/userAddress/info/'+options.id,
        success(res){
          that.setData({
            contactName: res.data.data.contactName,
            contactPhone: res.data.data.contactPhone,
            isDefault: res.data.data.isDefault,
            contactAddress: res.data.data.contactAddress,
            type:'edit',
            id:options.id
          })
        }
      })
    }
    console.log(that.data.contactName)
  },

  userName: function (event) {
    console.log(event.detail.value);
    this.setData({
      contactName: event.detail.value
    })
  },

  phone: function (event) {
    this.setData({
      contactPhone: event.detail.value
    })
  },

  bindTextAreaBlur: function (e) {
    this.setData({
      contactAddress: e.detail.value,
    })
  },

  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      isDefault: e.detail.value
    })
  },

  //省市联动
  bindRegionChange: function (e) {
    var that = this
    //为了让选择框有个默认值，    
    that.setData({
      clas: ''
    })　　　//下拉框所选择的值

    this.setData({
      //拼的字符串传后台
      detailed: e.detail.value[0] + " " + e.detail.value[1] + " " + e.detail.value[2],
      //下拉框选中的值
      region: e.detail.value
    })

    this.setData({
      address: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    })
    console.log(this.data.address)
  },

  submit:function(){
    var that = this;
    console.log(that.data.contactName + '---' + that.data.contactPhone + '---' + that.data.address + '---' + that.data.contactAddress+'---'+that.data.isDefault)
    if(that.data.isDefault == undefined){
      that.data.isDefault = 1
    } else if (that.data.isDefault == true){
      that.data.isDefault = 1
    } else if (that.data.isDefault == false) {
      that.data.isDefault = 0
    }
    if (that.data.contactName == ''){
      wx.showToast({
        title: '请输入收货人姓名',
        icon:'none'
      })
      return false;
    } else if (that.data.contactPhone == undefined) {
      wx.showToast({
        title: '请输入收货人手机号',
        icon: 'none'
      })
      return false;
    } else if (!(/^1[34578]\d{9}$/.test(that.data.contactPhone))) {
      wx.showToast({
        title: '手机号输入错误',
        icon: 'none'
      })
      return false
    } else if (that.data.address == undefined) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      })
      return false;
    } else if (that.data.contactAddress == undefined) {
      wx.showToast({
        title: '请输入具体地址',
        icon: 'none'
      })
      return false;
    } else if (that.data.contactAddress == '') {
      wx.showToast({
        title: '请输入具体地址',
        icon: 'none'
      })
      return false;
    }


    var message = { 'contactAddress': that.data.address + that.data.contactAddress, 'contactName': that.data.contactName, 'contactPhone': that.data.contactPhone, 'isDefault': that.data.isDefault, 'userId': wx.getStorageSync('userId') }
    var messagea = { 'contactAddress': that.data.address + that.data.contactAddress, 'contactName': that.data.contactName, 'contactPhone': that.data.contactPhone, 
    'id':that.data.id,'isDefault': that.data.isDefault, 'userId': wx.getStorageSync('userId') }
    if (that.data.type == 'edit') {
      app._ajaxjson(
        'put',
        '/userAddress/update',
        messagea,
        (data) => {
          wx.showToast({
            title: '地址修改成功',
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pagesA/address/address',
            })
          }, 1500);
        }
      )
    } else {
      app._ajaxjson(
        'post',
        '/userAddress/save',
        message,
        (data) => {
          if (data.code == 200) {
            wx.showToast({
              title: '地址添加成功',
            })
            setTimeout(function () {
              wx.navigateTo({
                url: '/pagesA/address/address',
              })
            }, 1500);
          }
        }
      )
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