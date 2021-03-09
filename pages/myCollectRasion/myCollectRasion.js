let url = "https://f.sksad.com/seller.php?s=/";
Page({
  data: {
    reasionList: [],
    showLogin: 0,
    rid: ''
  },
  onLoad(e) {
    let _this = this;
    my.setNavigationBar({
      title: '收藏的顾问'
    });
    _this.checkLogin({
      success(u) {
        _this.getReasionList(u.uid)
      }
    });
  },
  //获取置业顾问列表
  getReasionList(uid) {
    let _this = this;
    my.showLoading();
    my.request({
      url: url + 'SwiperApi/collectList',
      method: 'get',
      data: { uid },
      dataType: 'json',
      success: (result) => {
        my.hideLoading();
        console.log(result.data.data);
        if (result.data.code == 1) {
          _this.setData({
            reasionList: result.data.data,
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
  //复制
  copyBtn(e) {
    let txt = e.currentTarget.dataset.wx
    my.setClipboard({
      text: txt,
      success: function (res) {
        my.confirm({
          title: '温馨提示',
          content: '微信号已复制，马上添加好友咨询',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        });
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
