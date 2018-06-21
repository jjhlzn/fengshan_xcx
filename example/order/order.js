// example/order/order.js
let service = require('../service').Service;
let utils = require('../utils').utils;
let uploadFiles = require('../logic/upload').uploadFiles;

Page({

  /**
   * 页面的初始数据
   */
  data: {
     orderNo: "",
     order: {},

     lock: false,
     files: [],
     filesBackup: [],
     deleteImages: [],
     addImages: [],   //[{fileName: '', orginName: '', hasAddToDB: true}]
     uploadImageError: false,
     uploadedCount: 0,
     maxUploadCount: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.stringify(options))
    this.setData({ orderNo: options.orderNo});

    var self = this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: service.getOrderInfoUrl(),
      method: 'POST',
      data: {
        orderNo: self.data.orderNo
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

        let order = res.data.order
        order.orderDate = order.orderDate.substring(0, 10)
        order.deliveryDate = order.deliveryDate.substring(0, 10)

        //order.contentImages = order.contentImages.map(file => service.getOrderImageUrl(file));
        order.otherImages = order.otherImages.map(file => service.getOrderImageUrl(file));
        order.contentImages = order.contentImages.map(file => service.getOrderImageUrl(file));
        order.templateImages = order.templateImages.map(file => service.getOrderImageUrl(file));

        self.data.files = order.otherImages

        self.setData({
          order: order,
          files: self.data.files
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setTabBarStyle({
      color: "#6d6d6d",
      selectedColor: '#41a5c6',
      backgroundColor: '#FEFFFF',
      borderStyle: 'black'
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

  previewImageContent: function (e) {
    if (this.data.lock) {
      return;
    }
    let id = e.currentTarget.id;
    let index = parseInt(id.replace('image_', ''));
    console.log("index = " + index);
    wx.previewImage({
      current: this.data.order.contentImages[index], // 当前显示图片的http链接
      urls: this.data.order.contentImages // 需要预览的图片http链接列表
    })
  },

  previewImageTemplate: function (e) {
    if (this.data.lock) {
      return;
    }
    let id = e.currentTarget.id;
    let index = parseInt(id.replace('image_', ''));
    console.log("index = " + index);
    wx.previewImage({
      current: this.data.order.templateImages[index], // 当前显示图片的http链接
      urls: this.data.order.templateImages // 需要预览的图片http链接列表
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

  /* 长按图片 */
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
          console.log('url: ' + url);
          wx.showLoading({
            title: '',
          })
          wx.request({
            url: service.deleteOrderImageUrl(),
            method: 'POST',
            data: {
              orderNo: self.data.orderNo, 'type': 'other', imageUrl: url
            },
            header: {
              'content-type': 'application/json'
            },
            complete: function (res) {
              wx.hideLoading()
              console.log(res);
              if (res.data.status != 0) {
                wx.showToast({
                  title: '删除失败',
                })
                return;
              }

              self.removeImage(e);

            },
            fail: function (err) {
              wx.hideLoading()
              wx.showToast({
                title: '删除失败',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  uploadCompleteHandler: function() {

  },

  chooseImage: function (e) {
    var self = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths)
        wx.showLoading({
          title: '',
        })

        uploadFiles(res.tempFilePaths, self, (newFiles) => { 
          console.log("completedHandler called")
          wx.hideLoading()
          var urls = newFiles.map(file => service.getOrderImageUrl(file))
          self.setData({
            files: self.data.files.concat(urls)
          });
        });
      }
    })
  },

  /* 获取订单的某个状态是否已经完成 */
  getOrderFlowStatusIsFinished: function(name) {
    var isFound = false;
    var isFinished = false;
    this.data.order.flow.statusList.forEach( status => {
      //console.log(status.name)
       if (status.name === name) {
         isFinished = status.isFinished;
         isFound = true;
       }
    })

    if (!isFound) {
      console.error("can't find status name: " + name);
    } else {
      return isFinished
    }
    return "";
  },

  /* 设置订单的某个状态是否完成 */
  setOrderFlowStatusIsFinished: function(name, isFinished) {
    var order = this.data.order;
    order.flow.statusList.forEach(status => {
      if (status.name === name) {
        status.isFinished = isFinished;
      }
    })
    utils.checkAndSetOrderFinished(this.data.order);
    this.setData({order: order})
  },

  /* 点按进度状态 */
  bindStatusTap: function (e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    console.log('tap status: ' + id)
    wx.showModal({
      title: '设置' + id + '完成?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '',
          })
          wx.request({
            url: service.setFlowStatusUrl(),
            method: 'POST',
            data: {
              orderNo: self.data.orderNo,
              statusName: id,
              isFinished: !self.getOrderFlowStatusIsFinished(id)
            },
            header: {
              'content-type': 'application/json'
            },
            complete: function (res) {
              wx.hideLoading()
              console.log(res);
              if (res.data.status != 0) {
                wx.showToast({
                  title: '设置失败',
                })
                return;
              }
              self.setOrderFlowStatusIsFinished(id, !self.getOrderFlowStatusIsFinished(id))
              var pages = getCurrentPages();
              if (pages.length > 1) {
                //上一个页面实例对象
                var prePage = pages[pages.length - 2];
                //关键在这里
                prePage.changeOrderFlowStatus(self.data.orderNo, id, self.getOrderFlowStatusIsFinished(id))
              }

              //设置订单列表的
              wx.showToast('设置成功');
            },
            fail: function (err) {
              wx.hideLoading()
              wx.showToast({
                title: '设置失败',
              })
            }
          })
        }
      }
    })
  }
})