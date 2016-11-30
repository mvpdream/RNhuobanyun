import React, {Component} from 'react'
import {
   Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
  Dimensions
} from 'react-native';

import styles from "./style";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
export default class KbCellItem extends React.Component{
  constructor(props){
    super(props);
    const nav = this.props.nav;
    this.state = {

    };

  };
  change(item){
    if(!item.IsKb){
      /**
       * 0 文件夹
       * 1 文件
       * 2 图片
       * 3 文章
       */
      if(item.Type==1||item.Type==2){
        this.props.nav.push({
          id:'KbFileDetail',
          fileType:item.Type,
          managePermission:item.ManagePermission,
          kbName:item.FileName,
          menuText:this.props.menuText,
          kbId:item.Id,
          updateFileName:this.props.updateFileName,
          removeFile:this.props.removeFile,
          lockFile:this.props.lockFile,
          updateFile:this.props.updateFile,
          project:this.props.project&&this.props.project
        })
      }
      if(item.Type==3){
        this.props.nav.push({
          id:'KbArticleDetail',
          fileType:item.Type,
          managePermission:item.ManagePermission,
          kbName:item.FileName,
          menuText:this.props.menuText,
          kbId:item.Id,
          updateFileName:this.props.updateFileName,
          removeFile:this.props.removeFile,
          lockFile:this.props.lockFile,
          updateFile:this.props.updateFile
        })
      }


    }else {
      this.props.nav.push({
        id:'KbMain',
        kbName:item.FileName,
        kbId:item.Id,
        managePermission:item.ManagePermission
      })
    }

  }
  itemMenu(item){
    if(item!=null){
      this.props.callback(item);
    }
  }
  render() {
    var item=this.props.itemTemp;
    var icoName="folder";
    var iconColor="#E6B02D";
    if(item.IsKb){
      icoName="folder";
    }
    else{
      //後綴名
      var index=item.FileName.lastIndexOf(".");
      var name=item.FileName.substring(index,item.FileName.length);
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
          icoName="file-text";
          iconColor="#BEC3C7";
          break;
      }
    }
    return (
      //onLongPress={this.itemMenu.bind(this,item)}
      <TouchableOpacity onPress={()=>this.change(item)} onLongPress={this.itemMenu.bind(this,item)}>
        <View style={styles.fileSelCon}>
          <View style={styles.kbCellView}>
            <Icon
              name={item.Type==3?'file-text-o':icoName}
              size={25}
              color={item.Type==3?'#91A7B9':iconColor}
              />
            <View style={[styles.kbCellView,{marginLeft:10}]}>
              <Text style={styles.fileName}>{item.FileName+"   "}
                {
                  item.IsLock?
                      <Icon
                        name='lock'
                        size={18}
                        color='gray'
                        />
                    :null
                }
              </Text>

            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

