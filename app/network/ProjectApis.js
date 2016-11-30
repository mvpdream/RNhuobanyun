'use strict';

import { getData,postData,postFormData } from './utils/Http'

/**
 * 项目筛选列表
 * @param filter类型
 * @param page_index页数
 * @returns {Promise.<T>}
 * @constructor
 */
export function myProject(filter,page_index) {
  return getData(`MyProject?filter=${filter}&pageIndex=${page_index || 1}`);
}
/**
 * 搜索项目
 * @param keyword
 * @returns {Promise.<T>}
 */
export function searchProject(keyword) {
  return getData(`SearchProject?keyword=${keyword}`);
}
/**
 * 获取项目模板
 * @returns {Promise.<T>}
 */
export function getCompanyTemplates(){
  return getData(`GetCompanyTemplates`);
}
/**
 * 创建项目
 * @param createModel
 * @param partner_ids负责人
 * @param manager_ids管理员
 * @param member_ids项目成员
 * @param taskGroups任务分组
 * @param catalogNames文库目录
 * @returns {*}
 */
export function createProject(createModel, director_id,manager_ids,member_ids,taskGroups,catalogNames) {
  return postFormData('CreateProject', {
    createModel: createModel,
    directorId:director_id,
    managerIds:manager_ids,
    memberIds:member_ids,
    taskGroups:taskGroups,
    catalogNames:catalogNames
  });
}
/**
 * 编辑项目
 * @param createModel
 * @param director_id负责人
 * @param manager_ids管理员ids
 * @param member_ids成员ids
 * @returns {*}
 */
export function editProject(createModel, director_id,manager_ids,member_ids) {
  return postFormData('EditProject', {
    editModel: createModel,
    directorId:director_id,
    managerIds:manager_ids,
    memberIds:member_ids
  });
}
/**
 * 项目文库
 * @param project_id
 * @param kb_id
 * @returns {Promise.<T>}
 */
export function getProjectKb(project_id, kb_id) {
  return getData(`GetProjectKb?projectId=${project_id}&kbId=${kb_id}`);
}
/**
 * 项目详情
 * @param project_id
 * @returns {Promise.<T>}
 */
export function projectDetail(project_id) {
  return getData(`ProjectDetail?projectId=${project_id}`);
}
/**
 * 项目动态
 * @param project_id项目Id
 * @param pageIndex页码
 * @returns {Promise.<T>}
 */
export function getProjectActivities(project_id,pageIndex) {
  return getData(`GetProjectActivities?projectId=${project_id}&pageIndex=${pageIndex}`);
}
/**
 * 编辑项目公告
 * @param project_id
 * @param projectDescription
 * @returns {Promise.<T>}
 */
export function editProjectAnnouncement(project_id,projectDescription) {
  return postData('EditProjectAnnouncement', {
    projectId: project_id,
    projectDescription:projectDescription
  })
}
/**
 * 获取项目下任务阶段
 * @param project_id
 * @returns {Promise.<T>}
 */
export function getTaskStage(project_id) {
  return getData(`GetTaskStage?projectId=${project_id}`);
}
/**
 * 获取项目阶段下的任务
 * @param staget_id
 * @param pageIndex
 * @returns {Promise.<T>}
 */
export function getStageTasks(staget_id,pageIndex) {
  return getData(`GetStageTasks?stagetId=${staget_id}&pageIndex=${pageIndex}`);
}
/**
 * 移动任务
 * @param task_id
 * @param stage_id
 * @returns {Promise.<T>}
 */
export function sortTask(task_id,stage_id) {
  return postData('SortTask', {
    taskId: task_id,
    stageId:stage_id
  })
}
/**
 * 编辑任务阶段
 * @param project_id 项目Id
 * @param stage_id 阶段Ids
 * @param prevStage_id 阶段names
 * @returns {Promise.<T>}
 */
export function editStage(project_id,stage_ids,stage_names) {
  return postData('EditStage', {
    projectId: project_id,
    stageIds:stage_ids,
    stageNames:stage_names
  })
}
/**
 * 添加任务阶段
 * @param project_id
 * @param stage_name
 * @returns {Promise.<T>}
 */
export function createStage(project_id,stage_name) {
  return postData('CreateStage', {
    projectId: project_id,
    stageName:stage_name
  })
}
/**
 * 删除任务阶段
 * @param project_id
 * @param stage_id
 * @returns {Promise.<T>}
 */
export function deleteStage(project_id,stage_id) {
  return postData('DeleteStage', {
    projectId: project_id,
    stageId:stage_id
  })
}
/**
 * 获取项目设置
 * * @param project_id
 * @returns {Promise.<T>}
 */
export function projectSetting(project_id) {
  return getData(`ProjectSetting?projectId=${project_id}`);
}
/**
 * 归档项目
 * @param project_id
 * @returns {Promise.<T>}
 */
export function finishProject(project_id) {
  return postData(`FinishProject`,{
    projectId: project_id
  });
}
/**
 * 取消归档项目
 * @param project_id
 * @returns {Promise.<T>}
 */
export function cancelFinishProject(project_id) {
  return postData(`CancelFinishProject`,{
    projectId: project_id,
  });
}
/**
 * 删除项目
 * @param project_id
 * @returns {Promise.<T>}
 */
export function recycleProject(project_id) {
  return postData(`RecycleProject`,{
    projectId: project_id,
  });
}






