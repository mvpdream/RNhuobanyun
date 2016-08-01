'use strict';

import { getData,postData } from './utils/Http'
import { setCurrentUser,clearCurrentUser } from './utils/CurrentUser'

/**
 * 创建企业
 * @param {string} company_name 企业名称
 * @param {string} short_name 企业简称
 * @param {string} user_name 创建者名称
 */
export function createCompany(company_name, short_name, user_name) {
  return postData('createCompany', {
    companyName: company_name,
    shortName: short_name,
    creatorName: user_name
  });
}

/**
 * 加入企业
 * @param {string} company_code 企业code
 * @param {string} user_name 用户名称
 */
export function joinCompany(company_code, user_name) {
  return postData('joinCompany', {
    companyCode: company_code,
    userName: user_name
  });
}

/**
 * 获取企业列表
 */
export function getCompanyList() {
  return getData('companyList');
}

/**
 * 取消加入企业的申请
 * @param {string|number} user_id 用户id
 * @returns {*}
 */
export function cancelApply(user_id) {
  return postData('cancelApply', {
    userId: user_id
  });
}

/**
 * 进入企业
 * @param {number} user_id 用户id
 * @returns {*}
 */
export function enterCompany(user_id) {
  return postData('enterCompany', {
    userId: user_id
  }).then(res=> {
    if (res.Type == 1) {
      setCurrentUser(res.Data);
      return res;
    } else {
      clearCurrentUser();
      return res;
    }
  });
}
