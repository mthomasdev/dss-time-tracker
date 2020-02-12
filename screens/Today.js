import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

import * as Font from 'expo-font';

import moment from "moment";
import {AsyncStorage} from 'react-native';

export default class Today extends React.Component {
    state = {
        fontLoaded: false,
        myTimesheets : [],
        currentDate : new Date(),
        fetchDate : moment(new Date()).format('YYYY-MM-DD'),      
        timeAccumulated : {
            hours : 0,
            minutes : 0,
            seconds : 0,            
        },
    };

    async fetchTimesheet() {
        try {                        
            let fetchDate = this.state.fetchDate;
            let userId = await AsyncStorage.getItem('userId');                
            const response = await fetch(`http://10.10.10.205:3001/timelogs/${userId}/${fetchDate}/${fetchDate}`);
            const json = await response.json();            
            this.setState({ myTimesheets: json[0] });
        } catch (err) {
            console.log(err);
        }
    }

    async componentDidMount() {
        await Font.loadAsync({
            'latoBlack': require('../assets/fonts/Lato/Lato-Black.ttf'),
            'latoBold': require('../assets/fonts/Lato/Lato-Bold.ttf'),
            'latoLight': require('../assets/fonts/Lato/Lato-Light.ttf'),
            'latoRegular': require('../assets/fonts/Lato/Lato-Regular.ttf'),
        });

        this.setState({ fontLoaded: true });

        await this.fetchTimesheet();
         this.getAccumulatedTime();
    }


    async getAccumulatedTime() {

        let myTimesheets = this.state.myTimesheets;     

        if ( myTimesheets.logout != '00:00:00'  ) {
                let today = new Date();
                let formatedToday = moment(today).format('MMM DD YYYY');
                let myTimesheets = this.state.myTimesheets;     
                let login = (myTimesheets.login != '00:00:00') ? new moment(myTimesheets.login, "HH:mm:ss").format('hh:mm A') : 'Not Available';
                let loginDateTime = formatedToday + " " + login;
                let formatLogin = moment(loginDateTime, "MMM DD YYYY hh:mm:ss A");
                let formatCurrentDateTime = moment(today, "MMM DD YYYY hh:mm:ss A");
                let duration = moment.duration(formatCurrentDateTime.diff(formatLogin));      
                if  ( (myTimesheets.login != '00:00:00') ) {
                    this.setState({ timeAccumulated: {
                        hours : moment.utc(+duration).format('H'),
                        minutes : moment.utc(+duration).format('mm'),
                        seconds : moment.utc(+duration).format('ss'),
                    } });
                }      
                
        } else {
            this.acumulatedTime = setInterval(() => {

                let today = new Date();
                let formatedToday = moment(today).format('MMM DD YYYY');
                let myTimesheets = this.state.myTimesheets;        
                let login = (myTimesheets.login != '00:00:00') ? new moment(myTimesheets.login, "HH:mm:ss").format('hh:mm A') : 'Not Available';
                let loginDateTime = formatedToday + " " + login;
                let formatLogin = moment(loginDateTime, "MMM DD YYYY hh:mm:ss A");
                let formatCurrentDateTime = moment(today, "MMM DD YYYY hh:mm:ss A");
                let duration = moment.duration(formatCurrentDateTime.diff(formatLogin)); 
                
                if  ( (myTimesheets.login != '00:00:00') ) {
                    this.setState({ timeAccumulated: {
                                    hours : moment.utc(+duration).format('H'),
                                    minutes : moment.utc(+duration).format('mm'),
                                    seconds : moment.utc(+duration).format('ss'),
                                } });
                }
            }, 1000);
        }
        
    }

    render () {
        const today = this.state.currentDate;
        const formatedToday = moment(today).format('MMM DD YYYY');
        const myTimesheets = this.state.myTimesheets;        
        const login = (myTimesheets.login != '00:00:00') ? new moment(myTimesheets.login, "HH:mm:ss").format('hh:mm A') : 'Not Available';
        const logout = (myTimesheets.logout != '00:00:00') ? new moment(myTimesheets.logout, "HH:mm:ss").format('hh:mm A') : 'Not Available';
        
        
        if (this.state.fontLoaded) {
            return (
                <View style={styles.container}>
                    <SafeAreaView style={{ flex : 1 }}> 
                        {/* <TouchableOpacity 
                            style={{ alignItems: "flex-end", margin: 16 }}
                            onPress={this.props.navigation.openDrawer}
                        > 
                            <FontAwesome5 name="bars" size={24} color="#333" />
                        </TouchableOpacity> */}
                        
                        <View style={{ flex : 1}}>
                            <ImageBackground 
                                source={require("../assets/background.jpg")} 
                                style={{ width: undefined, padding:16, paddingTop: 0, paddingBottom: 0, height : Dimensions.get("window").height * 0.35,  }}
                               
                            >
                                <View style={{ flex : 1,  justifyContent : "center" }}>
                                    <Text style={styles.title}>Today</Text>
                                    <Text style={styles.date}>{formatedToday}</Text>
                                </View>
                            </ImageBackground>
                            <View style={{ flex : 1, backgroundColor : '#fff', padding: 20,  alignItems : "center", justifyContent : "center" }}>    
                                <Text style={styles.label}>ACCUMULATED HOURS</Text>
                                <Text style={styles.accumulatedDateValue}>
                                    { this.state.timeAccumulated.hours }
                                    <Text style={styles.dateSeparator}>H</Text>
                                    { this.state.timeAccumulated.minutes }
                                    <Text style={styles.dateSeparator}>M</Text>
                                    { this.state.timeAccumulated.seconds }
                                    <Text style={styles.dateSeparator}>S</Text>
                                </Text>
                            </View>
                            <View style={{ flex : 1, backgroundColor : '#fff', padding: 20, alignItems : "center", justifyContent : "center" }}>    
                                <Text style={styles.label}>TIME IN</Text>
                                <Text style={styles.dateValue}>{ login }</Text>
                            </View>    
                            <View style={{ flex : 1, backgroundColor : '#fff', padding: 20, alignItems : "center", justifyContent : "center" }}>
    
                                <Text style={styles.label}>TIME OUT</Text>
                                <Text style={styles.dateValue}>{ logout }</Text>
                            </View>
    
                           
                        </View>
                    </SafeAreaView>
    
                   
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <SafeAreaView style={{ flex : 1 }}> 
                        <TouchableOpacity 
                            style={{ alignItems: "flex-end", margin: 16 }}
                            onPress={this.props.navigation.openDrawer}
                        > 
                            <FontAwesome5 name="bars" size={24} color="#333" />
                        </TouchableOpacity>
                        
                        <View style={{ flex : 1, alignItems : "center", justifyContent : "center" }}>
                            <Text>Loading...</Text>                       
                        </View>
                    </SafeAreaView>

                
                </View>

            )
            
        }
        
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : "#fff",
    },
    title : {
        color : "#fff",
        fontSize : 42,
        fontFamily : 'latoBlack',
        padding : 10,
    },
    date : {
        color : "#fff",
        fontSize : 24,
        fontFamily : 'latoBold',
        padding : 10,
        textTransform : 'uppercase'
    },
    label : {
        color : "#333",
        fontSize : 14,
        fontFamily : 'latoRegular',
        paddingBottom : 5,       
        width : '100%',
        textAlign: 'center'
    },
    dateValue : {
        color : "#333",
        fontSize : 42,
        fontFamily : 'latoBold',
        paddingTop : 10,      
        width : '100%',
        textAlign: 'center'
    },
    accumulatedDateValue : {
        color : "#333",
        fontSize : 62,
        fontFamily : 'latoBold',
        paddingTop : 10,      
        width : '100%',
        textAlign: 'center'
    },
    dateSeparator : {
        color : "#333",
        fontSize : 24,
        fontFamily : 'latoBold',
        paddingTop : 10,    
        marginRight : 15,
        
    }
})
