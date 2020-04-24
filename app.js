//app.js
App({
  api_url: 'https://back.zhanchengwlkj.com/distribution_applet',
  // app_url2:'http://2300i2t902.imwork.net:51377',
  globalData: {
    isIPX: false
  },
  checkIsIPhoneX: function () {
    const self = this
    wx.getSystemInfo({
      success: function (res) {
        // 根据 model 进行判断
        if (res.model.search('iPhone X') != -1) {
          self.globalData.isIPX = true
        }
        // 或者根据 screenHeight 进行判断
        // if (res.screenHeight == 812) {
        //   self.globalData.isIPX = true
        // }
      }
    })
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  _ajax: function (type, url, data, success, fail, complete) {
    wx.showNavigationBarLoading();
    let app = this;
    data == "" ? data = {} : data;
    // data.userId = wx.getStorageSync('userId');
    wx.request({
      url: app.api_url + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: type,
      data: data,
      success: function (res) {
        if (res.data.status === 0) {
          success && success(res.data);
        } else {
          fail && fail(res.data.msg);
        }
        return;
      },
      fail: function (res) {
        fail && fail("网络状况不佳,请稍后再试");
      },
      complete: function (res) {
        // wx.hideLoading();
        wx.hideNavigationBarLoading();
        complete && complete(res);
      }
    });
  },

  _ajaxjson: function (type, url, data, success, fail, complete) {
    wx.showNavigationBarLoading();
    let app = this;
    data == "" ? data = {} : data;
    // console.log(JSON.stringify(data));
    // data.userId = wx.getStorageSync('userId');
    wx.request({
      url: app.api_url + url,
      header: {
        'content-type': 'application/json',
      },
      dataType: "json",
      method: type,
      data: JSON.stringify(data),
      success: function (res) {
        if (res.statusCode === 200) {
          success && success(res.data);
        } else {
          fail && fail(res.data.msg);
        }
        return;
      },
      fail: function (res) {
        fail && fail("网络状况不佳,请稍后再试");
      },
      complete: function (res) {
        // wx.hideLoading();
        wx.hideNavigationBarLoading();
        complete && complete(res);
      }
    });
  },

  _ajaxtoken: function (type, url, data, success, fail, complete) {
    wx.showNavigationBarLoading();
    let app = this;
    data == "" ? data = {} : data;
    // data.userId = wx.getStorageSync('userId');
    wx.request({
      url: app.api_url + url,
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync("token")
      },
      method: type,
      data: data,
      success: function (res) {
        if (res.data.status === 0) {
          success && success(res.data);
        } else {
          fail && fail(res.data.msg);
        }
        return;
      },
      fail: function (res) {
        fail && fail("网络状况不佳,请稍后再试");

      },
      complete: function (res) {
        // wx.hideLoading();
        wx.hideNavigationBarLoading();
        complete && complete(res);
      }
    });
  },

  _ajaxjsontoken: function (type, url, data, success, fail, complete) {
    wx.showNavigationBarLoading();
    let app = this;
    data == "" ? data = {} : data;
    // console.log(JSON.stringify(data));
    // data.userId = wx.getStorageSync('userId');
    wx.request({
      url: app.api_url + url,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("token")
      },
      dataType: "json",
      method: type,
      data: JSON.stringify(data),
      success: function (res) {
        if (res.statusCode === 200) {
          success && success(res.data);
        } else {
          fail && fail(res.data.msg);
        }
        return;
      },
      fail: function (res) {
        fail && fail("网络状况不佳,请稍后再试");
      },
      complete: function (res) {
        // wx.hideLoading();
        wx.hideNavigationBarLoading();
        complete && complete(res);
      }
    });
  },

  globalData: {
    userInfo: null
  }
})