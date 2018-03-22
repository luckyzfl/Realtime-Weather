import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  AsyncStorage,
  Alert,
  Text,
  Button,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  FlatList,
  TextInput,
  View
} from 'react-native';
import {
    List,
    ListItem
} from 'react-native-elements';
export default class Details extends Component{
    constructor(props){
        super(props);

        this.state = {
            text: '',
            modalVisible:false,
            cityName:"",
            cityList:[],
            citySearchList:[],
            showDelete:false
        }
        this2=this;
        AsyncStorage.getAllKeys(function (error, result) {
            if (!error) {
                if(result){
                    this2.setState({
                        cityList: result
                    })
                }
            }
        })
    }//constructor
    getUrlName=(name)=>{
        let url='http://api.openweathermap.org/data/2.5/weather?q='
            +name
            +'&units=metric&appid=ac57940a945fa474db5c9298d50b5fed';
        return url;
    }//get url by name
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
            var name = data.name;

            var CitySearchList = this.state.citySearchList;
            CitySearchList.push(name);

            this.setState({
                cityName:data.name,
                citySearchList:CitySearchList,

            });
        })
        .catch(error=>alert(error))
    }//fetch
    _searchTextSubmit(event){
        var zip = event.nativeEvent.text;
        var url = this.getUrlName(zip);
        this.fetchInformation(url);
    }
    _searchTextChange(event){
         var zip = event.nativeEvent.text;
         this.setState({
            text:zip,

         });
    }
    setModalVisible(visible) {
            this.setState({
                modalVisible: visible,
            });
     }
     _delete(key) {
            return AsyncStorage.removeItem(key);
     }
     load() {
         //this current 
     //     this2 = this;
          AsyncStorage.getItem(keyName, function (error, result) {
               if (!error) {
                     this.setState(
                       {
                         result: result === null ? 'The data has been deleted and now is null' : result
                       }
                     )
               }
           })
    }
    save(Name) {
         //this current
     //    this2 = this;
        AsyncStorage.setItem(Name,Name, function (error) {
            if (error) {
                alert('Failure storage');
            } else {
            }
        })
    }//save
    _deleteButton(){
        let a = this.state.showDelete;
        a = a ? false : true;
        this.setState({
            showDelete:a
        })
    }
    static navigationOptions = {
        title:'Chat with Lucy',
    };
    render(){
        if(this.state.showDelete == true){
            listElement=<FlatList style={{flex:1}}
                data={this.state.cityList}
                keyExtractor={item => item}
                renderItem={({item,index}) =>
                    <View style={styles.ListEle}>
                        <View style={{flexDirection:'row',justifyContent:"space-between",flex:1}}>
                            <View style={{flex:7}}>
                                <TouchableOpacity
                                    style={{alignItems:'flex-start',flex:1}}
                                    onPress={()=>{
                                        //alert("do");
                                        navigate('Home',{user:item})
                                    }}
                                >
                                    <Text
                                        style={{fontSize:30,flex:1,paddingLeft:8,alignItems:'flex-start',}}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:2}}>
                                <TouchableOpacity
                                    onPress={()=>{{
                                        let a = this.state.cityList;
                                        this._delete(a[index]);
                                        a.splice(index,1);
                                        this.setState({
                                            cityList: a,

                                        })
                                    }

                                    }}
                                >
                                    <Text style={{fontSize:25,paddingTop:5}}>Del</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                }
            />
         }else if(this.state.showDelete == false){

                        listElement=<FlatList style={{flex:1}}
                            data={this.state.cityList}
                            keyExtractor={item => item}
                            renderItem={({item,index}) =>
                                <View style={styles.ListEle}>
                                    <View style={{flexDirection:'row',justifyContent:"space-between",flex:1}}>
                                        <View style={{flex:9}}>
                                            <TouchableOpacity
                                                style={{alignItems:'flex-start',flex:1}}
                                                onPress={()=>{
                                                    //alert("do");
                                                    navigate('Home',{user:item})
                                                }}
                                            >
                                                <Text
                                                    style={{fontSize:30,flex:1,paddingLeft:8,alignItems:'flex-start',}}
                                                >
                                                    {item}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex:2}}>

                                         </View>
                                    </View>
                                </View>
                            }
                        />
         }
        const { navigate } = this.props.navigation;
        return(
            <View style={styles.container}>
                <Modal
                style={{backgroundColor:'grey',opacity: 0.5}}
                animationType='slide'           // from the bottom
                transparent={false}             // black not null
                visible={this.state.modalVisible}    // if visualbale
                onRequestClose={() => {this.onRequestClose()}}  // android must realise
                >
                    <ImageBackground source={require('./img/back.jpg')} resizeMode='cover' style={styles.backdrop}>
                        <View style={styles.containerSea}>
                            <View style={styles.searchBox}>
                                <TextInput style={styles.inputText}
                                    keyboardType='web-search'
                                    placeholder='Find city'
                                    returnKeyType='go'
                                    underlineColorAndroid='transparent'
                                    onSubmitEditing={(event)=>{{this._searchTextSubmit(event)}}}
                                //   onChangeText={(event) => {{this._searchTextChange(event)}}}
                                />
                                <TouchableHighlight
                                    onPress={() => {{this.setModalVisible(false)}}}
                                >
                                    <Text style={{fontSize:20}}>Cancel</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <List>
                            <FlatList
                                renderRow={this.renderRow}
                                data={this.state.citySearchList}
                                keyExtractor={item => item}
                                renderItem={({item,index}) => (
                                    <ListItem
                                        title={`${item}`}
                                        onPress={()=>{{
                                            this.save(this.state.cityName);
                                            this2=this;
                                            AsyncStorage.getAllKeys(function (error, result) {
                                                if (!error) {
                                                    if(result){
                                                        this2.setState({
                                                            cityList: result
                                                        })
                                                    }
                                                }
                                            })
                                            this.setState({
                                                modalVisible:false,
                                                cityName:'',
                                                citySearchList:[]
                                            })
                                            navigate('Home',{user:item})
                                        }}}
                                    />
                                )}
                            />
                        </List>
                    </ImageBackground>
                </Modal>
                <ImageBackground source={require('./img/back4.jpg')} resizeMode='cover' style={styles.backdrop}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{ flex: 1,flexDirection: 'row',justifyContent: 'space-between'}}>
                            <View style={{ flex: 1}}>
                                <TouchableHighlight
                                        onPress={() => navigate('Home',{user:'backButton'})}
                                        style={{padding: 10}}
                                    >
                                            <Text style={{fontSize:20,paddingTop:-35}}>〈  Back</Text>
                                    </TouchableHighlight>
                            </View>
                            <View style={{ flex: 1}}>
                                <TouchableHighlight
                                        onPress={() => {{this.setModalVisible(true)}}}
                                        style={{padding: 10}}
                                    >
                                            <Text style={{fontSize:20}}>   Search</Text>
                                    </TouchableHighlight>

                            </View>
                            <View style={{ flex: 1}}>
                                <TouchableHighlight
                                        onPress={() => {{this._deleteButton()}}}
                                        style={{padding: 10}}
                                    >
                                            <Text style={{fontSize:20}}>   Delete</Text>
                                    </TouchableHighlight>

                            </View>
                        </View>
                        <View style={{ flex: 12}}>
                            {listElement}
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

var width_list = Dimensions.get('window').width;
var baseFontSize = 16;
const styles = StyleSheet.create({
    container:{
        flex: 1,

    },
    ListEle:{
        height:70,
        width:width_list,
        flexDirection:'column'
    },
    searchBox:{//search box
      height:40,
      flexDirection: 'row',   // row main
      flex:1,
      borderRadius: 5,  // circle edge
      backgroundColor: 'white',
      alignItems: 'center',
      marginLeft: 8,
      marginRight: 8,
    },
    inputText:{
      flex:1,
      backgroundColor:'transparent',
      fontSize:15,
    },
    containerSea: {
        flexDirection: 'row',   // row
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,   
        height: Platform.OS === 'ios' ? 68 : 58,   
        alignItems: 'center'  // center
    },
    backdrop:{
        flex:1,
        flexDirection:'column',
    },
    overlay:{
        paddingTop:5,
        backgroundColor:'#000000',
        opacity: 0.5,
        flexDirection:'column',
        alignItems:'center',
        flex:1
    },
    backoverlay:{
        paddingTop:5,
        backgroundColor:'#000000',
        opacity: 0.5,
        flex:4
    },
    row:{
        flex:1,
        flexDirection:'row',
        flexWrap:'nowrap',
        alignItems:'flex-start',
        padding:30
    },
    rows:{
        flex:4


        },
    zipContainer:{
        flex:1,
        borderBottomWidth:1,
        borderBottomColor:'#DDDDDD',
        marginLeft:5,
        marginTop:3
    },
    zipCode:{
        width:50,
        height:baseFontSize
    },
    mainText:{

        fontSize:baseFontSize,
        color:'#FFFFFF'
    }

});
