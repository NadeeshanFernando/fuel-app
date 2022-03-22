import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ActivateAccountScreen from './ActivateAccountScreen';
import SuccessScreen from './SuccessScreen';
import RequestResetScreen from './RequestResetScreen';
import VerifyOTPScreen from './VerifyOTPScreen';ResetPasswordScreen
import ResetPasswordScreen from './ResetPasswordScreen';SuccessResetScreen
import SuccessResetScreen from './SuccessResetScreen';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        <RootStack.Screen name="ActivateAccountScreen" component={ActivateAccountScreen}/>
        <RootStack.Screen name="SuccessScreen" component={SuccessScreen}/>
        <RootStack.Screen name="RequestResetScreen" component={RequestResetScreen}/>
        <RootStack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen}/>
        <RootStack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/>
        <RootStack.Screen name="SuccessResetScreen" component={SuccessResetScreen}/>
    </RootStack.Navigator>
);

export default RootStackScreen;