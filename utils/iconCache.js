/**
 * 底部导航栏图标缓存管理器
 * 负责下载云端图标并缓存到本地，避免重复下载
 */

const ICON_CACHE_KEY = 'tab_bar_icons_cache';
const ICON_CACHE_VERSION = '1.0.0';

/**
 * 获取所有导航栏图标URL列表
 */
function getTabIconUrls() {
  const IMAGE_BASE_URL = 'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la';

  return [
    `${IMAGE_BASE_URL}/image/common/home_unselected.png`,
    `${IMAGE_BASE_URL}/image/common/home_selected.png`,
    `${IMAGE_BASE_URL}/image/common/color_card_unselected.png`,
    `${IMAGE_BASE_URL}/image/common/color_card_selected.png`,
    `${IMAGE_BASE_URL}/image/common/explore more1.png`,
    `${IMAGE_BASE_URL}/image/common/explore more.png`,
    `${IMAGE_BASE_URL}/image/common/icon-01-2.png`,
    `${IMAGE_BASE_URL}/image/common/icon-01.png`,
    `${IMAGE_BASE_URL}/image/common/my_meilian_unselected.png`,
    `${IMAGE_BASE_URL}/image/common/my_meilian_selected.png`,
  ];
}

/**
 * 下载单个图标并保存到本地持久化目录
 * @param {string} url - 图标URL
 * @param {string} filename - 保存的文件名
 * @returns {Promise<string>} 本地持久化文件路径
 */
function downloadIcon(url, filename) {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager();
    const userDataPath = wx.env.USER_DATA_PATH;
    const filePath = `${userDataPath}/${filename}`;

    // 首先检查文件是否已存在
    fs.access({
      path: filePath,
      success: () => {
        // 文件已存在，直接返回路径
        resolve(filePath);
      },
      fail: () => {
        // 文件不存在，下载并保存
        wx.downloadFile({
          url: url,
          success: (res) => {
            if (res.statusCode === 200) {
              // 将临时文件复制到持久化目录
              fs.saveFile({
                tempFilePath: res.tempFilePath,
                filePath: filePath,
                success: () => {
                  resolve(filePath);
                },
                fail: (error) => {
                  console.error('保存图标文件失败:', error);
                  reject(error);
                }
              });
            } else {
              reject(new Error(`Download failed with status ${res.statusCode}`));
            }
          },
          fail: reject
        });
      }
    });
  });
}

/**
 * 生成图标文件名
 * @param {string} url - 图标URL
 * @returns {string} 文件名
 */
function generateIconFilename(url) {
  // 从URL中提取文件名
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];
  // 添加版本号避免缓存冲突
  return `icon_${ICON_CACHE_VERSION}_${filename}`;
}

/**
 * 批量下载所有图标
 * @returns {Promise<Object>} URL到本地路径的映射对象
 */
function downloadAllIcons() {
  const urls = getTabIconUrls();
  const downloadPromises = urls.map((url, index) => {
    const filename = generateIconFilename(url);
    return downloadIcon(url, filename);
  });

  return Promise.all(downloadPromises)
    .then(filePaths => {
      const iconMap = {};
      urls.forEach((url, index) => {
        iconMap[url] = filePaths[index];
      });
      return iconMap;
    });
}

/**
 * 清理旧版本的图标文件
 */
function cleanupOldIconFiles() {
  try {
    const fs = wx.getFileSystemManager();
    const userDataPath = wx.env.USER_DATA_PATH;

    // 读取目录内容
    const files = fs.readdirSync(userDataPath);

    // 删除旧版本的图标文件
    files.forEach(file => {
      if (file.startsWith('icon_') && !file.includes(ICON_CACHE_VERSION)) {
        try {
          fs.unlinkSync(`${userDataPath}/${file}`);
          console.log('清理旧图标文件:', file);
        } catch (error) {
          console.error('删除旧图标文件失败:', file, error);
        }
      }
    });
  } catch (error) {
    console.error('清理旧图标文件失败:', error);
  }
}

/**
 * 保存图标缓存到本地存储
 * @param {Object} iconMap - URL到本地路径的映射对象
 */
function saveIconCache(iconMap) {
  try {
    // 清理旧版本文件
    cleanupOldIconFiles();

    const cacheData = {
      version: ICON_CACHE_VERSION,
      timestamp: Date.now(),
      icons: iconMap
    };
    wx.setStorageSync(ICON_CACHE_KEY, cacheData);
    console.log('图标缓存保存成功');
  } catch (error) {
    console.error('保存图标缓存失败:', error);
  }
}

/**
 * 验证本地图标文件是否存在
 * @param {Object} iconMap - 图标映射对象
 * @returns {boolean} 是否所有图标文件都存在
 */
function validateIconFiles(iconMap) {
  const fs = wx.getFileSystemManager();

  for (const url in iconMap) {
    try {
      fs.accessSync(iconMap[url]);
    } catch (error) {
      console.log('图标文件不存在:', iconMap[url]);
      return false;
    }
  }

  return true;
}

/**
 * 从本地存储加载图标缓存
 * @returns {Object|null} 缓存的图标映射对象，如果不存在或过期则返回null
 */
function loadIconCache() {
  try {
    const cacheData = wx.getStorageSync(ICON_CACHE_KEY);
    if (!cacheData) {
      return null;
    }

    // 检查缓存版本和有效期（30天）
    const CACHE_VALID_DURATION = 30 * 24 * 60 * 60 * 1000; // 30天
    if (cacheData.version !== ICON_CACHE_VERSION ||
        (Date.now() - cacheData.timestamp) > CACHE_VALID_DURATION) {
      console.log('图标缓存已过期，准备重新下载');
      return null;
    }

    // 验证本地文件是否存在
    if (!validateIconFiles(cacheData.icons)) {
      console.log('图标文件不存在，准备重新下载');
      return null;
    }

    console.log('使用本地图标缓存');
    return cacheData.icons;
  } catch (error) {
    console.error('加载图标缓存失败:', error);
    return null;
  }
}

/**
 * 初始化图标缓存
 * @returns {Promise<Object>} URL到本地路径的映射对象
 */
function initIconCache() {
  return new Promise((resolve, reject) => {
    // 首先尝试加载本地缓存
    const cachedIcons = loadIconCache();
    if (cachedIcons) {
      console.log('导航栏图标使用本地缓存');
      resolve(cachedIcons);
      return;
    }

    // 如果没有缓存或缓存过期，则下载新图标
    console.log('开始下载导航栏图标到本地...');
    downloadAllIcons()
      .then(iconMap => {
        saveIconCache(iconMap);
        console.log('导航栏图标下载完成，已保存到本地');
        resolve(iconMap);
      })
      .catch(error => {
        console.error('下载图标失败:', error);
        // 下载失败时返回原始URL
        const fallbackMap = {};
        getTabIconUrls().forEach(url => {
          fallbackMap[url] = url;
        });
        console.log('使用原始URL作为fallback');
        resolve(fallbackMap);
      });
  });
}

/**
 * 获取图标路径（优先使用缓存的本地路径）
 * @param {string} url - 原始图标URL
 * @param {Object} iconCache - 图标缓存映射对象
 * @returns {string} 本地缓存路径或原始URL
 */
function getIconPath(url, iconCache) {
  return iconCache && iconCache[url] ? iconCache[url] : url;
}

export {
  initIconCache,
  getIconPath,
  ICON_CACHE_KEY
};
