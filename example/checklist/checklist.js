// notchecklist.js
let service = require('../service').Service
let loadData = require('../dataloader').loadData
let getMoreData = require('../dataloader').getMoreData
let reset = require('../dataloader').reset
import { checkPermission } from '../model/user.js';
let moment = require('../lib/moment.js');
let utils = require('../utils').utils;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    status: '已验货',
    totalCount: 0,
    items: [],
    request: {
      pageNo: 0,
      pageSize: 10
    },
    isLoadAll: false,
    isBackFromSarch: false,
    queryParams: {
      startDate: '',
      endDate: '',
      ticketNo: '',
      hasChecked: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var endDate = new moment().format('YYYY-MM-DD');
    var startDate = new moment().subtract(30, 'day').format('YYYY-MM-DD');
    this.setData({
      queryParams: {
        startDate: startDate,
        endDate: endDate,
        ticketNo: "",
        hasChecked: true
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    checkPermission();
    loadData(this, 0)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    utils.onShowHandler(this, utils.isNeedReloadCheckedListKey, reset, loadData);
    /*
    if (this.data.isBackFromSearch) {
      console.log("load data after search")
      reset(this);
      loadData(this, 0)
    }

    let isNeedReload = wx.getStorageSync(utils.isNeedReloadCheckedListKey);
    console.log("isNeedReload: " + isNeedReload);
    if (isNeedReload) {
      wx.setStorageSync(utils.isNeedReloadCheckedListKey, false)
      reset(this);
      loadData(this, 0)
    } */

    wx.setNavigationBarTitle({
      title: '已验货列表',
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom called")
    getMoreData(this);
  },

  /**
   * 下拉刷新处理
   */
  onPullDownRefresh: function () {
    let self = this;
    reset(this);
    loadData(this, 0)
    wx.stopPullDownRefresh();
  },

  bindItemTap: function (e) {
    console.log("item: ", e);
    let id = e.currentTarget.dataset.id;
    console.log("id: ", id);
    wx.navigateTo({
      url: '../contractsofitem2/contractsofitem2?id=' + id,
    })
  },

  bindSearchTap: function (e) {
    this.data.queryParams.status = this.data.status;
    wx.navigateTo({
      url: '../search/search?queryparams=' + JSON.stringify(this.data.queryParams),
    })
  }
})