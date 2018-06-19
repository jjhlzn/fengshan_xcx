let service = require('../service').Service;
let uploadFiles = require('../logic/upload').uploadFiles;
let utils = require('../utils').utils;
import { checkPermission } from '../model/user.js';

Page({
  data: {
    startDate: '2018-03-01',
    maxUploadCount: 3,
    lock: false,     
    uploadedCount: 0,
    ticketNo: "",
    contractNo: "",
    productNo: "",
    spid: "",
    order: {

    },
    files: [],
    deleteImages: [],
    addImages: [],   //[{fileName: '', orginName: '', hasAddToDB: true}]
    uploadImageError: false
  },

  onLoad: function (options) {
  },

  setPickCount: function(e) {
    this.data.product.pickCount = e.detail.value;
  },
  setLong: function (e) {
    this.data.product.sizeObj.long = e.detail.value;
  },
  setWidth: function (e) {
    this.data.product.sizeObj.width = e.detail.value;
  },
  setHeight: function (e) {
    this.data.product.sizeObj.height = e.detail.value;
  },
  setGrossWeight: function (e) {
    this.data.product.grossWeight = e.detail.value;
  },
  setNetWeight: function (e) {
    this.data.product.netWeight = e.detail.value;
  },
  setCheckMemo: function (e) {
    this.data.product.checkMemo = e.detail.value;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '新增订单',
    })
    checkPermission()
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.data.product.checkResult = e.detail.value;
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },

  previewImage: function (e) {
    if (this.data.lock) {
      return;
    }
    let id = e.currentTarget.id;
    let index = parseInt(id.replace('image_', ''));
    console.log("index = " + index);
    wx.previewImage({
      current: this.data.files[index], // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  touchend: function (e) {
    if (this.data.lock) {
      setTimeout(() => {
        this.setData({
          lock: false
        })
      }, 100)
    }
  },

  getImageUrl: function(event) {
    let e = event;
    let id = e.currentTarget.id;
    let index = parseInt(id.replace('image_', ''));
    return this.data.files[index];
  },

  //传入按键事件，将所点按的图片删除
  removeImage: function (e) {
    let id = e.currentTarget.id;
    let index = parseInt(id.replace('image_', ''));
    let url = this.data.files.splice(index, 1);
    console.log("delete image: " + url);
    this.setData({ files: this.data.files });
  },

  bindLongImageTap: function (e) {
    let self = this;
    this.setData({
      lock: true
    });
    wx.showModal({
      title: '',
      content: '删除该图片？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let url = self.getImageUrl(e);
          self.removeImage(e);
          console.log('url: ' + url);
          if (!url.startsWith('http://tmp/') && !url.startsWith('wxfile://')) {
            self.data.deleteImages.push(url);
          }

          let deleteIndex = -1;
          self.data.addImages.forEach((item, index) => {
            if (item.originName == url) {
              self.data.deleteImages.push(item.fileName);
              deleteIndex = index;
            }
          })
          if (deleteIndex != -1) {
            self.data.addImages.splice(deleteIndex, 1);
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  checkBeforeTap: function () {
    return "";

    let self = this;
    
    if (!utils.isInt(self.data.product.pickCount)) {
      return "抽箱数必须是整数";
    }
    if (!utils.isFloat(self.data.product.grossWeight)) {
      return "单件毛重必须是数字";
    }
    if (!utils.isFloat(self.data.product.netWeight)) {
      return "单件净重必须是数字";
    }

    return "";
  },

  getBoxSizeStr: function() {
    return this.data.product.sizeObj.long + 'x' +  this.data.product.sizeObj.width + 'x'
      + this.data.product.sizeObj.height;
  },


  uploadCompleteHandler: function() {
    
    let self = this;
    let addImageUrls = self.data.addImages.filter(item => { return !item.hasAddToDB }).map(item => item.fileName);
    
    console.log('addImages:' + addImageUrls);
    console.log('deleteImages: ' + self.data.deleteImages);
    wx.request({
      url: service.checkProductUrl(),
      data: {
        ticketNo: self.data.ticketNo,
        contractNo: self.data.contractNo,
        productNo: self.data.productNo,
        spid: self.data.spid,

        checkResult: self.data.product.checkResult,
        pickCount: parseInt(self.data.product.pickCount),
        boxSize: self.getBoxSizeStr(),
        grossWeight: parseFloat(self.data.product.grossWeight),
        netWeight: parseFloat(self.data.product.netWeight),
        checkMemo: self.data.product.checkMemo,

        username: utils.getMyUserName(),

        addImages: utils.combineImageUrls(addImageUrls),
        deleteImages: utils.combineImageUrls(self.data.deleteImages)
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let items = self.data.items;
        console.log("checkproduct response:", res);
        wx.hideLoading();
        if (res.data.status != 0) {
          wx.showToast({
            title: '验货失败',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: '验货成功',
            duration: 3000
          })

          self.data.addImages.forEach(item => {
            item.hasAddToDB = true;
          })

          self.data.deleteImages = [];

          //把审核的结果传递回前一个页面
          let pages = getCurrentPages();
          let curPage = pages[pages.length - 2];
          curPage.updateCheckResult(self.data.productNo, self.data.product.checkResult);

         //if (res.confirm) {
            wx.navigateBack({
              isCheckSuccess: true
              //checkResult: {
              //  result: true
             // }
            });
         // }
        }
      },
      fail: function (err) {
        console.error(err)
        wx.showToast({
          title: '验货失败',
          duration: 3000
        })

      },
      complete: function () {
      }
    })
  },

  bindSubmitTap: function (e) {
    this.data.uploadImageError = false;
    let errorMessage = this.checkBeforeTap();
    if (errorMessage != "") {
      wx.showModal({
        content: errorMessage,
        showCancel: false
      })
      return false;
    }

    wx.showToast({
      title: '保存成功',
    })
    return;

    var self = this;
    //上传图片，使用对话框提示，图片上传完之后，提交验货结果
    //过滤不需要进行上传的图片
    this.data.files.forEach(item => {
      console.log("item: " + item);
    })
    let needUploadFiles = this.data.files
            .filter((item) => { 
              return item.startsWith('http://tmp/') || item.startsWith('wxfile://') 
            })
            .filter((item) => {
              let needAdd = true;
              self.data.addImages.forEach( x => {
                console.log("item: " + item);
                console.log("x.originName: " + x.originName);
                if (item == x.originName && x.hasAddToDB) {
                  needAdd = false;
                }
              })
              return needAdd;
            });
    
    console.log("needUploadFiles: " + needUploadFiles);

    let imageCount = needUploadFiles.length;

    if (imageCount > 0) {
      wx.showLoading({
        title: '上传中( ' + 1 + '/' + imageCount + ' )',
      })
    }
    uploadFiles(needUploadFiles, this, this.uploadCompleteHandler);
  },
});