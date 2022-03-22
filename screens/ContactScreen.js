// Make Phone Call, Send SMS or Email Using React Native Communication
// https://aboutreact.com/make-phone-call-send-sms-or-email-using-react-native-communication/

// import React in our code
import React from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';

import Communications from 'react-native-communications';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';

import * as dataValidation from "../util/dataValidation";
import { endpoints, requestMethods } from '../util/serverEndpoints';
import { awaitable } from '../util/util';
import * as userSession from '../util/userSession';

const ContactScreen = ({ navigation, route }) => {

    const theme = useTheme();

    const { email } = route.params || {};

    const { colors } = useTheme();

    const [isValidPhone, setPhoneValidity] = React.useState(false);
    const [isPhoneShown, setIsPhoneShown] = React.useState(false);

    const [phone, setphone] = React.useState('');
    const [message, setMessage] = React.useState('');

    const [isSubmitEnabled, setSubmitEnabled] = React.useState(false);

    const onSubmitClick = async () => {

      if (!isValidPhone) {
        // Phone is invalid. Prompt user a message telling the email is invalid.
        console.log("Invalid Phone number");
        Alert.alert(
          'Warning!',
          'Please enter valid phone number!');
        return;
      }

      if (!message) {
        // Phone is invalid. Prompt user a message telling the email is invalid.
        console.log("Message field emty");
        Alert.alert(
          'Warning!',
          'Message cannot be empty!');
        return;
      }

      const token = userSession.getAccessToken();

    const requestData = {
      phone: phone.trim(),
      message: message.toLowerCase().trim()
    }

    const fetchOptions = {
      method: requestMethods.MAKE_INQUIRY,
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`
      }
    }
    setSubmitEnabled(true);

    // Sending request.
    const [response, err] = await awaitable(fetch(endpoints.MAKE_INQUIRY, fetchOptions));

    setSubmitEnabled(false);

    if (err) {
      // Failed to complete the request. Possibly due to a network error.
      console.log("Network error!!!");
      return;
    }

    const response_json = await response.json();

    //401
    if (response.status === 401) {
      Alert.alert( 
        'Session Timeout!',
        'Something went wrong. Please try again in few minutes or Sign in again to continue');
      console.log(response_json);
      console.log(token);
      return;
    }

    if (response.status === 201) {
      Alert.alert(
        'Success!',
        'Your message sent successfully. Our agent will contact you soon.');
      console.log(response_json);
      console.log(token);
      navigation.navigate('Home')
    }
    }

    React.useEffect(() => {
      if (dataValidation.isValidPhone(phone)) setPhoneValidity(true);
      else setPhoneValidity(false);
    }, [phone]);

    const ValidFormFieldIcon = (
      <Animatable.View animation="bounceIn">
        <Feather
          name="check-circle"
          color="green"
          size={25}
        />
      </Animatable.View>);

const InvalidPhoneWarning = (
  <Animatable.View animation="fadeInLeft" duration={500}>
      <Text style={styles.errorMsg}>e.g: xxx-xxx-xxxx</Text>
  </Animatable.View>
);

  return (
    <ScrollView style={styles.container}>
        <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <View style={styles.sliderContainer}>
          <View style={styles.slide}>
            <Image
              source={require('../assets/banners/shed4.jpg')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.titleText}>
          SMARTREFUEL CALL CENTER
        </Text>

        <View style={styles.buttonContainer}>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={
            () => Communications.phonecall('0726618185',true)
          }>
          <View style={{flexDirection: 'row'}}>
          <Icon name="phone-in-talk" color="#FF6347" size={30} />
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FF6347',}}> Call</Text>
          </View>
          <Text style={styles.buttonTextStyle}>
            +94 72 661 8185
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={() =>
            Communications.email(
              [
                'smartapp9731@gmail.com',
              ],
              null,
              null,
              'SmartRefuel',
              'What do you want to say',
            )
          }>
          <View style={{flexDirection: 'row'}}>
          <Icon name="email-outline" color="#FF6347" size={30} />
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FF6347',}}> Email</Text>
          </View>
          <Text style={styles.buttonTextStyle}>
            smartapp9731@gmail.com
          </Text>
        </TouchableOpacity>
        </View>

        <Text style={{fontSize: 20 , marginTop: 5}}>Or</Text>

        <View>

        <Text style={[styles.text_footer, {
        marginTop: 15
      }]}>Phone</Text>
      <View style={styles.action}>
        <Icon name="cellphone-android" color="#0000A0" size={30} />
        <TextInput
          placeholder="Phone"
          placeholderTextColor="#C0C0C0"
          keyboardType="number-pad"
          autoCorrect={false}
          onChangeText={setphone}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
        />
        {isValidPhone && ValidFormFieldIcon}
        <TouchableOpacity onPress={() => setIsPhoneShown(!isPhoneShown)}>

        </TouchableOpacity>
      </View>
      {!isValidPhone && phone.length > 0 && InvalidPhoneWarning}

      <Text style={[styles.text_footer, {
        marginTop: 10
      }]}>Message</Text>
      <View style={styles.action}>
        <Icon name="tooltip-text-outline" color="#0000A0" size={30} />
        <TextInput
          placeholder="message"
          placeholderTextColor="#C0C0C0"
          autoCorrect={false}
          onChangeText={setMessage}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
        />
      </View>

      <TouchableOpacity style={styles.commandButton}
        onPress={onSubmitClick}
        disabled={isSubmitEnabled}
        >
        <Text style={styles.panelButtonTitle}>Submit</Text>
      </TouchableOpacity>

        
        </View>

      </View>
    </ScrollView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 20,
    marginTop: 10,
    // textAlign: 'center',
    fontWeight: 'bold'
  },
  buttonStyle: {
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6347',
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  buttonTextStyle: {
    color: 'black',
    textAlign: 'center',
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
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 15
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
    fontSize: 15,
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
});