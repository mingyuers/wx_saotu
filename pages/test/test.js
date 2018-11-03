var page = undefined;
Page({
  data: {
    imgData: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 100,
    circular: true,
    current_name: '',
    currentTab: 0,
    shareData: {
      title: '[有人@我]快来欣赏Instagram美图啦',
      desc: 'ins照片墙',
      path: '/pages/test/test'
    },
  },
  onLoad: function() {
    page = this;
    this.add_one_data();
    this.showTips();
  },
  changeEvent: function(e) {
    var current_page = e.detail.current + 1;
    var totle_page = this.data.imgData.length;
    console.log(current_page + "-" + totle_page)
    if ((totle_page - current_page) <= 5) {
      this.add_one_data()
    }
    this.setData({
      currentTab: e.detail.current
    })
  },

  add_one_data: function() {
    var that = this
    var old_data = that.data.imgData
    wx.request({
      url: 'https://api.betteridea.cn/wximg/',
      success: function(res) {
        var new_data = old_data.concat(res.data.data)
        //        console.log(new_data);
        that.setData({
          imgData: new_data,
        })
      }
    })
    //    console.log(old_data)
  },
  previewImage: function(e) {
    console.log(e)
    //var that = this
    var url = this.data.imgData[this.data.currentTab].imgurl
    wx.previewImage({
      current: url, // 当前显示图片的http链接  
      urls: [url] // 需要预览的图片http链接列表  
    })
  },
  closeTips: function(e) {
    this.setData({
      shouldShowTips: false
    })
  },
  onShareAppMessage: function() {
    return this.data.shareData
  },
  saveImg: function(e) {
    wx.showLoading({
      title: '正在保存...'
    })
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.doSave()
            },
            fail() {
              wx.hideLoading()
              wx.showToast({
                title: '保存失败，无权限',
                duration: 2000
              })
            }
          })
        } else {
          that.doSave()
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '保存失败',
          duration: 2000
        })
      }
    });
  },

  doSave: function() {
    wx.showLoading({
      title: '正在保存...'
    })
    var imgurl = this.data.imgData[this.data.currentTab].imgurl
    wx.downloadFile({
      url: imgurl,
      success: function(res) {
        let path = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            console.log(res)
            wx.hideLoading()
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
          },
          fail(res) {
            console.log(res)
            wx.hideLoading()
            wx.showToast({
              title: '保存失败',
              duration: 2000
            })
          },
          complete(res) {
            console.log(res)
          }
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  showTips: function() {
    var shouldShowTips = false;
    var now = Math.round(new Date().getTime());
    var nextTips = wx.getStorageSync('nextTips');
    console.log('nextTips:' + nextTips);
    //提示间隔时间15天
    var dtime = 15 * 24 * 3600 * 1000;
    if (!nextTips) {
      shouldShowTips = true;
      wx.setStorage({
        key: "nextTips",
        data: now + dtime
      })
      // wx.setStorageSync('nextTips', now + dtime);
    } else {
      if (nextTips < now) {
        shouldShowTips = true;
        wx.setStorage({
          key: "nextTips",
          data: now + dtime
        })
        // wx.setStorageSync('nextTips', now + dtime);
      }
    }
    // this.setData({
    //   shouldShowTips: shouldShowTips
    // })
    if (shouldShowTips) {
      wx.showModal({
        title: 'Tips',
        content: '右划浏览下一张~',
        showCancel: false,
      })
    }
    console.log("shouldShowTips:" + shouldShowTips);
  },
})