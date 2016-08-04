
/**
 * Created by wangshuo on 2016/2/3.
 */
import React, {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    } from 'react-native';
import styles from "./style";
var Dimensions=require('Dimensions');
var {height, widths} = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import Icons from 'react-native-vector-icons/Ionicons';


export default class RegisterSucceed extends React.Component{
    creatCompany(){
        this.props.nav.push({
            id: 'CreatCompany',
        });
    };
    joinCompany(){
        this.props.nav.push({
            id: 'JoinCompany',
        });
    };
    render(){
        return(
            <View style={styles.recontainer}>
                <NavigationBar
                  style={{height: 55,backgroundColor:'#175898'}}
                  leftButton={
                     <View style={styles.navLeftBtn}>
                     <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={() => {this.props.nav.pop()}}>
                        <Icons
                          name="android-arrow-back"
                          size={28}
                          color="white"
                          onPress={() => {this.props.nav.pop()}}
                        />
                         </TouchableOpacity>
                         <Text numberOfLines={1} style={styles.navLeftText}>注册成功</Text>
                     </View>
                   }/>
                <View style={styles.rescontainer}>
                  <View style={styles.resimageView}>
                      <Image resizeMode="stretch" style={styles.resImage} source={require('../image/succeed.png')}/>
                      <Text style={{fontSize:28,color:'#175898'}}>注册成功！</Text>
                  </View>

                    <View style={{alignItems:'center',justifyContent: 'center',marginTop:30}}>
                        <TouchableOpacity style={styles.companyTou} onPress={this.creatCompany.bind(this)}>
                            <View style={styles.compbutton}>
                                <Text style={{fontSize:16,color:'white'}}>创建企业</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.companyTou} onPress={this.joinCompany.bind(this)}>
                            <View style={styles.compbutton}>
                                <Text style={{fontSize:16,color:'white'}}>加入企业</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    };

}
