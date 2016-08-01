'use strict';

var React = require('react-native');
var {
  StyleSheet,
  ToolbarAndroid,
  ToastAndroid,
  View
} = React;
import colorManager from '../../common/styles/manager'
var Icons = require('react-native-vector-icons/Ionicons');
var NavToolbar = React.createClass({

  render: function () {
    var title = this.props.title;
    var navIcon = {uri: this.props.icon, isStatic: true}

    return (
      <View>
        <Icons.ToolbarAndroid
          title={title}
          titleColor="white"
          style={[styles.toolbar,{backgroundColor:colorManager.getCurrentStyle().NAVCOLOR}]}
          navIconName={this.props.navIconName}
          onIconClicked={this.props.onClicked}
          onActionSelected={this.props.onActionSelected}
          actions={this.props.actions}
          overflowIconName="more"
          iconSize={28}
          />
        </View>
      )
  }
})

var styles = StyleSheet.create({
  toolbar: {
    height: 55
  }
});

module.exports = NavToolbar;
