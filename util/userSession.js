import { awaitable } from "./util";
import { requestMethods, endpoints } from './serverEndpoints';

import AsyncStorage from '@react-native-community/async-storage';

const userSession = {
    name: "",
    email: "",
    accessToken: ""
};

const subscribers = [];

let isActive = false;

export const sessionTypes = {
    UPDATE : "SESSION_UPDATED",
    INITIALIZE : "SESSION_INITIALIZED",
    DESTROY : "SESSION_DESTROYED"
}

function callSubscribers(type){
    subscribers.forEach(subscriber => {
        subscriber(type);
    });
} 

async function storeSessionToken() {
    try {
        await AsyncStorage.setItem('accessToken', userSession.accessToken);
    } catch (err) {
        console.log("Error occurred while storing user session ");
    }
}

export async function loadSessionToken() {
    const [token, err] = await awaitable(AsyncStorage.getItem('accessToken'));
    if (err) throw new Error(err.toString());
    return token;
}

async function deleteSessionToken() {
    try {
        await AsyncStorage.removeItem('accessToken');
    } catch (err) {
        console.log("Error occurred while deleting user session ");
    }
}

async function getUserData() {
    if (!userSession.accessToken) throw new Error("Couldn't find a token");

    const getUserInfoOptions = {
        method : requestMethods.GET_USER_INFO,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : `JWT ${userSession.accessToken}`
        }
    }

    const [response, err] = await awaitable(fetch(endpoints.GET_USER_INFO, getUserInfoOptions));

    if (err) throw new Error("Network error");
    if (!response.ok) throw new Error("Server rejected the request");

    const responseBody = await response.json();

    return {
        name : responseBody.name,
        email : responseBody.email
    }
}

export async function initialize(token) {
    if (isSessionActive()) throw new Error("Session already initialized");

    if (typeof token != "string") throw new Error("Access token should be a string.");
    if (!(token.length > 0)) throw new Error("Access token can't be empty.");

    userSession.accessToken = token;

    const [userInfo, err] = await awaitable(getUserData());
    if (err) return false;

    userSession.name = userInfo.name || '';
    userSession.email = userInfo.email || '';

    await storeSessionToken();
    isActive = true;
    callSubscribers(sessionTypes.INITIALIZE);
    return true;
}

export async function updateSession() {
    if (!isSessionActive()) throw new Error("Tried to update an inactive user session.");

    const [userInfo, err] = await awaitable(getUserData());

    if (err) return false;

    userSession.name = userInfo.name || '';
    userSession.email = userInfo.email || '';

    callSubscribers(sessionTypes.UPDATE);
    return true;
}

export async function destroySession() {
    userSession.accessToken = '';
    userSession.name = '';
    userSession.email = '';

    await deleteSessionToken();

    isActive = false;

    callSubscribers(sessionTypes.DESTROY);
}

export function isSessionActive() {
    return isActive;
}

export function getUserSession() {
    if (!isSessionActive()) throw new Error("Tried to access property of an inactive user session.");
    return userSession;
}

export function getEmail() {
    if (!isSessionActive()) throw new Error("Tried to access property of an inactive user session.");
    return userSession.email;
}

export function getUsername() {
    if (!isSessionActive()) throw new Error("Tried to access property of an inactive user session.");
    return userSession.name;
}

export function getAccessToken() {
    if (!isSessionActive()) throw new Error("Tried to access property of an inactive user session.");
    return userSession.accessToken;
}

export function subscribe(callback) {
    subscribers.push(callback);
}