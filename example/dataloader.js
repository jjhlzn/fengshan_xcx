let service = require('./service').Service
let utils = require('./utils.js').utils;
const moment = require('./moment.js');

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
  let queryParams = {
    pageNo: self.data.request.pageNo,
    pageSize: self.data.request.pageSize,
    startDate: self.data.queryParams.startDate,
    endDate: self.data.queryParams.endDate,
    keyword: self.data.queryParams.keyword,
    isShowFinished: self.data.queryParams.isShowFinished,
    username: utils.getMyUserName()
  }
  console.log(JSON.stringify(queryParams))
  wx.request({
    url: service.getOrdersUrl(),
    method: 'POST',
    data: queryParams,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      let items = self.data.items;
      items.push.apply(items, res.data.items);
      console.log("res:", res);

      items.forEach((item) => {
        let statusList = item.flow.statusList;
        statusList.forEach((status) => {
          if (status.name == '完成' && status.isFinished) {
            item.isFinished = true
          }
        })

        let today = moment().format('YYYY-MM-DD');
        if (!item.isFinished) {
          if (item.deliveryDate < today) {
            item.isTimeout = true;
          }
        }
      })


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
