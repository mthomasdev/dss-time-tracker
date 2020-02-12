import React, { useState, useEffect, Fragment } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, ImageBackground, Dimensions, ActivityIndicator } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import moment from "moment";
import { useHttp } from '../hooks/http'
import * as Font from 'expo-font';
import MonthSelectorCalendar from 'react-native-month-selector';
import {AsyncStorage} from 'react-native';


const Monthly = props => {
    const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
    const [screenTitle, setScreenTitle] = useState('Monthly');  
    const [screenSubTitle, setScreenSubTitle] = useState(moment().format('MMMM YYYY'));    
    const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));
    const [goRun, setGoRun] = useState(false); 
    const [isReadyToFetch, setIsReadyToFetch] = useState(false); 
    const [selectedDate, setSelectedDate] = useState(moment()); 
    const [isFontLoaded, setIsFontLoaded] = useState(false); 
    const [totalHours, setTotalHours] = useState(0); 
    const [missingHours, setMissingHours] = useState(0); 
    const [userId, setUserId] = useState(''); 
    const uri = window.location.href;
    const split = uri.split("/");      
    const [isLoading, fetchedData] =  useHttp(`http://10.10.10.205:3001/timelogs/${userId}/${startDate}/${endDate}`, isReadyToFetch, [startDate, endDate, isReadyToFetch]);
    
    const userLogs = fetchedData ? fetchedData.filter(log => {
        let day = new moment(log.attendanceDate).format('ddd');        
        return (day.toLowerCase() != 'sun' && day.toLowerCase() != 'sat') || log.login != '00:00:00';
    })
    .map((log, index) => ({

        id : index,
        date : new moment(log.attendanceDate).format('MMM DD'),
        day : new moment(log.attendanceDate).format('DD'),
        dayLabel : new moment(log.attendanceDate).format('ddd'),
        login : (log.login != '00:00:00') ? new moment(log.login, "HH:mm:ss").format('hh:mm A') : 'Not Available',
        logout : (log.logout != '00:00:00') ? new moment(log.logout, "HH:mm:ss").format('hh:mm A') : 'Not Available',
        minutes : log.minutes,
        hours : log.hours
    })) : [];

    async function loadFont() {
        await Font.loadAsync({
            'latoBlack': require('../assets/fonts/Lato/Lato-Black.ttf'),
            'latoBold': require('../assets/fonts/Lato/Lato-Bold.ttf'),
            'latoLight': require('../assets/fonts/Lato/Lato-Light.ttf'),
            'latoRegular': require('../assets/fonts/Lato/Lato-Regular.ttf'),
        });

        setIsFontLoaded(true);
    }

    async function getTotalHours() {
        await userLogs;

        const getTotal = userLogs.reduce((total, amount) => {
            total += amount.hours;
            return total;
          }, 0);

        setTotalHours(getTotal.toFixed(2));
    }


    async function getMissingHours() {
        await userLogs;
        await totalHours;
        
        let targetHours = userLogs.length * 9;
        let missingHours = ( targetHours - totalHours <= 0) ? 0 : targetHours - totalHours;

        setMissingHours(missingHours.toFixed(2));
    }

    async function retrieveData() {
       
        try {
            const getUserId = await AsyncStorage.getItem('userId');
          
            if (getUserId !== null) {    
                
            setUserId(getUserId);
            setGoRun(true); //Set true to run http request
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    useEffect(() => {
        retrieveData();
    }, []);

    useEffect(() => {
        
        if ( goRun ) {
            setIsReadyToFetch(true);
        }
    }, [goRun]);

    useEffect(() => {
        loadFont();
    }, []);

    
    useEffect(() => {
        getTotalHours();
    }, [userLogs]);

    useEffect(() => {
        getMissingHours();
    }, [userLogs]);


    useEffect(() => {

        if (selectedDate) {
            let start = selectedDate.startOf('month').format('YYYY-MM-DD');
            let end = selectedDate.endOf('month').format('YYYY-MM-DD');
            
            setStartDate(start);
            setEndDate(end);
            setScreenSubTitle(moment(start).format('MMMM YYYY'))
        }
        
    }, [selectedDate]);

    let content = (
        <View style={styles.container}>
            <SafeAreaView style={{ flex : 1 }}>
                <View style={{ flex : 1}}>
                    <View style={{ flex : 1,  alignItems: 'stretch',  flexDirection: 'row', }}>
                        <View style={{ flex : 8,}}>
                            <ImageBackground 
                                source={require("../assets/background.jpg")} 
                                style={{ width: undefined, padding:16, paddingTop: 0, paddingBottom: 0, height : Dimensions.get("window").height * 0.35,  }}                        
                            >
                                <View style={{ flex : 1,  justifyContent : "center" }}>
                                    <Text style={styles.title}>{ screenTitle }</Text>     
                                    <Text style={styles.date}>{ screenSubTitle }</Text>                       
                                </View>
                            </ImageBackground>
                        </View>                        
                        <View style={{ flex : 4,}}>
                            <MonthSelectorCalendar
                                containerStyle={{ flex : 1, alignItems: 'stretch', flexDirection: 'column',}}
                                selectedDate={selectedDate}
                                initialView={selectedDate}
                                onMonthTapped={(date) => setSelectedDate(date)} 
                                swipable
                                selectedBackgroundColor={"#f45611"}
                            />
                        </View>
                    </View>
                    { isLoading ? (
                    <View style={{flex : 1, flexDirection: 'row', justifyContent: 'space-around',}}>
                        <ActivityIndicator size="large" color="#f45611" />            
                    </View>
                    ) : ( 
                    <Fragment>
                    <View style={{ height : 100, paddingTop: 40}}>
                        <View style={{flex : 1, alignItems: 'stretch',  flexDirection: 'row',  }}>
                            <View style={{ flex : 6, justifyContent: 'center', alignItems : "center" }}>
                                <Text style={styles.label}>TOTAL HOURS</Text>
                                <Text style={[styles.itemDay, { color : '#28a745'}]}>{totalHours}</Text>
                            </View>
                            <View style={{ flex : 6, justifyContent: 'center', alignItems : "center" }}>
                                <Text style={styles.label}>MISSING HOURS</Text>
                                <Text style={[styles.itemDay, { color : missingHours <= 0 ? '#28a745' : '#ffc107'}]}>{missingHours}</Text>
                               
                            </View>
                        </View>
                    </View>
                    <View style={{ flex : 1,  paddingTop : 50, paddingBottom : 50}}>
                        <FlatList 
                            keyExtractor={(item) => item.id.toString()}
                            data={userLogs}
                            renderItem={({item}) => (
                                <View style={styles.flatlist}>
                                    <View style={{ width : 2, height: 100, marginRight : 15, backgroundColor: item.hours < 9 ? '#ffc107' : '#28a745' }}></View>
                                    <View style={{ flex : 3, justifyContent: 'center', }}>
                                        <Text style={styles.itemDay}>{ item.day }</Text>
                                        <Text style={styles.itemDayLabel}>{ item.dayLabel }</Text>
                                    </View>
                                    <View style={{ flex : 6, justifyContent: 'center', }}>
                                        <View style={{flex : 1, alignItems: 'stretch',  flexDirection: 'row' }}>
                                            <View style={{ flex : 1, justifyContent: 'center', }}><Text style={styles.label}>TIME IN</Text></View>
                                            <View style={{ flex : 1, justifyContent: 'center', }}><Text style={styles.dateValue}>{ item.login }</Text></View>
                                        </View>
                                        <View style={{flex : 1, alignItems: 'stretch',  flexDirection: 'row',  }}>
                                            <View style={{ flex : 1, justifyContent: 'center', }}><Text style={styles.label}>TIME OUT</Text></View>
                                            <View style={{ flex : 1, justifyContent: 'center', }}><Text style={styles.dateValue}>{ item.logout }</Text></View>
                                        </View>
                                    </View>
                                    <View style={{ flex : 3, justifyContent: 'center', alignSelf: 'center', flexDirection: 'row', }}>
                                        <Text style={[styles.itemDay, { color : item.hours < 9 ? '#ffc107' : '#28a745'}]}>{ item.hours }</Text>                                        
                                    </View>
                                </View>
                                
                                
                            )}
                        />
                    </View>
                    </Fragment>
                     ) } 
                    
                </View>
                
            </SafeAreaView>
        </View>
    )

   
    return content;
}

export default Monthly;

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
        fontSize : 12,
        fontFamily : 'latoRegular',    
    },
    dateValue : {
        color : "#333",
        fontFamily : 'latoBold', 
        fontSize : 16,
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
        
    },
    flatlist : {
        flex : 1, 
        alignItems: 'stretch',  
        flexDirection: 'row',      
        marginBottom : 20,
        justifyContent : 'center', 
        alignSelf : 'center', 
        width : '90%',
        boxShadow: '0px 5px 5px -1px rgba(0,0,0,0.3)',
    },
    itemDay : {
        fontFamily : 'latoBold',
        fontSize : 24,
    },
    itemDayLabel : {
        fontFamily : 'latoLight',
        fontSize : 24,
    }
})

