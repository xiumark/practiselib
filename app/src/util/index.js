/**
 * Created by a on 2017/7/13.
 */
import { getLocalStorage, setLocalStorage } from './cache';
import { getDomainConfig } from './network';
const _ = require('lodash');

let domainConfig = null;
getDomainConfig(response => {
  domainConfig = response;
});

let language = '';
export function getLanguage() {
  language = getLocalStorage('appLanguage');
  if (!language) {
    language = navigator.language;

    if (!language) {
      language = navigator.browserLanguage;
    }

    if (language) {
      let lans = language.split('-');
      if (lans.length > 1) {
        language = lans[0];
      }
    }
  }
  return language;
}

export function setLanguage(language) {
  this.language = language;
  setLocalStorage('appLanguage', language);
}

export function intlFormat(data) {
  let lan = getLanguage();
  return data[lan] ? data[lan] : data['en'];
}

export function getObjectByKey(list, key, value) {
  for (var i = 0; i < list.length; i++) {
    if (list[i][key] == value) {
      return list[i];
    }
  }
  return null;
}

export function getIndexByKey(list, key, value) {
  for (var i = 0; i < list.length; i++) {
    if (list[i][key] == value) {
      return i;
    }
  }
  return -1;
}

/**
 *  获取字符串填充html元素宽度
 *  @str
 */
export function getElementOffwidth(str, fontSize = '14px') {
  var w = 0;
  var html = document.createElement('span');
  html.style.visibility = 'hidden';
  html.style.fontSize = fontSize;
  html.innerHTML = str;
  document.body.appendChild(html);
  w = html.offsetWidth;
  document.body.removeChild(html);
  return w;
}

/**
 *
 * @param key(model)
 */
export function getClassByModel(key) {
  switch (key) {
    case 'gateway':
    case 'ssgw':
      return 'icon_gateway';
    case 'lc':
    case 'ssslc':
      return 'icon_lc';
    case 'sensor':
    case 'sses':
      return 'icon_control';
    //智慧路灯 icon
    case 'smartlight':
      return 'icon_smart_light';
    case 'smartLightPole':
      return 'icon_light_control';
    case 'ammeter':
      return 'icon_ammeter';
    case 'pole':
      return 'icon_pole';
    case 'screen':
    case 'ssads':
      return 'icon_screen';
    case 'xes':
      return 'icon_collect';
    case 'scene':
      return 'icon_scene';
    default:
      return 'icon_lc';
  }
}

export function getDeviceTypeByModel(key) {
  switch (key) {
    case 'lc':
    case 'ssgw':
      return 'CONTROLLER';
    case 'led':
    case 'ssslc':
      return 'DEVICE';
    case 'plc':
      return 'PLC';
    case 'ammeter':
      return 'icon_ammeter';
    case 'pole':
      return 'POLE';
    case 'screen':
      return 'SCREEN';
    case 'xes':
      return 'XES';
    case 'gateway':
      return 'GATEWAY';
    case 'sensor':
      return 'SENSOR';
    default:
      return 'DEVICE';
  }
}

export function transformDeviceType(deviceType) {
  switch (deviceType) {
    case 'DEVICE':
      return 'lamp';
    case 'CONTROLLER':
      return 'lc';
    case 'ISTREETLIGHT':
      return 'intelligent';
    case 'CHARGER':
      return 'charger';
    case 'POLE':
      return 'pole';
    case 'SCREEN':
      return 'screen';
    case 'PLC':
      return 'plc';
    case 'XES':
      return 'xes';
    case 'GATEWAY':
      return 'gateway';
    case 'SENSOR':
      return 'sensor';
    default:
      return null;
  }
}

export function getNotifyStateClass(state) {
  switch (state) {
    case 0:
      return 'fail';
    case 1:
      return 'success';
    case 2:
      return 'warning';
    default:
      break;
  }
}

export function IsMapCircleMarker(domainLevel, map) {
  if (!domainLevel || !map) {
    return false;
  }
  // return map.zoom < map.maxZoom - (map.maxZoom - map.minZoom) / domainLevel;
  const domain = domainConfig[domainConfig.length - 1];
  return map.zoom < domain.zoomRange[0];
}

export function getDomainLevelByMapLevel(domainLevel, map) {
  // if (map.zoom == map.minZoom) {
  //     return Math.min(1, domainLevel);
  // }
  // if (map.zoom == map.maxZoom) {
  //     return Math.max(1, domainLevel);
  // }
  // return Math.round((map.zoom - map.minZoom + 1) * domainLevel / (map.maxZoom - map.minZoom));
  const domain = _.find(domainConfig, domain => {
    return map.zoom >= domain.zoomRange[0] && map.zoom <= domain.zoomRange[1];
  });
  return domain ? domain.id : domainConfig.length + 1;
}

export function getZoomByMapLevel(curLevel, domainLevel, map) {
  //  if (map.zoom == map.minZoom) {
  //      return Math.min(map.minZoom, map.maxZoom);
  //  }
  //  if (map.zoom == map.maxZoom) {
  //      return Math.max(map.minZoom, map.maxZoom);
  //  }
  //  return Math.round(curLevel*(map.maxZoom-map.minZoom)/domainLevel+map.minZoom-1);

  return domainConfig[curLevel - 1].zoomRange[1];
}

export const DOMAIN_NAME_LENGTH = 16;
export const DEVICE_ID_LENGTH = 16;
export const DEVICE_NAME_LENGTH = 16;
export const STRATEGY_NAME_LENGTH = 16;

export function numbersValid(number) {
  // return /^([1-9]\d*)|0$/.test(number)
  if (number == null) {
    return false;
  }
  return /^[+-]?\d*\.?\d*$/.test(number);
}

export function NameValid(name) {
  return /^[a-zA-Z_\u4e00-\u9fa5][\w\u4e00-\u9fa5]*$/.test(name);
}

export function Name2Valid(name) {
  return /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(name);
}

export function Name3Valid(name) {
  // return /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(name);
  return true;
}
export function IPValid(ip) {
  return /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/.test(ip);
}

export function PORTValid(port) {
  if (port < 1 || port > 65535) {
    return false;
  }
  return /^([1-9]\d*|0)$/.test(port);
}

export function MACValid(mac) {
  return /^[0-9A-F]{16}$/.test(mac);
}

export function lngValid(value) {
  return /^[-]?(\d|([1-9]\d)|(1[0-7]\d)|(180))(\.\d*)?$/.test(value);
}

export function latValid(value) {
  return /^[-]?(\d|([1-8]\d)|(90))(\.\d*)?$/.test(value);
}

export function latlngValid(str) {
  return str.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, '');
}

export function PassWordValid(password) {
  return /^[_0-9a-zA-Z]+$/.test(password);
}

export function makeTree(pre) {
  const data = pre.map(v => {
    if (!v.parentId) v.parentId = '';
    return v;
  });
  let groupedByParents = _.groupBy(data, 'parentId');
  let keysById = _.keyBy(data, 'id');
  _.each(_.omit(groupedByParents, ''), function(children, parentId) {
    keysById[parentId].children = children;
  });
  return groupedByParents[''];
}

export function transformKey(name) {
  switch (name) {
    case 'ssgw':
      return 'gateway';
    case 'ssslc':
      return 'lc';
    case 'sses':
      return 'sensor';
    case 'ssads':
      return 'screen';
    default:
      return '';
  }
}

//设备编号输入验证处理
export function checkDeviceId(value, oldValue) {
  let newValue = oldValue;
  if (/^[0-9a-f]*$/i.test(value)) {
    newValue = value.toUpperCase();
  }
  return newValue;
}
