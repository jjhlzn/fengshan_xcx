// notchecklist.js
let service = require('../service').Service
let utils = require('../utils.js').utils;
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
    status: '未分配',
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

  removeItem: function(ticketNo) {
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
      this.setData({ items: items, totalCount: this.data.totalCount - 1});
      //让待验货列表重新刷新
      wx.setStorageSync(utils.isNeedReloadNotCheckListKey, true);
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
    utils.onShowHandler(this, null, reset, loadData);

    wx.setNavigationBarTitle({
      title: '待分配列表',
    })

    wx.setTabBarStyle({
      color: "#6d6d6d",
      selectedColor: '#3AA5C8',
      backgroundColor: '#FEFFFF',
      borderStyle: 'black'
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
        url: '../assignchecker/assignchecker?id=' + id,
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