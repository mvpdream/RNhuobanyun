'use strict';

import { getData,postData,postFormData } from './utils/Http';

/**
 *获取文库下的文件
 * @param kb_id 文件夹的Id
 * @returns {Promise.<T>}
 */
export function getKBFileList(kb_id) {
  return getData(`GetKBFileList?KbId=${kb_id}`);
}
/**
 *创建文件夹
 * @param kb_name 文件夹名字
 * @param parent_Kb_Id 父级文件夹Id
 * @returns {Promise.<T>}
 */
export function createKb(kb_name, parent_Kb_Id) {
  return postData('CreateKb', {
    KbName: kb_name,
    ParentKbId:parent_Kb_Id
  })
}
/**
 *重命名文件夹
 * @param kb_id 文件夹Id
 * @param kb_name 新命名
 * @returns {Promise.<T>}
 */
export function renameKb(kb_id,kb_name) {
  return postData('RenameKb', {
    KbId: kb_id,
    KbName:kb_name
  })
}
/**
 *重命名文章
 * @param article_id 文章Id
 * @param article_name 新命名
 * @returns {Promise.<T>}
 */
export function renameArticle(article_id, article_name) {
  return postData('RenameArticle', {
    ArticleId: article_id,
    ArticleName:article_name
  })
}
/**
 *重命名文件
 * @param attachment_id 文件Id
 * @param attachment_name 新命名
 * @returns {Promise.<T>}
 */
export function renameAttachment(attachment_id,attachment_name) {
  return postData('RenameAttachment', {
    AttachmentId: attachment_id,
    AttachmentName:attachment_name
  })
}
/**
 * 删除文件
 * @param kb_id 文件夹Id
 * @returns {Promise.<T>}
 */
export function deleteKb(kb_id) {
  return postData('DeleteKb', {
    KbId: kb_id
  })
}
/**
 * 删除附件
 * @param attachment_id 附件Id
 * @returns {Promise.<T>}
 */
export function deleteAttachment(attachment_id) {
  return postData('DeleteAttachment', {
    AttachmentId: attachment_id
  })
}
/**
 * 删除文章
 * @param article_id 文章Id
 * @returns {Promise.<T>}
 */
export function deleteArticle(article_id) {
  return postData('DeleteArticle', {
    ArticleId: article_id
  })
}
/**
 *附件详情
 * @param attachment_id 文件（附件）Id
 * @returns {Promise.<T>}
 */
export function getAttachmentDetail(attachment_id) {
  return getData(`GetAttachmentDetail?AttachmentId=${attachment_id}`);
}
/**
 *图片详情
 * @param image_id 图片Id
 * @returns {Promise.<T>}
 */
export function getImageDetail(image_id) {
  return getData(`GetImageDetail?ImageId=${image_id}`);
}
/***
 * 文章详情
 * @param article_id 文章Id
 * @returns {Promise.<T>}
 */
export function getArticleDetail(article_id){
  return getData(`GetArticleDetail?ArticleId=${article_id}`)
}
/**
 * 文件（附件、图片）的全部历史版本
 * @param attachment_id 文件Id
 * @returns {Promise.<T>}
 */
export function getAttachmentHistorys(attachment_id) {
  return getData(`GetAttachmentHistorys?AttachmentId=${attachment_id}`);
}
/**
 * 文章的全部历史版本
 * @param article_id 文章Id
 * @returns {Promise.<T>}
 */
export function getArticleHistorys(article_id) {
  return getData(`GetArticleHistorys?ArticleId=${article_id}`);
}
/**
 * 分页获取一个附件的评论
 * @param attachment_id 附件Id
 * @param page_index 页数
 * @returns {Promise.<T>}
 */
export function getAttachmentComments(attachment_id, page_index) {
  return getData(`GetAttachmentComments?AttachmentId=${attachment_id}&pageIndex=${page_index}`);
}
/**
 * 搜索
 * @param kb_id 文件夹Id
 * @param keyword 关键字
 * @returns {Promise.<T>}
 */
export function search(kb_id,keyword){
  return getData(`Search?KbId=${kb_id}&Keyword=${keyword}`)
}
/**
 * 赞、取消赞
 * @param attachment_id 附件Id
 * @returns {Promise.<T>}
 */
export function toggleFavoriteState(attachment_id) {
  return postData('ToggleFavoriteState', {
    AttachmentId: attachment_id
  })
}
/**
 * 赞、取消赞
 * @param article_id 文章Id
 * @returns {Promise.<T>}
 */
export function toggleArticleFavoriteState(article_id) {
  return postData('ToggleArticleFavoriteState', {
    ArticleId: article_id
  })
}
/**
 * 锁定文件（仅附件）
 * @param attachment_id 附件Id
 * @returns {Promise.<T>}
 */
export function lockAttachment(attachment_id) {
  return postData('LockAttachment', {
    AttachmentId: attachment_id
  })
}
/**
 * 解锁文件（仅附件）
 * @param attachment_id 附件Id
 * @returns {Promise.<T>}
 */
export function undoAttachment(attachment_id) {
  return postData('UndoAttachment', {
    AttachmentId: attachment_id
  })
}
/**
 * 上传更新附件
 * @param kb_id 文件夹Id
 * @param attachment_id 附件Id
 * @param is_update_attachment 是否上传标记
 * @param files
 * @returns {*}
 */
export function directUpload(kb_id, attachment_id, is_update_attachment,files) {
  return postFormData('DirectUpload', {
    kbId: kb_id,
    AttachmentId: attachment_id,
    isUpdateAttachment: is_update_attachment,
    Files: files
  });
}
/**
 * 获取下载权限
 * @param attachment_id 文件Id
 * @returns {Promise.<T>}
 */
export function downloadAttachment(attachment_id){
  return getData(`KBDownloadAttachment?AttachmentId=${attachment_id}`)
}
/**
 * 判断是否有管理员权限
 * @returns {Promise.<T>}
 */
export function checkKBManager(){
  return getData(`checkKBManager`)
}
