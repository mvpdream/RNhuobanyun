'use strict';

import React, {
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
  Linking,
  Component,
  ViewPagerAndroid,
  } from 'react-native';
var Dimensions = require('Dimensions');
import api from "../../network/ApiHelper";
import styles from "./style";
var {height, width} = Dimensions.get('window');
var Icons = require('react-native-vector-icons/Ionicons');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
import CameraRollPicker from 'react-native-camera-roll-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavigationBar from 'react-native-navbar';
var image=[];
var asset=[];
var sunNum=3;
var _this;
var _that;

class SelNum extends Component{
  constructor(props) {
    super(props);
    this.state = {
      selNum:0,

    };
    _that=this;
  }
  chageNum(images,assets){
    this.setState({selNum:images.length});
    image=images;
    asset=assets;
  }
  enterSelect(){
    //此处处理回调函数
    _this.props.getSelImg(image,asset);
    _this.props.nav.pop();
  }
  render(){
    return(
      <TouchableOpacity onPress={()=>this.enterSelect()}>
      <View style={[styles.navLeftBtn,{paddingRight:10}]}>
        <Text style={{ color: 'white',fontSize:16}}>{'确定'+'('+this.state.selNum+"/"+_this.state.sumNum+')'}</Text>
      </View>
        </TouchableOpacity>
    )
  }
}
export default class PhotoSelector  extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      sumNum:this.props.num==null?3:this.props.num
    };
    _this=this;
    image=[];
    asset=[];
  }
  getSelectedImages(images,assets) {
    this.refs.rightBtn.chageNum(images,assets);
  }

  render() {
    return (
      //one of 'Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream' and 'SavedPhotos'
      //batchSize：显示的图片的数量
      //imagesPerRow：一行显示的图片数量
      //imageMargin：图片之间的间距
     <View style={{flex:1}}>
       <NavigationBar
         style={{height: 55,backgroundColor:'#175898'}}
         leftButton={
           <View style={styles.navLeftBtn}>
              <Icons
                name="android-arrow-back"
                size={28}
                style={{marginLeft:20,paddingRight:20}}
                color="white"
                onPress={() => {this.props.nav.pop()}}
              />
            <Text style={{ color: 'white',fontSize:18}}>图片选择</Text>
           </View>
         }
         rightButton={
             <SelNum ref="rightBtn"/>
           }/>
       <CameraRollPicker
         groupTypes='SavedPhotos'
         batchSize={30}
         maximum={this.state.sumNum}
         assetType='Photos'
         imagesPerRow={3}
         imageMargin={5}
         callback={this.getSelectedImages.bind(this)} />
       <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
       </View>
    )}

};

