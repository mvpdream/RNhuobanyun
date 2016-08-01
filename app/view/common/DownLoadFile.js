'use strict';

import React, {
  ToastAndroid,
  Linking
  } from 'react-native';

var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
import Toast from  '@remobile/react-native-toast'
//var httpUrl='http://i-test.huobanyun.cn';
var httpUrl = 'http://i.huobanyun.cn';
//var httpUrl='http://192.168.0.155';
import RNFS from 'react-native-fs';

export function downLoadFiles(fileName,fileUrl){
  var url="";
  var oldDir=RNFS.PicturesDirectoryPath;//"/storage/sdcard/Pictures""/storage/emulated/0/Pictures"
  var apkPat=oldDir.substr(0,oldDir.lastIndexOf("/"));
  var apkPath =apkPat+"/"+"Download"+"/"+fileName;
  if(fileName.indexOf(".png")>-1||fileName.indexOf(".jpg")>-1){
    url=fileUrl;
  }
  else{
    url=httpUrl+fileUrl;
  }
  var option={
    fromUrl:url,
    toFile:apkPath
  };
  loaderHandler.showLoader("正在解析文件...请稍等.");
  RNFS.readdir(apkPat+"/"+"Download")
    .then((res)=>{
      RNFS.downloadFile(option)
        .then((res)=>{
          //下载完直接打开
          loaderHandler.hideLoader();
          if(res.statusCode==200){
            Linking.canOpenURL("file://"+option.toFile).then(supported => {
              if (!supported) {
                Toast.show('没有对应的应用程序!',"short");
              } else {
                return Linking.openURL("file://"+option.toFile);
              }
            }).catch(err =>  Toast.show('打开失败!',"short"));
          }
          else{
            Toast.show("下载失败，请重试","short");
          }
        })
    }).catch((err)=>{
      //需要创建
      RNFS.mkdir(apkPat+"/"+"Download")
        .then((res)=>{
          if(res[0]){
            RNFS.downloadFile(option)
              .then((res)=>{
                //下载完直接打开
                loaderHandler.hideLoader();
                if(res.statusCode==200){
                  Linking.canOpenURL("file://"+option.toFile).then(supported => {
                    if (!supported) {
                      Toast.show('没有对应的应用程序!',"short");
                    } else {
                      return Linking.openURL("file://"+option.toFile);
                    }
                  }).catch(err =>  Toast.show('打开失败!',"short"));
                }
                else{
                  Toast.show("下载失败，请重试","short");
                }
              })
          }
          else{
            Toast.show("目录创建失败，无法下载","short");
          }
        });
    }
  )
}

