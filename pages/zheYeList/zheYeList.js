let url = "https://f.sksad.com/seller.php?s=/";
Page({
  data: {
    reasionList: null,
    showLogin: 0,
    rid: ''
  },
  onLoad(e) {
    my.setNavigationBar({
      title: "置业顾问-" + e.panName
    });
    let _this = this;
    e.rid && (this.setData({
      rid: e.rid
    }));
    this.checkLogin({
      success() {
        _this.getReasionList();
      }
    })
  },
  //获取置业顾问列表
  getReasionList() {
    my.showLoading();
    let _this = this;
    my.request({
      url: url + 'SwiperApi/getReasionList',
      method: 'get',
      data: { id: _this.data.rid, uid: _this.data.uid },
      dataType: 'json',
      success: (result) => {
        my.hideLoading();
        if (result.data.code == 1) {
          console.log(result)
          _this.setData({
            reasionList: result.data.data ? result.data.data : [],
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
      //准备复制的数据
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
  //收藏
  collect(d) {
    let _this = this;
    this.checkLogin({
      success() {
        var reasion_id = d.currentTarget.dataset.id,
          type = d.currentTarget.dataset.isCol;
        console.log({
          uid: _this.data.uid,
          rid: reasion_id,
          type
        })
        my.request({
          url: url + 'SwiperApi/collectReasion',
          method: 'get',
          data: {
            uid: _this.data.uid,
            rid: reasion_id,
            type
          },
          dataType: 'json',
          success: (result) => {
            my.showToast({
              type: 'success',
              content: result.data.msg,
              duration: 1000,
            });
            let reasionList = _this.data.reasionList;
            reasionList.forEach((reasion) => {
              reasion.id == reasion_id && (reasion.is_col = reasion.is_col ? 0 : 1)
            });
            _this.setData({
              reasionList
            });
          }
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
          _this.setData({
            uid: res.data.uid
          });
          option.success();
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
                  console.log('用户信息', result);
                  _this.getReasionList(1);
                  _this.setData({
                    showLogin: 0
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
