// example/contractsofitem2/contractsofitem2.js
let service = require('../service').Service
import { checkPermission } from '../model/user.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    selectedType: '全部',
    ticketNo: '',
    products: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ticketNo: options.id
    });
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
      title: '验货详情',
    })
    this.loadData();
  },

  allTap: function() {
    this.changeSelectedType('全部')
  },
  qualifyTap: function() {
    this.changeSelectedType('合格')
  },
  notQualifyTap: function() {
    this.changeSelectedType('不合格')
  },
  tbdTap: function() {
    this.changeSelectedType('待定')
  },

  changeSelectedType: function(selectedType) {
    console.log('selectedType: ' + selectedType)
    this.setData({
      selectedType: selectedType,
      products: []
    })
    this.loadData();
  },

  loadData: function () {
    let self = this;
    this.setData({
      loading: true
    })
    wx.request({
      url: service.getProductsUrl(),
      data: {
        ticketNo: self.data.ticketNo,
        checkResult: self.data.selectedType
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("res:", res);
        if (res.data.status != 0) {
          wx.showToast({
            title: '加载失败',
          })
          return;
        }
        let products = res.data.products;
        self.setData({ products: products});
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

  updateCheckResult: function(productNo, checkResult) {
    let product = this.data.products.filter(product => product.productNo == productNo)[0];
    if (product) {
      product.checkResult = checkResult;
      this.setData({products: this.data.products});
    }
  },

  bindItemTap: function (e) {
    let productNoAndSpid = e.currentTarget.dataset.id;
    let productNo = productNoAndSpid.split('###')[0]
    let spid = productNoAndSpid.split('###')[1]

    console.log('productNo: ' + productNo);
    let product = this.data.products.filter(product => product.productNo == productNo)[0]
    console.log(JSON.stringify(product));

    if (!product.contractNo) {
      wx.showToast({
        title: '合同号不能为空'
      })
      return;
    }

    wx.navigateTo({
      url: '../checkproduct/checkproduct?ticketNo=' + this.data.ticketNo + '&contractNo=' + product.contractNo + '&productNo=' + productNo + '&spid=' + spid,
    })
  },

  bindRecheckTap: function(e) {
    wx.navigateTo({
      url: '../check/check?ticketNo=' + this.data.ticketNo,
    })
  }
})