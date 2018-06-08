// me.js
import { checkPermission } from '../model/user.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginUser: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ loginUser: wx.getStorageSync('loginUser')});
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
      title: '我'
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
  
  },

  /**
 * 下拉刷新处理
 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  bindLogoutTap: function() {
    wx.setStorageSync('loginUser', undefined);
    wx.reLaunch({
      url: '../login/login',
    })
  }
})