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
  Switch,
  Picker,
  Dimensions
} from 'react-native';

import styles from "./style";
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
var {height, widths} = Dimensions.get('window');

var UserandDepArr=[];
var ImagePickerManager = require('react-native-image-picker');
var imageData=[];
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import InputScrollView from 'react-native-inputscrollview';


export default class SendActivity extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      UserandDepArr:[],
      atUserorDep:[],
      isBottomView:false,
      avatarSource:[],
      switchState:false,
      expired_time:1,
      activityContent:"",
      announcementTil:""
    };
  };
  componentDidMount() {
    imageData=[];
    this.forceUpdate();
  };
  showDialog() {
    var options = {
      data: {
        items:["@用户",'@部门'],
        itemsCallback: (index, text) =>
        {
           if(index==0){
             var selectorConfig={
               selectorType:0,
               selectorRadio:0,
               getselectorItem:this.userItem.bind(this)
             };
             this.props.nav.push({
               id: 'SelectorMain',
               selectorConfig:selectorConfig
             });
           }
          else{
             var selectorConfigs={
               selectorType:1,
               selectorRadio:0,
               getselectorItem:this.userItem.bind(this)
             };
             this.props.nav.push({
               id: 'SelectorMain',
               selectorConfig:selectorConfigs
             });
           }
        }
      }
    };
    // var dialog = new DialogAndroid();
    // dialog.set(options.data);
    // dialog.show();
  }
  submitActivity(){
    var userData=this.state.UserandDepArr&&this.state.UserandDepArr.filter((useritem)=>{
      if(useritem.Type=="user"&&useritem!=null){
        return useritem
      }
      });
    var newuserData=userData&&userData.map((useritem)=>{
        if(useritem.Type=="user"&&useritem!=null){
          return useritem.Id
        }
      });
    var depData=this.state.UserandDepArr&&this.state.UserandDepArr.filter((depitem)=>{
        if(depitem.Type=="dep"&&depitem!=null){
          return depitem
        }
      });
    var newdepData=depData&&depData.map((depitem)=>{
          return depitem.Id
      });
    var fileData = this.state.avatarSource && this.state.avatarSource.map((item)=> {
        return {
          uri:encodeURI(item.uri),
          name:encodeURIComponent(item.uri.split('/').pop())
        };
      });
    var atusers=this.state.atUserorDep&&this.state.atUserorDep.filter((item)=>{
        if(item.Type=="user"&&item!=null){
          return item
        }
      });
    var newatusers=atusers&&atusers.map((useritem)=>{
        if(useritem.Type=="user"&&useritem!=null){
          return useritem.Id
        }
      });
    var atdeps=this.state.atUserorDep&&this.state.atUserorDep.filter((item)=>{
        if(item.Type=="dep"&&item!=null){
          return item
        }
      });
    var newatdeps=atdeps&&atdeps.map((depitem)=>{
        if(depitem.Type=="dep"&&depitem!=null){
          return depitem.Id
        }
      });
    var atText=this.state.atUserorDep&&this.state.atUserorDep.map((item)=>{
        return "@["+item.Name+"]"
      });
    var actConent="";
    actConent=this.state.atUserorDep&&atText.toString()+this.state.activityContent;
    if (this.state.UserandDepArr.length == 0&&this.props.project==null) {
      ToastAndroid.show("请选择发送范围",ToastAndroid.SHORT);
      return;
    }
    if(actConent==""){
      ToastAndroid.show("请填写发送内容！",ToastAndroid.SHORT);
      return;
    }
    if(this.props.project!=null){
      newuserData=null;
      newdepData=null;
    }
    loaderHandler.showLoader("请稍等。。。");
    if(this.props.type==1){
      if(this.state.announcementTil==""){
        loaderHandler.hideLoader();
        ToastAndroid.show("请填写公告标题！",ToastAndroid.SHORT);
        return;
      }
    api.Activity.createSharing(newuserData,newdepData,fileData,this.state.expired_time,this.state.switchState,actConent,newatusers,newatdeps,true,this.state.announcementTil,this.props.project&&this.props.project.projectId)
      .then((resData)=>{
        if (resData.Type == 1) {
          if(this.props.project==null){
              setTimeout(()=>{this.props.reloadList(this.isOK.bind(this))},1200);
            }else{
              setTimeout(()=>{
                this.props.reloadList();
                ToastAndroid.show("发送成功",ToastAndroid.SHORT);
                loaderHandler.hideLoader();
                this.props.nav.pop();
              },1200);
            }
        }else{
          loaderHandler.hideLoader();
           ToastAndroid.show(resData.Data,ToastAndroid.SHORT);
        }
      });}
    else{
    api.Activity.createSharing(newuserData,newdepData,fileData,null,this.state.switchState,actConent,newatusers,newatdeps,false,null,this.props.project&&this.props.project.projectId)
    .then((resData)=>{
        if (resData.Type == 1) {
         if(this.props.project==null){
              setTimeout(()=>{this.props.reloadList(this.isOK.bind(this))},1200);
            }else{
              setTimeout(()=>{
                this.props.reloadList();
                ToastAndroid.show("发送成功",ToastAndroid.SHORT);
                loaderHandler.hideLoader();
                this.props.nav.pop();
              },1200);
            }
        }else{
          loaderHandler.hideLoader();
           ToastAndroid.show(resData.Data,ToastAndroid.SHORT);
        }
      })}
  };
  isOK(isok){
    if(isok){
      ToastAndroid.show("发送成功",ToastAndroid.SHORT);
      loaderHandler.hideLoader();
      this.props.nav.pop();
    }else{
      ToastAndroid.show("列表刷新失败,请重试",ToastAndroid.SHORT);
      loaderHandler.hideLoader();
      this.props.nav.pop();
    }
  }
  uploadImage(){
    var options = {
      title: '选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从图库中获取',
      maxWidth: 1000,
      maxHeight: 1000,
      aspectX: 1,
      aspectY: 1,
      quality: 1,
      allowsEditing: false
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        //console.log('User cancelled image picker');
      }
      else if (response.error) {
        //console.log('ImagePickerManager Error: ', response.error);
      }
      else {
        const source = {uri:"file://"+response.path, isStatic: true};
        imageData.push(source);
        this.setState({
          avatarSource: imageData
        });
      }
    });
  }
  closeScopeItem(index){
    if(index>-1){
      this.state.UserandDepArr.splice(index,1);
      this.forceUpdate()
    }
  }
  scopeItem(UserandDepItem){
   //获取到用户和部门
    if(UserandDepItem!=null){
      this.setState({UserandDepArr:UserandDepItem})
    }
  }
  sendscope(){
    var selectorConfig={
      selectorType:2,
      selectorRadio:1,
      getselectorItem:this.scopeItem.bind(this)
    };
    this.props.nav.push({
      id: 'SelectorMain',
      selectorConfig:selectorConfig
    });

  }
  changeSwitch(){
    this.setState({switchState:!this.state.switchState})
  }
  deleteImage(index) {
    imageData.splice(index, 1);
    this.forceUpdate();
  }
  pickerItem(itemValue,itemPosition){
  this.setState({expired_time:itemValue});
  }
  userItem(selectedItem){
    this.state.atUserorDep.push(selectedItem[0]);
    var newstr=this.state.activityContent.substring(0,this.state.activityContent.length-1)
    this.setState({atUserorDep:this.state.atUserorDep,activityContent:newstr})
  }
  closeatItem(index){
    if(index>-1){
      this.state.atUserorDep.splice(index,1);
      this.forceUpdate()
    }
  }
  getActCont(text){
    this.setState({ activityContent: text});
    var actText=this.state.activityContent;
  }
  render() {
    return (

      <View style={{flex:1,backgroundColor:'white'}}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
              <NavLeftView nav={this.props.nav} leftTitle={this.props.type==0?"发分享":"发公告"}/>
                   }
          rightButton={
                   <TouchableOpacity style={{marginRight:10,justifyContent: 'center'}} onPress={this.submitActivity.bind(this)}>
                    <Text numberOfLines={1} style={styles.rightNavText}>发送</Text>
                      </TouchableOpacity>
                    } />

        <InputScrollView showsVerticalScrollIndicator={false}>
        <View>
        {
          this.props.project==null?
            <TouchableOpacity onPress={this.sendscope.bind(this)}>
          <View style={styles.sendConView}>
            <View style={styles.sendToView}>
              <Text style={styles.nomText}>发送至：</Text>
            </View>
            <View style={styles.sendToRView}>
              {
                this.state.UserandDepArr && this.state.UserandDepArr.map((scopeTemp, index)=> {
                  return (
                    <View key={index} style={styles.scopeView}>
                      <Text style={[styles.nomText, {color: 'white'}]}>{scopeTemp.Name}</Text>
                      <Icons name='ios-close' size={20} color='white' style={{marginLeft: 10}}
                            onPress={this.closeScopeItem.bind(this, index)}/>
                    </View>
                  )
                })
              }
            </View>
          </View>
        </TouchableOpacity>:null}
          {
            this.props.type==0?null
              :<View style={styles.nomView}>
              <TextInput
                style={{height:40,textAlignVertical:'center'}}
                placeholder='公告标题'
                onFocus={()=>{
               this.setState({isBottomView:true})
              }}
                onChangeText={(text) => this.setState({ announcementTil: text})}
                underlineColorAndroid="transparent"
                />
            </View>
          }


          <View style={[styles.nomView,{flex:1}]}>
            <View style={styles.sendToRView}>
            {
              this.state.atUserorDep && this.state.atUserorDep.map((atTemp, index)=> {
                  return (
                    <View key={index} style={styles.scopeView}>
                      <Text style={[styles.nomText,{color:'white'}]}>@{"["+atTemp.Name+"]"}</Text>
                      <Icons name='ios-close-empty' size={20} color='white' style={{marginLeft:10}} onPress={this.closeatItem.bind(this,index)} />
                    </View>
                  )
                })
            }
            </View>
            <TextInput
              style={{height:Dimensions.get('window').height*0.3,textAlignVertical:'top'}}
              multiline={true}
              ref="sendConent"
              value={this.state.activityContent}
              placeholder='发送内容'
              onChangeText={this.getActCont.bind(this)}
              underlineColorAndroid="transparent"
              />

          </View>

        </View>

        <View  style={styles.rightleftView}>
          <Text style={styles.nomText}>是否需要回执</Text>
          <Switch onValueChange={this.changeSwitch.bind(this)} value={this.state.switchState}/>
        </View>
          {
            this.props.type==0?null:
              <View  style={styles.rightleftView}>
                <Text style={styles.nomText}>公告有效期</Text>
                <View style={{width:Dimensions.get('window').width*0.4}}>
                  <Picker
                    selectedValue={this.state.expired_time}
                    mode="dialog"
                    onValueChange={this.pickerItem.bind(this)}>
                    <Picker.Item label="一天" value="1" />
                    <Picker.Item label="三天" value="2" />
                    <Picker.Item label="一周" value="3" />
                    <Picker.Item label="一个月" value="4" />
                    <Picker.Item label="三个月" value="5" />
                  </Picker>
                </View>
              </View>
          }
        <View style={{flexDirection: 'row',padding:10}}>
          {
            this.state.avatarSource && this.state.avatarSource.map((item, index)=> {
              return (
                <View key={index} style={{padding:10}}>
                  <Image
                    resizeMode='cover'
                    source={{uri:item.uri}}
                    style={{width: 70,height: 85}}
                    />
                  <Icons name='ios-close-circle'
                         size={26}
                         color='#C7254E'
                         onPress={this.deleteImage.bind(this,index)}
                         style={styles.closeImgIcon}/>
                </View>
              )
            })
          }
          {
            this.state.avatarSource&&this.state.avatarSource.length<3?
              <TouchableOpacity onPress={this.uploadImage.bind(this)}>
              <View style={styles.addimage}>
              <Icons name='ios-add'
                     size={50}
                     color='#737373'
                     onPress={this.uploadImage.bind(this)}
                />
            </View></TouchableOpacity>:null
          }

        </View>

      </InputScrollView>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>

    );
  }
};

