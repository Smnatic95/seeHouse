Component({
  mixins: [],
  data: {},
  props: {show:0},
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onGetAuthorize(){
       this.props.onAgreeAuth();
    },
    onAuthError(e){
      this.props.onErrorAuth(e);
    },
    cancel(){
      this.props.onCancelAuth();
    }
  },
});
