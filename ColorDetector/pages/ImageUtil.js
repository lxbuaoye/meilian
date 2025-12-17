import { colorList } from './ColorMapping.js';
import colorNameToColorMap from './ColorNameToColorMap';

export const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export function rgbToHex(r, g, b) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export const findCloestColor = (color) => {
  if (color === null) {
    return;
  }
  let minDeviation = Number.MAX_SAFE_INTEGER;
  let result;
  for (let i = 0; i < colorList.length; i++) {
    const temp = colorList[i];
    const deviation =
      ((temp.red - color.r) * (temp.red - color.r) +
        (temp.green - color.g) * (temp.green - color.g) +
        (temp.blue - color.b) * (temp.blue - color.b)) /
      3;
    if (deviation < minDeviation) {
      result = temp;
      minDeviation = deviation;
    }
  }
  return result != null ? result : null;
};

export async function processImage(originalImage) {
  console.log(originalImage);
  const { width, height } = originalImage;
  const canvas = wx.createOffscreenCanvas({ type: '2d', width: width, height: height });
  // 获取 context。注意这里必须要与创建时的 type 一致
  const context = canvas.getContext('2d');

  // 创建一个图片
  const image = canvas.createImage();
  // 等待图片加载
  await new Promise((resolve) => {
    image.onload = resolve;
    image.src = originalImage.path; // 要加载的图片 url
  });

  // 把图片画到离屏 canvas 上
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  // 获取画完后的数据
  const imageData = context.getImageData(0, 0, width, height);
  const originalData = imageData.data;

  let increment = 1;
  if (width * height > 1000 * 1000) {
    increment = 20;
  } else if (width * height > 500 * 500) {
    increment = 10;
  } else if (width * height > 100 * 100) {
    increment = 5;
  }

  const colorNameToCountMap = new Map();

  for (let y = 0; y < height; y += increment) {
    for (let x = 0; x < width; x += increment) {
      // Calculate the starting index of the pixel in the array
      const index = (y * width + x) * 4;
      const tempColor = {
        r: originalData[index],
        g: originalData[index + 1],
        b: originalData[index + 2],
        // a: originalData[index + 3], we don't care for now
      };

      const cloestColor = findCloestColor(tempColor);
      if (cloestColor === null) {
        return;
      }
      if (colorNameToCountMap.has(cloestColor.color)) {
        colorNameToCountMap.set(cloestColor.color, colorNameToCountMap.get(cloestColor.color) + 1);
      } else {
        colorNameToCountMap.set(cloestColor.color, 1);
      }
    }
  }
  /*
  groupResult = [
    {
      colorName: "XBS 10"
      color: "hex",
      count: 100,
    }
  ]
  */

  const mapEntries = Array.from(colorNameToCountMap.entries());

  // Sort the array of entries based on the value (the second element of each entry [key, value])
  mapEntries.sort(([, valueA], [, valueB]) => {
    if (valueA > valueB) {
      return -1;
    }
    if (valueA < valueB) {
      return 1;
    }
    return 0;
  });

  // Sum the value
  let totalPixelCount = 0;
  const colorGroupResultMap = new Map();
  for (let i = 0; i < mapEntries.length; i++) {
    const colorGroupName = colorNameToColorMap.get(mapEntries[i][0]).colorGroup;
    totalPixelCount += mapEntries[i][1];

    if (colorGroupResultMap.has(colorGroupName)) {
      colorGroupResultMap.get(colorGroupName).count += mapEntries[i][1];
    } else {
      colorGroupResultMap.set(colorGroupName, {
        colorName: mapEntries[i][0],
        count: mapEntries[i][1],
        hex: rgbToHex(
          colorNameToColorMap.get(mapEntries[i][0]).red,
          colorNameToColorMap.get(mapEntries[i][0]).green,
          colorNameToColorMap.get(mapEntries[i][0]).blue,
        ),
      });
    }
  }

  const mapEntries2 = Array.from(colorGroupResultMap.entries());

  mapEntries2.sort((a, b) => {
    if (a.count > b.count) {
      return -1;
    }
    if (a.count < b.count) {
      return 1;
    }
    return 0;
  });
  console.log(mapEntries2);
  return {
    totalPixelCount: totalPixelCount,
    detail: mapEntries2.map((item) => {
      return {
        colorGroupName: item[0],
        ...item[1],
        percentage: ((item[1].count * 100) / totalPixelCount).toFixed(2),
      };
    }),
  };
}
