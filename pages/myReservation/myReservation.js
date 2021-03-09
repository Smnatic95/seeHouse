let url = "https://f.sksad.com/seller.php?s=/";
Page({
  data: {
    reserveList: [],
    init:false
  },
  onLoad() {

  },
  onLoad(e) {
    let _this = this;
    my.setNavigationBar({
      title: '我的预约'
    });
    _this.checkLogin({
      success(u) {
        _this.getReserveList(u.uid)
      }
    });
  },
  //拨打电话
  makePhoneCall(t) {
    let tel = t.currentTarget.dataset.tel
    my.makePhoneCall({
      number: tel
    });
  },
  //取消预约
  cancelRes(e) {
    let id = e.currentTarget.dataset.id,
      status = e.currentTarget.dataset.status,
      _this = this;
    if (status == 1) {
      my.request({
        url: url + 'SwiperApi/cancelRes',
        method: 'get',
        data: { id },
        dataType: 'json',
        success: (result) => {
          console.log(result);
          if (result.data.code == 1) {
            my.showToast({
              content: result.data.msg,
              type: 'success'
            });
            let reserveList = this.data.reserveList;
            reserveList && reserveList.forEach(reserve => {
              (reserve.id == id) && (reserve.status = 0)
            });
            _this.setData({
              reserveList:reserveList?reserveList:[]
            })
          } else {
            my.showToast({
              type: 'fail',
              content: result.data.msg,
              duration: 1000,
            });
          }
        }
      });
    }
  },
  //获取预约列表
  getReserveList(uid) {
    my.showLoading();
    let _this = this
    my.request({
      url: url + 'SwiperApi/reserveList',
      method: 'get',
      data: { uid },
      dataType: 'json',
      success: (result) => {
        my.hideLoading();
        console.log(result);
        if (result.data.code == 1) {
          _this.setData({
            reserveList: result.data.data?result.data.data:[],
            init:true
          });
        } else {
          my.showToast({
            type: 'fail',
            content: result.data.msg,
            duration: 1000,
          });
        }
      }
    });
  },
  //检查登录
  checkLogin(option) {
    let _this = this;
    my.getStorage({
      key: 'user_info',
      success: function (res) {
        if (res.data) {
          option.success && option.success(res.data);
          _this.setData({
            u: res.data
          });
        } else {
          _this.setData({
            showLogin: 1
          });
        }
      },
      fail(err) {
        _this.setData({
          showLogin: 1
        });
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
              let userInfo = JSON.parse(res.response).response
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
                  console.log('用户信息', result.data.data);
                  _this.getReserveList(result.data.data.id);
                  _this.setData({
                    showLogin: 0,
                    u: result.data.data
                  })
                  my.setStorage({
                    key: 'user_info',
                    data: {
                      uid: result.data.data.id,
                      nickname: result.data.data.nickname,
                      avatar: result.data.data.avatar
                    },
                  });
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
