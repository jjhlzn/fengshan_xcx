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
    status: '未验货',
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
      hasChecked: false,
      checker: "-1"
    },

    statusList: [
      { id: 1, name: '雕刻', isFinished: true },
      { id: 2, name: '打磨', isFinished: true },
      { id: 3, name: '油漆', isFinished: true },
      { id: 4, name: '描字', isFinished: true },
      { id: 5, name: '发货', isFinished: false },
      { id: 6, name: '完成', isFinished: false },
    ]
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
        hasChecked: false,
        checker: "-1"
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
    utils.onShowHandler(this, utils.isNeedReloadNotCheckListKey, reset, loadData);

    wx.setNavigationBarTitle({
      title: '订单列表',
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
    for(var i = 0; i < this.data.items.length; i++) {
      if (this.data.items[i].ticketNo == ticketNo) {
        return this.data.items[i];
      }
    }
    return null;
  },

  bindItemTap: function(e) {

    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/order'
    })
    
  },

  bindSearchTap: function (e) {
    this.data.queryParams.status = this.data.status;
    console.log("in find bindSearchTap:")
    console.log(JSON.stringify(this.data.queryParams))
    wx.navigateTo({
      url: '../search/search?queryparams=' + JSON.stringify(this.data.queryParams),
    })
  },

  bindStatusTap: function(e) {
    let id = e.currentTarget.dataset.id;
    console.log('tap status: ' + id)
    wx.showModal({
      title: '设置' + id + '完成?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }


})