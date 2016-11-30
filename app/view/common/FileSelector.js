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
  Linking,
  ViewPagerAndroid,
  BackAndroid,
  WebView,
  Dimensions
} from 'react-native';

import _ from 'lodash';
import api from "../../network/ApiHelper";
import styles from "./style";
var {height, width} = Dimensions.get('window');
var Icons = require('react-native-vector-icons/Ionicons');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
var callFun;
var _this;
var dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.title !== row2.title});
;
var newArr=[];
export default class FileSelector  extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      AllData:new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      path:this.props.path==null?"/storage/":this.props.path,
      icoName:"",
      hasFile:true,
      menuItem:[],
      resData:[]
    };
    _this=this;
    this._onBackAndroid=this.onBackAndroid.bind(this);
  }
  componentDidMount(){
    _this=this;
    this.getList("/storage/");
    BackAndroid.addEventListener('hardwareBackPress', this._onBackAndroid);
  }
  componentWillUnmount() {
      BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
  }
  onBackAndroid(){
    /**
     * 设备物理后退键的事件
     */
    if(_this.state.menuItem.length==1){
      this.getList("/storage/");
    }
    if(_this.state.menuItem.length==0){
      this.props.nav.pop()
    }
    if(_this.state.menuItem.length!=1&&_this.state.menuItem.length!=0){
      this.getList(_this.state.menuItem[_this.state.menuItem.length-2].path);
    }
    //this.state.menuItem=_this.state.menuItem;
    //this.state.menuItem.splice(this.state.menuItem.length-1);
    this.state.menuItem=_.dropRight(_this.state.menuItem,1);
  };
  getList(path){
    /**
     * 数据改变后listView的位置不会到底部，导致数据显示不全
     * 解决方案：
     * 1.this.refs.list.scrollTo({x:0,y:0,animated:false});
     * 2.给listView加上key={xxx}，改变xxx的值就会重新渲染
     */
    RNFS.readDir(path)
      .then((result) => {
        if(result.length==0){
          this.setState({hasFile:false})
        }
        else{
          //根据文件类型进行排序
          result=_.sortBy(result, function(item) {
            return item.isFile();
          });
          _this.setState({
            AllData:this.state.AllData.cloneWithRows(result),
            hasFile:true,
            resData:result
          });
          if(_this.refs.list&&this.state.resData.length<=5){
            this.refs.list.scrollTo({x:0,y:0,animated:false});
          }
        }
      }).catch((err) => {
        this.setState({hasFile:false});
        //console.log(err.message, err.code);
      });
  }
  selectKB(item){


    if(item.isFile()){
      if(this.props.fileName!=null&&this.props.fileName.length!=0){
        var fileName=this.props.fileName;
        var oldFileType=fileName.substring(fileName.lastIndexOf("."),fileName.length);
        if(item.name.lastIndexOf(".")==-1){
          ToastAndroid.show('请选择同样的文件类型!',ToastAndroid.SHORT);
          return;
        }
        var newFileType=item.name.substring(item.name.lastIndexOf("."),item.name.length);
        if(oldFileType==newFileType){
          if((item.size/1024/1024)>20){
            ToastAndroid.show("只允许上传最大为20M的文件！",ToastAndroid.SHORT);
          }else{
            this.props.getSelFile(item);
            this.props.nav.pop();
          }
        }else{
          ToastAndroid.show("请选择同样的文件类型！",ToastAndroid.SHORT);
        }
      }else{
        if((item.size/1024/1024)>20){
          ToastAndroid.show("只允许上传最大为20M的文件！",ToastAndroid.SHORT);
        }else{
          this.props.getSelFile(item);
          this.props.nav.pop();
        }
      }

      //文件
      //Alert.alert(
      //  '文件信息',
      //  'name:'+item.name+'\n'+'size:'+item.size+'KB'+'\n'+'path:'+item.path
      //);
      //Linking.canOpenURL("file://"+item.path).then(supported => {
      //  if (!supported) {
      //    ToastAndroid.show('没有对应的应用程序！', ToastAndroid.SHORT);
      //  } else {
      //    return Linking.openURL("file://"+item.path);
      //  }
      //}).catch(err =>  ToastAndroid.show('打开失败！', ToastAndroid.SHORT));

    }
    else{
      //var temp=new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
      this.getList(item.path);
      _this.state.menuItem.push(item);
      this.setState({
        dataSource:dataSource.cloneWithRows(this.state.resData)
      });

    }

  }
  menuKB(item,index){
    if(item==0){
      this.getList("/storage/");
    }
    else{
      this.getList(item.path);
    }
    this.state.menuItem.splice(index+1);
  }
  renderItem(item) {
    var isFile=item.isFile().toString();
    var isImg=false;
    if(item.name.indexOf(".jpg")!=-1||item.name.indexOf(".png")!=-1){
      isImg=true;
    }
    var txtColor="gray";
    var icoName="folder";
    var iconColor="#E6B02D";
    if(!item.isFile()){
      icoName="folder";
    }
    else{
      //後綴名
      var index=item.name.lastIndexOf(".");
      var name=item.name.substring(index,item.name.length);
      switch(name){
        case ".txt":
          icoName="file-text-o";
          iconColor="#91A7B9";
          break;
        case ".jpg":
        case ".jpeg":
        case ".png":
          icoName="file-image-o";
          iconColor="#E15555";
          break;
        case ".docx":
        case ".doc":
          icoName="file-word-o";
          iconColor="#3E9AE8";
          break;
        case ".xlsx":
        case ".xls":
          icoName="file-excel-o";
          iconColor="#2FB266";
          break;
        case ".pptx":
        case ".ppt":
          icoName="file-powerpoint-o";
          iconColor="#EB8B18";
          break;
        case ".rar":
        case ".zip":
          icoName="file-zip-o";
          iconColor="#7DCA3D";
          break;
        case ".pdf":
          icoName="file-pdf-o";
          iconColor="#CF2C34";
          break;
        case ".mp3":
        case ".amr":
          icoName="file-sound-o";
          iconColor="#8183F1";
          break;
        case ".mp4":
          icoName="file-movie-o";
          iconColor="#6D8AAB";
          break;
        default:
          icoName="file";
          iconColor="#BEC3C7";
          break;
      }
    }
    return (
      <TouchableOpacity onPress={this.selectKB.bind(this,item)}>
        <View style={styles.fileSelCon}>
          <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <Icon
            name={icoName}
            size={30}
            color={iconColor}
            />
            <View style={{marginLeft:10}}>
            <Text numberOfLines={1} style={styles.fileName}>{item.name}</Text>
            <Text style={{color:'gray'}}>{item.size+'kb'}</Text>
              </View>
          </View>
          {!item.isFile()?<Icon
            name='angle-right'
            size={24}
            color="#A5A2A2"
            />:null}
         </View>
      </TouchableOpacity>
    )
  }
  backFile(){
    this.onBackAndroid();
  }
  render() {

    return (
     <View style={{flex:1}}>
       <NavigationBar
         style={styles.NavSty}
         leftButton={
          <NavLeftView nav={this.props.nav} backFun={this.backFile.bind(this)} leftTitle={this.props.navTil==null?"文件选择":this.props.navTil}/>
         }
         />

        <View style={styles.listViewSty}>
          <View style={{backgroundColor:'#EFF0F4',flexDirection: 'row',padding:10,flexWrap:'wrap'}}>
            <TouchableOpacity onPress={this.menuKB.bind(this,0,-1)}>
              <Text style={{color:'black',fontSize:16}}>根目录></Text>
            </TouchableOpacity>
            {
              this.state.menuItem&&this.state.menuItem.map((item,index)=>{
                return(
                  <TouchableOpacity key={index} onPress={this.menuKB.bind(this,item,index)}>
                    <Text style={{color:'black',fontSize:16}}>{item.name}></Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
          {
            !this.state.hasFile?<View style={styles.noFile}>
              <Icon
                name="exclamation-circle"
                size={35}
                color="#A5A2A2"
                />
              <Text style={{fontSize:14}}>没有文件</Text>
            </View>:
              <ListView
              ref="list"
              dataSource={this.state.AllData}
              renderRow={this.renderItem.bind(this)}
              />
          }

        </View>




       <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
       </View>
    )}

};

