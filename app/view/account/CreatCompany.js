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
    TextInput,
    } from 'react-native';
import styles from "./style";
import api from "../../network/ApiHelper";
var Dimensions=require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import Toast from  '@remobile/react-native-toast'
import NavigationBar from 'react-native-navbar';
import Icons from 'react-native-vector-icons/Ionicons';


export default class CreatCompany extends React.Component{
    state = {
        selectText:false,
        sel:false,
        sec:false,
        companyname:"",
        shortName:"",
        creatname:"",
        cont:false
    };
    creatcompany(){
        api.Company.createCompany(this.state.companyname,this.state.shortName,this.state.creatname)
        .then((resData)=>{
              Toast.show(resData.Data,"short");
                this.props.nav.push({
                    id: 'SelectCompany'
                });
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
                         <Text numberOfLines={1} style={styles.navLeftText}>创建企业</Text>
                     </View>
                   }/>
                <View style={styles.container}>
                    <View style={styles.creatcom}>
                        <Text style={styles.titletext}>企业全称</Text>
                        <View style={this.state.selectText?[styles.titleInput,{borderColor:'#0683F9',borderWidth: 1.2}]:styles.titleInput}>
                            <TextInput
                                ref="allname"
                                underlineColorAndroid="transparent"
                                onFocus={()=>{this._onFocus(0)}}
                                placeholder ="输入企业全称"
                                textAlignVertical={'center'} textAlign={'start'} style={styles.TextInputs} onChangeText={(text) => this.setState({companyname: text})} />
                        </View>
                    </View>
                    <View style={styles.creatcom}>
                        <Text style={styles.titletext}>企业简称</Text>
                        <View style={this.state.sel?[styles.titleInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.titleInput}>
                            <TextInput
                                ref="partname"
                                underlineColorAndroid="transparent"
                                onFocus={()=>{this._onFocus(1)}}
                                placeholder ="输入企业简称"
                                textAlignVertical={'center'} textAlign={'start'} style={styles.TextInputs} onChangeText={(text) => this.setState({shortName: text})} />
                        </View>
                    </View>
                    <View style={styles.creatcom}>
                        <Text style={styles.titletext}>姓名</Text>
                        <View style={this.state.sec?[styles.titleInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.titleInput}>
                            <TextInput
                                ref="name"
                                underlineColorAndroid="transparent"
                                onFocus={()=>{this._onFocus(2)}}
                                placeholder ="输入姓名"
                                textAlignVertical={'center'} textAlign={'start'} style={styles.TextInputs} onChangeText={(text) => this.setState({creatname: text})} />
                        </View>
                    </View>
                    {
                        this.state.companyname==""|| this.state.shortName==""|| this.state.creatname==""
                            ?<TouchableOpacity style={styles.loginTou}>
                            <View style={[styles.button,{backgroundColor:'#ccc'}]}>
                                <Text style={styles.text}>完成</Text>
                            </View>
                        </TouchableOpacity>
                            :<TouchableOpacity style={styles.loginTou} onPress={this.creatcompany.bind(this)}>
                            <View style={styles.button}>
                                <Text style={styles.text}>完成</Text>
                            </View>
                        </TouchableOpacity>
                    }



                </View>
            </View>
        );
    };

    _onFocus(textid){
        switch (textid) {
            case 0:
                this.setState({
                    selectText:true,
                    sel:false,
                    sec:false
                });
                break;
            case 1:
                this.setState({
                    selectText:false,
                    sel:true,
                    sec:false
                });
                break;
            case 2:
                this.setState({
                    selectText:false,
                    sel:false,
                    sec:true
                });
                break;
        }
    };

}
