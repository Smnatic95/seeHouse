let url = "https://f.sksad.com/seller.php?s=/";
Page({
  data: {
    louPanImgList: [],
    operatingShowClass: '',
    moreOperatingTransY: '100%',
    product_detail: null,
    flag: true,
    showLogin: 0,
    status: "inited",
    time: "0",
    video: {
      showAllControls: true,
      showPlayButton: true,
      showCenterButton: true,
      showFullScreenButton: true,
      isLooping: false,
      muteWhenPlaying: false,
      initTime: 0,
      objectFit: "fill",
      autoPlay: false,
      directionWhenFullScreen: 100,
      mobilenetHintType: 2
    },
    init: false,
    showGetMobileBox: true
  },
  onLoad(e) {
    let _this = this;
    this.setData({
      pid: e.index
    });
    my.getStorage({
      key: 'uid',
      complete(res) {
        if (!res.data) {
          //获取uid
          _this.getUserId().then((uid) => {
            my.setStorageSync({
              key: 'uid',
              data: uid
            })
            _this.getDetail(e.index, uid);
          });
        } else {
          _this.getDetail(e.index, res.data ? res.data : '');
        }
      }
    });
  },
  //打开地图
  openLocation() {
    let product = this.data.product_detail;
    my.openLocation({
      longitude: product.lat,
      latitude: product.lng,
      name: product.pro_name,
      address: product.address,
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
  //获取楼盘详情
  getDetail(p, uid) {
    my.showLoading();
    let _this = this;
    my.request({
      url: url + 'SwiperApi/proDetail',
      method: 'get',
      data: { id: p, uid },
      dataType: 'json',
      success: (result) => {
        my.hideLoading()
        console.log('楼盘详情数据', result.data.data)
        my.setNavigationBar({
          title: result.data.data.product.pro_name
        });
        _this.setData({
          louPanImgList: result.data.data.pro_imgs,
          product_detail: result.data.data.product,
          is_subs: result.data.data.is_subs,
          init: true,
          showGetMobileBox: !Boolean(result.data.data.product.user_mobile),
          UserMobile: result.data.data.product.user_mobile
        })
      }, fail(err) {
        my.showToast({
          content: err,
          type: 'fail'
        });
        my.hideLoading();
      }
    });
  },
  //订阅
  subScribe(e) {
    let _this = this;
    this.checkLogin({
      success(u) {
        my.showLoading();
        my.request({
          url: url + 'SwiperApi/toSubs',
          method: 'get',
          data: { uid: u.uid, pid: _this.data.product_detail.id },
          dataType: 'json',
          success: (result) => {
            my.hideLoading();
            _this.setData({
              is_subs: result.data.data
            });
            my.showToast({
              content: result.data.msg
            });
          }, fail(err) {
            my.showToast({
              content: err,
              type: 'fail'
            });
            my.hideLoading();
          }
        });
      }
    })
  },
  //预约
  yuyue() {
    let _this = this;
    my.getStorage({
      key: 'uid',
      complete(res) {
        if (res.data) {
          _this.makeReserve({
            uid: res.data,
            pro_id: _this.data.pid,
            mobile: _this.data.mobile,
            type: _this.data.product_detail.is_pay
          });
        }
      }
    });
    // my.pageScrollTo({
    //   selector: '.reservationForm',
    //   duration: 150
    // })
  },
  //点击楼盘图片
  imgTap(e) {
    let _this = this;
    my.previewImage({
      urls: _this.data.louPanImgList.map(item => item.imgs),
      current: e.currentTarget.dataset.index,
      enablesavephoto: true,
      enableShowPhotoDownload: true
    });
  },
  //拨打电话
  callTel(t) {
    let tel = t.currentTarget.dataset.tel
    my.makePhoneCall({
      number: tel
    });
  },
  //在线咨询
  seek(e) {
    let rid = e.currentTarget.dataset.index
    my.navigateTo({
      url: '/pages/zheYeList/zheYeList?rid=' + rid + '&panName=' + this.data.product_detail.pro_name
    });
  },
  imgBoxTouchStart(e) {
    // this.setData({
    //   operatingShowClass: 'hide'
    // })
  },
  imgBoxTouchEnd(e) {
    // this.setData({
    //   operatingShowClass: 'show'
    // })
  },
  //显示更多操作
  getMoreOperating() {
    this.setData({
      moreOperatingTransY: 0
    })
  },
  //点击遮罩层
  maskTap() {
    this.setData({
      moreOperatingTransY: '100%'
    })
  },
  //用户同意获取手机号
  onGetPhoneNumber(e) {
    this.setData({
      showGetMobileBox: false
    });
    let _this = this;
    let uid = my.getStorageSync({
      key: 'uid'
    }).data;
    my.getPhoneNumber({
      success: (res) => {
        let encryptedData = JSON.parse(res.response).response;
        my.request({
          url: url + 'SwiperApi/getalimobile',
          method: 'post',
          dataType: 'text',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            enmobile: encryptedData
          },
          success: (result) => {
            //保存用户手机号
            result = JSON.parse(result.data);
            console.log('手机号解析结果', result, uid);
            _this.setData({
              UserMobile: result.mobile
            });
            _this.saveUserTel(result.mobile, uid);
          }, fail(err) {
            my.showToast({
              content: err,
              type: 'fail'
            });
          }
        });
      },
      fail: (res) => {
        console.log(res);
        console.log('getPhoneNumber_fail');
      },
    });
  },
  //保存用户手机号
  saveUserTel(mobile, uid) {
    my.request({
      url: url + 'SwiperApi/saveUserTel',
      method: 'get',
      data: {
        mobile,
        uid
      },
      dataType: 'json',
      success: (result) => {
        console.log('保存用户手机号', result)
      }, fail(err) {
        my.showToast({
          content: err,
          type: 'fail'
        });
        my.hideLoading();
      }
    });
  },
  //用户拒绝获取手机号
  onGetPhoneNumberError(e) {
    this.setData({
      showGetMobileBox: false
    });
    console.log('获取手机号失败', e);
  },
  //点击提交
  reservationSubmit(e) {
    let _this = this,
      formValue = e.detail.value,
      phoneReg = /^[1]([3-9])[0-9]{9}$/;
    this.checkLogin({
      success(u) {
        if (!formValue.mobile) {
          my.showToast({
            content: '请输入手机号',
            type: 'fail'
          })
          return
        }

        if (!phoneReg.test(formValue.mobile)) {
          my.showToast({
            content: '手机号格式不正确',
            type: 'fail'
          })
          return
        }

        if (!formValue.real_name) {
          my.showToast({
            content: '请填写姓名',
            type: 'fail'
          })
          return
        }
        my.showLoading();
        _this.makeReserve({
          uid: u.uid,
          pro_id: _this.data.pid,
          mobile: formValue.mobile,
          real_name: formValue.real_name,
          type: _this.data.product_detail.is_pay
        });
      }
    })
  },
  makeReserve(parames) {
    my.request({
      url: url + 'SwiperApi/makeReserve',
      method: 'get',
      data: parames,
      dataType: 'json',
      success: (result) => {
        my.hideLoading();
        //提交出错
        if (!result.data.code) {
          my.showToast({
            type: 'fail',
            content: result.data.msg,
            duration: 1500,
          });
        }
        //需要支付
        else if (parames.is_pay == 1) {
          this.pay(result.data.data.trade_no);
        } else {
          my.showToast({
            type: 'success',
            content: result.data.msg,
            duration: 1500,
          });
        }
      },
      fail(err) {
        my.showToast({
          content: err,
          type: 'fail'
        });
      }
    });
  },
  // 发起支付
  pay(tradeNO) {
    my.tradePay({
      tradeNO,
      success: (result) => {
        console.log(result)
        if (result.resultCode != 9000) {
          my.showToast({ content: '支付失败', duration: 1500 });
        }//支付成功 
        else {
          my.showToast({
            type: 'success',
            content: '支付成功',
            duration: 1500,
          });
        }
      },
      fail: (err) => {
        console.log('支付异常', err)
      }
    });
  },
  moreOperatingCancel() {
    this.setData({
      moreOperatingTransY: '100%'
    })
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    let product = this.data.product_detail;
    return {
      title: product.pro_name,
      desc: product.address,
      path: 'pages/louPanDetail/louPanDetail?index=' + product.id,
      imageUrl: product.path_img,
      bgImgUrl: product.path_img
    };
  },
  //检查登录
  checkLogin(option) {
    let _this = this;
    my.getStorage({
      key: 'user_info',
      success: function (res) {
        if (res.data) {
          option.success(res.data);
        } else {
          _this.setData({
            showLogin: 1
          });
        }
      },
      fail(reason) {
        option.fail && option.fail(reason)
      },
      complete(res) {
        option.complete && option.complete(res);
      }
    });
  },
  //同意授权
  AgreeAuth() {
    let _this = this;
    my.getAuthCode({
      scopes: ['auth_base'],
      success: (result) => {
        console.log(result)
        if (result.authCode) {
          my.getOpenUserInfo({
            fail: (error) => {
              console.error('getAuthUserInfo', error);
            },
            success: (res) => {
              let userInfo = JSON.parse(res.response).response;
              console.log(userInfo)
              my.showLoading();
              my.request({
                url: url + 'SwiperApi/saveUserInfo',
                method: 'get',
                data: {
                  authCode: result.authCode,
                  nickname: userInfo.nickName,
                  avatar: userInfo.avatar,
                  city: userInfo.city,
                },
                dataType: 'json',
                success: (result) => {
                  my.hideLoading();
                  console.log('用户信息', result);
                  _this.setData({
                    showLogin: 0
                  });
                  my.setStorage({
                    key: 'user_info',
                    data: {
                      uid: result.data.data.id,
                      nickname: result.data.data.nickname,
                      avatar: result.data.data.avatar
                    },
                  });
                }, fail(err) {
                  my.showToast({
                    content: err,
                    type: 'fail'
                  });
                  my.hideLoading();
                }
              });
            }
          });

        }
      }
    });
  },
  //拒绝授权
  ErrorAuth(e) {
    this.setData({
      showLogin: 0
    });
    console.log('授权失败', e)
  },
  //点击取消
  CancelAuth() {
    this.setData({
      showLogin: 0
    });
    console.log('用户点击了取消')
  }
});
