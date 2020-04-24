const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cc: {
      "flag": 1,
      "name": '搜索'
    },
    inpuVal: "",//input框内值
    listarr: [],//创建数组
    SearchText: '取消',//按钮变动值
    keydown_number: 0,//检测input框内是否有内容
    input_value: "",//value值
    name_focus: true,//获取焦点
    rightList: []
  },
  //取值input判断输入框内容修改按钮
  inputvalue: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
    if (e.detail.cursor != 0) {
      this.setData({
        SearchText: "搜索",
        keydown_number: 1
      })
    } else {
      this.setData({
        SearchText: "取消",
        keydown_number: 0
      })
    }
  },

  //键盘点击搜索
  bindconfirm: function () {
    var that = this;
    if (that.data.keydown_number == 1) {
      //把获取的input值插入数组里面
      let arr = that.data.listarr;
      console.log(that.data.inputVal)
      console.log(that.data.input_value)
      //判断取值是手动输入还是点击赋值
      if (that.data.input_value == "") {
        // console.log('进来第er个')
        // 判断数组中是否已存在
        let arrnum = arr.indexOf(that.data.inputVal);
        console.log(arr.indexOf(that.data.inputVal));
        if (arrnum != -1) {
          // 删除已存在后重新插入至数组
          arr.splice(arrnum, 1)
          arr.unshift(that.data.inputVal);

        } else {
          arr.unshift(that.data.inputVal);
        }

      } else {
        let arr_num = arr.indexOf(that.data.input_value);
        console.log(arr.indexOf(that.data.input_value));
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(that.data.input_value);
        } else {
          arr.unshift(that.data.input_value);
        }

      }
      console.log(arr)

      //存储搜索记录
      wx.setStorage({
        key: "list_arr",
        data: arr
      })


      //取出搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function (res) {
          that.setData({
            listarr: res.data
          })
        }
      })
      that.setData({
        input_value: '',
      })
      wx.request({
        url: app.api_url +'/products/list',
        data:{
          search: that.data.inputVal,
          current: 1,
          size: 20
        },
        success(res){
          that.setData({
            rightList: res.data.data.records
          })
          if (that.data.rightList.length == 0) {
            wx.showToast({
              title: '没有相关商品',
              icon: 'none'
            })
          }
        }
      })
    } else {
      console.log("取消")
    }
  },

  //搜索方法
  search: function () {
    var that = this;
    if (that.data.keydown_number == 1) {
      //把获取的input值插入数组里面
      let arr = that.data.listarr;
      console.log(that.data.inputVal)
      console.log(that.data.input_value)
      //判断取值是手动输入还是点击赋值
      if (that.data.input_value == "") {
        // console.log('进来第er个')
        // 判断数组中是否已存在
        let arrnum = arr.indexOf(that.data.inputVal);
        console.log(arr.indexOf(that.data.inputVal));
        if (arrnum != -1) {
          // 删除已存在后重新插入至数组
          arr.splice(arrnum, 1)
          arr.unshift(that.data.inputVal);

        } else {
          arr.unshift(that.data.inputVal);
        }

      } else {
        let arr_num = arr.indexOf(that.data.input_value);
        console.log(arr.indexOf(that.data.input_value));
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(that.data.input_value);
        } else {
          arr.unshift(that.data.input_value);
        }

      }
      console.log(arr)

      //存储搜索记录
      wx.setStorage({
        key: "list_arr",
        data: arr
      })


      //取出搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function (res) {
          that.setData({
            listarr: res.data
          })
        }
      })
      that.setData({
        input_value: '',
      })
      wx.request({
        url: app.api_url + '/products/list',
        data: {
          search: that.data.inputVal,
          current: 1,
          size: 20
        },
        success(res) {
          that.setData({
            rightList: res.data.data.records
          })
          if (that.data.rightList.length == 0) {
            wx.showToast({
              title: '没有相关商品',
              icon: 'none'
            })
          }
        }
      })
    } else {
      console.log("取消")
    }

  },
  //清除搜索记录
  delete_list: function () {
    var that = this;
    wx.showModal({
      content: '确定清除历史搜索？',
      success: function (res) {
        if (res.confirm) {
          //清除当前数据
          that.setData({
            listarr: []
          });
          //清除缓存数据
          wx.removeStorage({
            key: 'list_arr'
          })
        } else {
          console.log("用户点击了取消")
        }
      }
    })
  },
  //点击赋值到input框
  this_value: function (e) {
    var that = this;
    that.setData({
      name_focus: true
    })
    let value = e.currentTarget.dataset.text;
    that.setData({
      input_value: value,
      SearchText: "搜索",
      keydown_number: 1
    })
    wx.request({
      url: app.api_url + '/products/list',
      data: {
        search: value,
        current: 1,
        size: 20
      },
      success(res) {
        that.setData({
          rightList: res.data.data.records
        })
        if (that.data.rightList.length == 0) {
          wx.showToast({
            title: '没有相关商品',
            icon: 'none'
          })
        }
      }
    })
  },

  //跳转商品详情页
  goDetails: function (e) {
    wx.navigateTo({
      url: '/pagesA/details/details?pid=' + e.currentTarget.dataset.postad,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let This = this;
    //设置当前页标题
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    //读取缓存历史搜索记录
    wx.getStorage({
      key: 'list_arr',
      success: function (res) {
        This.setData({
          listarr: res.data
        })
      }
    })
  },
})