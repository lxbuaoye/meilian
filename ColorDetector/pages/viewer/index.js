// pages/index/index.js
const app = getApp();

function rgbaToHex(r, g, b, a) {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  const rHex = toHex(r);
  const gHex = toHex(g);
  const bHex = toHex(b);

  if (a === 255) {
    return `#${rHex}${gHex}${bHex}`;
  }
  const aHex = toHex(Math.round((a / 255) * 255)); // Normalize alpha to 0-255
  return `#${rHex}${gHex}${bHex}${aHex}`;
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }
  return `${(h * 360).toFixed(0)}, ${(s * 100).toFixed(2)}%, ${(l * 100).toFixed(2)}`;
}

Page({
  data: {
    // ... (keep existing data: canvasWidth, canvasHeight, imagePath, etc.) ...
    canvasWidth: 500,
    canvasHeight: 600,
    menuBarTop: 44,
    menuBarHeight: 32,
    imagePath: '',
    imageInfo: null,
    ctx: null,
    scale: 1.0,
    fitScale: 1.0,
    minAllowedScale: 0.1,
    maxScale: 4.0,
    offsetX: 0,
    offsetY: 0,
    lastTouchX: 0,
    lastTouchY: 0,
    lastDistance: 0,
    isDragging: false,
    isPinching: false,

    // --- <<<<<<<<<< ADDED pixelInfoText data ---
    pixelColor: '',
    pixelColorHsl: '',
    pixelColorHex: '',
    pixelInfoText: '点击图片区域查看像素信息', // Initial text
  },

  onLoad(options) {
    const menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuBarTop: menuButton.top,
      menuBarHeight: menuButton.height,
    });
    this.setData({ imagePath: options.imageSrc });
  },

  // --- Keep existing functions: onReady, chooseImage, loadImage, drawImage, onTouchStart, onTouchMove, onTouchEnd, calculateDistance ---
  onReady: function (options) {
    /* ... unchanged ... */

    const query = wx.createSelectorQuery().in(this);
    query
      .select('#imageCanvas')
      .boundingClientRect((rect) => {
        if (rect) {
          this.setData({
            canvasWidth: wx.getWindowInfo().windowWidth,
            canvasHeight: wx.getWindowInfo().windowHeight,
          });
          this.ctx = wx.createCanvasContext('imageCanvas', this);
          console.log(this.data.imagePath);
          this.loadImage(this.data.imagePath);
          console.log('Canvas Context Initialized');
        } else {
          console.error('无法获取 Canvas 尺寸');
          this.ctx = wx.createCanvasContext('imageCanvas', this);
          console.log('Canvas Context Initialized with default size');
        }
      })
      .exec();
  },
  loadImage: function (path) {
    /* ... unchanged ... */
    if (!path) return;
    wx.showLoading({ title: '图片加载中...' });
    wx.getImageInfo({
      src: path,
      success: (res) => {
        const ctx = wx.createCanvasContext('imageCanvas', this);
        const imageWidth = res.width;
        const imageHeight = res.height;
        const { canvasWidth } = this.data;
        const { canvasHeight } = this.data;

        const imageAspectRatio = imageWidth / imageHeight;
        const canvasAspectRatio = canvasWidth / canvasHeight;

        let initialScale = 1;
        let initialOffsetX = 0;
        let initialOffsetY = 0;

        if (imageAspectRatio < canvasAspectRatio) {
          // 图片更宽，以高度为基准缩放
          initialScale = canvasHeight / imageHeight;
          initialOffsetX = (canvasWidth - imageWidth * initialScale) / 2;
          initialOffsetY = 0;
        } else {
          // 图片更高或比例相同，以宽度为基准缩放
          initialScale = canvasWidth / imageWidth;
          initialOffsetY = (canvasHeight - imageHeight * initialScale) / 2;
          initialOffsetX = 0;
        }

        this.setData(
          {
            imagePath: path,
            imageInfo: res,
            fitScale: initialScale,
            scale: initialScale,
            offsetX: initialOffsetX,
            offsetY: initialOffsetY,
            isDragging: false,
            isPinching: false,
            lastTouchX: 0,
            lastTouchY: 0,
            lastDistance: 0,
            pixelColor: '',
            pixelColorHsl: '',
            pixelColorHex: '',
            pixelInfoText: '点击图片区域查看像素信息', // Reset text on new image load
          },
          () => {
            this.drawImage();
            wx.hideLoading();
          },
        );
      },
      fail: (err) => {
        console.error('Get image info failed:', err);
        wx.hideLoading();
        wx.showToast({ title: '图片信息获取失败', icon: 'none' });
      },
    });
  },
  drawImage: function () {
    /* ... unchanged ... */
    if (!this.ctx || !this.data.imageInfo) return;
    const { ctx } = this;
    const { canvasWidth, canvasHeight, imagePath, imageInfo, scale, offsetX, offsetY } = this.data;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // Draw using explicit dx, dy, dWidth, dHeight for clarity with offset/scale
    ctx.drawImage(imagePath, offsetX, offsetY, imageInfo.width * scale, imageInfo.height * scale);
    ctx.draw();
  },
  onTouchStart: function (e) {
    /* ... unchanged ... */
    if (!this.data.imageInfo) return;
    const { touches } = e;
    if (touches.length === 1) {
      this.setData({
        isDragging: true,
        isPinching: false,
        lastTouchX: touches[0].clientX,
        lastTouchY: touches[0].clientY,
      });
    } else if (touches.length === 2) {
      const distance = this.calculateDistance(touches[0], touches[1]);
      this.setData({
        isDragging: false,
        isPinching: true,
        lastDistance: distance,
      });
    }
  },
  onTouchMove: function (e) {
    /* ... unchanged ... */
    if (!this.data.imageInfo) return;
    const { touches } = e;

    if (this.data.isDragging && touches.length === 1) {
      const touch = touches[0];
      const deltaX = touch.clientX - this.data.lastTouchX;
      const deltaY = touch.clientY - this.data.lastTouchY;
      this.setData({
        offsetX: this.data.offsetX + deltaX,
        offsetY: this.data.offsetY + deltaY,
        lastTouchX: touch.clientX,
        lastTouchY: touch.clientY,
      });
      this.drawImage();
    } else if (this.data.isPinching && touches.length === 2) {
      const currentDistance = this.calculateDistance(touches[0], touches[1]);
      if (this.data.lastDistance <= 0) {
        this.setData({ lastDistance: currentDistance });
        return;
      }
      const scaleFactor = currentDistance / this.data.lastDistance;
      let newScale = this.data.scale * scaleFactor;
      newScale = Math.max(this.data.fitScale, newScale);
      newScale = Math.min(newScale, this.data.maxScale);
      // newScale = Math.max(this.data.minAllowedScale, newScale); // Optional absolute min

      const centerX = (touches[0].clientX + touches[1].clientX) / 2;
      const centerY = (touches[0].clientY + touches[1].clientY) / 2;
      const imgRelativeX = (centerX - this.data.offsetX) / this.data.scale;
      const imgRelativeY = (centerY - this.data.offsetY) / this.data.scale;
      const newOffsetX = centerX - imgRelativeX * newScale;
      const newOffsetY = centerY - imgRelativeY * newScale;

      this.setData({
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
        lastDistance: currentDistance,
      });
      this.drawImage();
    }
  },
  onTouchEnd: function (e) {
    /* ... unchanged ... */
    if (e.touches.length === 0) {
      this.setData({
        isDragging: false,
        isPinching: false,
        lastDistance: 0,
        lastTouchX: 0,
        lastTouchY: 0,
      });
    } else if (e.touches.length === 1 && this.data.isPinching) {
      this.setData({
        isPinching: false,
        isDragging: true,
        lastTouchX: e.touches[0].clientX,
        lastTouchY: e.touches[0].clientY,
        lastDistance: 0,
      });
    }
  },
  calculateDistance: function (touch1, touch2) {
    /* ... unchanged ... */
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  },

  // --- <<<<<<<<<< ADDED onTap Function ---
  onTap: function (e) {
    // Ensure image and context are ready
    if (!this.data.imageInfo || !this.ctx) {
      this.setData({ pixelColor: '', pixelInfoText: '请先加载图片' });
      return;
    }

    // 1. Get Tap Coordinates (relative to canvas)
    // Use e.detail.x and e.detail.y for tap events on canvas
    const canvasX = e.detail.x;
    const canvasY = e.detail.y;
    const tapX = Math.floor(canvasX); // Use integer coordinates
    const tapY = Math.floor(canvasY);

    console.log(`Tap on canvas at: (${tapX}, ${tapY})`);

    const { offsetX, offsetY, scale, imageInfo } = this.data;

    // 2. Check if tap is within the *drawn* image bounds on the canvas
    const drawX = offsetX;
    const drawY = offsetY;
    const drawWidth = imageInfo.width * scale;
    const drawHeight = imageInfo.height * scale;
    const drawEndX = drawX + drawWidth;
    const drawEndY = drawY + drawHeight;

    if (tapX >= drawX && tapX < drawEndX && tapY >= drawY && tapY < drawEndY) {
      // 3. Use wx.canvasGetImageData to read the pixel data at the tapped canvas coordinate
      wx.canvasGetImageData(
        {
          canvasId: 'imageCanvas',
          x: tapX,
          y: tapY,
          width: 1,
          height: 1,
          success: (res) => {
            // res.data contains [R, G, B, A] for the single pixel
            const pixelData = res.data;
            const r = pixelData[0];
            const g = pixelData[1];
            const b = pixelData[2];
            const a = pixelData[3]; // Alpha value (0-255)

            // Calculate approximate original image coordinate (for display info only)
            const imageX = Math.floor((tapX - offsetX) / scale);
            const imageY = Math.floor((tapY - offsetY) / scale);

            console.log(
              `Pixel at canvas(${tapX}, ${tapY}) -> approx img(${imageX}, ${imageY}): R=${r}, G=${g}, B=${b}, A=${a}`,
            );

            // 4. Display the result
            this.setData({
              pixelColor: `rgb(${r},${g},${b})`,
              pixelColorHex: rgbaToHex(r, g, b, a),
              pixelColorHsl: rgbToHsl(r, g, b),
              pixelInfoText: `画布坐标 (${tapX}, ${tapY})\n像素值: R=${r}, G=${g}, B=${b}, A=${a}`,
            });
          },
          fail: (err) => {
            console.error('wx.canvasGetImageData 失败:', err);
            // Check if err.errMsg contains "canvas has not been painted"
            let errorMsg = '读取像素信息失败';
            if (err.errMsg && err.errMsg.includes('canvas has not been painted')) {
              errorMsg = '读取失败，画布可能尚未绘制完成';
            }
            this.setData({
              pixelColor: '',
              pixelInfoText: errorMsg,
            });
          },
        },
        this,
      ); // Pass component instance 'this'
    } else {
      // Tap was outside the drawn image area
      console.log('Tap is outside the drawn image area.');
      this.setData({
        pixelColor: '',
        pixelInfoText: '点击位置在图片外部',
      });
    }
  },

  goBack() {
    wx.navigateBack({
      delta: 1,
    });
  },
});
