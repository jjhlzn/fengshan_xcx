// assignchecker.js
import { checkPermission } from '../model/user.js';
let service = require('../service').Service;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkers: [
      //{name: '张三', username: '0001'}
    ],
    checkerNames: [
      //'张三'
    ],
    checkerIndex: 0,
    ticketNo: '',
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ticketNo: options.id});
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    checkPermission();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '分配验货员'
    })
  },

  loadData: function () {
    var self = this;
    if (this.data.loading) {
      console.log("正在加载数据中")
      return;
    }

    self.setData({ loading: true });
    wx.request({
      url: service.getAllCheckersUrl(),
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let items = self.data.items;
        console.log(res);
        let checkers = res.data.checkers;

        self.setData({checkers: checkers});
        let checkerNames = checkers.map(item => item.name);
        self.setData({ checkerNames: checkerNames, selectedChecker: checkers[0]});
      },
      fail: function (err) {
        console.error(err)
        wx.showToast({
          title: '加载失败',
        })
      },
      complete: function () {
        self.setData({ loading: false });
      }
    })
  },

  bindCheckerChange: function (e) {
    this.setData({
      checkerIndex: e.detail.value
    })
  },

  bindSaveTap: function(e) {
    let selectedChecker = this.data.checkers[this.data.checkerIndex];
    if (!selectedChecker) {
      wx.showToast({
        title: '没有选中验货员',
        image: '../icons/error.png'
      })
    }
    console.log('selectedChecker: ' + this.data.selectedChecker.name);

    let loginUser = wx.getStorageSync('loginUser');
    let self = this;
    wx.request({
      url: service.assignCheckerUrl(),
      data: {
        ticketNo: this.data.ticketNo,
        checker: selectedChecker.username
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 0) {
          wx.showToast({
            title: '保存成功',
          });

          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.removeItem(self.data.ticketNo);


        } else {
          wx.showToast({
            title: '保存失败',
          })
        }
      },
      fail: function (err) {
        console.error(err)
        wx.showToast({
          title: '保存失败',
        })
      }
    })

    
  }
})