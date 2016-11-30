'use strict';

import { getData,postData,postFormData } from './utils/Http'

/**
 * 查看我的任务
 * @returns {Promise.<T>}
 */
export function myTasks() {
  return getData('MyTasks');
}
/**
 * 查看未读任务
 * @returns {Promise.<T>}
 */
export function unreadTaskCount() {
  return getData('UnreadTaskCount');
}
/**
 * 任务筛选列表
 * @param filter类型
 * @param page_index页数
 * @returns {Promise.<T>}
 * @constructor
 */
export function myTaskFilter(filter, page_index) {
  return getData(`MyTaskFilter?filter=${filter}&pageIndex=${page_index || 1}`);
}
/**
 * 获取我的下属和部门
 * @returns {Promise.<T>}
 */
export function getUnderlingAndDepartment() {
  return getData(`GetUnderlingAndDepartment`);
}
/**
 * 获取搜索结果
 * @param keyword关键字
 * @param userId用户Id
 * @param departmentId部门Id
 * @returns {Promise.<T>}
 */
export function getSearchTasks(keyword, userId,departmentId) {
  return getData(`GetSearchTasks?keyword=${keyword}&userId=${userId}&departmentId=${departmentId}`);
}
/**
 * 获取某个任务的拓展属性
 * @param taskId任务Id
 * @returns {Promise.<T>}
 */
export function getExtendedProperty(taskId) {
  return getData(`GetExtendedProperty?taskId=${taskId}`);
}
/**
 * 创建任务
 * @param creatModel
 * @param files
 * @returns {*}
 */
export function createTask(creatModel,properties,members,files) {
  return postFormData('CreateTask', {
    creatModel: creatModel,
    properties:properties,
    members:members,
    files: files
  });
}
/**
 * 修改任务
 * @param editmodel
 * @param propertieIds
 * @param properties
 * @param members
 * @param files
 * @returns {*}
 */
export function editTask(editmodel,propertieIds,properties,members,attachmentIds,files) {
  return postFormData('EditTask', {
    editmodel: editmodel,
    propertieIds:propertieIds,
    properties:properties,
    members:members,
    attachmentIds:attachmentIds,
    files: files
  });
}
/**
 * 任务详情
 * @param taskId 任务id
 * @returns {Promise.<T>}
 */
export function taskDetail(taskId) {
  return getData(`TaskDetail?taskId=${taskId}`);
}
/**
 * 获取任务回复列表
 * @param task_id 任务id
 * @param pageIndex 页码
 * @returns {Promise.<T>}
 */
export function getTaskComments(task_id,pageIndex) {
  return getData(`GetTaskComments?taskId=${task_id}&pageIndex=${pageIndex}`);
}
/**
 * 获取任务的日志列表
 * @param task_id 任务id
 * @param pageIndex 页码
 * @returns {Promise.<T>}
 */
export function getTaskLogs(task_id,pageIndex) {
  return getData(`GetTaskLogs?taskId=${task_id}&pageIndex=${pageIndex}`);
}
/**
 * 重开任务
 * @param taskId
 * @returns {Promise.<T>}
 */
export function restartTask(taskId) {
  return postData('RestartTask', {
    taskId: taskId
  })
}
/**
 * 完成任务
 * @param taskId
 * @returns {Promise.<T>}
 */
export function finishTask(taskId) {
  return postData('FinishTask', {
    taskId: taskId
  })
}
/**
 * 删除任务
 * @param taskId
 * @returns {Promise.<T>}
 */
export function recycleTask(taskId) {
  return postData('RecycleTask', {
    taskId: taskId
  })
}
/**
 * 退出任务
 * @param taskId
 * @returns {Promise.<T>}
 */
export function quitTask(taskId) {
  return postData('QuitTask', {
    taskId: taskId
  })
}



