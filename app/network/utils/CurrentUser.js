/**
 * 维持当前用户的信息状态
 */
let currentLoginUser = null;

/**
 * 获取当前登录用户信息
 * @returns {*}
 */
export function getCurrentUser() {
  return currentLoginUser;
}

/**
 * 注销当前用户
 */
export function clearCurrentUser() {
  currentLoginUser = null;
}

/**
 * 设置当前用户信息
 * @param user 用户信息
 */
export function setCurrentUser(user) {
  currentLoginUser = user;
  Object.freeze(currentLoginUser);
}

/**
 * 获取当前用户ID
 * @returns {*}
 */
export function getCurrentUserId() {
  return currentLoginUser && currentLoginUser['id'];
}