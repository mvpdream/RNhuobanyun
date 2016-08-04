/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  } = React;
var Dimensions = require('Dimensions');
module.exports = StyleSheet.create({
  Ncontainer: {
    flex: 1,
    flexDirection: 'row'
  },
  Acontainer:{
    flex: 1,
    backgroundColor:'#EFF0F4'
  },
  itemHead:{
    flexDirection: 'row'
  },
  itemOther:{
    backgroundColor:'#EFF0F4',
    marginTop:10,
    padding:8,
    flexDirection: 'row',
  },
  itemnamesope:{
    justifyContent: 'center',
    paddingLeft:8,
    marginTop:8,
    marginLeft:4
  },
  itemBottom:{
    borderTopColor: '#ECEFF1',
    borderTopWidth: 1.5,
    padding:10,
    marginTop:10,
    flexDirection: 'row',
  },
  itemBottoms:{
    borderTopColor: '#ECEFF1',
    borderTopWidth: 1.5,
    padding:10,
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemBottomView:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemUserimg:{
    width: 50,
    height: 50,
    borderRadius:100
  },
  itemUserimgs:{
    width: 45,
    height: 45,
    borderRadius:90
  },
  NrightContainer: {
    flex: 1
  },
  countnum:{
    color:'#64656B',
    fontSize: 13,
  },
  itemBody:{
   marginTop:10,
    padding:6
  },
  Ntitle: {
    color:'black',
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'left'
  },
  nomText:{
    color:'black',
    fontSize: 14
  },
  scopeText:{
    color:'#64656B',
    fontSize: 12,
  },
  modalTitle:{
    color:'#64656B',
    fontSize: 18,
  },
  itemNamesope:{
    fontSize:14,
    color:'black',
    fontWeight:'200'
  },
  Ndata: {
    color:'black',
    textAlign: 'left'
  },
  Nicon: {
    width: 40,
    height: 40
  },
  Nbody:{
    color:'black',
    textAlign: 'center',
    fontSize: 15,
    marginBottom:5,
    marginTop:1
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
  containersw: {
    flex: 1,
    backgroundColor: 'white',
  },
  serchImg:{
    width:35,
    height:30,
    marginLeft:20,
    marginRight:5
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
  bonnerView:{
    width:Dimensions.get('window').width,
    borderColor: '#3D75E4',
    backgroundColor:'white',
    borderWidth: 1,
    padding:15,
  },
  closeIcon:{
    width: 30,
    height: 30,
    position: 'absolute',
    top:0,
    right:1
  },
  activityItemView:{
    backgroundColor:'white',
    padding:12,
    paddingBottom:0,
    marginTop:10
  },
  actionBtn:{
    position:'absolute',
    right:-5,
    top:20,
    left:10,
    bottom:30
  },
  activityImageView:{
    padding:10,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  commentTou:{
    backgroundColor:'#175898',
    justifyContent :'center',
    borderRadius: 5,
    width:Dimensions.get('window').width*0.2,
    height:40
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
  voteorRView:{
    flex:1,
    backgroundColor:'#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'#D7D7D7',
    borderWidth:1,
    borderRadius:3,
    padding:8
  },
  submitVotes:{
    flex:1,
    padding:15,
    flexDirection:'row',
    justifyContent:'flex-end'
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
  submitVoteView:{
    padding:5,
    width:100,
    alignItems: 'center',
    backgroundColor:'#175898'
  },
  submitVoteViews:{
    flex:1,
    width:Dimensions.get('window').width,
    paddingLeft:20,
    paddingRight:15
  },
  creatVoteR:{
    borderRadius: 3,
    borderColor: '#D7D7D7',
    backgroundColor:'rgba(122, 166, 212, 0.49)',
    borderWidth: 1,
    width:Dimensions.get('window').width-50,
    paddingLeft:13,
    paddingRight:17,
    marginTop:5
  },
  creatVoteRs:{
    borderRadius: 3,
    borderColor: '#D7D7D7',
    backgroundColor:'rgba(122, 166, 212, 0.49)',
    borderWidth: 1,
    width:Dimensions.get('window').width-50,
    marginTop:5,
    paddingBottom:1
  },
  progressView:{
    backgroundColor:'#5BC0DE',
    height:3,
    borderRadius: 3,
  },
  creatVoteR1:{
    borderRadius: 3,
    borderColor: '#D7D7D7',
    backgroundColor:'rgba(122, 166, 212, 0.49)',
    borderWidth: 1,
    width:Dimensions.get('window').width-50,
    paddingLeft:16,
    paddingRight:-5,
    marginTop:5
  },
  unrecticed:{
    padding:6,
    borderColor:'#D7D7D7',
    borderWidth:1,
    borderRadius:3,
    width:Dimensions.get('window').width-50,
  },
  noReceptited:{
    borderRadius: 10,
    borderColor: '#D7D7D7',
    backgroundColor:'#D7E3E3',
    borderWidth: 1,
    width:Dimensions.get('window').width-40,
    paddingLeft:20,
    paddingRight:18,
    marginTop:5
  },
  voteCont:{
    padding:5,
    width:Dimensions.get('window').width*0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor:'#175898'
  },
  commentPView:{
    backgroundColor:'#F2F2F2',
    borderColor:'#D7D7D7',
    borderWidth:1
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
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal4: {
    height: 300,
  },
  scopeView:{
    padding:5,
    flexDirection: 'row',
    borderRadius: 8,
    borderColor: '#dddddd',
    backgroundColor:'#5DCFF3',
    borderWidth: 1
  },
  addimage:{
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
  sendConView:{
    borderBottomColor:'#D7D7D7',
    borderBottomWidth:1,
    flexDirection: 'row',
    padding:8,
    alignItems: 'center'
  },
  sendToView:{
    width:80,
    borderRightColor:'#D7D7D7',
    borderRightWidth:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendToRView:{
    width:Dimensions.get('window').width-80,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding:5
  },
  nomView:{
    borderBottomColor:'#D7D7D7',
    borderBottomWidth:1,
    padding:8
  },
  rightleftView:{
    borderBottomColor:'#D7D7D7',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth:1,
    padding:8,
    flexDirection: 'row'
  },
  closeImgIcon:{
    width: 28,
    height: 28,
    position: 'absolute',
    top:-3,
    right:-3
  },
  optionView:{
    width:Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding:5
  },
  modal3: {
    height: Dimensions.get('window').height*0.8,
    width: Dimensions.get('window').width
  },
  actDetailTou:{
    padding:6,
    paddingRight:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempItemView:{
    borderRadius: 10,
    borderColor: '#D7D7D7',
    backgroundColor:'#D7E3E3',
    borderWidth: 1,
    marginTop:6,
    width:Dimensions.get('window').width-40,
    marginLeft:20,
    paddingLeft:10,
    paddingRight:20,
  },
  voteorreceView:{
    borderWidth:1,
    height:80,
    borderColor:'#ECEFF1',
    backgroundColor:'white',
    padding:5,
    justifyContent: 'center',
    marginTop:10
  },
  voteorreceViews:{
    alignItems: 'center',
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  voteorreceViewss:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:10
  },
  actDetailIcon:{
    width:30,
    height:30,
    borderRadius:15,
    borderColor:'#999',
    backgroundColor:'#ddd',
    alignItems: 'center',
    justifyContent: 'center',
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
  a: {
    fontWeight: '500',
    color: '#007AFF',
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


