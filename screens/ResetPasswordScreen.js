import React from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import * as serverEndpoints from "../util/serverEndpoints";
import * as dataValidation from "../util/dataValidation";
import { awaitable } from '../util/util';

const ResetPasswordScreen = ({ navigation, route }) => {

    const { email } = route.params || {};

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = React.useState(false);
    const [isResetDisabled, setResetDisabled] = React.useState(false);

    const [password, setPassword] = React.useState('');
    const [confirmedPassword, setConfirmedPassword] = React.useState('');

    const onResetClick = async () => {
        

        if (!dataValidation.isValidPassword(password)) {
            // Password is invalid. Prompt user a message.
            console.log("Invalid password");
            return;
        }

        if (password !== confirmedPassword) {
            // Passwords mismatched. Prompt user a message.
            console.log("password mismatch");
            return;
        }

        const { endpoints, requestMethods } = serverEndpoints;

        const resetRequestData = {
            email: email,
            password1: password,
            password2: confirmedPassword
        }


        const fetchOptions = {
            method: requestMethods.RESET_PASSWORD,
            body: JSON.stringify(resetRequestData),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Disabling signup button so that user can't send several requests.
        setResetDisabled(true);

        // Sending the request to the server.
        const [response, err] = await awaitable(fetch(endpoints.RESET_PASSWORD, fetchOptions));

        // Now that request has been completed, enabling signup button again.
        setResetDisabled(false);

        if (err) {
            // Failed to complete the request. Possibly due to a network error.
            // Return from the function after handling the error. 
            console.log("Network error!!!");
            return;
        }

        // response_json contains body of server's response.
        const response_json = await response.json();

        if (!response.ok) {
            // Server responded with error status code.
            // Handle it here.
            console.log(response_json);
            return;
        }

        navigation.navigate('SuccessResetScreen');
    }


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#FFA500' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Choose a new password!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>

                    <Text style={[styles.text_footer, {
                        marginTop: 5
                    }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20} />
                        <TextInput
                            placeholder="Your Password"
                            secureTextEntry={!showPassword}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setPassword(val)}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather
                                name={!showPassword ? "eye-off" : "eye"}
                                color="grey"
                                size={20} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 5
                    }]}>Confirm Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20} />
                        <TextInput
                            placeholder="Confirm Your Password"
                            secureTextEntry={!showConfirmedPassword}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setConfirmedPassword(val)}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmedPassword(!showConfirmedPassword)}>
                            <Feather
                                name={!showConfirmedPassword ? "eye-off" : "eye"}
                                color="grey"
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                            Create a new password that is
                </Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}at least 6 characters long.</Text>

                    </View>



                    <View style={styles.button}>

                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={onResetClick}
                            disabled={isResetDisabled}>
                            <LinearGradient
                                colors={['#FFA07A', '#FF6347']}
                                style={styles.signIn}>
                                <Text style={[styles.textSign, { color: '#fff' }]}>Reset</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => navigation.navigate('SuccessResetScreen')}
                >
                <LinearGradient
                    colors={['#FFA07A', '#FF6347']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Reset</Text>
                </LinearGradient>
                </TouchableOpacity> */}

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
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFA500'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 20,
        marginTop: 150
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
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
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 20
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
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
});
