//app.js
const api = require('./api/api')

App({
  onLaunch: function () {
    this.globalData = {
      "commonUrl": "https://chenmin0519.club",
      api,
    };
    this.getToken();
    // this.getwxUser();
    this.onLoad();
  },
  getoppenid: function (code){
    var that = this;
    wx.request({
      url: that.globalData.commonUrl + '/user/getoppenid',
      data: {
        code: code
      },
      success: function (res) {
        that.globalData.openid = res.data.data.openid;
        that.globalData.session_key = res.data.data.session_key;
        that.aouthOpenid();
      },
      fail: function (res) {
        console.info(res);
      }
    })
  },
  getToken:function(){
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          that.getoppenid(res.code);
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '微信授权登陆失败',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }); 
  },
  aouthOpenid:function(){
    var that = this;
    wx.request({
      url: that.globalData.commonUrl + '/user/appauthor',
      data: {
        openid: that.globalData.openid
      },
      success: function (res) {
        if(res.data.code != 0){
          //未注册
          wx.navigateTo({
            url: '/pages/regist/regist',
          });
        }else{
          //已注册
          that.globalData.token = res.data.data;
        }
      },
      fail: function (res) {
        console.info(res);
      }
    })
  },
  chekWxAuth:function(){
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting){
          that.getwxUser();
        }else{
          wx.navigateTo({
            url: '/pages/regist/regist',
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.globalData.userInfo = {
        "headimg": "../../images/touxiang.png",
        "mobile": "18874830336",
        "name": "chenmin",
      };

  }
})
