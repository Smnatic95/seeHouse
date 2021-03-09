let url = "https://f.sksad.com/seller.php?s=/";
Page({
  data: {
    init: false,
    curInd: 0
  },
  onLoad() {
    this.setData({
      city_name: my.getStorageSync({ key: 'city_info' }).data.cityName
    })
    this.getNoticeTypeList();
  },
  //点击分类
  catItemClick(e) {
    let curInd = e.currentTarget.dataset.index;
    this.setData({
      curInd
    });
    let types = this.data.types;
    //如果没有初始化数据
    if (types[curInd].page == 0) {
      this.getnoticeByTid(curInd);
    }
  },
  //轮播图切换
  swiperChange(e) {
    let current = e.detail.current;
    this.setData({
      curInd: current
    });
    let types = this.data.types;
    //如果没有初始化数据
    if (types[current].page == 0) {
      this.getnoticeByTid(current);
    }
  },
  //文章列表
  getnoticeByTid(curInd) {
    my.showLoading();
    my.request({
      url: url + 'SwiperApi/noticeByTid',
      method: 'get',
      data: { id: this.data.types[curInd].id, page: this.data.types[curInd].page + 1 },
      dataType: 'json',
      success: (result) => {
        my.stopPullDownRefresh();
        my.hideLoading();
        if (result.data.code == 1) {
          let types = this.data.types;
          types.forEach((type) => {
            if (type.id == this.data.types[curInd].id) {
              type.hasNext = Boolean(result.data.data);
              type.page = ++type.page;
              if (result.data.data) {
                type.noticeList = type.noticeList ? type.noticeList.concat(result.data.data) : result.data.data;
              }
            }
          });
          this.setData({
            types
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
  //分类数据
  getNoticeTypeList() {
    let _this = this;
    my.showLoading();
    my.request({
      url: url + 'SwiperApi/noticeTypeList',
      method: 'get',
      data: { city_name: _this.data.city_name },
      dataType: 'json',
      success: (result) => {
        my.hideLoading();
        if (result.data.code == 1) {
          result.data.data.types.forEach((item) => {
            item.page = 0;
            item.hasNext = true;
          });
          result.data.data.types[0].noticeList = result.data.data.notice_data;
          result.data.data.types[0].page = 1;
          this.setData({
            types: result.data.data.types,
            init: true
          });
          console.log(result.data.data);
        } else {
          my.showToast({
            type: 'fail',
            content: result.data.msg,
            duration: 1500,
          });
        }
      }, fail(err) {
        my.showToast({
          type: 'fail',
          content: err,
          duration: 1500,
        });
      }
    });
  },
  //滑到底部
  onScrollToLower() {
    let curInd = this.data.curInd;
    if (this.data.types[curInd].hasNext) {
      this.getnoticeByTid(this.data.curInd)
    }
  },
  catchTouchMove(e) {

  },
  catchTouchStart(e) {

  },
  onPullDownRefresh() {
    let curInd = this.data.curInd,
      types = this.data.types;
    types[curInd].page = 0;
    types[curInd].hasNext = true;
    types[curInd].noticeList = [];
    this.setData({
      types
    });
    this.getnoticeByTid(curInd);
  }
});
