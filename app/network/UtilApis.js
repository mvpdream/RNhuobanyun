'use strict';

import { getData,postData } from './utils/Http'
import { setCurrentUser } from './utils/CurrentUser'

/**
 * 获取短信验证码
 * @param {string} phone_number 手机号码
 * @param {string} phone_code 加密字符串
 */
export function getValidCode(phone_number,phone_code) {
  return getData(`getvalidcode?phonenumber=${phone_number}&code=${phone_code}`);
}

/**
 * 获取短信验证码(找回密码)
 * @param {string} phone_number 手机号码
 */
export function getFindPasswordCode(phone_number) {
  return getData(`getFindPasswordCode?phonenumber=${phone_number}`);
}


/**
 * 更新
 * @param {string} version_number 版本号
 */
export function checkUpdate(version_number) {
  return getData(`CheckUpdate?versionNum=${version_number}&type=0`);
}

/**
 * 检查登录状态
 * -----------
 * Type如下
 * 0 - 账号未登录
 * 1 - 正常登录
 * 2 - 用户未登录
 */
export function checkLoginState() {
  return getData(`CheckLoginState`).then(res=> {
    if (res.Type == 1 && !!res.Data) {
      //当用户正常登录时 更新currentUser缓存
      setCurrentUser(res.Data);
    }
    return res;
  });
}
