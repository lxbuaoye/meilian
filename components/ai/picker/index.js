// components/ai/picker/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    header: {
      type: String,
      value: '',
    },
    list: {
      type: Object,
      value: '',
    },
    itemWidth: {
      type: Number,
      value: 104,
    },
    itemHeight: {
      type: Number,
      value: 104,
    },
    innerPadding: {
      type: Number,
      value: 0,
    },
    outterPadding: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: 0,
    prompt: '',
    selection: '无',
    colorPickerVisible: false,
  },

  observers: {
    // 当 list 变更时尝试解析 cloud:// 链接为临时 URL
    'list': function (newList) {
      if (!newList || !Array.isArray(newList)) return;
      this.resolveCloudImages(newList);
    }
  },

  attached() {
    this.updateSelectionWithIndex(0);
    // 尝试在组件挂载时解析已有 list 中的 cloud:// 链接
    if (this.data.list && Array.isArray(this.data.list) && this.data.list.length > 0) {
      try {
        this.resolveCloudImages(this.data.list);
      } catch (e) {
        console.warn('resolveCloudImages on attached error', e);
      }
    }
  }, // 此处atta
  /**
   * 组件的方法列表
   */
  methods: {
    updateSelectionWithIndex(index) {
      if (this.data.list[index] && this.data.list[index].moreColorOption) {
        this.setData({ colorPickerVisible: true });
        return;
      }
      this.setData({
        value: index,
        selection: this.data.list[index].name,
        prompt: this.data.list[index].prompt,
      });
      if (this.data.list[index].shouldDownload) {
        this.setData({
          shouldDownload: this.data.list[index].shouldDownload,
          inputImageSrc: this.data.list[index].inputImageSrc,
        });
      } else {
        this.setData({
          shouldDownload: false,
        });
      }
      if (this.data.list[index].color) {
        this.setData({
          color: this.data.list[index].color,
        });
      }
      if (this.data.list[index].approximateName) {
        this.setData({
          approximateName: this.data.list[index].approximateName,
        });
      }
    },
    onChange(e) {
      this.updateSelectionWithIndex(e.detail.value);
    },

    onColorPickerVisibleChange(e) {
      this.setData({ colorPickerVisible: e.detail.visible });
    },
    closeColorPicker() {
      this.setData({ colorPickerVisible: false });
    },

    onSelectedColor(e) {
      const selection = e.detail;
      this.setData({
        list: [...this.data.list.slice(0, -1), selection, ...this.data.list.slice(-1)],
      });
      setTimeout(() => {
        this.updateSelectionWithIndex(this.data.list.length - 2);
      }, 100);
      this.setData({ colorPickerVisible: false });
    },
    
    // 将 list 中的 cloud:// fileID 批量转换为临时 URL 并写回 list[*].imageSrcTemp
    async resolveCloudImages(list) {
      try {
        const fileIdToIndexes = {};
        const fileList = [];
        list.forEach((item, idx) => {
          const src = item && item.imageSrc;
          if (typeof src === 'string' && src.startsWith('cloud://')) {
            if (!fileIdToIndexes[src]) {
              fileIdToIndexes[src] = [];
              fileList.push({ fileID: src, maxAge: 60 * 60 });
            }
            fileIdToIndexes[src].push(idx);
          }
        });

        if (fileList.length === 0) return;

        const resp = await wx.cloud.getTempFileURL({ fileList });
        if (!resp || !resp.fileList) return;

        resp.fileList.forEach((f) => {
          const url = f.tempFileURL || '';
          const fid = f.fileID;
          const indexes = fileIdToIndexes[fid] || [];
          indexes.forEach((i) => {
            // 设置 list[i].imageSrcTemp
            this.setData({
              [`list[${i}].imageSrcTemp`]: url,
            });
          });
        });
      } catch (err) {
        // 忽略错误，不阻塞主流程
        console.warn('resolveCloudImages error', err);
      }
    },
    
    // 当 image 加载失败时，尝试用 CLOUD_IMAGE_BASE 下的 /image/ai_change_coloer/ 文件夹替换
    onImageError(e) {
      try {
        const idx = e.currentTarget.dataset.index;
        const item = this.data.list && this.data.list[idx];
        if (!item) return;
        const app = getApp();
        const base = (app && app.globalData && app.globalData.CLOUD_IMAGE_BASE) || '';
        if (!base) return;

        // 尝试从原始 imageSrc 或 cloud fileID 中提取文件名
        let filename = '';
        const src = item.imageSrc || '';
        if (typeof src === 'string') {
          // cloud://.../path/filename.ext or .../filename.ext
          const lastSlash = src.lastIndexOf('/');
          filename = lastSlash !== -1 ? src.substring(lastSlash + 1) : src;
        }
        if (!filename && item.imageSrcTemp) {
          const lastSlash = item.imageSrcTemp.lastIndexOf('/');
          filename = lastSlash !== -1 ? item.imageSrcTemp.substring(lastSlash + 1) : item.imageSrcTemp;
        }
        if (!filename) return;

        // 优先使用 compressed_color_cards 目录中的缩略图（针对 texture/banbogan 等素材）
        const compressedNames = ['banbogan.jpg', 'tianerong.jpg', 'laimushi.jpg', 'yajingshi.jpg'];
        let fallback = `${base}/image/ai_change_coloer/${filename}`;
        try {
          const lower = (filename || '').toLowerCase();
          if (compressedNames.includes(lower)) {
            fallback = `${base}/compressed_color_cards/${filename}`;
          }
        } catch (e) {
          // ignore
        }
        // 写回到临时字段，触发视图更新
        this.setData({
          [`list[${idx}].imageSrcTemp`]: fallback,
        });
      } catch (err) {
        console.warn('picker onImageError', err);
      }
    },
  },
});
