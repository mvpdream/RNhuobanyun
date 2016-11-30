/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {Component} from 'react'
import {
  StyleSheet,
  Dimensions
  } from 'react-native'
var {height, width} = Dimensions.get('window');
module.exports = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#EFF0F4"
  },
  whiteContainer:{
    flex:1,
    backgroundColor:"#ffffff"
  },
  taskListRow:{
    backgroundColor: 'white',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  navLeftBtn: {
    justifyContent: 'center',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center'
  },
  listTopView:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  nameView:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  imgView:{
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  Title: {
    fontSize: 14,
    color: "black"
  },
  tips: {
    marginTop:10,
    fontSize: 13,
    color:"#AAAAAB"
  },
  NavBarSty: {
    height: 55,
    backgroundColor: '#175898'
  },
  navLeftText: {
    width: Dimensions.get('window').width * 0.5,
    color: 'white',
    fontSize: 18,
    paddingRight: 5
  },
  navRightText:{
    height:55,
    paddingRight: 10,
    justifyContent: 'center'
  },
  rightNavText: {
    color: 'white',
    fontSize: 16
  },
  touIcon: {
    height: 55,
    width:35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  LeftView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  navIconTou: {
    paddingRight: 5,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30
  },
  noDataView: {
    position: 'absolute',
    right: 0,
    top: Dimensions.get('window').height * 0.5 - 150,
    left: Dimensions.get('window').width * 0.5 - 100,
    bottom: 0,
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerView: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    color: 'blue',
    textAlign: 'center',
    fontSize: 16
  },
  taskName:{
    borderColor: '#BDBDC1',
    borderWidth: 1,
    borderRadius: 2,
    marginBottom: 0,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:20
  },
  downIcon:{
    justifyContent: 'center',
    alignItems: 'center',
    height:40,
    width:20
  },
  TextInputs: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
    padding:0
  },
  searchView:{
    flex:1,
    paddingLeft:30,
    paddingRight:30
  },
  selectView:{
    flex:1,
    borderWidth:0,
    paddingTop:1,
    paddingBottom:1
  },
  conditions:{
    backgroundColor:'#ffffff',
    padding:12,
    justifyContent: 'center',
  },
  CreatTaskRow:{
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1,
    paddingTop:6,
    paddingBottom:6,
    justifyContent: 'center',
  },
  hourText:{
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1,
    marginBottom:10
  },
  CreatTaskRow1:{
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1,
    paddingTop:15,
    paddingBottom:15,
    justifyContent: 'center'

  },
  CreatTaskRows:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  workHoursRow:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filesRow:{
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1,
    paddingTop:16,
    paddingBottom:15,
    justifyContent: 'center'
  },
  filesView:{
    flexDirection: 'row',
    height:20
  },
  filesIcon:{
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filesViews:{
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  fileView:{
    flexDirection: 'row',
    borderColor: '#BDBDC1',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:5,
    height:30
  },
  closeImgIcon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: -8,
    right: -10
  },
  fileCon:{
    height:30,
    paddingRight:20,
    marginBottom:10
  },
  fileRow:{
    flexDirection: 'row',
    height:30
  },
  rigthBtn: {
    color: "gray",
    justifyContent: 'center',
  },
  rightBtnView:{
    justifyContent: 'center',
  },
  rowViewTou:{
    flex:1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  userView:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  hourTextIn:{
    height:40,
    width:35,
    fontSize: 13,
    marginBottom:-10
  },
  openViewView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  openViewTou: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  openUpView: {
    position: 'relative',
    top: 55,
    right: 5,
    left: Dimensions.get('window').width -150,
    bottom: 10
  },
  openViewsView: {
    backgroundColor: '#F2F2F2'
  },
  modalTextView: {
    borderBottomColor: '#D7D7D7',
    borderBottomWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalText: {
    color: 'black',
    fontSize: 17,
    marginLeft: 10
  },
  detailTitle:{
    flexDirection: 'row',
    alignItems: 'center'//垂直居中
  },
  detailView:{
    paddingLeft:12,
    paddingRight:12,
    marginTop:20
  },
  titleView:{
    flexDirection: 'row',
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1
  },
  titleText:{
    color: 'black',
    fontSize: 16,
    height:30,
    width:Dimensions.get('window').width-24
  },
  describeView:{
    flexDirection: 'row',
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1
  },
  describeText:{
    color: 'black',
    fontSize: 14,
    height:100,
    textAlignVertical: 'top',
    paddingTop:10,
    paddingBottom:10,
    width:Dimensions.get('window').width-24
  },
  detailFilesView:{
    alignItems: 'center',//垂直居中
    flexDirection: 'row'
  },
  detailProjName:{
    width:Dimensions.get('window').width-24,
    textAlign:'right'
  },
  ExpandPropertieView:{
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1,
    paddingTop:6,
    paddingBottom:6,
    flexDirection: 'row',
    alignItems: 'center'//垂直居中
  },
  ExpandPropertiesTI:{
    fontSize: 14,
    color: "black",
    width:80
  },
  ExpandPropertiesText:{
    height:18,
    fontSize: 14,
    width:Dimensions.get('window').width-24-80,
  },
  childText:{
    fontSize: 15,
    color: "black",
    fontWeight:"400"
  },
  addChild:{
    alignItems: 'center',//垂直居中
    marginTop:6,flexDirection: 'row',
  },
  logsAndcommentsView:{
    paddingBottom:50,
    marginTop:20,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 20,
  },
  commViewCon: {
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white'
  },
  moreComView: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  favorIconView: {
    alignItems: 'center',
    flexDirection: 'row',
    width: Dimensions.get('window').width - 30,
    justifyContent: 'center'
  },
  commentView: {
    marginTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width
  },
  commView: {
    width: Dimensions.get('window').width
  },
  comBody: {
    marginLeft: 35,
    borderBottomColor: '#D7D7D7',
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  comParBody: {
    marginLeft: 10,
    marginTop: 6
  },
  tabSty:{
    alignItems: 'center',
    justifyContent: 'center',
    padding:5,
    paddingTop:10,
    paddingBottom:10,
    borderBottomColor: '#ffffff',
    borderBottomWidth: 4,
  },
  Fstyle:{
    position:'absolute',
    top: height,
    backgroundColor:"gray",
    right: 0,
    left: 0,
    bottom:0
  },
  groupName:{
    alignItems: 'center',
    flexDirection: 'row',
    marginTop:10
  },
  statusView:{
    borderRadius: 3,
    borderColor: '#AAAAAB',
    borderWidth: 1,
    paddingLeft:8,
    paddingRight:8,
    paddingTop:3,
    paddingBottom:3
  },
  ProdescribeView:{
    flexDirection: 'row',
    marginTop:10,
    borderTopColor: '#BDBDC1',
    borderTopWidth: 1
  },
  groupItemRow:{
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1
  },
  bgModal:{
    flex:1,
    backgroundColor:"rgba(0, 0, 0, 0.5)",
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer:{
    backgroundColor:"rgba(0, 0, 0, 0.3)",
    width:Dimensions.get('window').width*0.6,
    height:Dimensions.get('window').height*0.6,
    paddingLeft:6,
    paddingRight:6
  },
  modalItemView:{
    backgroundColor:"#ffffff",
    marginTop:5,
    borderRadius: 3,
    padding:10
  },
  modalItemText:{
    fontSize: 15,
    color: "black",
    fontWeight:"400"
  },
  navLeftIcon:{
    height:55,
    width:35,
    paddingRight:5,
    alignItems: 'center',
    justifyContent: 'center'
  },




});


