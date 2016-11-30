import React, {Component} from 'react'
import {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  TextInput,
  ScrollView,
  Alert,
  ViewPagerAndroid,
  Dimensions
} from 'react-native';


import api from "../../network/ApiHelper";
import styles from "./style";
var {height, width} = Dimensions.get('window');
import Icons from 'react-native-vector-icons/Ionicons';
import Images from 'react-native-image-zoom'

import RNFS from 'react-native-fs';
import ScrollableTabView from 'react-native-scrollable-tab-view';

export default class ImagesViewer  extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      dataSource : new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      imgurl:"",
      openView:false,
      currpagenum:this.props.imgindex
    }
  }
  componentDidMount(){
    this.setState({
      dataSource:this.state.dataSource.cloneWithRows(this.props.imageUrls)
    });

  }
  downLoadImg(){
    var currUrl=this.props.imageUrls[this.state.currpagenum];
    var index=currUrl.indexOf('Expires');
    var newStr=currUrl.substring(0,index-1);
    var imgIndex=newStr.lastIndexOf('/');
    var FileName=newStr.substring(imgIndex+1,newStr.lenght);
    var apkPat=RNFS.PicturesDirectoryPath;//"/storage/sdcard/Pictures""/storage/emulated/0/Pictures"
    var apkPath =apkPat+"/"+FileName;
    var option={
      fromUrl:currUrl,
      toFile:apkPath
    };
    RNFS.readdir(apkPat)
    .then((res)=>{
        //直接下载至该目录
          const ret = RNFS.downloadFile(option);
          ret.promise.then(res => {
            if (res.statusCode == 200) {
              ToastAndroid.show("图片已保存到"+apkPat+"目录下",ToastAndroid.SHORT);
            } else {
              ToastAndroid.show("下载失败，请重试",ToastAndroid.SHORT);
            }
          }).catch(err => {
            ToastAndroid.show("下载失败，请重试",ToastAndroid.SHORT);
          });
      }).catch((err)=>{
        //需要创建
        RNFS.mkdir(apkPat)
        .then((res)=>{
            if(res[0]){
              const ret = RNFS.downloadFile(option);
              ret.promise.then(res => {
                if (res.statusCode == 200) {
                  ToastAndroid.show("图片已保存到"+apkPat+"目录下",ToastAndroid.SHORT);
                } else {
                  ToastAndroid.show("下载失败，请重试",ToastAndroid.SHORT);
                }
              }).catch(err => {
                ToastAndroid.show("下载失败，请重试",ToastAndroid.SHORT);
              });
            }
            else{
              ToastAndroid.show("目录创建失败，无法下载",ToastAndroid.SHORT);
            }
          });
      });
  }
  changePage(data){
    this.setState({currpagenum:data.i})
  }
  render() {
    return (
     <View style={{flex:1,backgroundColor:'black'}}>
       <View style={{height: 55,marginTop:10}}>
         <TouchableOpacity onPress={() => {this.props.nav.pop();}}>
           <Icons
             name="md-arrow-round-back"
             size={28}
             color="white"
             style={styles.serchImg}
             />
         </TouchableOpacity>
       </View>
       <ScrollableTabView
         renderTabBar={() => <Text/>}
         initialPage={this.state.currpagenum} onChangeTab={this.changePage.bind(this)}>
         {
           this.props.imageUrls&&this.props.imageUrls.map((imgitem,index)=>{
             return(
               <View key={index} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                 <Images
                   source={{uri:imgitem}}
                   scaleType='centerInside'
                   style={{width:width, flex:1}}
                   />
               </View>
             )
           })
         }
       </ScrollableTabView>



       <View style={styles.ImgViewBottom}>
       <Text style={{fontSize:16,color:'white'}}>{this.state.currpagenum+1} / {this.props.imageUrls.length}</Text>
         <TouchableOpacity onPress={this.downLoadImg.bind(this)}>
         <Text style={{fontSize:16,color:'white'}}>保存</Text>
         </TouchableOpacity>
       </View>
       </View>
    )}

};

