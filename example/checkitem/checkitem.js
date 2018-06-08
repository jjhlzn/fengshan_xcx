// checkitem.js
let service = require('../service').Service;
import { checkPermission } from '../model/user.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticketNo: "",
    contractNo: "",
    contract: {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ticketNo: options.ticketNo, contractNo: options.contractNo});

    var self = this;
    console.log("onload");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: service.getContractInfoUrl(),
      data: {
        ticketNo: self.data.ticketNo,
        contractNo: self.data.contractNo
      },
      header: {
        'content-type': 'application/json'
      },
      complete: function(res) {
         wx.hideLoading()
         console.log(res);
         if (res.data.status != 0) {
           wx.showToast({
             title: '加载失败',
           })
           return;
         }
         self.setData({
           contract: res.data.contract
         })
      },
      fail: function(err) {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    checkPermission()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '验货单',
    })
  },

  bindCheckTap: function() {
    wx.navigateTo({
      url: '../check/check',
    })
  },

  updateCheckResult: function(productNo, checkResult) {
    //console.log("updateCheckResult called: " + productNo);
    //console.log(JSON.stringify(this.data.contract));
    this.data.contract.products.forEach(product => {
     // console.log(JSON.stringify(product));
      if (product.productNo == productNo) {
        product.checkResult = checkResult;
        console.log("find " + productNo);
      }
    })

    this.setData({
      contract: this.data.contract
    });
  },

  bindFileTap: function(e) {
    var url2 = service.getCheckFileUrl();
    console.log("url: ", url2);
    wx.previewImage({
      current: url2, // 当前显示图片的http链接
      urls: [url2] // 需要预览的图片http链接列表
    })
  },

  bindFileTap2: function(e) {
    wx.navigateTo({
      url: '../showdocument/showdocument',
    })
  },

  

  bindViewImagesTap: function(e) {
    let images = this.data.checkItem.checkResult.images;
    wx.navigateTo({
      url: '../checkimages/checkimages?images='+JSON.stringify(images),
    })
  },

  bindProductTap: function(e) {
    let productNoAndSpid = e.currentTarget.dataset.id;
    let productNo = productNoAndSpid.split('###')[0]
    let spid = productNoAndSpid.split('###')[1]
    wx.navigateTo({
      url: '../checkproduct/checkproduct?ticketNo=' + this.data.ticketNo + '&contractNo=' + this.data.contract.contractNo + '&productNo=' + productNo + '&spid='+spid,
    })
  }, 

  /**
 * 下拉刷新处理
 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

})