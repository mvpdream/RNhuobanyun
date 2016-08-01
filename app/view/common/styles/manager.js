import { normal,colorful } from './style'

var _currentStyle = normal;
const STYLE_TYPE = {
  NORMAL: 0,
  COLORFUL: 1
};

module.exports = {
  styleType: STYLE_TYPE,
  getCurrentStyle: function () {
    return _currentStyle;
  },
  switchStyle: function (type) {
    switch (type) {
      case STYLE_TYPE.NORMAL:
        _currentStyle = normal;
        break;
      case STYLE_TYPE.COLORFUL:
        _currentStyle = colorful;
        break;
      default :
        _currentStyle = normal;
        break;
    }
  }
};

