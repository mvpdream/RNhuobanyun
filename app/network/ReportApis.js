'use strict';

import { getData,postData,postFormData } from './utils/Http'

/**
 * 查看使用的规则
 * @returns {Promise.<T>}
 */
export function getTasterAndRules() {
  return getData('GetTasterAndRules');
}

/**
 * 获取汇报模板
 * @param type 汇报类型
 * @param date_target 汇报时间
 * @returns {Promise.<T>}
 */
export function getReportTemplate(type, date_target) {
  return getData(`GetReportTemplate?reportType=${type}&dateTarget=${date_target}`);
}

/**
 * 创建汇报
 * @param body 汇报内容
 * @param type 汇报类型
 * @param create_time 创建时间
 * @param copy_to 抄送人ID
 * @param is_temp 是否暂存
 * @param files 上传的附件对象
 * @returns {Promise.<T>}
 */
export function createReport(body, type, create_time, copy_to, is_temp, files) {
  return postFormData('CreateReport', {
    ReportBody: body,
    ReportType: type,
    DateTarget: create_time,
    CopyTo: copy_to,
    IsTemp: is_temp,
    files: files
  });
}

/**
 * 更新汇报
 * @param id 汇报ID
 * @param body 汇报内容
 * @param type 汇报类型
 * @param copy_to 抄送人ID
 * @param is_temp 是否暂存
 * @param attachment_ids 已有的附件id
 * @param files 上传的附件对象
 * @returns {Promise.<T>}
 */
export function updateReport(id, body, type, copy_to, is_temp, attachment_ids, files) {
  return postFormData('UpdateReport', {
    ReportId: id,
    ReportBody: body,
    ReportType: type,
    CopyTo: copy_to,
    AttachmentIds: attachment_ids,
    IsTemp: is_temp,
    files: files
  });
}

/**
 * 获取汇报详情
 * @param id
 * @returns {Promise.<T>}
 */
export function getReportDetail(id) {
  return getData(`GetReportDetail?ReportId=${id}`);
}

/**
 * 获取用户的汇报列表
 * @param user_id 用户id
 * @param type 汇报类型
 * @param year 年
 * @param month 月
 * @returns {Promise.<T>}
 */
export function getReportListByUser(user_id, type, year, month) {
  return getData(`GetReportListByUser?UserId=${user_id}&ReportType=${type}&Year=${year}&Month=${month}`);
}

/**
 * 获取收到的汇报
 * @param type 汇报类型
 * @param page_index 页码
 * @returns {Promise.<T>}
 */
export function receivedReportList(type, page_index) {
  return getData(`ReceivedReportList?ReportType=${type}&PageIndex=${page_index || 1}`);
}

/**
 * 查询汇报提交情况
 * @returns {Promise.<T>}
 */
export function checkSubmitStatus(type) {
  return getData(`CheckSubmitStatus?ReportType=${type}`);
}