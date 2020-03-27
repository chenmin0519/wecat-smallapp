//index.js
const app = getApp()
// const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const api = app.globalData.api
Page({
  data: {
    host: getApp().globalData.commonUrl,
    logoUrl: './../../images/logo.png',
    areaInfo: "请选择地区",
    areaValue: [0, 0, 0],//取了哪一个
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    animationTypeMenu:{},
    addressMenuIsShow: false,
    typeMenuIsShow:false,
    provinces: [],//所有省份
    addressCitys: {},//所有市
    addressAreas: {},//所有区县
    citys: [],//联动存市
    areas: [],//联动存区县
    typeEnums: [],
    typeValue: [0],

    province: '',//最终值id
    city: '',//最终值id
    area: '',//最终值id
    category:'',//类型
    address:'',//详细地址
    categoryName:'请选择',
    measure: '',//mianji
    trafficWas:'',//人流量
    title: '',//标题
  },
  // 初始化
  async init() {
    await api.showLoading() // 显示loading
    await this.getData()
    await this.getTypeData()  // 请求数据
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getTypeData:function(){
    var that = this;
    return new Promise((resolve, reject) => {
      api.getData(getApp().globalData.commonUrl + '/enums/getEnumsItem?enumCode=TypeEnum', {
      }).then((res) => {
        that.setData({
          typeEnums: res.data
        })
        resolve()
      })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },
  getData:function(){
    var that = this;
    return new Promise((resolve, reject) => {
      api.getData(getApp().globalData.commonUrl + '/area/getAll', {
      }).then((res) => {
        that.setData({
          provinces: res.data.provinces,
          addressCitys: res.data.citys,
          addressAreas: res.data.areas,
          citys: res.data.citys[res.data.provinces[0].id],
          areas: res.data.areas[res.data.citys[res.data.provinces[0].id][0].id]
        })
        resolve()
      })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },

  onLoad: function (options) {
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    this.init();
  },
  
  // 执行动画
  startAnimation: function (isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
  },
  selectCategoryName:function(){
    var that = this
    if (that.data.typeMenuIsShow) {
      return
    }
    that.startTypeAnimation(true)
  },

  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startTypeAnimation(true)
  },
  startTypeAnimation: function (isShow){
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationTypeMenu: that.animation.export(),
      typeMenuIsShow: isShow,
    })
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击type选择取消按钮
  typeCancel: function (e) {
    this.startTypeAnimation(false)
  },
  // 点击type选择确定按钮
  typeSure: function (e) {
    var that = this
    var type = that.data.typeValue
    var typeEnums = that.data.typeEnums
    that.startTypeAnimation(false)
    // 将选择的城市信息显示到输入框
    that.setData({
      categoryName: typeEnums[type[0]].enumName,
      category: typeEnums[type[0]].enumCode,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var citys = that.data.citys
    var provinces = that.data.provinces
    var areas = that.data.areas
    var value = that.data.areaValue
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = provinces[value[0]].areaName + ',' + citys[value[1]].areaName + ',' + areas[value[2]].areaName;
    that.setData({
      areaInfo: areaInfo,
    })
  },
  hideCitySelected: function (e) {
    this.startAddressAnimation(false)
  },
  typeChange:function(e){
    var value = e.detail.value
    this.setData({
      typeValue: value
    })
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.addressCitys
    var areas = this.data.addressAreas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.areaValue[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        areaValue: [provinceNum, 0, 0],
        province: id,
        citys: citys[id],
        areas: areas[citys[id][0].id],
      })
    } else if (this.data.areaValue[1] != cityNum) {
      var id = this.data.citys[cityNum].id
      this.setData({
        areaValue: [provinceNum, cityNum, 0],
        areas: areas[this.data.citys[cityNum].id],
        city: id
      })
    } else {
      var id = this.data.areas[countyNum].id
      this.setData({
        areaValue: [provinceNum, cityNum, countyNum],
        area: id
      })
    }
  },


  handleInputAdress:function(e){
    var value = e.detail.value
    this.setData({
      address:value
    })
  },
  handleInputarea: function(e){
    var value = e.detail.value
    this.setData({
      measure: value
    })
  },
  handleInputtrafficWas: function (e) {
    var value = e.detail.value
    this.setData({
      trafficWas: value
    })
  },
  handleInputtitle:function(e){
    var value = e.detail.value
    this.setData({
      title: value
    })
  },

  
  
})