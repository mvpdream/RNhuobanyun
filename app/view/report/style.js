/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  } = React;
var Dimensions = require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var WINDOW_HEIGHT = Dimensions.get('window').height;
var LIST_HEIGHT = WINDOW_HEIGHT - 80; //计算出滚动区域的高度

var WINDOW_WIDTH = Dimensions.get('window').width;
var LIST_INFO_WIDTH = WINDOW_WIDTH - 90;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  submitCon: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  reportTitle: {
    paddingLeft: 20,
    backgroundColor: '#fff',
    justifyContent: "center",
    height: 56,
    borderColor: '#ECEFF1',
    borderWidth: 1
  },
  conView: {
    borderColor: '#ECEFF1',
    borderWidth: 1
  },
  footerView:{
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  attView: {
    paddingLeft: 20,
    backgroundColor: '#fff',
    paddingTop: 15,
    height: 56,
    marginTop: 10,
    flexDirection: 'row'
  },
  conViews: {
    paddingLeft: 15,
    backgroundColor: '#fff',
    justifyContent: "center",
    height: 100,
    paddingRight: 15,
  },
  tempTitle:{
    paddingLeft: 13,
    paddingRight:13,
    paddingTop:10,
    paddingBottom:10
  },
  xuanView: {
    paddingLeft:20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding:10,
    marginTop: 10,
  },
  uncommitContainer: {
    flexDirection: 'row',
    borderColor: '#ECEFF1',
    borderWidth: 1,
    justifyContent: 'center',
  },
  rulesContainer: {
    flexDirection: 'row',
    height: 100,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 10
  },

  containers: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: '#ECEFF1',
    marginRight: 15
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 13,
    paddingLeft:13,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1.5

  },
  RlistRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 15,
    height: 60,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1
  },
  listDown: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderColor: '#dddddd',
    borderWidth: 1,
  },
  dailyReportItem: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    borderColor: '#dddddd',
    borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 90
  },
  dailyReportnoItem: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    borderColor: '#dddddd',
    borderWidth: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    height: 90
  },
  dailyReportItems: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    borderColor: '#dddddd',
    borderWidth: 1,
    backgroundColor: '#FCF8E3',
    alignItems: 'center',
    justifyContent: 'center',
    height: 90
  },
  cellImage: {
    height: 25,
    marginRight: 13,
    width: 23,
    justifyContent: 'center'
  },
  info: {
    width: LIST_INFO_WIDTH,
    justifyContent: 'flex-start',
    flex: 1,
  },
  dailyReportView: {
    width: LIST_INFO_WIDTH,
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: "black"
  },
  rigthBtn: {
    width: 23,
    height: 20,
    color: "#175898",
    justifyContent: 'center',
  },
  rigthBtns:{
    width: 23,
    height: 25,
    color: "#175898",
    justifyContent: 'center',
  },
  changedate: {
    width: 50,
    height: 50,
    color: "#175898",
  },
  changedateView: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom:10
  },
  ruleText: {
    fontSize: 15,
    color: 'black',
  },
  ruleTextName:{
    color:'black',
    fontSize:15,
    fontWeight:'bold'
  },
  tasterusersView: {
    backgroundColor:'white',
    borderBottomColor: '#ECEFF1',
    borderBottomWidth: 1,
    alignItems: 'center',
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row'
  },
  taname: {
    marginLeft: 12,
    fontSize: 16,
    color: 'black'
  },
  tadescription: {
    marginLeft: 10,
    fontSize: 15,
    color: '#6D6868'
  },
  noruleViewV: {
    marginTop:15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noruleViewText: {
    fontSize: 14,
    paddingTop: 10,
    color: 'black'
  },
  norView: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
  yearText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold'
  },
  detailView: {
    marginTop: 10,
    borderColor: '#ECEFF1',
    borderWidth: 1
  },
  detailBody: {
    backgroundColor: 'white',
    borderColor: '#ECEFF1',
    borderWidth: 1
  },
  detailBodys: {
    flex: 1,
    height: 100,
    paddingLeft: 15,
    paddingRight: 15
  },
  detailName: {
    backgroundColor: 'white',
    borderColor: '#ECEFF1',
    borderWidth: 1
  },
  detailNames:{
    paddingLeft:15,
    paddingRight:15,
    padding:10,
    backgroundColor: '#F6F7F8',
    borderColor: '#F6F7F8',
    borderWidth: 1
  },
  detailBod:{
    flex:1,
    paddingLeft:15,
    paddingRight:15,
    padding:5
  },
  tasterView:{
    paddingLeft:20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding:10,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modal3: {
    height: 400,
    width: 400,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  modal33: {
    height: Dimensions.get('window').height*0.8,
    width: Dimensions.get('window').width
  },
  addimageView:{
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,
    marginLeft:10,
    padding:10,
    width: 70,
    height: 85,
    borderWidth:1,
    borderColor:'#737373',
    backgroundColor:'#E6E6E6'
  },
  ruleItemView:{
    marginTop:5,
    borderBottomColor: '#ECEFF1',
    borderBottomWidth: 1,
    padding:5
  },
  newsView:{
    borderColor:'#000000',
    backgroundColor:'white',
    justifyContent: 'center',
    marginTop:10,
    paddingLeft:10,
    paddingRight:10,
    width:Dimensions.get('window').width-30
  },
  footerText:{
    color:'blue',
    textAlign: 'center',
    fontSize: 16
  },
  changeDateIcon:{
    width: 50,
    height: 50,
    borderRadius:25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dedailText:{
    fontSize: 14,
    fontWeight:'bold',
    color:'black',
    width:Dimensions.get('window').width-10
  },
  newView:{
    borderColor:'#ECEFF1',
    borderWidth: 1,
    marginTop:10,
    marginBottom:10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    width:Dimensions.get('window').width,
    alignItems: 'center',
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
  rightNavText:{
    color: 'white',
    fontSize:18
  },
  touIcon:{
    height:55,
    width:35,
    alignItems: 'center',
    justifyContent: 'center'
  }



});


