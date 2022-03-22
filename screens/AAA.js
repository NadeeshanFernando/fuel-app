import React, { Component, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import { endpoints, requestMethods } from '../util/serverEndpoints';
import { awaitable } from '../util/util';
import * as userSession from '../util/userSession';

export default class AAA extends React.Component{

    // const [userValues, setUserValues] = useState([]);

    // const token = userSession.getAccessToken();

    // useEffect(() => {
    //     getRFIDData();
    // }, [])

    // const getRFIDData = async () => {
    //     const fetchOptions = {
    //         method: requestMethods.RFID_DETAILS,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `JWT ${token}`
    //         }
    //     }

    //     const [response, err] = await awaitable(fetch(endpoints.RFID_DETAILS, fetchOptions));
    //     const responseBody = await response.json();
    //     console.log(responseBody);
    //     setUserValues(responseBody);
    // } 

    // const userData = userValues.map((rfid, id) => {
    //     console.log('RFIDValue: ' + rfid.vehicle_no);
    //     return  (
    //         <Picker.Item 
    //             label={rfid.vehicle_no} 
    //             value={rfid.vehicle_no} 
    //             key={id} />
    //     );
    // })

    render(){

        return (
            {
                id: 4,
                title: 'Your bengali thali order placed successfully',
                details: 'Your bengali thali order to Delicious Bong Recipe has been accepted and being processed.'
            }
        );
    }

    
}
