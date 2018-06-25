// example/report/report.js
let service = require('../service').Service
let utils = require('../utils').utils;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notFinishedOrder: 0,
    timeOutOrder: 0,
    peopleOrders: []
  },

  loadData: function(callback) {
    var self = this;

    wx.request({
      url: service.getReportUrl(),
      method: 'POST',
      data: {
        device: 'WX'
      },
      header: {
        'content-type': 'application/json'
      },
      complete: function (res) {
        console.log(res);
        if (callback) {
          callback()
        }
        if (res.data.status != 0) {
          wx.showToast({
            title: '加载失败',
          })
          return;
        }

        self.setData({
          notFinishedOrder: res.data.result.notFinishedOrders,
          timeOutOrder: res.data.result.timeoutOrders,
          peopleOrders: res.data.result.orderChart
        })

      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
    
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
      title: '统计',
    })
    wx.setTabBarStyle({
      color: "#6d6d6d",
      selectedColor: '#41a5c6',
      backgroundColor: '#FEFFFF',
      borderStyle: 'black'
    })
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
    this.loadData(() => {
      wx.stopPullDownRefresh();
    })
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})