let url = "https://f.sksad.com/seller.php?s=/";
import parse from 'mini-html-parser2';
Page({
  data: {
    contents: '',
    desc: '',
    title: ''
  },
  onLoad(e) {
    console.log(e)
    this.getnoticeDetail(e.rid);
  },
  //获取文章详情
  getnoticeDetail(id) {
    let _this = this;
    my.showLoading();
    my.request({
      url: url + 'SwiperApi/noticeDetail',
      method: 'get',
      data: { id },
      dataType: 'json',
      success: (result) => {
        my.hideLoading();
        console.log('数据', result.data.data);
        let html = _this.escape2Html(result.data.data.contents);
        let imgStrs = html.match(/<img.*?>/g);
        imgStrs.forEach(imgTag => {
          let imgTag_cls = imgTag.replace('>', ' style="max-width:100%;height:auto" />');
          html = html.replace(imgTag, imgTag_cls)
        });
        html = html.replace(/<section/g, '<div').replace(/\/section>/g, '/div>');
        parse(html, (err, nodes) => {
          console.log(nodes)
          if (!err) {
            this.setData({
              nodes,
              contents: result.data.data.contents,
              desc: result.data.data.desc,
              title: result.data.data.title,
              createtime: result.data.data.addtime
            });
          }
        });
      }
    });
  },
  escape2Html(str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
  }
});
