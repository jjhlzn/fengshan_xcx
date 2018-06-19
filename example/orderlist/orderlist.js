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
      keyword: '',
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
    console.log("onLoad")
    console.log(JSON.stringify(options))
    var endDate = '2018-12-31';
    var startDate = '2018-01-01';
    this.setData({
      queryParams: {
        startDate: startDate,
        endDate: endDate,
        keyword: ""
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

    wx.setTabBarStyle({
      color: "#6d6d6d",
      selectedColor: '#41a5c6',
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
    for(var i = 0; i < this.data.items.length; i++) {
      if (this.data.items[i].ticketNo == ticketNo) {
        return this.data.items[i];
      }
    }
    return null;
  },

  bindItemTap: function(e) {

    let id = e.currentTarget.dataset.id;
    console.log("orerNo = " + id)
    wx.navigateTo({
      url: '../order/order?orderNo='+id
    })
    
  },

  bindSearchTap: function (e) {
    console.log("in find bindSearchTap:")
    console.log(JSON.stringify(this.data.queryParams))
    wx.navigateTo({
      url: '../search/search?queryparams=' + JSON.stringify(this.data.queryParams),
    })
  },


  changeOrderFlowStatus: function(orderNo, statusName, isFinished) {
    let orders = this.data.items;
    for(var i = 0; i < orders.length; i++) {
      let order = orders[i];
      if (order.orderNo === orderNo) {
        order.flow.statusList.forEach( status => {
          if (status.name === statusName) {
            status.isFinished = isFinished;
          }
        })
        utils.checkAndSetOrderFinished(order);
        this.setData({items: orders})
        break;
      }
    }
  }


})