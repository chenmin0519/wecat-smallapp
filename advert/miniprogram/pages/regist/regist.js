//index.js
const app = getApp()

Page({
  data: {
    host: getApp().globalData.commonUrl,
    logoUrl: './../../images/logo.png',
    text: '获取验证码', //按钮文字
    userName: '', //倒计时
    disabled: false, //按钮是否禁用
    phone: '', //获取到的手机栏中的值
    // VerificationCode: '',
    // Code: '',
    newChanges: '',
    newChangesAgain: '',
    userNameERRDisabled: false,
    userNameERRMes: "用户名不能为空",
    phoneERRDisabled:false,
    phoneERRMes:"手机号不能为空",
    passwordERRDisabled:false,
    passwordERRMes:"密码不能为空",
    passwordAgainERRDisabled: false,
    passwordAgainERRMes: "两次密码不符",
    success: false,
    state: ''
  },
  /**
    * 获取验证码
    */
  return_home: function (e) {
    wx.navigateTo({
      url: '/pages/login/login',
    })

  }, 
  //手机号聚焦
  focusPhone:function(){
    this.setData({
      phoneERRDisabled: false,
    })
  },
  //手机号失焦
  blurPhone:function(e){
    var that = this;
    var phone = e.detail.value;
    if(phone){
      if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        that.setData({
          phoneERRDisabled: true,
          phoneERRMes:"手机号格式不对",
        })
      }else{
        wx.request({
          url: getApp().globalData.commonUrl + '/user/checkPhone', //后端判断是否已被注册， 已被注册返回1 ，未被注册返回0
          data: {
            phone: phone
          },
          success: function (res) {
            if(res.data.data == 1){
              that.setData({
                phoneERRDisabled: true,
                phoneERRMes: "手机号以被注册",
              })
            }
          }
        })
      }
    }else{
      this.setData({
        phoneERRDisabled: true,
      })
    }
  },
  //密码聚焦
  focusPas: function () {
    this.setData({
      passwordERRDisabled: false,
    })
  },
  //密码失焦
  blurPas: function (e) {
    var phone = e.detail.value;
    if (phone) {
    } else {
      this.setData({
        passwordERRDisabled: true,
      })
    }
  },
  //用户名聚焦
  focusUserName: function () {
    this.setData({
      userNameERRDisabled: false,
    })
  },
  //用户名失焦
  blurUserName: function (e) {
    var userName = e.detail.value;
    if (userName) {
    } else {
      this.setData({
        userNameERRDisabled: true,
      })
    }
  },
  //重复密码聚焦
  focusPasAgain: function () {
    this.setData({
      passwordAgainERRDisabled: false,
    })
  },
  //重复密码失焦
  blurPasAgain: function (e) {
    var pasAgain = e.detail.value;
    if (pasAgain) {
      var pas = this.data.newChangesAgain;
      if(pas != pasAgain){
        this.setData({
          passwordAgainERRDisabled: true,
        })
      }
    } else {
      this.setData({
        passwordAgainERRDisabled: true,
      })
    }
  },
  handleInputUserName:function(e){
    var userName = e.detail.value;
    this.setData({
      userName: userName,
    })
  },
  handleInputPhone: function (e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone,
    })
  },
  handleVerificationCode: function (e) {
    var code = e.detail.value;
    this.setData({
      Code: code,
    })
  },
  getPhoneNumber: function (e) {
    this.setData({
      disabled: true
    })
  },
  handleNewChanges: function (e) {
    var newChanges = e.detail.value;
    this.setData({
      newChanges: newChanges,
    })
  },
  handleNewChangesAgain: function (e) {
    var newChangesAgain = e.detail.value;
    this.setData({
      newChangesAgain: newChangesAgain,
    })
  },
  
  doGetCode: function () {
    var that = this;
    that.setData({
      disabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
      color: '#ccc',
    })

    var phone = that.data.phone;
    var currentTime = that.data.currentTime //把手机号跟倒计时值变例成js值
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    // var phone = that.data.phone;
    // var currentTime = that.data.currentTime //把手机号跟倒计时值变例成js值
    // var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    wx.request({
      url: getApp().globalData.commonUrl + '/user/checkPhone', //后端判断是否已被注册， 已被注册返回1 ，未被注册返回0
      data: {
        phone: phone
      },
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        debugger
        that.setData({
          state: res.data.data,
        })
        if (phone == '') {
          warn = "号码不能为空";
        } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
          warn = "手机号格式不正确";
        } //手机号已被注册提示信息
        else if (that.data.state == 1) {  //判断是否被注册
          warn = "手机号已被注册";
        }
        else {
          wx.request({
            url: '', //填写发送验证码接口
            method: "POST",
            data: {
              coachid: that.data.phone
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data)
              that.setData({
                VerificationCode: res.data.verifycode
              })


              //当手机号正确的时候提示用户短信验证码已经发送
              wx.showToast({
                title: '短信验证码已发送',
                icon: 'none',
                duration: 2000
              });
              //设置一分钟的倒计时
              var interval = setInterval(function () {
                currentTime--; //每执行一次让倒计时秒数减一
                that.setData({
                  text: currentTime + 's', //按钮文字变成倒计时对应秒数

                })
                //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
                if (currentTime <= 0) {
                  clearInterval(interval)
                  that.setData({
                    text: '重新发送',
                    currentTime: 61,
                    disabled: false,
                    color: '#33FF99'
                  })
                }
              }, 100);
            }
          })
        };
        //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
        if (warn != null) {
          wx.showModal({
            title: '提示',
            content: warn
          })
          that.setData({
            disabled: false,
            color: '#33FF99'
          })
          return;
        }
      }

    })

  },
  getwxUserSave: function () {
    var that = this;
    if (!that.data.userName){
      this.setData({
        userNameERRDisabled: true,
      })
      return;
    }
    if (!that.data.phone){
      this.setData({
        phoneERRDisabled: true,
      })
      return;
    }
    if (!that.data.newChanges) {
      this.setData({
        passWordERRDisabled: true,
      })
      return;
    }
    if (!that.data.newChangesAgain) {
      this.setData({
        passWordAgainERRDisabled: true,
      })
      return;
    }
    wx.getUserInfo({
      success: function (res) {
        getApp().globalData.userInfo = res.userInfo;
        var nickName = res.userInfo.nickName;
        var avatarUrl = res.userInfo.avatarUrl;
        var gender = res.userInfo.gender; //性别 0：未知、1：男、2：女
        var openid = getApp().globalData.openid;
        wx.request({
          url: getApp().globalData.commonUrl + '/user/regist',
          method:'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            'userName': that.data.userName,
            'nickName': res.userInfo.nickName,
            'avatarUrl': res.userInfo.avatarUrl,
            'gender': res.userInfo.gender,
            'openid': getApp().globalData.openid,
            'pasWor': that.data.newChanges,
            'phone': that.data.phone,
          },
          success: function (res) {
            debugger
            that.globalData.token = res.data.data;
            console.info(that.globalData.token)
            wx.reLaunch({
              url: '/pages/index/index',
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '服务器异常',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '获取微信信息失败',
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
  bindGetUserInfo:function(){
    //保存信息
    this.getwxUserSave();
  },
  submit: function (e) {
    
    // var that = this
    // if (this.data.Code == '') {
    //   wx.showToast({
    //     title: '请输入验证码',
    //     image: '/images/error.png',
    //     duration: 2000
    //   })
    //   return
    // } else if (this.data.Code != this.data.VerificationCode) {
    //   wx.showToast({
    //     title: '验证码错误',
    //     image: '/images/error.png',
    //     duration: 2000
    //   })
    //   return
    // }
    // else if (this.data.NewChanges == '') {
    //   wx.showToast({
    //     title: '请输入密码',
    //     image: '/images/error.png',
    //     duration: 2000
    //   })
    //   return
    // } else if (this.data.NewChangesAgain != this.data.NewChanges) {
    //   wx.showToast({
    //     title: '两次密码不一致',
    //     image: '/images/error.png',
    //     duration: 2000
    //   })
    //   return
    // } else {
    //   var that = this
    //   var phone = that.data.phone;
    //   wx.request({
    //     url: getApp().globalData.baseUrl + '/Coachs/insert',
    //     method: "POST",
    //     data: {
    //       coachid: phone,
    //       coachpassword: that.data.NewChanges
    //     },
    //     header: {
    //       "content-type": "application/x-www-form-urlencoded"
    //     },
    //     success: function (res) {
    //       wx.showToast({
    //         title: '提交成功~',
    //         icon: 'loading',
    //         duration: 2000
    //       })
    //       console.log(res)
    //       that.setData({
    //         success: true
    //       })
    //     }
    //   })
    // }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})
