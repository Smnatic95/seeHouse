let url = "https://f.sksad.com/seller.php?s=/";
Page({
  data: {
    showLogin: 0
  },
  onLoad() {
    let _this = this;
    this.checkLogin({
      success(u) {
        _this.setData({
          u
        })
      }
    });
  },
  mineNavigate(e) {
    let url = e.currentTarget.dataset.url;
    this.checkLogin({
      success() {
        my.navigateTo({
          url
        });
      }
    })
  },
  //检查登录
  checkLogin(option) {
    let _this = this;
    my.getStorage({
      key: 'user_info',
      success: function (res) {
        if (res.data) {
          option.success && option.success(res.data);
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
                  console.log(result);
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