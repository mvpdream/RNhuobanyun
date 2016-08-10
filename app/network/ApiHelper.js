'use strict';

import {
  setErrConsumeFunction
} from './utils/Http'

import {
  userLogin,
  userRegister,
  updateAvatar,
  getUserProfile,
  editUserProfile,
  getSuperiorList,
  addSuperior,
  removeSuperior,
  resetPassword,
  logout,
  unregister,
  getMySubordinate,
  checkApplyCode,
  findPassword
} from './UserApis'

import { getCurrentUser,getCurrentUserId } from './utils/CurrentUser'

import { getValidCode,checkLoginState,checkUpdate,getFindPasswordCode } from './UtilApis'

import { createComment,removeComment } from './CommentApis'

import {
  getActivityList,
  getActivityDetail,
  createSharing,
  createVote,
  voteFor,
  getVoteOrReceiptState,
  toggleLikeState,
  removeActivity,
  getValidAnnouncement,
  getActivityScopes
} from './ActivityApis'

import {
  getCompanyList,
  createCompany,
  joinCompany,
  cancelApply,
  enterCompany
} from './CompanyApis'

import {
  getTasterAndRules,
  getReportTemplate,
  createReport,
  updateReport,
  getReportDetail,
  getReportListByUser,
  receivedReportList,
  checkSubmitStatus
} from './ReportApis'

import {
  getUserList,
  getDepList,
  getUnitsOfDep,
  getUserListGroupByPrefix,
  groupImportUserInfo
} from './OrganizationalStructureApis'
import {
  getKBFileList,
  createKb,
  renameKb,
  deleteKb,
  getAttachmentDetail,
  getImageDetail,
  getArticleDetail,
  getAttachmentHistorys,
  getAttachmentComments,
  getArticleHistorys,
  getArticleComments,
  toggleFavoriteState,
  renameAttachment,
  deleteAttachment,
  deleteArticle,
  lockAttachment,
  undoAttachment,
  directUpload,
  search,
  renameArticle,
  downloadAttachment,
  toggleArticleFavoriteState,
  checkKBManager
} from './KBApis'
import { getAttendanceRule,attendance,checkIn,myAttendance } from './AttendanceApis.js'

/**
 * Even though the codes bellow act like a fool,
 * we still need a namespace to separate diff-modules.
 */
export default {
  User: {
    userLogin: userLogin,
    userRegister: userRegister,
    uploadAvatar: updateAvatar,
    getCurrentUser: getCurrentUser,
    getCurrentUserId: getCurrentUserId,
    getUserProfile: getUserProfile,
    editUserProfile: editUserProfile,
    getSuperiorList: getSuperiorList,
    addSuperior: addSuperior,
    removeSuperior: removeSuperior,
    resetPassword: resetPassword,
    logout: logout,
    unregister: unregister,
    getMySubordinate: getMySubordinate,
    checkApplyCode:checkApplyCode,
    findPassword:findPassword
  },
  OS: {
    getUserList: getUserList,
    getDepList: getDepList,
    getUnitsOfDep: getUnitsOfDep,
    getUserListGroupByPrefix:getUserListGroupByPrefix,
    groupImportUserInfo:groupImportUserInfo
  },
  Company: {
    getCompanyList: getCompanyList,
    createCompany: createCompany,
    joinCompany: joinCompany,
    cancelApply: cancelApply,
    enterCompany: enterCompany
  },
  Util: {
    setErrConsumeFunction: setErrConsumeFunction,
    getValidCode: getValidCode,
    checkLoginState: checkLoginState,
    checkUpdate:checkUpdate,
    getFindPasswordCode:getFindPasswordCode
  },
  Report: {
    REPORT_TYPE: {
      DAILY: 0,
      WEEKLY: 1,
      MONTHLY: 2,
      ALL: null
    },
    getTasterAndRules: getTasterAndRules,
    getReportTemplate: getReportTemplate,
    createReport: createReport,
    updateReport: updateReport,
    getReportDetail: getReportDetail,
    getReportListByUser: getReportListByUser,
    receivedReportList: receivedReportList,
    checkSubmitStatus: checkSubmitStatus
  },
  Comment: {
    createComment: createComment,
    removeComment:removeComment
  },
  Activity: {
    getActivityList: getActivityList,
    getActivityDetail: getActivityDetail,
    createSharing: createSharing,
    createVote: createVote,
    voteFor: voteFor,
    getActivityScopes:getActivityScopes,
    getVoteOrReceiptState: getVoteOrReceiptState,
    toggleLikeState: toggleLikeState,
    removeActivity: removeActivity,
    getValidAnnouncement:getValidAnnouncement
  },
  KB:{
    getKBFileList:getKBFileList,
    createKb:createKb,
    renameKb:renameKb,
    deleteKb:deleteKb,
    getAttachmentDetail:getAttachmentDetail,
    getImageDetail:getImageDetail,
    getArticleDetail:getArticleDetail,
    getAttachmentHistorys:getAttachmentHistorys,
    getAttachmentComments:getAttachmentComments,
    getArticleHistorys:getArticleHistorys,
    getArticleComments:getArticleComments,
    toggleFavoriteState:toggleFavoriteState,
    toggleArticleFavoriteState:toggleArticleFavoriteState,
    renameAttachment:renameAttachment,
    deleteAttachment:deleteAttachment,
    deleteArticle:deleteArticle,
    lockAttachment:lockAttachment,
    undoAttachment:undoAttachment,
    directUpload:directUpload,
    search:search,
    renameArticle:renameArticle,
    downloadAttachment:downloadAttachment,
    checkKBManager:checkKBManager
  },
  Attendance: {
    getAttendanceRule:getAttendanceRule,
    attendance:attendance,
    checkIn:checkIn,
    myAttendance:myAttendance
  }

}