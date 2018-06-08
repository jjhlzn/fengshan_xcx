let service = require('../service').Service;
let uploadFiles = require('../logic/upload').uploadFiles;
let utils = require('../utils').utils;
import { checkPermission } from '../model/user.js';

Page({
  data: {
    
    maxUploadCount: 3,
    lock: false,
    uploadedCount: 0,
    radioItems: [
      { name: '完成', value: '完成' },
      { name: '未完成', value: '未完成', checked: true }
    ],
    checkResult: {
      result: "1",
      description: "",
    },
    ticketNo: "",
    checkResult: "",
    checkMemo: "",

    files: [],
    deleteImages: [],
    addImages: [],
    uploadImageError: false,

    isCheckResultChange: false
  },

  onLoad: function(options) {
    console.log('options: ' + JSON.stringify(options))


    this.setData({
      ticketNo: options.ticketNo
    })
    if (!options.checkResult ) {
      console.log("set isCheckResultChange to true")
      this.data.isCheckResultChange = true
    }

    var self = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: service.getCheckOrderInfoUrl(),
      data: {
        ticketNo: self.data.ticketNo
      },
      header: {
        'content-type': 'application/json'
      },
      complete: function (res) {
        wx.hideLoading()
        console.log(res);
        if (res.data.status != 0) {
          wx.showToast({
            title: '加载失败',
          })
          return;
        }

        let found = false;
        let checkResult = "";
        self.data.radioItems.forEach(item => {
          if (item.value == res.data.checkOrder.checkResult) {
            item.checked = true;
            checkResult = res.data.checkOrder.checkResult;
            found = true;
          } else {
            delete item.checked;
          }
        });

        if (!found) {
          self.data.radioItems[1].checked = true;
          checkResult = self.data.radioItems[1].value;
        }

        let files = res.data.checkOrder.pictureUrls;
        let urls = files.map(file => service.makeImageUrl(file));
        self.setData({
          files: urls,
          radioItems: self.data.radioItems,
          checkResult: checkResult,
          checkMemo: res.data.checkOrder.checkMemo
        })

      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
      }
    })
  },

  setCheckMemo: function (e) {
    this.data.checkMemo = e.detail.value;
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '验货',
    })
    checkPermission()
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    if (this.data.checkResult != e.detail.value) {
      this.data.isCheckResultChange = true;
    }
    this.data.checkResult = e.detail.value;
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

  touchend: function(e) {
    if (this.data.lock) {
      setTimeout( () => {
        this.setData({
          lock: false
        })
      }, 100)
    }
  },

  getImageUrl: function (event) {
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

  checkBeforeTap: function(){
    return "";
  },

  uploadCompleteHandler: function () {
    let self = this;

    let addImageUrls = self.data.addImages.filter(item => { return !item.hasAddToDB }).map(item => item.fileName);

    console.log('addImages:' + addImageUrls);
    console.log('deleteImages: ' + self.data.deleteImages);

    wx.request({
      url: service.checkOrderUrl(),
      data: {
        ticketNo: self.data.ticketNo,

        checkResult: self.data.checkResult,
        checkMemo: self.data.checkMemo,

        username: utils.getMyUserName(),

        addImages: utils.combineImageUrls(addImageUrls),
        deleteImages: utils.combineImageUrls(self.data.deleteImages)
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let items = self.data.items;
        console.log("checkorder response:", res);
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

          //把审核的结果传递回前一个页面
          let pages = getCurrentPages();
          let curPage = pages[pages.length - 2];
          if (curPage.updateCheckResult) {
            curPage.updateCheckResult(self.data.ticketNo, self.data.checkResult);
          }

          //对待验货，未完成，已验货 列表进行刷新。
          if (self.data.isCheckResultChange) {
            wx.setStorageSync(utils.isNeedReloadNotCheckListKey, true);
            wx.setStorageSync(utils.isNeedReloadNotCompleteListKey, true);
            wx.setStorageSync(utils.isNeedReloadCheckedListKey, true);
          }
          self.data.isCheckResultChange = false;

          //if (res.confirm) {
            wx.navigateBack({
              //checkResult: {
               // result: true
              //}
            });
          //}
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
        self.data.addImages.forEach(x => {
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