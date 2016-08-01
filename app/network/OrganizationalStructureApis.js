'use strict';

import { getData,postData } from './utils/Http';

/**
 * 获取用户列表
 * @param keyword
 * @returns {Promise.<T>}
 */
export function getUserList(keyword) {
  return getData(`GetUserList?keyword=${keyword}`);
}

/**
 * 获取部门列表
 * @param keyword
 * @returns {Promise.<T>}
 */
export function getDepList(keyword) {
  return getData(`GetDepList?keyword=${keyword}`);
}

/**
 * 获取指定部门的直属单位(用户/部门)
 * @param dep_id
 * @returns {Promise.<T>}
 */
export function getUnitsOfDep(dep_id) {
  return getData(`GetUnitsOfDep?DepId=${dep_id}`);
}

/**
 * 获取根据首字符分组后的用户列表
 * @returns {Promise.<T>}
 */
export function getUserListGroupByPrefix(){
  return getData(`GetUserListGroupByPrefix`);
}
/**
 * 获取批量导出的用户信息
 * @returns {Promise.<T>}
 */
export function groupImportUserInfo(user_ids){
  return postData('GroupImportUserInfo',{
    UserIds: user_ids
  });
}
