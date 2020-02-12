import React, { useState, useEffect  } from 'react';
// import { createAppContainer } from 'react-navigation'
// import { createDrawerNavigator } from 'react-navigation-drawer'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
 import { StyleSheet, AsyncStorage, View, Text, TextInput, TouchableOpacity} from 'react-native'
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { NavigationContainer } from '@react-navigation/native';



import {
  TodayScreen,
  PayPeriodScreen,
  MonthlyScreen,
} from './screens'



const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Today"
      activeColor="#fff"
      inactiveColor="#333"
      barStyle={{ backgroundColor: '#f45611' }}
    >
      <Tab.Screen 
        name="Today" 
        component={TodayScreen} 
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      
      />
      <Tab.Screen 
        name="Pay Period" 
        component={PayPeriodScreen}
        options={{
          tabBarLabel: 'Pay Period',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen 
        name="Monthly" 
        component={MonthlyScreen}
        options={{
          tabBarLabel: 'Monthly',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [userId, setUserId] = useState('');
  const [storedId, setStoredId] = useState('');


  async function onContinue() {
    const id = await userId;
    console.log(id)
    try {
      await AsyncStorage.setItem('userId', id);
    } catch (error) {
      console.log(error)
    }

    retrieveData();
  }

  async function retrieveData() {
   
    try {
      const id = await AsyncStorage.getItem('userId');
      setStoredId(id);
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(() => {
     console.log(storedId);
  }, [storedId]);


  let navigationContent = (
    <NavigationContainer style={styles.root}>
      <MyTabs />
    </NavigationContainer>
  );

  let loginContent = (
    

    <View style={{flex : 1, flexDirection: 'column', justifyContent: 'center', padding: 40}}>
        <Text style={{ marginBottom : 10, fontSize : 18}}>EMPLOYEE ID</Text>
        <TextInput
          onChangeText={value => setUserId(value)}
          style={{ height: 40, borderColor: '#ccc', borderWidth: 1, maxWidth: 400 , padding : 10}}         
          
        />

        <TouchableOpacity
                onPress={() => onContinue()}
                style={{ backgroundColor: '#f45611', marginTop: 10, maxWidth: 400  }}>
                <Text style={{ height: 40, color: '#fff',  maxWidth: 400 , padding : 10 }}>Continue</Text>
              </TouchableOpacity>
    </View>
  );

  return storedId ? navigationContent : loginContent;

}


const styles = StyleSheet.create({
  root : {
      maxWidth : 600
  },
  
})
