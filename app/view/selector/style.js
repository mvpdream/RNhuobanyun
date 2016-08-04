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
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  container: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    height: 70
  },
  deplistrow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  containersw: {
    flex: 1,
    backgroundColor: 'white',
  },
  icontainer: {
    padding:16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  searchView:{
    flex:1,
    marginLeft:10,
    alignItems: 'center',
    justifyContent: 'center',
    height:40,
    flexDirection: 'row',
    borderRadius: 15,
    borderColor: '#dddddd',
    backgroundColor:'white',
    borderWidth: 1,
  },
  serchImg:{
    width:30,
    height:30,
    marginLeft:12,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 90,
    marginLeft:8
  },
  rightContainer: {
    flex: 1,
    paddingLeft:1,
  },
  title: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight:'bold',
    color: "black",
    marginTop:-5
  },
  year: {
    fontSize: 14,
    marginLeft: 15,
    color: "black",
    marginTop:5
  },
  cellImage: {
    height: 50,
    marginRight: 15,
    width: 30,
    justifyContent: 'center'
  },
  info: {
    width: LIST_INFO_WIDTH,
    justifyContent: 'flex-start',
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: "black"
  },
  texts: {
    fontSize: 16,
    color: "black"
  },
  rigthBtn: {
    width: 32,
    height: 32,
    color: "#175898",
    justifyContent: 'center',
    marginRight: -15
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal4: {
    height: 300
  },
  loginTou:{
    marginTop:25
  },
  button:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    height:56,
    backgroundColor:'#175898',
    borderRadius: 5,
  },
  nodataViewText: {
    fontSize: 14,
    paddingTop: 10,
    color: 'black'
  },
  nodataView:{
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:18
  },
  searchViews:{
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    backgroundColor:'#EEE',
    padding:5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seachView:{
    height:40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 15,
    borderColor: '#dddddd',
    backgroundColor:'white',
    borderWidth: 1,
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
    fontSize:18
  },

});


