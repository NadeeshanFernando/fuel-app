import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    StyleSheet,
    SafeAreaView,
    Alert,
    StatusBar,
    Image,
    ScrollView
} from 'react-native';
import { useTheme } from 'react-native-paper';
import PayHere from '@payhere/payhere-mobilesdk-reactnative';
import * as userSession from "../util/userSession";


const PaymentScreen = ({ navigation, route }) => {

    const { colors } = useTheme();

    const theme = useTheme();

    const username = userSession.getUsername();
    const email = userSession.getEmail();

    const [pID, setpID] = React.useState('');

    const { items } = route.params || {};
    const { amount } = route.params || {};
    const { phone } = route.params || {};
    const { address } = route.params || {};
    const { engineNo } = route.params || {};

    const paymentObject = {
        "sandbox": true,                 // true if using Sandbox Merchant ID
        "merchant_id": "1216017",        // Replace your Merchant ID
        "merchant_secret": "8X3d32YwiTj4p6nzGEnGnk4UrP14i7CkP4ZFBgcbJOXE",        // See step 4e
        "notify_url": "http://sample.com/notify",
        "order_id": pID,
        "items": items,
        "amount": amount,               // Recurring amount
        "recurrence": "",         // Recurring payment frequency
        "duration": "",            // Recurring payment duration
        "startup_fee": "10.00",          // Extra amount for first payment
        "currency": "LKR",
        "first_name": username,
        "last_name": "",
        "email": email,
        "phone": phone,
        "address": address,
        "city": "",
        "country": "",
        "delivery_address": "",
        "delivery_city": "",
        "delivery_country": "",
        "custom_1": "",
        "custom_2": ""
    };

    const onRequestTagClick = async () => {

    PayHere.startPayment(
        paymentObject, 
        (paymentId) => {
            console.log("Payment Completed", paymentId);
            setpID(paymentId)
            Alert.alert(
                'Success!',
                'Thanks for your purchase for' +'\n'+ 'Vehicle: ' + items + ", Engine: " + engineNo);
            navigation.navigate('Home')
        },
        (errorData) => {
            Alert.alert("PayHere Error", errorData);
        },
        () => {
            console.log("Payment Dismissed");
        }
    );

    }

    return (
        
        <ScrollView style={styles.container}>

            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <View style={styles.sliderContainer}>
          <View style={styles.slide}>
            <Image
              source={require('../assets/banners/shed1.jpg')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
      </View>

            <TouchableOpacity style={styles.commandButton}
                onPress={onRequestTagClick}>
                <Text style={{fontSize: 17, fontWeight: 'bold', color: '#FFFFFF'}}>Proceed to pay</Text>
            </TouchableOpacity>
            
        </ScrollView>
    );
    // return (
    //     <SafeAreaView style={styles.container}>

    //         <WebView source={{ uri: 'https://sandbox.payhere.lk/pay/o42f568f7' }} />

    //     </SafeAreaView>




    // );
};

export default PaymentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        alignSelf: 'center'
    },
    action: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    textstyle: {
        fontSize: 20
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#52D017',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '50%',
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
      }
});
