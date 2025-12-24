Page({
  data: {
    url: '',
  },

  onLoad(options) {
    const url = options && options.url ? decodeURIComponent(options.url) : '';
    this.setData({ url });
  },
});
