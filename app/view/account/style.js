'use strict';
import React, {Component} from 'react'
import {
  StyleSheet,
  Dimensions
  } from 'react-native'

var {height, widths} = Dimensions.get('window');  //��ȡ��Ļ����

module.exports = StyleSheet.create({
    container: {
      flex: 1,
      padding:20,
      backgroundColor:'white'
    },
    rescontainer:{
        flex: 1,
        backgroundColor:'white'
    },
    recontainer: {
        flex: 1,
        backgroundColor:'white'
    },
    todo:{
      flex: 1,
      paddingLeft:40,
      paddingRight:40,
      paddingTop:20,
      paddingBottom:10
    },
    button:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      marginVertical: 5,
      height:56,
      backgroundColor:'#175898',
      borderRadius: 6
    },
    codebutton:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:50,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor:'#175898',
        borderRadius: 6
    },
    compbutton:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:55,
        width:230,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor:'#175898',
        borderRadius: 6,
    },
    selcompbutton:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:50,
        width:150,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor:'#175898',
        borderRadius: 6,
    },
    imageViews:{
      alignItems:'center',
      padding:30,
    },
    resimageView:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'center',
        padding:40
    },
    forgetpas:{
      marginTop:40
    },
    loginTou:{
      marginTop:30
    },
    joincomTou:{
        marginTop:40
    },
    registerTou:{
        marginTop:50
    },
    userResi:{
      marginTop:10,
      alignItems:'center'
    },
    userImage: {
      padding:30,
      height: 100,
      width: 140,
      justifyContent: 'center',
    },
    resImage:{
        padding:30,
        height: 50,
        width: 50,
        justifyContent: 'center',
    },
    text:{
      fontSize:22,
      color:'white'
    },
    texts:{
      marginTop:5,
      fontSize:18,
      fontWeight:'bold'
    },
    adduserInput: {
      borderWidth: 1,
      borderColor: '#ABAAAA',
      borderRadius: 5,
      marginTop:23,
      marginBottom:0,
      height:50,
      flexDirection:'row',
      justifyContent: 'center'
    },
    titleInput:{
        borderWidth: 1,
        borderColor: '#ABAAAA',
        borderRadius: 5,
        marginBottom:0,
        height:50,
        justifyContent: 'center'
    },
    codeInput:{
        flex:1,
        borderWidth: 1,
        borderColor: '#ABAAAA',
        borderRadius: 5,
        marginTop:23,
        marginBottom:0,
        height:50,
    },
    codeTou:{
       width:widths*0.45,
        height:50,
        marginTop:23,
        marginLeft:20
    },
    companyTou:{
        width:widths*0.45,
        height:60,
        marginTop:10,
        marginLeft:10,
        marginBottom:10
    },
    companyTous:{
        width:widths*0.45,
        height:50,
        marginTop:10,
        marginBottom:10,
        flex:1,
      alignItems:'center',
    },
    TextInputs:{
      fontSize:16,
      flex:1,
      marginLeft:10,
      textAlignVertical:'center'
    },
    touch:{
      marginTop:110,
    },
    creatcom:{
        marginTop:15,
    },
    titletext:{
        color:'black',
        marginBottom:5,
        fontSize:15,
        marginTop:10
    },
    comcellCont:{
        flexDirection:'row',
        height:100,
        paddingBottom:10,
        paddingRight:20,
        paddingLeft:20,
        marginTop:5,
    },
    comcellView:{
        borderColor:'#cccccc',
        borderRadius: 6,
        borderWidth: 1,
        height:80,
        marginTop:10,
        justifyContent: 'center',
        paddingLeft:10,
        width:Dimensions.get('window').width-40,
        backgroundColor:'#FCF8E3'
    },
    containersw: {
      flex: 1,
      backgroundColor: 'white',
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
    bottomTou: {
      alignItems: 'center',
      justifyContent: 'center'
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
    loginProgress:{
      width:30,
      height:30,
      justifyContent: 'center',
      marginLeft:10
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
    NavSty:{
      height: 55,
      backgroundColor:'#175898'
    }
  });


