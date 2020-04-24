const app = getApp()
Page({
  data: {
    // 列表数据
    list: [
      { time: "2019-01-15 08:43:21", ftime: "2019-01-15 08:43:21", context: "[潍坊市]代签收(圆通快递 ),感谢使用顺丰,期待再次为您服务", display: 0 },
      { time: "2019-01-15 07:41:10", ftime: "2019-01-15 07:41:10", context: "[潍坊市]快件交给安同振，正在派送途中（联系电话：18369680172）", display: 1 },
      { time: "2019-01-15 07:00:24", ftime: "2019-01-15 07:00:24", context: "快件到达 【潍坊市奎文区万达广场营业点】", display: 1 },
      { time: "2019-01-15 05:57:10", ftime: "2019-01-15 05:57:10", context: "[潍坊市]快件已发车", display: 1 },
      { time: "2019-01-15 01:55:44", ftime: "2019-01-15 01:55:44", context: "快件在【潍坊宝通集散中心】已装车,准备发往 【潍坊市奎文区万达广场营业点】", display: 1 },
      { time: "2019-01-14 19:52:05", ftime: "2019-01-14 19:52:05", context: "[潍坊市]快件到达 【潍坊宝通集散中心】", display: 1 },
      { time: "2019-01-14 14:57:40", ftime: "2019-01-14 14:57:40", context: "[连云港]快件已发车", display: 1 },
      { time: "2019-01-14 09:44:55", ftime: "2019-01-14 09:44:55", context: "快件在【连云港海州集散中心】已装车,准备发往 【潍坊宝通集散中心】", display: 1 },
      { time: "2019-01-14 09:24:07", ftime: "2019-01-14 09:24:07", context: "快件到达 【连云港海州集散中心】", display: 1 },
      { time: "2019-01-14 00:24:21", ftime: "2019-01-14 00:24:21", context: "[常州市]快件已发车", display: 1 },
      { time: "2019-01-13 23:59:14", ftime: "2019-01-13 23:59:14", context: "[常州市]快件在【常州横山桥集散中心】已装车,准备发往 【连云港海州集散中心】", display: 1 },
      { time: "2019-01-13 21:05:56", ftime: "2019-01-13 21:05:56", context: "[常州市]快件到达 【常州横山桥集散中心】", display: 1 },
      { time: "2019-01-13 20:39:47", ftime: "2019-01-13 20:39:47", context: "[常州市]快件已发车", display: 1 },
      { time: "2019-01-13 20:01:08", ftime: "2019-01-13 20:01:08", context: "[常州市]快件在【常州武进天安营业部】已装车,准备发往 【常州横山桥集散中心】", display: 1 },
      { time: "2019-01-13 17:13:21", ftime: "2019-01-13 17:13:21", context: "[常州市]顺丰速运 已收取快件", display: 1 }
  
    ],
    hasData:true,
    traceModal:'',
    modal:'',
    orderProductList:'',
    cover:''

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log("onload id:"+options.id);
    var that = this;
    wx.request({
      url: app.api_url + '/orderLogistic/info/' + options.id,
      success(res) {
        console.log(res);
    
        var obj_trace = JSON.parse(res.data.data.logisticTrace);
        var list = obj_trace.Traces;
         console.log("物流obj_trace");
         console.log(obj_trace);
        console.log(list);
         var tra = [];
        for (var i = list.length-1; i >0;i--){
          tra.push(list[i]);
        }

        that.setData({
          traceModal: obj_trace,
          modal: res.data.data,
          orderProductList: res.data.data.orderProductList,
          list: tra,
          cover: res.data.data.orderProductList[0].cover
        })
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
