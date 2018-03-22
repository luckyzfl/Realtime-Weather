import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Button,
  Text,
  FlatList,
  TextInput,
  View,
  Image,
  ImageBackground
} from 'react-native';
class Forecast extends Component {
  render() {
    return (
            <View style={{flex:1,alignItems:'center'}}>
                <View style={styles.box}>
                    <Text style={styles.bigtext}>
                      ◎  {this.props.name}  
                    </Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.bigtext}>
                    ☼   {this.props.main}
                    </Text>
                </View>
                {/* <Text style={styles.bigtext}>
                    Current condition:{this.props.description}
                </Text> */}
                <View style={styles.box}>
                    <Text style={styles.bigtext}>
                    ¤  {this.props.temp} ℃
                    </Text>
                </View>
            </View>
    );
  }
}
const styles = StyleSheet.create({
    box:{
        flex:1,
        //width:Dimensions.get('window').width,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
    },
    pic:{
        alignItems:"center",
        justifyContent:"flex-end",
        flex:1,
    },
    bigtext:{
        flex: 1,
        fontSize:25,
        textAlign:'center',
        margin:10,
        color:'#FFFFFF',
        alignItems:'center',
    },
});
export default Forecast;