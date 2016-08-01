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
  openViewView:{
    position:'absolute',
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    top:0,
    bottom:0,
    right:0,
    left:0
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
  openViewsView:{
    backgroundColor:'#F2F2F2',
    width:Dimensions.get('window').width*0.40
  },
  modalTextView:{
    borderBottomColor:'#D7D7D7',
    borderBottomWidth:1,
    paddingTop:12,
    paddingBottom:12,
    marginLeft:20,
    marginRight:20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalText:{
    color:'black',
    fontSize: 17,
    marginLeft:10
  },
  listViewSty:{
    flex:1,
    borderBottomColor: '#EFF0F4',
    borderBottomWidth: 1.5,
    borderTopColor: '#EFF0F4',
    borderTopWidth: 1.5
  },
  noFile:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  fileSelCon:{
    borderBottomColor: '#D7D7D7',
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent:'space-between',
    padding:10,
    marginTop:1,
    paddingLeft:15,
    paddingRight:18
  },
  fileName:{
    width:Dimensions.get('window').width*0.85,
    color:'black',
    fontSize:15,
    fontWeight:'400'
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
  TextTil:{
    color:"#000000",
    fontSize:18,
    fontWeight:'300',
    marginTop:3
  },
  TextNom:{
    color:"#000000",
    fontSize:14
  },
  TextNomSml:{
    color:"#000000",
    fontSize:13
  },
  commentCView:{
    width:Dimensions.get('window').width,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor:'#ffffff',
    padding:2,
    marginTop:10
  },
  commentView:{
    paddingLeft:5,
    paddingRight:5,
    paddingBottom:5,
    backgroundColor:'#ffffff',
    width:Dimensions.get('window').width
  },
  commView:{
    width:Dimensions.get('window').width
  },
  kbCellView:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  allCenter:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  fileInfoView:{
    marginTop:10,
    backgroundColor:'#ffffff',
    padding:15,
    marginBottom:10
  },
  infoBottom:{
    marginTop:10,
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  itemUserimgs:{
    width: 30,
    height: 30,
    borderRadius:15
  },
  favorIcon:{
    width:50,
    height: 50,
    borderRadius:25,
    borderColor:'#D7D7D7',
    borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  favorIconView:{
    alignItems: 'center',
    flexDirection: 'row',
    width:Dimensions.get('window').width-30,
    justifyContent: 'center'
  },
  nodataView:{
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:18
  },
  nodataViewText: {
    fontSize: 14,
    paddingTop: 10,
    color: 'black'
  },
  touIcon:{
    height:55,
    width:35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  comBody:{
    marginLeft:35,
    borderBottomColor:'#D7D7D7',
    borderBottomWidth:1,
    paddingBottom:10
  },
  comParBody:{
    marginLeft:10,
    marginTop:6
  },
  navLoadIcon:{
    width:25,
    height:25,
    justifyContent: 'center'
  },
  commViewCon:{
    paddingBottom:10,
    marginTop:10,
    marginBottom:10,
    backgroundColor:'white'
  },
  moreComView:{
    backgroundColor:'#ffffff',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding:10
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
  }
});


