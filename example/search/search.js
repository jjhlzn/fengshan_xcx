// search.js
import { checkPermission } from '../model/user.js';
let moment = require('../lib/moment.js');
let utils = require('../utils').utils;
let service = require('../service').Service;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '',
    endDate: '',
    keyword: "",
    isShowFinished: false,
    statuses: [{ name: '未完成', value: 0 },
    { name: '全部', value: 1 }
    ],
    statusNames: [
      '未完成',
      '全部',
    ],
    statusIndex: 0,
    
  },

  loadData: function () {
    var self = this;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("search.js options:" + options.queryparams);

    this.loadData()
    if (options.queryparams) {
      console.log("find queryparams");
      let queryParams = JSON.parse(options.queryparams);
      queryParams.statusIndex = 0;


      this.setData({
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
        keyword: queryParams.keyword,
        isShowFinished: queryParams.isShowFinished,
        statusIndex: queryParams.isShowFinished ? 1 : 0
      });
    } else {
      var endDate = '2018-12-31';
      var startDate = '2018-01-01';
      this.setData({
        startDate: startDate,
        endDate: endDate,
        keyword: "",
        isShowFinished: false,
      });
    }
    
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
      title: '查找订单',
    })
  },


  bindTicketNoInput: function(e) {
    this.data.keyword = e.detail.value;
  },

  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  bindStatusChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      isShowFinished: e.detail.value == 1,
      statusIndex: e.detail.value
    })
  },

  bindSearchTap: function() {

    wx.setStorageSync(utils.queryParamsKey, {
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        keyword: this.data.keyword,
        isShowFinished: this.data.isShowFinished,
        isBackFromSearch: true
    });

    console.log("before wx.switchTab")
    let url = "../orderlist/orderlist";
  
    wx.switchTab({
      url: url,
    })
  }
})