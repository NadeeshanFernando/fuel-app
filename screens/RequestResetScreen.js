import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';

import { AuthContext } from '../components/context';

import Users from '../model/users';

import * as dataValidation from "../util/dataValidation";
import { endpoints, requestMethods } from "../util/serverEndpoints";
import { awaitable } from '../util/util';

const RequestResetScreen = ({ navigation }) => {
    const [email, setEmail] = React.useState('');
    const [isValidEmail, setEmailValidity] = React.useState(false);

    const { colors } = useTheme();

    const onSearchBtnClick = async () => {

        if(!email.trim()) {
            Alert.alert(
                'Warning!',
                'Please enter your email!');
            return;
        }

        if (!dataValidation.isValidEmail(email)) {
            Alert.alert(
                'Warning!',
                'Please Enter Valid Email!');
            return;
        }

        const requestOptions = {
            method: requestMethods.OTP_REQUEST,
            body: JSON.stringify({ email: email }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        // Sending OTP request
        const [response, err] = await awaitable(fetch(endpoints.OTP_REQUEST, requestOptions));

        if (err) {
            // Request failed. Possibly a Network error
            console.log("Network error");
            return;
        }

        navigation.navigate('VerifyOTPScreen', { email: email });
    }

    const ValidFormFieldIcon = (
        <Animatable.View animation="bounceIn">
            <Feather
                name="check-circle"
                color="green"
                size={20} />
        </Animatable.View>
    );

    const InvalidEmailWarning = (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Invalid email!</Text>
        </Animatable.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#FFA500' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Find your account!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}>
                <Text style={[styles.text_footer, {
                    color: colors.text
                }]}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="envelope"
                        color="#FF0000"
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Email"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        onEndEditing={e => {
                            const emailValidity = dataValidation.isValidEmail(email);
                            setEmailValidity(emailValidity);
                            // handleValidUser(e.nativeEvent.text)
                        }}
                    />

                    {isValidEmail && ValidFormFieldIcon}

                </View>

                {!isValidEmail && InvalidEmailWarning}

                <View style={styles.textPrivate}>
                    <Text style={styles.color_textPrivate}>
                        Please enter your
                </Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}email address</Text>
                    <Text style={styles.color_textPrivate}>{" "}to</Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}search</Text>
                    <Text style={styles.color_textPrivate}>{" "}for</Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}your account.</Text>
                </View>

                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        // onPress={() => {loginHandle( data.username, data.password )}}
                        onPress={onSearchBtnClick}
                    >
                        <LinearGradient
                            colors={['#FFA07A', '#FF6347']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Search</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignInScreen')}
                        style={[styles.signIn, {
                            borderColor: '#FF6347',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: '#FF6347'
                        }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default RequestResetScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFA500'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50,
        marginTop: 120
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        fontSize: 15,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 30
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 25
    }
});
