// notchecklist.js
let service = require('../service').Service
let utils = require('../utils').utils;
import { checkPermission } from '../model/user.js';
let loadData = require('../dataloader').loadData
let getMoreData = require('../dataloader').getMoreData
let reset = require('../dataloader').reset
let moment = require('../lib/moment.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    status: '未完成',
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

  removeItem: function (ticketNo) {
    let items = this.data.items;
    console.log(this.data.items);
    let index = -1;
    items.forEach((item, i) => {
      if (item.ticketNo == ticketNo) {
        index = i;
      }
    });
    if (index != -1) {
      items.splice(index, 1);
      this.setData({ items: items });
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
        hasChecked: false
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
    utils.onShowHandler(this, utils.isNeedReloadNotCompleteListKey, reset, loadData);
    /*
    let queryParams = wx.getStorageSync(utils.queryParamsKey);
    console.log("queryParams: " + JSON.stringify(queryParams));
    if (queryParams) {
      console.log("load data after search")
      this.setData({
        queryParams: queryParams
      })
      if (queryParams.isBackFromSearch) {
        reset(this);
        loadData(this, 0)
      }
      wx.setStorageSync(utils.queryParamsKey, null);
    } else {
      let isNeedReload = wx.getStorageSync(utils.isNeedReloadNotCompleteListKey);
      console.log("isNeedReload: " + isNeedReload);
      if (isNeedReload) {
        wx.setStorageSync(utils.isNeedReloadNotCompleteListKey, false)
        reset(this);
        loadData(this, 0)
      } 
    }*/

    wx.setNavigationBarTitle({
      title: '待完成列表',
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

  getItem(ticketNo) {
    for (var i = 0; i < this.data.items.length; i++) {
      if (this.data.items[i].ticketNo == ticketNo) {
        return this.data.items[i];
      }
    }
    return null;
  },

  bindItemTap: function (e) {

    let id = e.currentTarget.dataset.id;

    let item = this.getItem(id);
    console.log("item:", item);
    if (item) {
      wx.navigateTo({
        url: '../contractsofitem/contractsofitem?id=' + id + '&checkResult='
        + item.checkResult + '&checkMemo=' + item.checkMemo,
      })
    }
  },

  bindSearchTap: function (e) {
    this.data.queryParams.status = this.data.status;
    wx.navigateTo({
      url: '../search/search?queryparams=' + JSON.stringify(this.data.queryParams),
    })
  }
})