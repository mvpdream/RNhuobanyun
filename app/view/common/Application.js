/**
 * Created by wangshuo
 */
'use strict';

import React, {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    } from 'react-native';
import styles from "./style";
import NavigationBar from 'react-native-navbar';
var Dimensions=require('Dimensions');
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, widths} = Dimensions.get('window');
import GridView from 'rn-grid-view';


export default class Application extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        const gridData = [
          {
            index:0,
            title: "通讯录",
            icon: 'phone-square',
            iconColor:'#33CC66',
            onSelect: ()=> {nav.push({id: 'AddressBook'})
          }
          },
          {
            index:1,
            title: "考勤",
            icon: 'map-marker',
            iconColor:'#3366CC',
            onSelect: ()=> {nav.push({id: 'AttendanceMain'})
          }
          }
        ];
        this.state = {
          gridData : gridData
        }
    };
    renderRow(item){
      return (
        <TouchableOpacity key={item.index} onPress={item.onSelect} activeOpacity={0.5}>
          <View style={[styles.itemView,{width:(Dimensions.get('window').width)/4}]}>
            <Icon
              name={item.icon}
              size={40}
              style={{height:50}}
              color={item.iconColor}
              />
            <Text style={{fontSize:13}}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      )
    }
    render() {
        const titleConfig = {
            title: '应用',
            tintColor:'white'
        };
        return (
            <View style={{flex:1}}>
                <NavigationBar
                  style={{height: 55,backgroundColor:'#175898'}}
                  title={titleConfig}/>
                <View style={styles.applicationWhiteV}>
                    <View style={{flex:1,marginTop:10}}>
                      <GridView
                        itemsPerRow={4}
                        renderFooter={null}
                        onEndReached={null}
                        scrollEnabled={true}
                        renderSeparator={null}
                        items={this.state.gridData}
                        fillIncompleteRow={false}
                        renderItem={this.renderRow}
                        automaticallyAdjustContentInsets={false} />
                    </View>
                </View>
            </View>
        );
    }
};

