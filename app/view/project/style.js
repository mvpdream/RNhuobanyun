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
    paddingTop:10,
    paddingBottom:10
  },
  navLeftBtn: {
    justifyContent: 'center',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center'
  },
  listTopView:{
    flexDirection: 'row',
    alignItems: 'center', //垂直居中
    paddingLeft:10,
    paddingRight:10,
  },
  nameView:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  imgView:{
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  NavBarSty: {
    height: 55,
    backgroundColor: '#175898'
  },
  navLeftText: {
    width: Dimensions.get('window').width * 0.6,
    color: 'white',
    fontSize: 18,
    paddingRight: 5
  },
  navRightText:{
    height:50,
    paddingRight: 10,
    justifyContent: 'center'
  },
  rightNavText: {
    color: 'white',
    fontSize: 16
  },
  touIcon: {
    height: 50,
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
    paddingRight: 6,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30
  },
  navLeftIcon:{
    height:55,
    width:35,
    paddingRight:5,
    alignItems: 'center',
    justifyContent: 'center'
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
  projectName:{
    fontSize: 16,
    color: "black",
    fontWeight:"400"
  },
  title: {
    fontSize: 14,
    color: "black"
  },
  adminTitle: {
    fontSize: 13,
    color: "gray"
  },
  memberView:{
    paddingTop:16,
    paddingBottom:15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer:{
    paddingTop:2.5,
    paddingBottom:2.5,
    paddingLeft:6,
    paddingRight:6,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'gray',
    justifyContent: 'center',
    borderWidth: 1
  },
  memberBtn:{

  },
  memberItem:{
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom:10
  },
  memberItemLeft:{
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft:10
  },
  memberItemRight:{
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row'
  },
  groupItemLeft:{
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  groupItemRight:{
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row'
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  selTemplates:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  downIcon:{
    justifyContent: 'center',
    alignItems: 'center',
    height:40,
    width:20
  },
  CreatProjectRow:{
    borderTopColor: '#BDBDC1',
    borderTopWidth: 1,
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1,
    paddingTop:5,
    paddingBottom:5,
    justifyContent: 'center',//垂直居中
  },
  groupItemNum:{
    padding:8
  },
  groupItemNumText:{
    fontSize: 18,
    color: "#03A9F4",
    fontWeight:"500"
  },
  groupItemRow:{
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1
  },
  projectMember:{
    paddingTop:15,
    paddingBottom:5,
    backgroundColor:"#ffffff"
  },
  newcontainer:{
    flex:1,
    marginTop:10
  },
  namesView:{
    justifyContent: 'center',
    paddingLeft:10,
    paddingRight:10,
    marginTop:6
  },
  describeText:{
    color: 'black',
    fontSize: 12,
    height:80,
    textAlignVertical: 'top',
    paddingTop:5,
    paddingBottom:5,
    width:Dimensions.get('window').width-24
  },
  describeTextView:{
    color: 'black',
    fontSize:12,

    width:Dimensions.get('window').width-24,
    paddingTop:10,
    paddingBottom:10,
  },
  describeView:{
    marginTop:1,
    backgroundColor:"#ffffff",
    paddingLeft:10,
    paddingRight:10,
  },
  activityView:{
    marginTop:5,
    flex:1
  },
  dragListView:{
    flex:1,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:15,
    paddingRight:15
  },
  dragItem:{
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop:10,
    paddingBottom:10,
  },
  dragItemLeft:{
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dragItemRow:{
    borderBottomColor: '#BDBDC1',
    borderBottomWidth: 1,
    marginLeft:6
  },
  settingBtn:{
    marginTop:10,
    width:Dimensions.get('window').width-26,
    paddingTop:10,
    paddingBottom:10,
    alignItems: 'center',
    borderColor: 'gray',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 3
  },
  BtnTitle:{
    fontSize: 14,
    color: "#ff0000",
    fontWeight:"400"
  }




});


