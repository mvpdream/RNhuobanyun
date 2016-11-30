import React, {Component} from 'react'
import {
 Image,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  ProgressBarAndroid,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import api from "../../network/ApiHelper";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons'
import InputScrollView from 'react-native-inputscrollview';



export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      user:[],
      isFetch:false,
      startLoad:true
    };
  };
  componentDidMount() {
    api.User.getUserProfile()
      .then((resData)=>{
        if(resData.Type==1){
          this.setState({
            startLoad:false,
            isFetch:true,
            user:resData.Data
          });
        }else{
          this.setState({
            isFetch:false
          });
        }

      })
  }
  editUser() {
    this.props.nav.push({
      id: 'UpdateUser',
      userData:this.state.user
    });
  };

  render() {
    return (
      <View style={styles.containersw}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
          <NavLeftView nav={this.props.nav} leftTitle="个人资料"/>
                   }
          rightButton={
                   this.state.isFetch?<TouchableOpacity style={{marginRight:10,alignItems: 'center',flexDirection: 'row'}} onPress={this.editUser.bind(this)}>
                    {
                        this.state.startLoad?<View style={styles.navLoadIcon}>
                        <ActivityIndicator animating={true} color='white'/>
                        </View>:null
                   }
                    <Text numberOfLines={1} style={styles.rightNavText}>编辑</Text>
                      </TouchableOpacity>:<Text/>
                    } />
        {this.state.isFetch? <InputScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Image
              source={{uri:this.state.user&&this.state.user.Avatar}}
              style={styles.thumbnail}
              />
            <View style={styles.rightContainer}>
              <Text style={styles.headName}>{this.state.user.FirstName}</Text>
              <Text style={[styles.headDepName,{width:Dimensions.get('window').width-100}]}>{this.state.user.Departments}</Text>
            </View>
          </View>

          <View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>手机</Text>
              <Text style={styles.year}>{this.state.user.Mobile}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>办公电话</Text>
              <Text style={styles.year}>{this.state.user.Phone}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>邮箱</Text>
              <Text style={styles.year}>{this.state.user.Email}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>QQ</Text>
              <Text style={styles.year}>{this.state.user.QQ}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>家乡</Text>
              <Text style={styles.year}>{this.state.user.Hometown}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>工号</Text>
              <Text style={styles.year}>{this.state.user.JobNumber}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>生日</Text>
              <Text style={styles.year}>{this.state.user.Birthday}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>毕业学校</Text>
              <Text style={styles.year}>{this.state.user.School}</Text>
            </View>
          </View>

        </InputScrollView>:null}

      </View>

    );
  }
};

