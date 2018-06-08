
export class User {

}

export function checkPermission() {
  console.log("checkPermission called");
  let loginUser = wx.getStorageSync('loginUser');
  if (!loginUser) {
    console.warn("not login, go to login page");
    wx.reLaunch({
      url: '../login/login',
    })
    return;
  }
}