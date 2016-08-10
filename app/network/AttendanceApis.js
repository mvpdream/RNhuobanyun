'use strict';

import { getData,postData,postFormData } from './utils/Http';

/**
 * 获取我的考勤规则（是否需要wifi）
 * @returns {Promise.<T>}
 */
export function getAttendanceRule() {
  return getData(`GetAttendanceRule`);
}
/**
 * 获取考勤首页
 * @param mac
 * @param name
 * @param longitude 经度
 * @param latitude 纬度
 * @returns {Promise.<T>}
 */
export function attendance(mac,name,longitude,latitude) {
  return getData(`Attendance?mac=${mac}&name=${name}&longitude=${longitude}&latitude=${latitude}`);
}
/**
 * 考勤打卡
 * @param mobileMac 设备MAC
 * @param longitude 经度
 * @param latitude 纬度
 * @returns {Promise.<T>}
 */
export function checkIn(mobileMac,longitude,latitude) {
  return postData('CheckIn', {
    mobileMac: mobileMac,
    longitude:longitude,
    latitude:latitude
  })
}
/**
 *获取我的考勤数据
 * @param month 月份
 * @returns {Promise.<T>}
 */
export function myAttendance(month) {
  return getData(`MyAttendance?month=${month}`);
}
