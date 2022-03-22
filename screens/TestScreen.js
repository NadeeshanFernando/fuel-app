import React, { useEffect, useRef } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  FlatList
} from 'react-native';

import * as dataValidation from "../util/dataValidation";
import { endpoints, requestMethods } from '../util/serverEndpoints';
import { awaitable } from '../util/util';
import * as userSession from '../util/userSession';
import { onChange, Value } from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const TestScreen = ({ navigation, route }) => {
  const [city, setcity] = React.useState('');
  const { email } = route.params || {};

  // const ref = useRef();

  // useEffect(() => {
  //   ref.current?.getAddressText(setcity);
  // }, []);

const onRequestTagClick = async () => {

  console.log("city:" + city)

  const token = userSession.getAccessToken();

  const requestData = {
    vehicle_no: "vehicleNo1",
    engine_no: "engineNo1",
    fuel_type: "fuelType1",
    phone: "phone1",
    address: city
  }

  const fetchOptions = {
    method: requestMethods.REQUEST_TAG,
    body: JSON.stringify(requestData),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`
    }
  }

  // Sending request.
  const [response, err] = await awaitable(fetch(endpoints.REQUEST_TAG, fetchOptions));

  if (err) {
    // Failed to complete the request. Possibly due to a network error.
    console.log("Network error!!!");
    return;
  }

  const response_json = await response.json();

  //400
  if (response.status === 400) {
    Alert.alert( 
      'Warning!',
      'Fail');
    console.log(response_json);
    // console.log(token);
    return;
  }

  //401
  if (response.status === 401) {
    Alert.alert( 
      'Session Timeout!',
      'Something went wrong. Please try again in few minutes or Sign in again to continue');
    console.log(response_json);
    // console.log(token);
    return;
  }

  if (response.status === 201) {
    Alert.alert(
      'Success!',
      'Success');
    console.log(response_json);
    // console.log(token);
  }
}
  
  return (
    <SafeAreaView style={styles.container}>

      <Text style={[styles.text_footer, {
        marginTop: 10
      }]}>Location</Text>
      <View style={styles.action}>
      <FontAwesome name="globe" color="#0C58FA" size={27} />
    <GooglePlacesAutocomplete
      // ref={ref}
      placeholder='Search'
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        // console.log(data, details); 
        setcity(data.description)
        console.log("GooglePlacesAutocomplete:" ,data.description)       
      }}
      query={{
        key: 'AIzaSyBvMpfZgNHmFZib32x4HHLpKWstfhKhUAs',
        language: 'en',
      }}
      // currentLocation={true}
      // currentLocationLabel='Current location'
    /> 
    </View>

      <TouchableOpacity style={styles.commandButton}
        onPress={onRequestTagClick}
        >
        <Text style={styles.panelButtonTitle}>Submit</Text>
      </TouchableOpacity>

      </SafeAreaView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,

  },
  action: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 15
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderContainer: {
    height: 200,
    width: '100%',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 100,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
    fontSize: 15,
},
});