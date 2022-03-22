import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { data } from '../model/data';
import Card from '../components/Card';
import { WebView } from 'react-native-webview';
import ChatBot from '../chatbot';

const HelpScreen = ({ navigation }) => {

    const { colors } = useTheme();

    // const renderItem = ({item}) => {
    //     return (
    //         <Card 
    //             itemData={item}
    //             onPress={()=> navigation.navigate('CardItemDetails', {itemData: item})}
    //         />
    //     );
    // };

    // return (
    //   <View style={styles.container}>
    //     <FlatList 
    //         data={data}
    //         renderItem={renderItem}
    //         keyExtractor={item => item.id}
    //     />
    //   </View>
    // );
    return (
        // <WebView source={{ uri: 'https://sandbox.payhere.lk/pay/o42f568f7' }} />
        <SafeAreaView>
            <ChatBot />
        </SafeAreaView>

    );
};

export default HelpScreen;

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
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
});
