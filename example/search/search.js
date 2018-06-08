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
    ticketNo: "",
    hasChecked: false,
    selectedCheckerUserName: '-1',
    statusIndex: 0,
    statuses: [{ name: '未分配', value: '未分配'},
      { name: '待验货', value: '未验货' },
      { name: '未完成', value: '未完成' },
      { name: '已验货', value: '已验货' },
              ],
    statusNames: [
      '未分配',
      '待验货',
      '未完成',
      '已验货'
    ],
    checkers: [
      //{name: '张三', username: '0001'}
      { name: '全部', username: '-1' }
    ],
    checkerNames: [
      //'张三'
      '全部'
    ],
    checkerIndex: 0,
    isShowSelectChecker: false
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
        checkers.splice(0, 0, { name: '全部', username: '-1' })
        self.setData({ checkers: checkers });
        let checkerNames = checkers.map(item => item.name);
        let localCheckerIndex = 0
        self.data.checkers.forEach((item, index) => {
          if (item.username == self.data.selectedCheckerUserName) {
            localCheckerIndex = index
          }
        })
        console.log("loadData: localCheckIndex = " + localCheckerIndex)
        self.setData({ checkerNames: checkerNames, 
          checkerIndex: localCheckerIndex});

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("search.js options:" + options.queryparams);
    if (utils.isCheckerManager) {
      this.setData({
        isShowSelectChecker: true
      })
    }
    this.loadData()
    if (options.queryparams) {
      console.log("find queryparams");
      let queryParams = JSON.parse(options.queryparams);
      queryParams.statusIndex = 0;
      this.data.statuses.forEach( (item, index) => {
        if (item.value == queryParams.status) {
          queryParams.statusIndex = index;
        }
      })
      let localCheckerIndex = 0
      this.data.checkers.forEach( (item, index) => {
        if (item.username == queryParams.checker) {
          localCheckerIndex = index
        }
      })
      console.log("localCheckIndex = " + localCheckerIndex)
      console.log(queryParams);
      this.setData({
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
        ticketNo: queryParams.ticketNo,
        statusIndex: queryParams.statusIndex,
        checkerIndex: localCheckerIndex,
        selectedCheckerUserName: queryParams.checker ? queryParams.checker : "-1"
      });
      console.log(this.data);
    } else {
      console.log("date:", new moment().format('YYYY-MM-DD'));
      var endDate = new moment().format('YYYY-MM-DD');
      var startDate = new moment().subtract(30, 'day').format('YYYY-MM-DD');
      this.setData({
        startDate: startDate,
        endDate: endDate,
        ticketNo: "",
        checkerIndex: 0,
        selectedCheckerUserName: "-1"
      });
    }
    
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
      title: '查找验货单',
    })
  },

  bindStatusChange: function (e) {
    this.setData({
      statusIndex: e.detail.value
    })
  },

  bindTicketNoInput: function(e) {
    this.data.ticketNo = e.detail.value;
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

  bindCheckerChange: function (e) {
    this.setData({
      checkerIndex: e.detail.value
    })
  },

  bindSearchTap: function() {
    wx.setStorageSync(utils.queryParamsKey, {
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        ticketNo: this.data.ticketNo,
        status: this.data.statuses[this.data.statusIndex].value,
        isBackFromSearch: true,
        checker: this.data.checkers[this.data.checkerIndex].username
    });
    console.log("before wx.switchTab")
    let url = "";
    if (this.data.statusIndex == 0) {
      url = '../assignlist/assignlist';
    } else if (this.data.statusIndex == 1) {
      url = '../notchecklist/notchecklist';
    } else if (this.data.statusIndex == 2) {
      url = '../notcompletelist/notcompletelist';
    } else if (this.data.statusIndex == 3) {
      url = '../checklist/checklist';
    }
    wx.switchTab({
      url: url,
    })
  }
})