import React, { Component } from 'react';
import {Platform,StyleSheet,Text,Image,ImageBackground,
    Dimensions,FlatList,Button,TextInput,View,Alert,TouchableOpacity} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Forecast from './Forecast'
import Details from './Details'
import Icon from 'react-native-vector-icons/FontAwesome';
var Geolocation=require('Geolocation');
class HomeScreen extends Component {
    imguri={
        cloud:require('./img/cloud.jpg'),
        clear:require('./img/clear.jpg'),
        rain:require('./img/rain.jpg'),
        def:require('./img/back.jpg'),
    }
    constructor(props){
        //console.log(props);
        super(props);
        console.log(this.imguri);
        this.state = {
            forecast:{
                main:'',
                description:'',
                temp:0
            },
            lat:'',//40.22
            lon:'',//116.22
            cityname:"",
            backpicurl:this.imguri.def
        };
        //if need get location
        if('params' in props.navigation.state&&props.navigation.state.params.user!='backButton'){
            this.fetchInformation(this.getUrlName(props.navigation.state.params.user));
            return;
        }
        this.getCurPosWea();
    }//constructor
    getBackGroundurl=(infor)=>{
        if(infor=='Clouds'){
            return this.imguri.cloud;
        }
        if(infor=='Clear'){
            return this.imguri.clear;
        }
        if(infor=='Rain'){
            return this.imguri.rain;
        }
        return this.imguri.def;
    }//get background image url
    getUrlPos=(lat,lon)=>{
        let url='http://api.openweathermap.org/data/2.5/weather?lat='
                +lat
                +"&lon="
                +lon
                +'&units=metric&appid=ac57940a945fa474db5c9298d50b5fed';
        return url;
    }//get url by pos
    getUrlName=(name)=>{
        let url='http://api.openweathermap.org/data/2.5/weather?q='
            +name 
            +'&units=metric&appid=ac57940a945fa474db5c9298d50b5fed';
        return url;
    }//get url by name
    getCurPosWea=()=>{
        Geolocation.getCurrentPosition(
            location => {
                console.log(location);
                this.setState({
                    lat:location.coords.latitude,
                    lon:location.coords.longitude
                });//setstate
                var url=this.getUrlPos(location.coords.latitude,location.coords.longitude);
                this.fetchInformation(url);
            },//location
            error => {
                Alert.alert("Error",error.message);
            },//errorz
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );//geolocation
    }//get current position weather
    fetchInformation=(url)=>{
        console.log(url);
        fetch(url)
        .then(response =>response.json())
        .then(data =>{
            console.log(data);
            if(data.message=="city not found"){
                Alert.alert("Error","City not found");
                return;
            }
            this.setState({
                forecast:{
                    main: data.weather[0].main,
                    description: data.weather[0].description,
                    temp: data.main.temp
                },
                cityname:data.name,
                backpicurl:this.getBackGroundurl(data.weather[0].main),
                lat:data.coord.lat,
                lon:data.coord.lon,
            });
        })
        .catch(error=>alert(error))
    }//fetch
    handleTextChange(event){
        var zip = event.nativeEvent.text;
        var url = this.getUrlName(zip);
        this.fetchInformation(url);
    }//textchange
    render(){
        const { navigate } = this.props.navigation;
        var content = null;
        if(this.state.forecast !== null){
            content = <Forecast
                            name={this.state.cityname}
                            main={this.state.forecast.main}
                            description={this.state.forecast.description}
                            temp={this.state.forecast.temp}/>
        }
        console.log(this.state.backpicurl);
        return (
            <View style={styles.container}>
                <ImageBackground 
                    //source={require("./img/1.jpg")}
                    source = {this.state.backpicurl}
                    resizeMode='cover'
                    style={styles.backdrop}
                >
                <View style={{flex:1}}>
                    <View style={{flex:0.06}}/>
                    <View style={{flex:0.2,alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
                        <TouchableOpacity
                            onPress={() => this.getCurPosWea()}
                        >
                            <Text style={{fontSize:30,color:"#DDDDDD"}}>☸</Text>
                        </TouchableOpacity>
                        <View style={{flex:0.88}}/>
                        <TouchableOpacity
                            onPress={() => navigate('Details',{user:'Lucy'})}
                        >
                            <Text style={{fontSize:30,color:"#DDDDDD"}}>十</Text>
                        </TouchableOpacity>
                        <View style={{flex:0.05}}/>

                    </View>
                </View>                    
                <View style={{flex:1,opacity:0.5,backgroundColor:'#4B4B4B',alignContent:'center'}}>
                    <View style={{flex:1,alignItems:'center'}}>
                        {content}
                    </View>
                </View>
                <View style={{flex:1}} />
                </ImageBackground>
           </View>
        )//return
    }//render
}//class
const RealtimeWeather = StackNavigator({
    Home:{
        screen: HomeScreen,
        navigationOptions: {
              headerTitle: 'Home',
              header: false,
        }
    },
    Details:{
        screen: Details,
        navigationOptions: {
              headerTitle: 'Details',
              header: false,
        }
    }
});
var baseFontSize = 16;
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    backdrop:{
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    },
});
export default RealtimeWeather;