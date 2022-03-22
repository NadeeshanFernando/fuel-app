import React, { useState, useEffect } from 'react';

//import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  RefreshControl,
  TouchableHighlight,
  Animated,
  Alert,
  TextInput
} from 'react-native';

import { format } from "date-fns";

import { endpoints, requestMethods } from '../util/serverEndpoints';
import { awaitable } from '../util/util';
import * as userSession from '../util/userSession';

const NotificationScreen = () => {
  const [refreshing, setRefreshing] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  const [search, setSearch] = useState('');
  const [masterDataSource, setMasterDataSource] = useState([]);

  const token = userSession.getAccessToken();
  const username = userSession.getUsername();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    //Service to get the data from the server to render
    fetch(endpoints.REFUEL_HISTORY,{
      method: requestMethods.REFUEL_HISTORY,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
    }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setRefreshing(false);
        setDataSource(responseJson);
        setMasterDataSource(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update DataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.vehicle_no ? item.vehicle_no.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataSource(newData);
      setSearch(text);
    }
    else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const EmptyListMessage = ({ item }) => {
    return (
      // Flat List Item
      <Text style={styles.emptyListStyle} onPress={() => getItem(item)}>
        --No Data Found--
      </Text>
    );
  };

  const ItemView = ({ item }) => {
    const date = new Date(item.request_date);
    const formattedDate = format(date, "MMMM do, yyyy h:mma");
    return (
      // Flat List Item
      <Animated.View style={styles.rowFront}>
      <TouchableHighlight
          style={styles.rowFrontVisible}
          onPress={() => console.log('Element touched')}
          underlayColor={'#aaa'}>
      <View>
        <Text style={styles.title} onPress={() => getItem(item)}>
          {'Vehicle number: ' + item.vehicle_no}
        </Text>
        <Text style={styles.details} onPress={() => getItem(item)}>
          {'Amount: Rs.' + item.amount + ',  Date: ' + formattedDate}
        </Text>
      </View>
      </TouchableHighlight>
      </Animated.View>
      
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const getItem = (item) => {
    const date = new Date(item.request_date);
    const formattedDate = format(date, "MMMM do, yyyy h:mma");
    //Function for click on an item
    // alert('Id : ' + item.id + ' Title : ' + item.vehicle_no);
      Alert.alert(
      'Hi ' + username + '!',
      'You refueled Rs.' + item.amount + ", For the Vehicle number " + item.vehicle_no + ' On ' + formattedDate);
  };

  const onRefresh = () => {
    //Clear old data of the list
    setDataSource([]);
    //Call the Service to get the latest data
    getData();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {refreshing ? <ActivityIndicator /> : null}
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Here By Vehicle"
        />
        <FlatList
          data={dataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          enableEmptySections={true}
          renderItem={ItemView}
          ListEmptyComponent={EmptyListMessage}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    marginTop: 10,
  },
  itemStyle: {
    fontSize: 15,
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  details: {
    fontSize: 13,
    color: '#999',
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  emptyListStyle: {
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  textInputStyle: {
    height: 50,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#1f65ff',
    backgroundColor: '#FFFFFF',
  },
});

export default NotificationScreen;