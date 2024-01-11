import React, { Component } from "react";
import HomeScreen from "./HomeScreen";
import CaptureSignature from "./CaptureSignature";
import CaptureQRCode from "./CaptureQRCode";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Setting from "./Setting";
import CreateVietQR from "./CreateVietQR";
class Stack extends Component {
    render() {
        return (
            <AppContainer />
        )
    }
}

const myStack = createStackNavigator({
  
    HomeScreen: {
        screen: HomeScreen,
        navigationOptions: {
            headerShown: false,
        }
    },
    CaptureSignature: {
        screen: CaptureSignature,
        navigationOptions: {
            headerShown: false,
        }
    },
    CaptureQRCode: {
        screen: CaptureQRCode,
        navigationOptions: {
            headerShown: false,
        }
    },
   CreateVietQR: {
        screen: CreateVietQR,
        navigationOptions: {
            headerShown: false,
        }
    },
    Setting: {
        screen: Setting,
        navigationOptions: {
            headerShown: false,
        }
    },
  
}, { initialRouterName: 'HomeScreen' });
const AppContainer = createAppContainer(myStack);

export default Stack;