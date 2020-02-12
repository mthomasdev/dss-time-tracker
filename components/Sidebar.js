import React from 'react'
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native'
import { DrawerNavigatorItems } from 'react-navigation-drawer'
import { Ionicons } from '@expo/vector-icons'

const Sidebar = props => (
    <ScrollView>
        <ImageBackground 
            source={require("../assets/background.jpg")} 
            style={{ width: undefined, padding:16, paddingTop: 48 }}
        >
            <Image source={require("../assets/profile-pic.png")} style={styles.profile} />
            <Text style={styles.username}>Username</Text>
        </ImageBackground>
         
         <View style={styles.container}>
            <DrawerNavigatorItems { ...props } />
         </View>
    </ScrollView>
);

export default Sidebar

const styles = StyleSheet.create({
    container : {
        flex : 1,

    },
    profile : {
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:3,
        borderColor:"#fff",
    },
    username: {
        fontSize : 16,
        color: "#fff",
        fontWeight: "500",
    }
})