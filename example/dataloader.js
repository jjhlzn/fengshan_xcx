let service = require('./service').Service
let utils = require('./utils.js').utils;

let getMoreData = function (page) {
  let self = page;
  if (self.data.items.length < self.data.totalCount) {
    //this.loadData(self.data.request.pageNo + 1);
    loadData(self, self.data.request.pageNo + 1)
  } else {
    self.setData({ isLoadAll: true });
  }
}

let reset = function(page) {
  let self = page;
  self.setData({
    request: {
      pageNo: 0,
      pageSize: 10
    },
    totalCount: 0,
    items: [],
    isLoadAll: false,
    isBackFromSearch: false
  });
}

let loadData = function (page, pageNo) {
  var self = page;
  self.data.request.pageNo = pageNo;

  if (self.data.loading) {
    console.log("正在加载数据中")
    return;
  }

  self.setData({ loading: true });
  self.data.loading = true;
  wx.request({
    url: service.getCheckOrdersUrl(),
    data: {
      pageNo: self.data.request.pageNo,
      pageSize: self.data.request.pageSize,
      startDate: self.data.queryParams.startDate,
      endDate: self.data.queryParams.endDate,
      ticketNo: self.data.queryParams.ticketNo,
      checker: self.data.queryParams.checker ? self.data.queryParams.checker : "-1",
      status: self.data.status,
      username: utils.getMyUserName()
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      let items = self.data.items;
      items.push.apply(items, res.data.items);
      console.log("res:", res);
      self.setData({ items: items, totalCount: res.data.totalCount });
      if (items.length === res.data.totalCount) {
        self.setData({ isLoadAll: true });
      }
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
}



module.exports = {
  loadData: loadData,
  getMoreData: getMoreData,
  reset: reset
}
