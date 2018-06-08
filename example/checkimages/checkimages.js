// checkimages.js
/**
 * 加载多张图片测试页
 */
let service = require('../service').Service;
import { checkPermission } from '../model/user.js';

//引入图片预加载组件
//const ImgLoader = require('../img-loader/img-loader.js')

Page({
  data: {
    imgList: []
  },
  onLoad(options) {
    let images = JSON.parse(options.images);
    this.setData({
      imgList: images.map(function (item) {
        return {url: service.getCheckImageUrl(item), loaded: false}
      })
    })


    //初始化图片预加载组件，并指定统一的加载完成回调
    //this.imgLoader = new ImgLoader(this, this.imageOnLoad.bind(this))
    console.log("imgList:", this.data.imgList);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    checkPermission()
    wx.setNavigationBarTitle({
      title: '验货图片',
    })
  },

  onReachBottom: function () {
    // Do something when page reach bottom.
  },


  bindImageTap: function(e) {
    
    console.log("id: ", encodeURI(e.currentTarget.id));
    wx.previewImage({
      urls: [encodeURI(e.currentTarget.id)] // 需要预览的图片http链接列表
    }) 

    /*
    var url2 = service.getCheckFileUrl();
    console.log("url: ", url2);
    wx.previewImage({
      current: url2, // 当前显示图片的http链接
      urls: [url2] // 需要预览的图片http链接列表
    }) */
  },

  /**
 * 下拉刷新处理
 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})


