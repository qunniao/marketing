const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAvatarUrl:'',
    current: 0,
    productNum:1,
    navData: [{
        text: "首页", //文本
        current: 0,
        iconPath: '../../imgs/home.png',
        selectedIconPath: '../../imgs/home1.png',
      },
      {
        text: "分类", //文本
        current: 1,
        iconPath: '../../imgs/classfication.png',
        selectedIconPath: '../../imgs/classfication1.png',
      },
      {
        text: "购物车", //文本
        current: 2,
        iconPath: '../../imgs/shop1.png',
        selectedIconPath: '../../imgs/shop.png',
      },
      {
        text: "我的", //文本
        current: 3,
        iconPath: '../../imgs/mine.png',
        selectedIconPath: '../../imgs/mine1.png',
      }
    ],
    // 首页轮播图
    imgUrls: [
      '../../imgs/lunbo.jpg',
      '../../imgs/lunbo2.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 6000,
    duration: 1000,
    circular: true,
    num: 2,
    arr: [],
    size:1,
    sort:'../../imgs/shangjiantou.png',
    sort1:'../../imgs/shangjiantou.png',
    sort2: '../../imgs/shangjiantou.png',
    sort3: '../../imgs/shangjiantou.png',
    hasList: false, //购物车是否有数据
    length:0,
    totalCount:0,
    totalMoney: 0, //总金额
    selectAllStatus: false, //是否全选
    carts: [],
    cid:[],
    adminShow:true,
    //用户个人信息
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    },
    background: "/imgs/mineHeader.png",
    productTypes:[],//商品分类
    product:[],//首页商品分类
    recommend:[],
    showModalStatus: false,
    gnum: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled' ,
    sizea:0,
    scrollTop: 0
  },

  //控制回到顶部按钮的显示与消失
  onPageScroll: function (t) {
    var a = this;
    //console.log(t.scrollTop)
    a.setData({
      scrollTop: t.scrollTop
    })
  },

  swiperNav: function(event) {
    var that = this;
    that.setData({　　
      sizea: event.currentTarget.dataset.sizea
    })
    if (that.data.sizea == 0) {
      wx.request({
        url: app.api_url + '/products/list',
        data: {
          current: 1,
          size: 20
        },
        success(res) {
          that.setData({
            product: res.data.data.records
          })
        }
      })
    } else {
      wx.request({
        url: app.api_url + '/products/list',
        data: {
          current: 1,
          size: 20,
          typeId: that.data.sizea,
        },
        success(res) {
          that.setData({
            product: res.data.data.records
          })
        }
      })
    }
  },

  powerDrawer: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    that.util(currentStatu)
    wx.request({
      url: app.api_url +'/products/info',
      data:{
        pid: e.currentTarget.dataset.bzd
      },
      success(res){
        that.setData({
          tupian:res.data.data.cover,
          mingzi:res.data.data.title,
          jiaqian:res.data.data.price,
          addCardId:res.data.data.pid
        })
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

  /* 点击减号 */
  bindMinusa: function () {
    var gnum = this.data.gnum;
    // 如果大于1时，才可以减  
    if (gnum > 1) {
      gnum--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = gnum <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      gnum: gnum,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlusa: function () {
    var gnum = this.data.gnum;
    // 不作过多考虑自增1  
    gnum++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = gnum < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      gnum: gnum,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var gnum = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      gnum: gnum
    });
  } ,

  //首页加入购物车
  addCard:function(){
    var that = this;
    if (wx.getStorageSync('userId') == null || wx.getStorageSync('userId')==undefined){
      console.log("首页加入购物车，没登录，去登录");
      that.bindGetUserInfo();
      wx.showToast({
        title: '正在登录',
        icon: 'none'
      })
      return;
    }
    //调用登录接口
   
    var addCart = { 'userId': wx.getStorageSync('userId'),'productId': that.data.addCardId, 'productName': that.data.mingzi, 'productPrice': that.data.jiaqian,'productNum':that.data.gnum}
    app._ajaxjsontoken(
      'post',
      '/carts/insertOrUpdate',
      addCart,
      (data) => {
        if(data.code == 200){
          wx.showToast({
            title: '加入购物车成功',
          })
          setTimeout(function () {
            that.setData({
                showModalStatus: false
              });
          }, 1000);
        } else if(data.code == 410013){
          wx.showToast({
            title: '超过库存',
            icon:'none'
          })
        }
      }
    )
               
  
  },


  //完成编辑
  wcxg: function (e) {
    this.setData({
      adminShow: !this.data.adminShow,
    });
  },

  //云库存
  userCloudProduct: function () {
    wx.navigateTo({
      url: '/pagesA/userCloudProduct/userCloudProduct',
    })
  },

  //帮助中心
  helpPage: function () {
    wx.navigateTo({
      url: '/pagesA/helpPage/helpPage',
    })
  },

  //设置
  shezhi:function(){
    wx.navigateTo({
      url: '/pagesA/setUp/shezhi',
    })
  },

  //跳转搜索页面
  search:function(){
    wx.navigateTo({
      url: '/pagesA/search/search',
    })
  },

  //钱包
  wallet:function(){
    wx.navigateTo({
      url: '/pagesA/wallet/wallet',
    })
  },

  //佣金
  commission:function(){
    wx.navigateTo({
      url: '/pagesA/commission/commission',
    })
  },

  //我的订单
  goOrder:function(){
    wx.navigateTo({
      url: '/pagesA/order/order',
    })
  },

  //切换tabbar
  tabbar: function(e) {
    var _this = this;
    this.setData({
      current: e.currentTarget.dataset.current,
    })
    if(_this.data.current == 0){
      wx.setNavigationBarTitle({
        title: '全民分销'
      })
    } else if (_this.data.current == 1){
      wx.setNavigationBarTitle({
        title: '全部商品'
      })
    } else if (_this.data.current == 2) {
      wx.setNavigationBarTitle({
        title: '购物车'
      })
      console.log("购物车页面");
      //获取购物车
      _this.getCartList();
    } else if (_this.data.current == 3) {
      wx.setNavigationBarTitle({
        title: '个人中心'
      })
    }
  },

  changeOil: function(e) {
    this.setData({
      num: e.target.dataset.num
    })
  },

  changeOila: function (e) {
    var that = this;
    that.setData({
      size: e.currentTarget.dataset.size,
      sort1: '../../imgs/shangjiantou.png',
      sort: '../../imgs/shangjiantou.png',
      sort2: '../../imgs/shangjiantou.png',
      sort3: '../../imgs/shangjiantou.png'
    })
    if(that.data.size == 1){
      wx.request({
        url: app.api_url +'/products/list',
        data:{
          current:1,
          size:20
        },
        success(res){
          that.setData({
            product:res.data.data.records
          })
        }
      })
    } else {
      wx.request({
        url: app.api_url + '/products/list',
        data: {
          current: 1,
          size: 20,
          typeId:that.data.size
        },
        success(res) {
          that.setData({
            product: res.data.data.records
          })
        }
      })
    }
  },

  // 按价格排序
  jiage:function(){
    var that = this;
    if (that.data.sort == '../../imgs/shangjiantou.png'){
      that.setData({
        sort: '../../imgs/shangjiantou1.png',
        sort1: '../../imgs/shangjiantou.png',
        sort2: '../../imgs/shangjiantou.png',
        sort3: '../../imgs/shangjiantou.png',
      })
      if(that.data.size == 1){
        wx.request({
          url: app.api_url + '/products/list',
          data: {
            current: 1,
            size: 20,
            sortType: 1
          },
          success(res) {
            that.setData({
              product: res.data.data.records
            })
          }
        })
      } else {
        wx.request({
          url: app.api_url + '/products/list',
          data: {
            current: 1,
            size: 20,
            typeId: that.data.size,
            sortType: 2
          },
          success(res) {
            that.setData({
              product: res.data.data.records
            })
          }
        })
      }
    } else if (that.data.sort == '../../imgs/shangjiantou1.png'){
      that.setData({
        sort1: '../../imgs/shangjiantou1.png',
        sort: '../../imgs/shangjiantou.png'
      })
      if (that.data.size == 1) {
        wx.request({
          url: app.api_url + '/products/list',
          data: {
            current: 1,
            size: 20,
            sortType: 2
          },
          success(res) {
            that.setData({
              product: res.data.data.records
            })
          }
        })
      } else {
        wx.request({
          url: app.api_url + '/products/list',
          data: {
            current: 1,
            size: 20,
            typeId: that.data.size,
            sortType: 1
          },
          success(res) {
            that.setData({
              product: res.data.data.records
            })
          }
        })
      }
    }
  },

  xiaoliang:function(){
    var that = this;
    if (that.data.sort2 == '../../imgs/shangjiantou.png') {
      that.setData({
        sort2: '../../imgs/shangjiantou1.png',
        sort3: '../../imgs/shangjiantou.png',
        sort: '../../imgs/shangjiantou.png',
        sort1: '../../imgs/shangjiantou.png'
      })
      if (that.data.size == 1) {
        wx.request({
          url: app.api_url + '/products/list',
          data: {
            current: 1,
            size: 20,
            sortType: 3
          },
          success(res) {
            that.setData({
              product: res.data.data.records
            })
          }
        })
      } else {
        wx.request({
          url: app.api_url + '/products/list',
          data: {
            current: 1,
            size: 20,
            typeId: that.data.size,
            sortType: 3
          },
          success(res) {
            that.setData({
              product: res.data.data.records
            })
          }
        })
      }
    } else if (that.data.sort2 == '../../imgs/shangjiantou1.png') {
      that.setData({
        sort3: '../../imgs/shangjiantou1.png',
        sort2: '../../imgs/shangjiantou.png'
      })
      if (that.data.size == 1) {
        wx.request({
          url: app.api_url + '/products/list',
          data: {
            current: 1,
            size: 20,
            sortType: 4
          },
          success(res) {
            that.setData({
              product: res.data.data.records
            })
          }
        })
      } else {
        wx.request({
          url: app.api_url + '/products/list',
          data: {
            current: 1,
            size: 20,
            typeId: that.data.size,
            sortType: 4
          },
          success(res) {
            that.setData({
              product: res.data.data.records
            })
          }
        })
      }
    }
  },

  //按默认排序商品
  moren:function(){
    var that = this;
    that.setData({
      sort: '../../imgs/shangjiantou.png',
      sort1: '../../imgs/shangjiantou.png',
      sort3: '../../imgs/shangjiantou.png',
      sort2: '../../imgs/shangjiantou.png'
    })
    if(that.data.size != 1){
      wx.request({
        url: app.api_url + '/products/list',
        data: {
          current: 1,
          size: 20,
          typeId: that.data.size
        },
        success(res) {
          that.setData({
            product: res.data.data.records
          })
        }
      })
    } else {
      wx.request({
        url: app.api_url + '/products/list',
        data: {
          current: 1,
          size: 20,
        },
        success(res) {
          that.setData({
            product: res.data.data.records
          })
        }
      })
    }
  },

  lockInviter: function () {
    console.log("userId:" + wx.getStorageSync('userId') + " shareId:" + wx.getStorageSync('shareId'));
    if (wx.getStorageSync('userId') == null || wx.getStorageSync('userId') == undefined) {
      console.log("还没登录");
      return;
    }
    if (wx.getStorageSync('shareId') == null || wx.getStorageSync('shareId') == undefined || wx.getStorageSync('shareId') == '') {
      console.log("没有邀请人");
      return;
    }
    //锁定邀请人
    var parmsDto = { 'id': wx.getStorageSync('userId'), 'inviterId': wx.getStorageSync('shareId') }
    app._ajaxtoken(
      'post',
      '/users/lockInviter',
      parmsDto,
      (data) => {
        console.log("锁定邀请人返回");
        console.log(data);
      }
    )

  },

  //登录
  bindGetUserInfo: function () {
    var _this = this;
    //调用登录接口
    wx.login({
      success: function (res_login) {
        //console.log("登录:");
        //console.log(res_login);
        if (res_login.code) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res_login.code)
              wx.request({
                url:app.api_url+'/login/wxLogin',
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                data: {
                  code: res_login.code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  inviterId: wx.getStorageSync('shareId')
                },
                success: res => {
                  console.log("微信登录返回 token:" + res.data.data.token + " userId:" + res.data.data.user.id);
                  wx.hideLoading();
                  wx.setStorageSync("token", res.data.data.token);
                  wx.setStorageSync('userId', res.data.data.user.id);
                  _this.lockInviter();
                }
              })
            },
            fail: function () {

            },
            
          })

        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("options.current:" + options.current);
    const scene = decodeURIComponent(options.scene);
    console.log("scene:" + scene);
    if (scene != undefined && scene !="undefined"){
      //扫产品二维码进来的
      wx.navigateTo({
        url: '/pagesA/details/details?' + scene,
      })
      
    }
    var that = this;
    let base64 = wx.getFileSystemManager().readFileSync(that.data.background, 'base64');
    that.setData({
      background: 'data:image/png;base64,' + base64
    })
    if(options.current!=undefined){
      that.setData({
        current:2
      })
      that.getCartList();
    }

    //登录
    that.bindGetUserInfo();

    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        console.log('成功了');
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      },
      fail: function () {
        console.log("失败了")
      }
    })
    //获取商品分类
    wx.request({
      url: app.api_url + '/productTypes/list',
      success(res){
        that.setData({
          productTypes:res.data.data,
          arr:res.data.data
        })
      }
    })
    //获取首页商品列表
    wx.request({
      url: app.api_url + '/products/list',
      data:{
        current:1,
        size:20
      },
      success(res) {
        that.setData({
          product: res.data.data.records
        })
      }
    })
    //获取推荐商品
    wx.request({
      url: app.api_url +'/products/recommend',
      success(res){
        that.setData({
          recommend:res.data.data
        })
      }
    })
    //获取轮播图
    wx.request({
      url: app.api_url + '/banners/list',
      success(res) {
        console.log("获取轮播图返回");
        console.log(res);
        that.setData({
          imgUrls: res.data.data
        })
      }
    })
    
  },
  

  //获取购物车列表
  getCartList: function () {
    var that = this;
    wx.request({
      url: app.api_url + '/carts/page',
      data: {
        current: 1,
        size: 50,
        userId: wx.getStorageSync("userId")
      },
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync('token')
      },
      success(res) {
        that.setData({
          carts: res.data.data.records,
          length: res.data.data.records.length,
        })
        if (res.data.data.records.length>0){
          that.setData({
            hasList: true
          })
        }else{
          that.setData({
            hasList: false
          })
        }
      }
    })
  },

  //轮播图点击跳转
  bindLunBo: function (event) {
    var id = event.currentTarget.dataset.id;
    var pid = event.currentTarget.dataset.pid;
    if(pid>0){
      //有产品id,跳转到产品详情页
      wx.navigateTo({
        url: '/pagesA/details/details?pid=' + pid,
      })
    }else{

    }
    
  },

  //跳转商品详情
  goDetails: function (event){
    var pid = event.currentTarget.dataset.pid
    wx.navigateTo({
      url: '/pagesA/details/details?pid='+pid,
    })
  },

  adminTap: function () {
    this.setData({
      adminShow: !this.data.adminShow,
    });
  },

  //设置文本框值
  bindIptCartNum: function (e) {

    const index = e.currentTarget.dataset.index;
    var productNum = e.detail.value;
    let carts = this.data.carts;
    carts[index].productNum = productNum;

    wx.request({
      url: app.api_url + '/carts/changeProductNum',
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync("token")
      },
      method: 'post',
      data: {
        cid: e.target.dataset.cartpid,
        num: productNum
      },
      success(res) {
        console.log(32)
      }
    })
    this.setData({
      carts: carts
    });
  },

  /* 点击减号 */
  bindMinus: function (e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let productNum = carts[index].productNum;
    if (productNum <= 1) {
      return false;
    }
    productNum = productNum - 1;
    carts[index].productNum = productNum;
    this.setData({
      carts: carts
    });
    wx.request({
      url: app.api_url + '/carts/changeProductNum',
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync("token")
      },
      method: 'post',
      data: {
        cid: e.target.dataset.cartpid,
        num: productNum
      },
      success(res) {
        console.log(32)
      }
    })
    this.getTotalPrice();
  },

  /* 点击加号 */
  bindPlus: function (e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let productNum = carts[index].productNum;
    productNum ++;
    carts[index].productNum = productNum;
    console.log(productNum)
    this.setData({
      carts: carts
    });
    wx.request({
      url: app.api_url + '/carts/changeProductNum',
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'token': wx.getStorageSync("token")
      },
      method:'post',
      data:{
        cid: e.target.dataset.cartpid,
        num: productNum
      },
      success(res){
        console.log(32)
      }
    })
    this.getTotalPrice();
  },

  //删除商品
  bindCartsDel(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要删除吗？',
      success: function (res) {

        if (res.confirm) {
          //网络请求删除购物车数据
        }
      }
    })
  },

  //计算总价
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    var totalCount = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].isSelect) { // 判断选中才会计算价格
        total += carts[i].productNum * carts[i].productPrice; // 所有价格加起来
        totalCount += Number(carts[i].productNum);
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalCount: totalCount,
      totalMoney: total.toFixed(2)
    });
  },

  //绑定单选
  bindCheckbox: function (e) {
    var that = this;
    var cid = e.currentTarget.dataset.cartpid
    let str = true; //用str与每一项进行状态判断
    let selectAllStatus = that.data.selectAllStatus; //是否已经全选
    const idx = e.currentTarget.dataset.index;
    let carts = that.data.carts;
    const isSelect1 = carts[idx].isSelect;
    carts[idx].isSelect = !isSelect1;
    that.setData({
      carts: carts
    });
    for (var i = 0; i < carts.length; i++) {
      str = str && carts[i].isSelect; //用str与每一项进行状态判断
    }

    if (carts[idx].isSelect){
      this.data.cid.push(cid);
    } else {
      this.data.cid.splice(idx, 1)
    }

    if (str === true) {
      that.setData({
        selectAllStatus: true
      })
    } else {
      that.setData({
        selectAllStatus: false
      })
    };
    that.getTotalPrice();
  },


  //绑定多选
  bindSelectAll: function (e) {
    var that = this;
    let selectedAllStatus = that.data.selectAllStatus;
    let carts = that.data.carts;
    selectedAllStatus = !selectedAllStatus;
    for (var i = 0; i < carts.length; i++) {
      carts[i].isSelect = selectedAllStatus;
      that.data.cid.push(carts[i].id)
    }
    console.log(that.data.cid)

    that.setData({
      carts: carts,
      selectAllStatus: selectedAllStatus
    });
    that.getTotalPrice();
  },

  //购物车结算
  bindjiesuan: function () {
    var that = this;
    let carts = that.data.carts;
    let jscart = [];
    var j = 0
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].isSelect) {
        jscart[j] = carts[i];
        j++;
      }
    }
    if (jscart.length <= 0) {
      wx.showToast({
        title: '未选择商品',
        icon: 'success',
        duration: 1000
      })
      return;
    }
    wx.setStorageSync('jscart', jscart); //存入缓存
    //转到结算页面
    // wx.request({
    //   url: app.api_url + '/carts/info?cIds='+that.data.cid,
    //   header: {
    //     'Content-Type': "application/x-www-form-urlencoded",
    //     'token': wx.getStorageSync("token")
    //   },
    //   success(res){
    //     if (res.data.code == 200) {
    //       wx.navigateTo({
    //         url: '/pagesA/confirmation/confirmation?cIds='+that.data.cid
    //       });
    //     }
    //   }
    // })
    var path = '/pagesA/confirmation/confirmation?cIds=' + that.data.cid + '&type=gwc';
    wx.setStorageSync("confirmPath", path);
    wx.navigateTo({
      url: path
    });

  },

  queding:function(){
    wx.navigateTo({
      url: '/pagesA/order/order?type=1',
    })
  },
  fukuan: function () {
    wx.navigateTo({
      url: '/pagesA/order/order?type=2',
    })
  },
  fahuo: function () {
    wx.navigateTo({
      url: '/pagesA/order/order?type=3',
    })
  },
  shouhuo: function () {
    wx.navigateTo({
      url: '/pagesA/order/order?type=4',
    })
  },
  shouhou: function () {
    wx.navigateTo({
      url: '/pagesA/order/order?type=5',
    })
  },

  bindshanchu:function(){
    var that = this;
    console.log(that.data.cid)
    wx.showModal({
      title: '确定要删除购物车吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api_url + '/carts/delete?cids=' + that.data.cid,
            method: 'delete',
            header: {
              'Content-Type': "application/x-www-form-urlencoded",
              'token': wx.getStorageSync("token")
            },
            success: function (data) {
              if (data.data.code == 200) {
                wx.showToast({
                  title: '删除成功',
                })
                that.getCartList();
              }
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})