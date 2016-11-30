'use strict';

import { getData,postData,postFormData } from './utils/Http';

/**
 * 动态列表
 * @param type 类型
 * @param page_index 页码
 * @param page_Capacity 页容量
 * @param key_word 关键字
 * @returns {Promise.<T>}
 */
export function getActivityList(type, page_index, page_Capacity,key_word) {
  return getData(`GetActivityList?type=${type}&pageIndex=${page_index}&pageCapacity=${page_Capacity}&keyWord=${key_word}`);
}

/**
 * 获取动态详情
 * @param activity_id 动态id
 * @returns {Promise.<T>}
 */
export function getActivityDetail(activity_id) {
  return getData(`getActivityDetail?activityId=${activity_id}`);
}

/**
 * 发分享/公告
 * @param users_in_range 可见范围中的用户
 * @param deps_in_range 可见范围中的部门
 * @param files 附件
 * @param announcement_expired_time 公告过期时间
 * @param has_receipt 是否需要回执
 * @param content 分享内容
 * @param mentioned_users @的用户
 * @param mentioned_deps @的部门
 * @param is_announcement 是否是公告
 * @param announcement_title 公告标题
 * @param project_id 项目Id
 * @returns {*}
 */
export function createSharing(users_in_range, deps_in_range, files, announcement_expired_time, has_receipt, content, mentioned_users, mentioned_deps, is_announcement, announcement_title,project_id) {
  return postFormData('createSharing', {
    UsersInRange: users_in_range,
    DepsInRange: deps_in_range,
    AnnouncementExpiredTime: announcement_expired_time,
    HasReceipt: has_receipt,
    Content: content,
    MentionedUsers: mentioned_users,
    MentionedDeps: mentioned_deps,
    IsAnnouncement: is_announcement,
    AnnouncementTitle: announcement_title,
    Files: files,
    ProjectId:project_id
  })
}

/**
 * 创建投票
 * @param vote_view_model 投票实体
 * @param content 分享内容
 * @param users_in_range 可见范围中的用户
 * @param deps_in_range 可见范围中的部门
 * @returns {Promise.<T>}
 */
export function createVote(vote_view_model, content, users_in_range, deps_in_range) {
  return postFormData('createVote', {
    VoteVM: vote_view_model,
    Content: content,
    UsersInRange: users_in_range,
    DepsInRange: deps_in_range
  })
}

/**
 * 参与投票
 * @param vote_option_ids 投票选项id
 * @returns {Promise.<T>}
 */
export function voteFor(vote_option_ids) {
  return postData('voteFor', {
    VoteOptionIds: vote_option_ids
  })
}

/**
 * 获取投票/回执某一项的参与情况
 * @param option_id 投票选项id
 * @returns {Promise.<T>}
 */
export function getVoteOrReceiptState(option_id) {
  return getData(`getVoteOrReceiptState?optionid=${option_id}`);
}
/**
 * 获取信息发送范围
 * @param activity_id 信息id
 * @returns {Promise.<T>}
 */
export function getActivityScopes(activity_id) {
  return getData(`getActivityScopes?activityId=${activity_id}`);
}


/**
 * 点赞/取消赞
 * @param activity_id 动态id
 * @returns {Promise.<T>}
 */
export function toggleLikeState(activity_id) {
  return postData('toggleLikeState', {
    ActivityId: activity_id
  })
}

/**
 * 删除动态
 * @param activity_id
 * @returns {Promise.<T>}
 */
export function removeActivity(activity_id) {
  return postData('removeActivity', {
    ActivityId: activity_id
  })
}

/**
 * 获取可用的公告
 * @returns {Promise.<T>}
 */
export function getValidAnnouncement(){
  return getData(`getValidAnnouncement`);
}
/**
 * 获取通知
 * @returns {Promise.<T>}
 */
export function getNotices(){
  return getData(`GetNotices`);
}
/**
 * 清除所有通知
 * @returns {Promise.<T>}
 */
export function clearUnread(){
  return postData(`ClearUnread`);
}