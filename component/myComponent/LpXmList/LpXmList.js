Component({
  mixins: [],
  data: {
    myLoupanList: ''
  },
  props: {
    louPanlist: '',
    noPanToa: '暂无相关楼盘...',
    showYHlouPan:false
  },
  didMount() {

  },
  didUpdate() {
    console.log(this.props.louPanlist);
    this.props.louPanlist && this.props.louPanlist.forEach((louPan) => {
      louPan.maskOpacity = 0
    });
  },
  didUnmount() { },
  methods: {
    toDetail: (e) => {
      let id = e.currentTarget.dataset.id;
      my.navigateTo({
        url: '/pages/louPanDetail/louPanDetail?index=' + id
      });
    },
    toZhiyeList(e) {
      let rid = e.currentTarget.dataset.id,
        name = e.currentTarget.dataset.name;
      my.navigateTo({
        url: '/pages/zheYeList/zheYeList?rid=' + rid + '&panName=' + name
      });
    }
  },
});

