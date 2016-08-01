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
  container:{
    flex:1,
    backgroundColor:'#ffffff',
    marginTop:10,

  },
  MyAtdContainer:{
    flex:1,
    padding:15
  },
  dateView:{
    padding:15,
    borderBottomColor: '#D7D7D7',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  PuCardView:{
    padding:15,
    flex:1
  },
  UpDateView:{
    flexDirection: 'row'
  },
  CardIcon:{
    width: 36,
    height: 36,
    backgroundColor:'#175898',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:18
  },
  CardIcons:{
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:18,
    backgroundColor:'gray'
  },
  TextTil:{
    color:"#000000",
    fontSize:14,
    fontWeight:'300'
  },
  TextNom:{
    color:"#000000",
    fontSize:14
  },
  IconText:{
    color:"#ffffff",
    fontSize:13
  },
  UpdateText:{
    color:"#0077B0",
    fontSize:12
  },
  PuCardDateView:{
    marginLeft:10,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  PuCardDateText:{
    color:"#000000",
    fontSize:15
  },
  PuCardDateTexts:{
    color:'#64656B',
    fontSize: 14
  },
  PuCardTypeView:{
    marginTop:8,
    marginLeft:40,
    alignItems: 'center',
    flexDirection: 'row'
  },
  PuCardWorkView:{
    backgroundColor:'#FF6600',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:8,
    padding:4
  },
  PuCardCont:{
    alignItems: 'center',
    marginTop:20,
    justifyContent: 'center',
    flex:1
  },
  PuCardBtn:{
    width: width*0.3,
    height: width*0.3,
    backgroundColor:'#175898',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:width*0.15
  },
  PuCardBtnText:{
    color:'#cccccc',
    fontSize: 14
  },
  PuCardOkView:{
    marginTop:10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  updateCardView:{
    alignItems: 'center',
    flexDirection: 'row'
  },
  DataPickerView:{
    width: width*0.3,

  },
  MyAtdCountView:{
    width: width*0.5,
    backgroundColor:'#ffffff',
    borderColor: '#CCCCCC',
    borderWidth: 1
  },
  DataPickerHeadView:{
    backgroundColor:'#175898',
    justifyContent: 'center',
    alignItems: 'center',
    padding:10
  },
  DataPickerContView:{
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderTopWidth:1,
    backgroundColor:'#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding:15
  },
  MonthText:{
    color:'black',
    fontSize:18,
    fontWeight:'500',
    marginTop:3
  },
  MonthView:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  MyAtdCont:{
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  nomView:{
    borderBottomColor: '#D7D7D7',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding:8
  },
  otherWorkView:{
    flex:1,
    alignItems: 'center',
    borderLeftColor: '#D7D7D7',
    borderLeftWidth: 1,
    justifyContent: 'center',
    padding:9
  },
  DetailTitle:{
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom:10
  },
  NormalDetailView:{
    alignItems: 'center',
    paddingBottom:10
  },
  NormalDetailTou:{
    alignItems: 'center',
    flexDirection: 'row'
  },
  circleView:{
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    borderColor: 'gray',
    borderWidth: 1.5,
    marginTop:5
  },
  circleSmallView:{
    width: 12,
    height: 12,
    backgroundColor:'#FF6600',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:6
  },
  MyAtdDetailView:{
    marginLeft:10,
    borderLeftColor: 'gray',
    borderLeftWidth: 1,
    marginTop:-10
  },
  MyAtdDetailViews:{
    marginLeft:15,
    paddingTop:10,
    paddingBottom:10
  },
  noData:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardText:{
    alignItems: 'center',
    justifyContent: 'center',
    width:Dimensions.get('window').width-25
  }


});


