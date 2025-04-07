import { colorList } from './ColorMapping.js';

const colorNameToColorMap = new Map();
for (let i = 0; i < colorList.length; i++) {
  colorNameToColorMap.set(colorList[i].color, colorList[i]);
}

export default colorNameToColorMap;
