'use strict';

import { getData,postData,postFormData } from './utils/Http'
import { setCurrentUser,clearCurrentUser } from './utils/CurrentUser'

/**
 * 用户登录
 * @param {string} phone_number 手机号码
 * @param {string} password 密码
 */
export function userLogin(phone_number, password) {
  return postData('Userlogin', {
    phoneNumber: phone_number,
    password: password
  }).then(res=> {
    if (res.Type == 1) {
      setCurrentUser(res.Data); //更新缓存中当前用户对象
    } else {
      clearCurrentUser(); //清空缓存的当前用户对象
    }
    return res;
  });
}

/**
 * 用户注册
 * @param {string} phone_number 手机号码
 * @param {string} password 密码
 * @param {string} valid_code 验证码
 */
export function userRegister(phone_number, password, valid_code) {
  return postData('UserRegister', {
    phoneNumber: phone_number,
    password: password,
    validCode: valid_code
  });
}
/**
 *验证码验证
 * @param phone_number 手机号
 * @param valid_code 验证码
 * @returns {Promise.<T>}
 */
export function checkApplyCode(phone_number, valid_code) {
  return postData('CheckApplyCode', {
    phoneNumber: phone_number,
    validCode: valid_code
  });
}
/**
 * 重置密码
 * @param phone_number 手机号
 * @param password 密码
 * @returns {Promise.<T>}
 */
export function findPassword(phone_number, password) {
  return postData('FindPassword', {
    phoneNumber: phone_number,
    password: password
  });
}
/**
 * 更新头像
 * @param avatarObj 更新的图片对象
 * @returns {*}
 */
export function updateAvatar(avatarObj) {
  return postFormData('UpdateAvatar', avatarObj);
}

/**
 * 获取用户信息
 * @returns {Promise.<T>}
 */
export function getUserProfile(user_id) {
  return getData(`GetUserProfile?userid=${user_id}`);
}

/**
 * 编辑用户信息
 * @param profile
 * @returns {Promise.<T>}
 */
export function editUserProfile(profile) {
  return postData('EditUserProfile', {
    Profile: profile
  });
}

/**
 * 获取用户上级列表
 */
export function getSuperiorList() {
  return getData('GetSuperiorList');
}

/**
 * 添加上级
 * @param user_id 添加的用户id
 */
export function addSuperior(user_id) {
  return postData('AddSuperior', {
    UserId: user_id
  });
}

/**
 * 移除上级
 * @param user_id 移除的用户id
 */
export function removeSuperior(user_id) {
  return postData('RemoveSuperior', {
    UserId: user_id
  });
}

/**
 * 重置密码
 * @param current_pwd 当前密码
 * @param new_pwd 新密码
 */
export function resetPassword(current_pwd, new_pwd) {
  return postData('ResetPassword', {
    CurrentPassword: current_pwd,
    NewPassword: new_pwd
  });
}

/**
 * 登出当前用户
 */
export function logout() {
  clearCurrentUser();
  return postData('Logout');
}

/**
 * 注销当前用户
 */
export function unregister() {
  return postData('Unregister');
}

/**
 * 获取我的下属列表
 * @returns {Promise.<T>}
 */
export function getMySubordinate() {
  return getData('GetMySubordinate');
}
