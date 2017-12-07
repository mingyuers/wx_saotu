var page = undefined;
Page({
  data: {
    guess_items: [
    ],
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

  refreshCheckBoxData: function (current_page) {
    var that = this
    var new_data = (that.data.imgData)[current_page]
    var new_guess_items = new_data.random_star
    new_guess_items.push(new_data.name)
    new_guess_items = [
      { name: new_guess_items[0], value: new_guess_items[0], checked: false },
      { name: new_guess_items[1], value: new_guess_items[1], checked: false },
      { name: new_guess_items[2], value: new_guess_items[2], checked: false },
      { name: new_guess_items[3], value: new_guess_items[3], checked: false }
    ]
    that.setData({
      guess_items: new_guess_items,
      current_name: new_data.name
    })
    console.log(that.data.guess_items)

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == this.data.current_name) {
      console.log('答对了');
      wx.showToast({
        title: '答对了',
      })
      var that = this
      that.setData({
        currentTab: that.data.currentTab + 1
      })
    }
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

var doommList = [];
var i = 0;
class Doomm {
  constructor(text, top, time, color) {
    console.log(top + '===' + time)
    this.text = text + i;
    this.top = 0;
    this.time = time;
    this.color = color;
    this.display = true;
    let that = this;
    this.id = i++;
    // setTimeout(function () {
    //   doommList.splice(doommList.indexOf(that), 1);
    //   page.setData({
    //     doommData: doommList
    //   })
    // }, this.time * 1000)
  }
}
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}