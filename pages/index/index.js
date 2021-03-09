let url = "https://f.sksad.com/seller.php?s=/";
Page({
  data: {
    cardCur: 0,
    swiperIndex: 0,
    notice: [],
    swiperList: [],
    louPanlist: [],
    city_name: '',
    showLogin: 0,
    nextMargin: '20px',
    previousMargin: '20px',
    swiperDuration: 500,
    swipeTimmer: null,
    init: false
  },
  // xmSwiperChg(e) {

  // },
  // swiperAniEnd(e) {
  //   let current = e.detail.current;
  //   if (current == 0) {
  //     current = this.data.swiperList.length
  //     this.setData({
  //       swiperIndex: current,
  //       swiperDuration: 1
  //     });
  //     setTimeout(() => {
  //       this.setData({
  //         swiperDuration: 500
  //       });
  //     })
  //   } else if (current == this.data.swiperList.length + 1) {
  //     this.setData({
  //       swiperIndex: 1,
  //       swiperDuration: 1
  //     });
  //     setTimeout(() => {
  //       this.setData({
  //         swiperDuration: 500
  //       });
  //     })
  //   }
  //   else {
  //     this.setData({
  //       swiperIndex: current,
  //       swiperDuration: 500
  //     });
  //   }
  // },
  // myAutoSwiper() {
  //   let swipeTimmer = setInterval(() => {
  //     let swiperIndex = ++this.data.swiperIndex
  //     this.setData({
  //       swiperIndex,
  //       swiperDuration: 500
  //     })
  //   }, 4000);
  //   this.setData({
  //     swipeTimmer
  //   })
  // },
  // swiperTouchStart(e) {
  //   if (this.data.swipeTimmer) {
  //     clearInterval(this.data.swipeTimmer);
  //     this.setData({
  //       swipeTimmer: null
  //     })
  //   }
  // },
  // swiperTouchEnd(e) {
  //   !this.data.swipeTimmer && this.myAutoSwiper()
  // },
  onLoad(query) {
    if (!my.getStorageSync({ key: 'uid' }).data) {
      this.getUserId().then((uid) => {
        my.setStorage({
          key: 'uid',
          data: uid
        })
      });
    }
    //不挟带选择的城市
    if (!query.chsCity) {
      //读取选择城市的缓存
      this.getStorageCityName().then((city_name) => {
        this.setData({
          city_name
        });
        this.getIndexData(this.data.city_name);
        this.getLocationInfo();
      });
    }
    else {
      this.setData({
        city_name: query.chsCity
      });
      this.getIndexData(query.chsCity);
      //缓存选择的城市
      my.setStorage({
        key: 'city_info',
        data: {
          cityName: query.chsCity
        }
      });
    }
  },
  //获取缓存的城市
  getStorageCityName() {
    return new Promise(function (resolsve, reject) {
      let _this = this;
      my.getStorage({
        key: 'city_info',
        complete: function (res) {
          if (res.data) {
            resolsve(res.data.cityName)
          } else {
            resolsve('郑州市')
          }
        }
      });
    })
  },
  getUserId() {
    return new Promise((resolve, reject) => {
      my.getAuthCode({
        scopes: 'auth_base',
        success: (result) => {
          my.request({
            url: url + 'SwiperApi/saveUserInfo',
            method: 'get',
            data: { authCode: result.authCode },
            dataType: 'json',
            success: (result) => {
              resolve(result.data.data.id)
            }
          });
        },
        fail: () => {

        },
        complete: () => {

        }
      });
    })
  },
  //获取位置信息
  getLocationInfo() {
    var that = this
    my.getLocation({
      type: 1,
      success(res) {
        if (res.city != that.data.city_name) {
          setTimeout(() => {
            my.confirm({
              title: '温馨提示',
              content: '定位到您在' + res.city + ',是否切换到该地区?',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              success: function (result) {
                if (result.confirm) {
                  that.getIndexData(res.city);
                }
              }
            });
          }, 1000)
        }
      }
    })
  },
  //获取首页信息
  getIndexData(city_name) {
    let _this = this;
    my.showLoading();
    my.request({
      url: url + 'SwiperApi/indexData',
      method: 'get',
      data: { city_name: city_name },
      dataType: 'json',
      success: (result) => {
        my.hideLoading();
        console.log('首页数据', result.data.data);
        if (result.data.code == 1) {
          _this.setData({
            swiperList: result.data.data.swiper,
            previousMargin: result.data.data.swiper && result.data.data.swiper.length > 1 ? '0' : '20px',
            notice: result.data.data.notice,
            louPanlist: result.data.data.product,
            city_name: result.data.data.city_name,
            init: true
          });
          //存储切换的城市
          my.setStorage({
            key: 'city_info',
            data: {
              cityName: city_name
            }
          });
        } else {
          my.showToast({
            type: 'fail',
            content: result.data.msg,
            duration: 1500,
          });
        }
      }
    });
  },
  swiperClick(e) {
    let proId = e.currentTarget.dataset.proId;
    console.log(proId)
    my.navigateTo({
      url: '../louPanDetail/louPanDetail?index=' + proId
    })
  },
  toMore(e) {
    let ipt = e.currentTarget.dataset.ipt ? e.currentTarget.dataset.ipt : '';
    my.navigateTo({
      url: '/pages/LouPanList/LouPanList?ipt=' + ipt
    });
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    // this.myAutoSwiper();
  },
  onHide() {
    // 页面隐藏
    // if (this.data.swipeTimmer) {
    //   clearInterval(this.data.swipeTimmer);
    //   this.setData({
    //     swipeTimmer: null
    //   })
    // }
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  }
});
