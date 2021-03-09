let url = "https://f.sksad.com/seller.php?s=/";
Page({
  data: {
    louPanlist: [],
    citys: [],
    citysBoxTrsY: '-100%',
    chsedCity_name: '全部',
    serachIpt: '',
    areaId: '',
    isFocus:undefined
  },
  onLoad(e) {
    this.setData({
      isFocus:e.ipt
    });
    this.getStorageCityName().then(city_name => {
      this.setData({
        city_name
      });
      this.getMorePro(city_name);
    })
  },
  onSerachIpt(e) {
    this.setData({
      serachIpt: e.detail.value
    })
  },
  //搜索
  searchPro() {
    this.getMorePro(this.data.city_name, this.data.areaId, this.data.serachIpt);
  },
  //点击区域
  chooseArea(e) {
    let areaId = e.currentTarget.dataset.areaId,
      areaName = e.currentTarget.dataset.areaName;
    this.setData({
      chsedCity_name: areaName,
      citysBoxTrsY: this.data.citysBoxTrsY ? 0 : '-100%',
      areaId
    })
    this.getMorePro(this.data.city_name, areaId, this.data.serachIpt)
  },
 //获取产品列表
  getMorePro(city_name, area_id, keys) {
    my.showLoading();
    let _this = this;
    my.request({
      url: url + 'SwiperApi/getMorePro',
      method: 'get',
      data: { city_name, area_id, keys },
      dataType: 'json',
      success: (result) => {
        my.hideLoading();
        console.log('数据', result)
        _this.setData({
          louPanlist: result.data?result.data.data:'',
          area: result.data.area
        })
      }
    });
  },
  //获取缓存的城市名字
  getStorageCityName() {
    return new Promise(function (resolve, reject) {
      let _this = this;
      my.getStorage({
        key: 'city_info',
        success: function (res) {
          if (res.data) {
            resolve(res.data.cityName)
          } else {
            resolve('郑州市')
          }
        }
      });
    })
  },
  chooseCity() {
    this.setData({
      citysBoxTrsY: this.data.citysBoxTrsY ? 0 : '-100%'
    })
  },
});
