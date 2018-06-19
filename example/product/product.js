// example/product/product.js
import { checkPermission } from '../model/user.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkItem: {},
    product: {
      id: "",
      checkResult: {},
      properties: [

      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item) {
      let checkItem = JSON.parse(options.item);
      console.log(checkItem);
      this.setData({
        checkItem: checkItem,
        product: checkItem.products[0]
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
      title: '商品',
    })

    wx.setTabBarStyle({
      color: "#6d6d6d",
      selectedColor: '#41a5c6',
      backgroundColor: '#FEFFFF',
      borderStyle: 'black'
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

  bindViewImagesTap: function() {
    let images = this.data.checkItem.checkResult.images;
    wx.navigateTo({
      url: '../checkimages/checkimages?images=' + JSON.stringify(images),
    })
  },

  bindCheckTap: function() {
    wx.navigateTo({
      url: '../checkproduct/checkproduct?item='+JSON.stringify(this.data.checkItem) 
       + '&product='+JSON.stringify(this.data.product),
    })
  },

  getProperty: function(code) {
    for(var i = 0; i < this.data.product.properties.length; i++) {
      let property = this.data.product.properties[i];
      if (property.code === code) {
        return property;
      }
    }
    return null;
  },


  bindProductPropertyTap: function (e) {
    return;
    console.log("property tap");
    let target = e.currentTarget;
    let property = this.getProperty(target.dataset.id);
    console.log("property:", property)
    if (property && property.canEdit) {
      console.log("navigate to edit page");
      wx.navigateTo({
        url: '../editproductproperty/editproductproperty?property='+JSON.stringify(property)+"&product="+JSON.stringify(this.data.product),
      })
    }
  }
})