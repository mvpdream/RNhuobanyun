/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  } = React;
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
module.exports = StyleSheet.create({
  nomText:{
    color:'black',
    fontSize: 14
  },
  countNum:{
    color:'#64656B',
    fontSize: 13
  },
  comBtnText:{
    color:'gray',
    fontSize: 15
  },
  dateText:{
    color:'#64656B',
    marginRight:3,
    fontSize: 13
  },
  commentView:{
    paddingLeft:5,
    paddingTop:3,
    paddingRight:5,
    backgroundColor:'#F2F2F2',
    borderBottomColor:'#D7D7D7',
    borderBottomWidth:1,
    width:Dimensions.get('window').width-42
  },
  itemUserimgs:{
    width: 30,
    height: 30,
    borderRadius:15
  },
  commentTextView:{
    borderColor:'#D7D7D7',
    borderWidth:1,
    backgroundColor:'#F5F2F0',
    width:Dimensions.get('window').width,
    alignItems: 'center',
    padding:5,
    flexDirection: 'row'
  },
  serchImg:{
    width:35,
    height:30,
    marginLeft:15,
  },
  commentTou:{
    backgroundColor:'#175898',
    justifyContent :'center',
    borderRadius: 5,
    width:Dimensions.get('window').width*0.2,
    height:40
  },
  commentTou1:{
    justifyContent :'center',
    width:Dimensions.get('window').width*0.15,
    height:40
  },
  commView:{
    borderColor:'#D7D7D7',
    borderWidth:1,
    marginLeft: 19.5,
    width:Dimensions.get('window').width-40
  },
  startView:{
    borderColor: '#D7D7D7',
    borderWidth: 1,
    padding:5,
    width:Dimensions.get('window').width-40,
    justifyContent: 'space-between',
    paddingLeft:15,
    marginTop:5,
    alignItems: 'center',
    flexDirection: 'row'
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal3: {
    height: Dimensions.get('window').height*0.8,
    width: Dimensions.get('window').width
  },
  actionsContainer: {
    padding: 6,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    borderTopWidth:1,
    borderTopColor:'#dddddd',
    backgroundColor:'#f4f4f4',
    alignItems: 'center'
  },
  actionActive: {
    color:'#3b5998'
  },
  actionIconRow:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionIcon: {
    width:32,
    height:32,
    flex:1,
    marginLeft: 8,
    marginRight: 8,
    flexDirection: 'row',
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  actionText:{
    color: 'black',
    textAlign: 'center',
    fontSize:13
  },
  actionItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'transparent',
  },
  applicationCon:{
    flex:1,
    backgroundColor:'#EFF0F4'
  },
  applicationWhiteV:{
    flex:1,
    backgroundColor:'white',
    marginTop:10
  },
  fileSelCon:{
    borderBottomColor: '#EFF0F4',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    justifyContent:'space-between',
    padding:10,
    paddingLeft:15,
    paddingRight:18

  },
  fileName:{
    width:Dimensions.get('window').width*0.8,
    color:'black',
    fontSize:15,
    fontWeight:'600'
  },
  navLeftBtn:{
    justifyContent: 'center',
    height:55,
    flexDirection: 'row',
    alignItems: 'center'
  },
  listViewSty:{
    flex:1,
    borderBottomColor: '#EFF0F4',
    borderBottomWidth: 1.5,
    borderTopColor: '#EFF0F4',
    borderTopWidth: 1.5
  },
  noFile:{
    alignItems: 'center',justifyContent: 'center'
  },
  commentListView:{
    paddingLeft:5,
    paddingRight:5,
    paddingBottom:5,
    backgroundColor:'#ffffff',
    width:Dimensions.get('window').width
  },
  footerView:{
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText:{
    color:'blue',
    textAlign: 'center',
    fontSize: 16
  },
  comBody:{
    paddingLeft:30,
    width:Dimensions.get('window').width-70
  },
  comParBody:{
    marginLeft:10,
    marginTop:6,
    marginBottom:8
  },
  comBody1:{
    marginLeft:35,
    borderBottomColor:'#D7D7D7',
    borderBottomWidth:1,
    paddingBottom:10
  },
  comParBody1:{
    marginLeft:10,
    marginTop:6
  },
  ImgViewBottom:{
    alignItems:'center',
    flexDirection: 'row',
    justifyContent:'space-between',
    padding:15
  },
  openViewTou:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height
  },
  openUpView:{
    position:'relative',
    top:55,
    right:5,
    left:Dimensions.get('window').width*0.58,
    bottom:10
  },
  openViewView:{
    position:'absolute',
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    top:0,
    bottom:0,
    right:0,
    left:0
  },
  openViewsView:{
    backgroundColor:'#F2F2F2',
    width:Dimensions.get('window').width*0.40
  },
  modalText:{
    color:'black',
    fontSize: 17,
    marginLeft:10
  },
  loaderContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },
  loaderOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    backgroundColor:'#4A4A4A',
    width: 150,
    height: 100
  },
  itemView:{
    alignItems: 'center',
    padding:10
  },
  commentCView:{
    width:Dimensions.get('window').width-40,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor:'#F2F2F2',
    borderColor:'#D7D7D7',
    borderWidth:1,
    marginLeft:2.5,
    padding:2
  }

});


