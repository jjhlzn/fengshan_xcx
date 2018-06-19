var service = require('../service').Service;

// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.setNavigationBarTitle({
      title: '风尚订单系统'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 下拉刷新处理
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  setUserName: function(e) {
    this.data.username = e.detail.value;
  },

  setPassword: function(e) {
    this.data.password = e.detail.value
  },

  bindLoginTap: function() {
    wx.showLoading({
      title: '登陆中',
    });

    let username = 

    wx.request({
      url: service.loginUrl(), //仅为示例，并非真实的接口地址
      data: {
        
          a: this.data.username,
          b: this.data.password
        
      },
      method: 'POST',
      header: { 
        'content-type': 'application/json'
      },
      success: function (res) { 
        console.log("success");
        console.log(res)
        var status = res.data.status;
        if (status != 0) {
          wx.showModal({
            content: res.data.errorMessage,
            showCancel: false,
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          }); 
          return;
        }
        let user = res.data.user;
        wx.setStorageSync('loginUser', res.data.user)
        wx.reLaunch({
          url: '../orderlist/orderlist',
        });
      },
      fail: function(res) {
        console.log("fail");
        wx.showModal({
          content: '服务器出错',
          showCancel: false,
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      },
      complete: function(res) {
        wx.hideLoading()
      }
    })
  }
})