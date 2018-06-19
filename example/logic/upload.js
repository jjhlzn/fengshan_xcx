let service = require('../service').Service;

function handleImageUploadFail() {
  wx.hideLoading();
  wx.showToast({
    title: '图片上传失败',
    duration: 3000
  })
}


function uploadFiles(files, controller, uploadCompleteHandler) {
  let self = controller;
  self.data.uploadedCount = 0;
  console.log('uploadFiles called')
  console.log(files)
  if (files.length == 0) {
    console.log(files.length)
    uploadCompleteHandler();
  } else {
    for (var i = 0; i < files.length && i < self.data.maxUploadCount; i++) {
      console.log("upload: " + i)
      upload(files, i, self, uploadCompleteHandler);
    }
  }
}

function upload(files, index, controller, uploadCompleteHandler) {

  var self = controller;
  console.log("self: " + self);
  wx.uploadFile({
    url: service.uploadFileUrl(),
    filePath: files[index],
    name: files[index],
    formData: {orderNo: controller.data.orderNo, type: "other"}, 
    success: function (res) {
      console.log(res);
      
      let json = null;
      try {
        json = JSON.parse(res.data)
      } catch(ex) {
        console.log("exception: " + ex);
        handleImageUploadFail();
        return;
      }
      console.log(json);
      if (json.status != 0) {
        self.handleImageUploadFail();
        return;
      }
      let newItem = {
        originName: json.orginNames[0],
        fileName: json.fileNames[0],
        hasAddToDB: false
      }
      files[index] = json.fileNames[0]
      self.data.addImages.push(newItem);
      self.data.uploadedCount++;
      console.log('完成第' + self.data.uploadedCount + '张');

      if (controller.data.uploadImageError ) {
        console.error("upload error")
        wx.hideLoading();
        return;
      }

      console.log("self.data.uploadedCount: " + self.data.uploadedCount)
      console.log("files.length: " + files.length)
      if (self.data.uploadedCount == files.length) {
        wx.hideLoading();
        uploadCompleteHandler(files);
      } else {
        wx.showLoading({
          title: '上传中( ' + (self.data.uploadedCount + 1) + '/' + files.length + ' )',
        })
        let next = index + self.data.maxUploadCount;
        if (next < files.length) {
          upload(files, index + self.data.maxUploadCount, self)
        } 
      }
    },
    fail: function (err) {
      console.log(err);
      controller.data.uploadImageError = true;
      handleImageUploadFail();
    }
  });

}

module.exports = {
  uploadFiles: uploadFiles
}