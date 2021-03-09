let url = "https://f.sksad.com/seller.php?s=/";
App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');
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
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
