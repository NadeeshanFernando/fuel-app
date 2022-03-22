import React from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class AuthLoading extends React.Component{

    constructor(){
        super();
        this.checkToken();
    }

checkToken = async () => {
    const access = await AsyncStorage.getItem("access");
    // const refresh = await AsyncStorage.getItem("refresh");
    if(access){
        this.props.navigation.navigate("App");
    }
    else{
        this.props.navigation.navigate("Auth");
    }
}

    render(){
        return(
            <View style={styles.container}>

                <ActivityIndicator>
                    
                </ActivityIndicator>

            </View>

        );
    };
}

export default AuthLoading;

const styles = StyleSheet.create({
    container: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    }
})