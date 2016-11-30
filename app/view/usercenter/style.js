/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';
import colorManager from '../common/styles/manager'
import React, {Component} from 'react'
import {
  StyleSheet,
  Dimensions
  } from 'react-native'
var {height, widths} = Dimensions.get('window');  //��ȡ��Ļ����
var WINDOW_HEIGHT = Dimensions.get('window').height;
var LIST_HEIGHT = WINDOW_HEIGHT - 80; //���������������ĸ߶�

var WINDOW_WIDTH = Dimensions.get('window').width;
var LIST_INFO_WIDTH = WINDOW_WIDTH - 90;

module.exports = StyleSheet.create({
  containers: {
    flex: 1,
    //backgroundColor:'#F9F5F5',
  },
  containersw: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    padding:16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  userinfocontainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },

  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  cellImage: {
    height: 20,
    marginRight: 13,
    width: 23,
    justifyContent: 'center'
  },
  info: {
    width: LIST_INFO_WIDTH,
    justifyContent: 'flex-start',
    flex: 1,
  },
  text: {
    fontSize: 15,
    color: "black"
  },
  rigthBtn: {
    width: 21,
    height: 20,
    color: "#175898",
    justifyContent: 'center',
  },
  listRows: {
    width: 30,
    height: 32,
    color: "#175898",
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    marginLeft: 10,
    color: "black"
  },
  year: {
    color: "#64656B",
    fontSize: 14,
  },
  headName:{
    color:'black',
    fontSize: 17,
    marginLeft:10
  },
  headDepName:{
    color: "#64656B",
    fontSize: 14,
    marginLeft:10
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  thumbnails: {
    width: 40,
    height: 40,
    borderRadius: 90
  },
  loaderThumbnail:{
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  usersafeView: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    padding: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  updatepasView: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    padding: 15
  },
  updatepasTextIn: {
    height: 40,
    fontSize: 17
  },
  usersafeText: {
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 12,
    color: "black"
  },
  usersafeTexts: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 10,
    color: "black"
  },
  pagerText:{
    fontSize: 14,
    color: "black"
  },
  bottomView: {
    backgroundColor: '#E4E4E4',
    marginBottom:10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomTou: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomTouView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - 30,
    height: 45,
    backgroundColor: '#F34949'
  },
  bottomTouViewpas: {
    borderColor: '#dddddd',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - 50,
    marginVertical: 5,
    height: 56,
    backgroundColor: '#175898'
  },
  updateView:{
    borderBottomColor : '#dddddd',
    borderBottomWidth : 1,
    paddingLeft: 12,
  },
  updateTextInput:{
    paddingLeft:13
  },
  userSupView:{
    justifyContent:'space-between',
    padding: 10,
    paddingRight:0,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor :'#dddddd',
    borderBottomWidth : 1,
    borderRightColor :'#dddddd',
    borderRightWidth : 1
  },
  userSupText:{
    color:'black',
    fontSize:15,
    marginBottom: 5,
    marginLeft:10
  },
  TextFieldText:{
    paddingTop:0,paddingLeft:0
  },
  hbyImage:{
    padding:30,
    height: 100,
    width: 130,
    justifyContent: 'center'
  },
  navLeftBtn:{
    justifyContent: 'center',
    height:55,
    flexDirection: 'row',
    alignItems: 'center'
  },
  navLeftText:{
    width:Dimensions.get('window').width*0.5,
    color: 'white',
    fontSize:18
  },
  touIcon:{
    height:55,
    width:35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightNavText:{
    color: 'white',
    fontSize:16
  },
  navLoadIcon:{
    width:25,
    height:25,
    justifyContent: 'center',
    marginRight:10
  },
  NavSty:{
    height: 55,
    backgroundColor:'#175898'
  },

  updateViews: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    paddingLeft: 12,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 1
  },



});


