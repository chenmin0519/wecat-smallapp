//index.js
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    clientWidth: 0,
    clientHeight: 0,
    // tab切换 
    currentTab: 0,
    searchLoading:false,
    searchLoadingComplete: false,
    host: getApp().globalData.baseUrl,
    currentIndex: 0,
    page: 1,//当前页
    pages: 10,//每页条数
    total: 2,//总条数
    firstList: [],//商品列表
    secondList: [{ icon: '/images/gg3.png', title: '电梯广告大屏高清招牌优惠很多', price: 450, num: 20 }, { icon: '/images/gg4.png', title: '学校公告栏广告显示优惠多多', price: 200, num: 11 }],
    thirdList: [{ icon: '/images/gg1.png', title: '小区公告栏价格实惠优惠力度强', price: 300, num: 36 }, { icon: '/images/gg4.png', title: '酒店公告栏价格实惠优惠力度强', price: 600, num: 11 }],
    carouselList: [{
      "id": "101",
      "img": "/images/gg1.png",
      "title": "",
      "url": ""
    },
    {
      "id": "102",
      "img": "/images/gg2.png",
      "title": "",
      "url": ""
    },
    {
      "id": "103",
      "img": "/images/gg3.png",
      "title": "",
      "url": ""
    },
    {
      "id": "104",
      "img": "/images/gg4.png",
      "title": "",
      "url": "" 
    }
    ],
    logoUrl: './../../images/logo.png',
    serchUrl: './../../images/serch.png',
    homeImageList:[
      {
        "id":"1",
        "img": "/images/gg4.png",
        "title": "首页",
        "url": "https://www.jianshu.com/"
      }, {
        "id": "1",
        "img": "/images/gg4.png",
        "title": "我要寻找",
        "url": "https://www.jianshu.com/"
      },{
        "id": "1",
        "img": "/images/gg4.png",
        "title": "我要发布",
        "url": "https://www.jianshu.com/"
      }, {
        "id": "1",
        "img": "/images/gg4.png",
        "title": "交流",
        "url": "https://www.jianshu.com/"
      }
    ],
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  // onLoad: function (options) {
  //   this.requestCarouselListData();//请求轮播图
  // },
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 3
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.gefirstList();
  },
  gefirstList: function (e) {
    this.setData({
    firstList :[{ icon: '/images/gg1.png', title: '小区公告栏价格实惠优惠力度强', price: 300, num: 36 }, { icon: '/images/gg2.png', title: '酒店公告栏价格实惠优惠力度强', price: 600, num: 8 }, { icon: '/images/gg3.png', title: '电梯广告大屏高清招牌优惠很多', price: 450, num: 20 }, { icon: '/images/gg4.png', title: '学校公告栏广告显示优惠多多', price: 200, num: 11 }]
    });
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }, 
  //请求轮播图
  // requestCarouselListData() {
  //   var that = this;//注意this指向性问题
  //   var urlStr = "./index.json"; //请求连接注意替换（我用本地服务器模拟）
  //   console.log("请求轮播图：" + urlStr);
  //   wx.request({
  //     url: urlStr,
  //     data: {//这里放请求参数，如果传入参数值不是String，会被转换成String 
  //       // x: '',
  //       // y: ''
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       console.log("轮播图返回值：");
  //       console.log(res.data.result);
  //       var resultArr = res.data.result;
  //       that.setData({
  //         carouselList: resultArr
  //       })
  //     }
  //   })
  // },

  //点击了轮播图
  chomeCarouselClick: function (event) {
    var urlStr = event.currentTarget.dataset.url;
    console.log("点击了轮播图：" + urlStr);
    // wx.navigateTo({
    //   url: 'test?id=1'
    // })
  },


  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    //下拉刷新,重新初始化,isMerge = false
    // getList(this);  
    // var arr = [{ icon: '/images/gg1.png', title: '小区公告栏价格实惠优惠力度强', price: 300, num: 36 }, { icon: '/images/gg2.png', title: '酒店公告栏价格实惠优惠力度强', price: 600, num: 8 }, { icon: '/images/gg3.png', title: '电梯广告大屏高清招牌优惠很多', price: 450, num: 20 }, { icon: '/images/gg4.png', title: '学校公告栏广告显示优惠多多', price: 200, num: 11 }];
    // var firs = [];
    // firs = this.data.firstList.concat(arr);
    // this.setData({
    //   firstList: firs
    // });
    this.setData({
      searchLoading: true
    })
  },
})
