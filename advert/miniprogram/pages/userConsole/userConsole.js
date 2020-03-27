// pages/userConsole/userConsole.js
const app = getApp();
Page({

  data: {
    openid: getApp().globalData.openid,
    teachers: getApp().globalData.userInfo,
  },

  onLoad: function (options) {
    this.setData({
      openid: getApp().globalData.openid
    })
  }
})