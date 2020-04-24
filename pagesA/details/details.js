// pagesA/details/details.js
const app = getApp()
const promisify = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    autoplay:false,
    length:0,
    swiperCurrent:1,
    price:"",
    title:'',
    display:'block',
    num: 1,
    cid:[],
    gou:[],
    shopLength:0,//购物车数量
    detailMobile:'',
    hasVideo: false,
    showModalStatus: false,
    showModalStatus2: false,
    retailFreightId:'',
    productIntroShow:false,
    isIPX: app.globalData.isIPX,
    twoshow: false
  },  
  /*
  lockInviter: function(){
    if (wx.getStorageSync('userId') == null || wx.getStorageSync('userId')==undefined){
      console.log("还没登录");
      return;
    }
    if (wx.getStorageSync('shareId') == null || wx.getStorageSync('shareId') == undefined) {
      console.log("没有邀请人");
      return;
    }
    //锁定邀请人
    wx.request({
      url: app.api_url + '/users/lockInviter',
      data: {
        id: wx.getStorageSync('userId'),
        inviterId: wx.getStorageSync('shareId')
      },
      success(res) {
        console.log("锁定邀请人返回");
        console.log(res);
        
      }
    })

  },
  */
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
    //调用登录接口
    wx.login({
      success: function (res_login) {
        if (res_login.code) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res_login.code)
              wx.request({
                url: app.api_url + '/login/wxLogin',
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                data: {
                  code: res_login.code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  inviterId: wx.getStorageSync('shareId')
                },
                success: res => {
                  wx.hideLoading();
                  wx.setStorageSync('userId', res.data.data.user.id)
                  wx.setStorageSync('token', res.data.data.token)
                  lockInviter();
                }
              })
            },
            fail: function () {

            }
          })

        }
      }
    })
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

  /* 加数 */
  addCount: function (e) {
    console.log("刚刚您点击了加1");
    var num = this.data.num;
    // 总数量-1  
    if (num < 1000) {
      this.data.num++;
    }
    // 将数值与状态写回  
    this.setData({
      num: this.data.num
    });
  },

  /* 减数 */
  delCount: function (e) {
    console.log("刚刚您点击了减1");
    var num = this.data.num;
    // 商品总数量-1
    if (num > 1) {
      this.data.num--;
    }
    // 将数值与状态写回  
    this.setData({
      num: this.data.num
    });
  },

  getCount: function (e) {
    var num = this.data.num;
    console.log(num);
    wx.showToast({
      title: "数量：" + num + "",
    })
  },

  //加入购物车
  submit:function(){
    var that = this;
    console.log(that.data.id+'--'+that.data.title+'--'+that.data.price+'--'+that.data.num)
    var cart = { 'productId': that.data.id, 'productName': that.data.title, 'productNum': that.data.num, 'productPrice': that.data.price, 'userId': wx.getStorageSync('userId'), 'shareId': wx.getStorageSync('shareId')}
    app._ajaxjsontoken(
      'post',
      '/carts/insertOrUpdate',
      cart,
      (data)=>{
        if (data.code == 200) {
          wx.showToast({
            title: '加入购物车成功',
          })
          setTimeout(function () {
            that.setData({
              showModalStatus: false
            });
          }, 1000);
        }
      }
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const scene = decodeURIComponent(options.scene);
    console.log("scene:"+scene);

    var that = this;
    that.setData({
      id: options.pid,
    })
    console.log("shareId1:" + options.shareId);
    if (options.shareId != undefined){
      wx.setStorageSync('shareId', options.shareId)
      console.log("shareId:" + options.shareId);
    }
    that.data.cid.push(options.pid)
    //获取商品详情
    wx.request({
      url: app.api_url +'/products/info',
      data:{
        pid:options.pid
      },
      success(res){
        var intro = false;
        if (res.data.data.productIntro != null && res.data.data.productIntro !=''){
          intro = true;
        }
        
        that.setData({
          movies: res.data.data.productImageList,
          id:res.data.data.pid,
          price:res.data.data.price,
          productIntro: res.data.data.productIntro,
          title:res.data.data.title,
          sales: res.data.data.sales,
          video: res.data.data.video,
          cover: res.data.data.cover,
          length: res.data.data.productImageList.length + 1,
          detailMobile: res.data.data.detailMobile,
          retailFreightId: res.data.data.retailFreightId,
          productIntroShow:intro
        })
        console.log('video:' + that.data.video);
        if (that.data.video != undefined && that.data.video != '') {
          that.setData({
            hasVideo: true,
            length: res.data.data.productImageList.length + 2
          })
          console.log('hasVideo:' + that.data.hasVideo);
        }
      }
    })

    //查询购物车
    wx.request({
      url: app.api_url + '/carts/page',
      data:{
        current:1,
        size:20,
        userId:wx.getStorageSync('userId')
      },
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync("token")
      },
      success:function(data){
        that.setData({
          shopLength:data.data.total
        })
      }
    })

    //获取产品二维码
    wx.request({
      url: app.api_url + '/products/getProductCodeImage',
      data: {
        pid: options.pid,
        userId: wx.getStorageSync("userId")
      },
      responseType: 'arraybuffer',
      success(res) {
        console.log("获取二维码接口返回：");
        console.log(res);
       
        var src = wx.arrayBufferToBase64(res.data)
        that.setData({
          src: src
        })
      }
    })


  },

  
  //轮播图的切换事件  
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current+1   //获取当前轮播图片的下标
    })
  },

  //登录
  confirmation: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util2(currentStatu)
    var _this = this;
    //调用登录接口
    wx.login({
      success: function (res_login) {
        if (res_login.code) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res_login.code)
              wx.request({
                url: app.api_url + '/login/wxLogin',
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                data: {
                  code: res_login.code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  inviterId: wx.getStorageSync('shareId')
                },
                success: res => {   
                  wx.hideLoading();
                  wx.setStorageSync('userId', res.data.data.user.id)
                  wx.setStorageSync('token', res.data.data.token)

                }
              })
            },
            fail: function () {

            }
          })

        }
      }
    })
  },

  //立即购买
  confirmationSubmit: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        showModalStatus: false
      });
    }, 1000);
    if (wx.getStorageSync("userId") == null || wx.getStorageSync("userId") == undefined){
      console.log("没有登录");
      _this.confirmation();
    }
   

    var orderde = { 'productId': _this.data.id, 'productName': _this.data.title, 'cover': _this.data.cover, 'productPrice': _this.data.price, 'productNum': this.data.num, 'retailFreightId': _this.data.retailFreightId }
    _this.data.gou = [];
    _this.data.gou.push(orderde)
    var path = '/pagesA/confirmation/confirmation?cIds=' + _this.data.cid + '&type=det&orderde=' + JSON.stringify(_this.data.gou);
    wx.setStorageSync("confirmPath",path);

    _this.setData(
      {
        showModalStatus: false,
        showModalStatus2: false
      }
    );

    wx.navigateTo({
      url: path
    })

 
  },

  gouwuche:function(){
    //调用登录接口
    wx.login({
      success: function (res_login) {
        if (res_login.code) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res_login.code)
              wx.request({
                url: app.api_url + '/login/wxLogin',
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                data: {
                  code: res_login.code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  inviterId: wx.getStorageSync('shareId')
                },
                success: res => {

                  wx.hideLoading();
                  wx.setStorageSync('userId', res.data.data.user.id)
                  wx.setStorageSync('token', res.data.data.token)
                  wx.navigateTo({
                    url: '/pages/index/index?current=2',
                  })
                }
              })
            },
            fail: function () {

            }
          })

        }
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
  onShow: function (options) {
    
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
   * 用户点击右上角分享-新
   */
  share: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.qwe(currentStatu)
    this.getuserpica()
    this.setData({
      asd: true
    })
  },
  qwe: function (currentStatu) {
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
      shareData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        shareData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData(
          {
            showShareStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData(
        {
          showShareStatus: true
        }
      );
    }
  },
  //获取分享给好友的图片
  getuserpica: function () {
    var _this = this;
    const ctx = wx.createCanvasContext('shareCanvasa')
    ctx.save()
    ctx.beginPath()
  },
  //获取保存的图片
  getuserpic: function () {
    var _this = this;
    wx.getUserInfo({
      success: res => {
       // console.log("getuserpic 获取用户信息");
        //console.log(res);
        var avatarUrl = res.userInfo.avatarUrl;
        var nickName = res.userInfo.nickName;
       // console.log("getuserpic 获取用户信息 avatarUrl:" + avatarUrl + " nickName:" + nickName);
        let rpx = 1;
        wx.getSystemInfo({
          success(res) {
            rpx = res.windowWidth / 375;
          },
        })
        const wxGetImageInfo = promisify.promisify(wx.getImageInfo)
        var fsm = wx.getFileSystemManager()
        var FILE_BASE_NAME = 'tmp_base64src'
        var format = 'png'
        var buffer = wx.base64ToArrayBuffer(_this.data.src)
        var filePath = `${wx.env.USER_DATA_PATH}/www.${format}`
       // console.log("buffer:" + buffer);
       
        fsm.writeFile({ //写文件
          filePath,
          data: buffer,
          encoding: 'binary',
          success(res) {
           // console.log("getuserpic filePath:" + filePath);
            wx.getImageInfo({ //读取图片
              src: filePath,
              success: function (res) {
                ctx.drawImage(res.path, 215 * rpx, 390 * rpx, 90 * rpx, 90 * rpx) //画图
              },
              error(res) {
               // console.log("shibaile")
              }
            })

            var avatarurl_width = 50;    //绘制的头像宽度
            var avatarurl_heigth = 50;   //绘制的头像高度
            var avatarurl_x = 20;   //绘制的头像在画布上的位置
            var avatarurl_y = 20;   //绘制的头像在画布上的位置

            wx.getImageInfo({ //读取图片-头像昵称
              src: avatarUrl,
              success: function (res) {
                //console.log("getuserpic 读取图片-头像昵称:" + res.path);
                ctx.save();
                //先画个圆
                ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.clip();//画了圆 再剪切
                ctx.drawImage(res.path, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth) //画图
                ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
                
              },
              error(res) {
                //console.log("shibaile")
              }
            })

           
            wx.getImageInfo({ //读取图片
              src: _this.data.cover.trim(),
              success: function (res) {
                //console.log("getuserpic 读取图片-产品图片:" + res.path);
                _this.setData({
                  realpath: res.path
                })
      
                ctx.drawImage(_this.data.realpath, 18 * rpx, 85 * rpx, 288 * rpx, 250 * rpx) //画图
                ctx.draw()
              },
              error(res) {
                //console.log("shibaile")
              }
            })
            

          }
        })
        
        const ctx = wx.createCanvasContext('shareCanvas')
        
        ctx.drawImage("../../imgs/iiiii.jpg")
       // ctx.drawImage(avatarUrl, 20 * rpx, 20 * rpx, 60 * rpx, 60 * rpx) //画图-头像昵称
        ctx.setFillStyle("#333")
        ctx.font = 'normal bold 12px sans-serif';
        ctx.fillText(nickName, 90 * rpx, 35 * rpx)

        ctx.font = 'normal bold 18px sans-serif';
        ctx.fillText("推荐给你一个好物", 90 * rpx, 60 * rpx)

        ctx.setFillStyle("red")
        ctx.font = 'normal bold 20px sans-serif';
        ctx.fillText("￥", 20 * rpx, 380 * rpx)
        ctx.setFillStyle("red")
        ctx.font = 'normal bold 26px sans-serif';
        ctx.fillText(_this.data.price, 45 * rpx, 380 * rpx)
        ctx.setFillStyle("#333")
        ctx.font = 'normal 16px sans-serif';
        ctx.fillText(_this.data.title, 20 * rpx, 430 * rpx)
        ctx.font = 'normal  11px sans-serif';
        ctx.setFillStyle('#808080')
       // _this.drawText(ctx, _this.data.productIntro, 20 * rpx, 450 * rpx, 10 * rpx, 170 * rpx)
        ctx.fillText("长按扫码去购买", 200 * rpx, 500 * rpx)
        ctx.stroke()

      },
      fail(res) {
        console.log("失败")
      }
    })
  },
  save: function () {
    let _this = this;
    const wxCanvasToTempFilePath = promisify.promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = promisify.promisify(wx.saveImageToPhotosAlbum)
    wxCanvasToTempFilePath({
      canvasId: 'shareCanvas'
    }, this).then(res => {
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: function (data) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '您的推广二维码已存入手机相册，赶快分享给好友吧',
            showCancel: false,
          })
          _this.setData({
            twoshow: false
          })
        },
        fail: function (err) {
          if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
            wx.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              showCancel: false,
              success: modalSuccess => {
                wx.openSetting({
                  success(settingdata) {
                    //console.log("settingdata", settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限成功,再次点击图片即可保存',
                        showCancel: false,
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限失败，将无法保存到相册哦~',
                        showCancel: false,
                      })
                    }
                  },
                  fail(failData) {
                    console.log("failData", failData)
                  },
                  complete(finishData) {
                    console.log("finishData", finishData)
                  }
                })
              }
            })
          }
        },
        complete(res) {
          wx.hideLoading()
        }
      })
    }).then(res => {
      // wx.showToast({
      //   title: '已保存到相册'
      // })
      // this.setData({
      //   twoshow: false
      // })
    })
  },
  ewshow: function () {
    this.getuserpic()
    this.setData({
      twoshow: true,
      showShareStatus: false
    })
  },
  ewhiden: function () {
    this.setData({
      twoshow: false
    })
  },
  roundRect(ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    ctx.setFillStyle('transparent')
    // ctx.setStrokeStyle('transparent')
    // 绘制左上角圆弧
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // 绘制border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 绘制右上角圆弧
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // 绘制border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 绘制右下角圆弧
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // 绘制border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 绘制左下角圆弧
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // 绘制border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
  },
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 16; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 50;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
    }
    else {
      console.log("来自右上角转发菜单")
    }
    console.log("shareId:" + wx.getStorageSync("userId"));
    return {
      title: that.data.title,
      path: '/pagesA/details/details?pid=' + that.data.id +'&shareId='+wx.getStorageSync("userId"),
      imageUrl: that.data.cover,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})