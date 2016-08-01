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
    width:35,
    height:30,
    marginLeft:20,
  },
  image: {
    width: 45,
    height: 45,
    marginLeft:10,
    borderRadius: 90
  },
  rightContainer: {
    flex: 1,
    paddingLeft:3
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
  title: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight:'bold',
    color: "black",
    marginTop:-5
  },
  year: {
    fontSize: 14,
    marginLeft: 15,
    color: "#64656B",
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
    height: 0
  },
  loginTou:{
    marginTop:15
  },
  button:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    height:50,
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
  pinyinAddress:{
    backgroundColor:'#175898',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom:14,
    paddingTop:14
  }

});


