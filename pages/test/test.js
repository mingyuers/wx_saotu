var page = undefined;
Page({
  data: {
    imgData: [
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 100,
    circular: true,
    current_name: '',
    currentTab: 0,
    shareData: {
      title: 'ins照片墙',
      desc: 'ins照片墙',
      path: '/pages/test/test'
    },
    doommData: []
  },
  onLoad: function () {
    page = this;
    this.add_one_data()
  },
  changeEvent: function (e) {
    var current_page = e.detail.current + 1;
    var totle_page = this.data.imgData.length;
    console.log(current_page + "```" + totle_page)
    if ((totle_page - current_page) <= 5) {
      this.add_one_data()
    }
    this.refreshCheckBoxData(current_page)
  },

  add_one_data: function () {
    var that = this
    var old_data = that.data.imgData
    wx.request({
      url: 'https://api.betteridea.cn/wximg/',
      success: function (res) {
        var new_data = old_data.concat(res.data.data)
        //        console.log(new_data);
        that.setData({
          imgData: new_data,
        })
        that.refreshCheckBoxData(0)
      }
    })
    //    console.log(old_data)
  },
  previewImage: function (e) {
    console.log(e)
    //var that = this
    var url = this.data.imgData[this.data.currentTab].imgurl
    wx.previewImage({
      current: url, // 当前显示图片的http链接  
      urls: [url] // 需要预览的图片http链接列表  
    })
  },
  onShareAppMessage: function () {
    return this.data.shareData
  },
  bindbt: function () {
    console.log(this.data.doommData);
    doommList.push(new Doomm("你是我的小苹果", Math.ceil(Math.random() * 200), Math.ceil(Math.random() * 5 + 5), getRandomColor()));
    this.setData({
      doommData: doommList
    })
  },
})
