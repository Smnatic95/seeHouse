let url = "https://f.sksad.com/seller.php?s=/";
Page({
  data: {
    citys: [],
    word_list: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    goCitysId: 'A',
    showChsWordClass: '',
    curCityName: '郑州市'
  },
  onLoad(e) {
    console.log(e)
    this.getCityList();
    this.setData({
      curCityName: e.curCity ? e.curCity : '郑州市'
    })
  },
  getCityList() {
    let _this = this
    my.showLoading();
    my.request({
      url: url + 'SwiperApi/getCityList',
      method: 'get',
      data: {},
      dataType: 'json',
      success: (result) => {
        my.hideLoading();
        console.log('城市数据', result.data.data)
        if (result.data.code == 1) {
          _this.setData({
            citys: result.data.data
          });
        } else {
          my.showToast({
            type: 'success',
            content: result.data.msg,
            duration: 1500,
          });
        }
      }
    });
  },
  wordClick(e) {
    let chooseWord = e.currentTarget.dataset.word,
      hasCity = this.data.citys.some(citys => citys.initials == chooseWord);
    this.setData({
      showChsWordClass: '',
      goCitysId: chooseWord
    })
    setTimeout(() => {
      this.setData({
        showChsWordClass: 'fadeOut'
      });
    }, 50)
    if (hasCity) {
      my.pageScrollTo({
        selector: '#' + 'word' + chooseWord,
        duration: 150
      })
    } else {
      my.showToast({
        type: 'none',
        content: '暂无与' + chooseWord + '相关的城市',
        duration: 1500
      });
    };
  }
});
