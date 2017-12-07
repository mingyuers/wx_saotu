//index.js
//获取应用实例
var app = getApp()
Page({
  data: {

  },
  //事件处理函数
  bindViewTap: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.request({
      url: 'https://api.betteridea.cn/wximg/',
      success: function (res) {
        console.log(res)
        that.setData(res.data)
      }
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    that.setData({
      'data': {
        'imgurl': 'http://ou43h7cjd.bkt.clouddn.com/chenqiaoen/10724199_1805060006417552_3111482555006713856_n.jpg',
        'name': '陈乔恩'
      }
    })
  }
})
