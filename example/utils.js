let utils = {
  isFloat: isFloat,
  isInt: isInt,
  isNeedReloadNotCheckListKey: 'isNeedReloadNotCheckListKey',
  isNeedReloadNotCompleteListKey: 'isNeedReloadNotCompleteListKey',
  isNeedReloadCheckedListKey: 'isNeedReloadCheckedListKey',
  queryParamsKey: 'queryParamsKey',
  combineImageUrls: combineImageUrls,
  onShowHandler: onShowHandler,
  getMyUserName: getMyUserName,
  extractSize: extractSize,
  isCheckerManager: isCheckerManager,
  checkAndSetOrderFinished: checkAndSetOrderFinished,
};

function checkAndSetOrderFinished(order) {
  var isFinished = true;
  order.flow.statusList.forEach(status => {
    if (status.name !== '完成') {
      isFinished = isFinished && status.isFinished;
    }
  })

  order.flow.statusList.forEach(status => {
    if (status.name === '完成') {
      status.isFinished = isFinished;
    } 
  })
  
  return isFinished;
}

function isFloat(value) {
  if (!isNumeric(value))
    return false;

  let val = parseFloat(value);
  if (isNaN(val)) 
    return false;
  return true;
}

function isInt(value) {
  return isFloat(value)
}


function isNumeric(num) {
  return !isNaN(num)
}

function getMyUserName() {
  let loginUser = wx.getStorageSync("loginUser");
  if (loginUser) {
    return loginUser.username;
  }
  return "";
}

function isCheckerManager() {
  let loginUser = wx.getStorageSync("loginUser");
  console.log("loginUser: ", loginUser)
  if (loginUser.role == 'checker_manager')
    return true
  return false 
}

function combineImageUrls(array) {
  if (array.length == 0) {
    console.log("reuslt: ");
    return "";
  }
  let result = array[0];
  for (var i = 1; i < array.length; i++) {
    if (!array[i].hasAddDB)
      result = result + "^" + array[i];
  }
  console.log("reuslt: " +result);
  return result;
}

function extractSize(sizeStr) {
  console.log("sizeStr: " + sizeStr);
  let defaultResult = {
    long: 0,
    width: 0,
    height: 0
  };
  if (!sizeStr) {
    return defaultResult;
  }
  let regex = new RegExp('(.+)x(.+)x(.+)');
  let result = regex.exec(sizeStr);
  if (!result) {
    return defaultResult;
  }
  return {
    long: result[1],
    width: result[2],
    height: result[3]
  }
}


function onShowHandler(page, isReloadKey, reset, loadData) {
  let self = page;
  let queryParams = wx.getStorageSync(utils.queryParamsKey);
  console.log("queryParams: " + JSON.stringify(queryParams));
  if (queryParams) {
    console.log("load data after search")
    self.setData({
      queryParams: queryParams
    })
    if (queryParams.isBackFromSearch) {
      reset(self);
      loadData(self, 0)
    }
    wx.setStorageSync(utils.queryParamsKey, null);
  } else {
    if (isReloadKey) {
      let isNeedReload = wx.getStorageSync(isReloadKey);
      console.log("isNeedReload: " + isNeedReload);
      if (isNeedReload) {
        wx.setStorageSync(isReloadKey, false)
        reset(self);
        loadData(self, 0)
      }
    }
  }
}



module.exports = {
  utils: utils
}
