import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, SafeAreaView, Dimensions, Image, ScrollView } from 'react-native';
import { Component } from 'react';
import Svg, { Path } from "react-native-svg";
import * as Font from 'expo-font';
import * as MailComposer from 'expo-mail-composer';

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assetsLoaded: false,
    }
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Inter-Black': require('./assets/fonts/Inter-Black.ttf')
    });
    this.setState({ assetsLoaded: true });
    let isMail = await MailComposer.isAvailableAsync()
    if (isMail === false) {
      Alert.alert("Thông báo", "Để sử dụng chương trình cần phải cài đặt email mặc định trên thiết bị")
    }
  }
  func_redirect_capturesignature = () => {
    this.props.navigation.navigate('CaptureSignature');
  }

  func_redirect_captureqrcode = () => {
    this.props.navigation.navigate('CaptureQRCode');
  }
  func_redirect_setting = () => {
    this.props.navigation.navigate('Setting');
  }
  func_redirect_vietqr=()=> {
    this.props.navigation.navigate('CreateVietQR');
  }


  render() {
    const { assetsLoaded } = this.state;
    if (!assetsLoaded) return null;

    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Camera đã không được cho phép, vui lòng vào phần cài đặt để thay đổi quyền truy cập camera</Text>;
    } else {

      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
           <StatusBar style="auto" />
            <View style={styles.viewoutbutton}>
              <View style={styles.header}>
                <Image
                  source={require('./assets/scanner.png')}
                  style={styles.ImageIconStyle}
                />
                <Text style={styles.textheader}>
                  SCANNERSAQ
                </Text>
              </View>

            </View>
          <ScrollView style={styles.container}>
           
            <View style={styles.viewoutbutton}>
              <TouchableOpacity style={styles.button} onPress={this.func_redirect_capturesignature}>
                <View style={styles.viewinbutton}>
                  <Svg
                    width={40}
                    height={40}
                    viewBox="0 0 20 20"
                  >
                    <Path fill-rule="evenodd" d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" fill="#fff" />



                  </Svg>
                  <Text style={styles.buttontext}>
                    Chụp chữ ký, CCCD
                  </Text>
                </View>

              </TouchableOpacity>
            </View>
            <View style={styles.viewoutbutton}>
              <TouchableOpacity style={styles.button} onPress={this.func_redirect_captureqrcode}>
                <View style={styles.viewinbutton}>
                  <Svg
                    width={40}
                    height={40}
                    viewBox="0 0 20 20"
                  >
                    <Path fill-rule="evenodd" d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z" fill="#fff" />
                    <Path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z" fill="#fff" />
                    <Path fill-rule="evenodd" d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z" fill="#fff" />
                    <Path fill-rule="evenodd" d="M9 2h5v5H9V2Zm1 1v3h3V3h-3ZM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8Zm2 2H9V9h1v1Zm4 2h-1v1h-2v1h3v-2Zm-4 2v-1H8v1h2Z" fill="#fff" />
                    <Path fill-rule="evenodd" d="M12 9h2V8h-2v1Z" fill="#fff" />



                  </Svg>
                  <Text style={styles.buttontext}>
                    Quét QRCode
                  </Text>
                </View>

              </TouchableOpacity>
            </View>

            <View style={styles.viewoutbutton}>
              <TouchableOpacity style={styles.button} onPress={this.func_redirect_vietqr}>
                <View style={styles.viewinbutton}>
                  <Image
                     style={{width:35,height:35,marginRight:5,}}
                     source={require('./assets/logovietQR.png')}
                  >
                    



                  </Image>
                  <Text style={styles.buttontext}>
                    Tạo VietQR
                  </Text>
                </View>

              </TouchableOpacity>
            </View>

            <View style={styles.viewoutbutton}>
              <TouchableOpacity style={styles.button} onPress={this.func_redirect_setting}>
                <View style={styles.viewinbutton}>
                  <Svg
                    width={40}
                    height={40}
                    viewBox="0 0 20 20"
                  >
                    <Path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" fill='#fff' />
                    <Path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" fill='#fff' />



                  </Svg>
                  <Text style={styles.buttontext}>
                    Cài đặt
                  </Text>
                </View>

              </TouchableOpacity>
            </View>

            
          </ScrollView>
          <View style={styles.viewoutbutton}>
              <View style={styles.footer}>
                <Text>
                  Phiên bản 1.3.1
                </Text>
                <Text>
                  Dinhviet34@gmail.com
                </Text>
              </View>
            </View>
        </SafeAreaView>
      )


    }
  }
}

const styles = StyleSheet.create({
  container: {
   
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
    marginTop: "13%",
    fontFamily: 'Inter-Black',
    marginRight: 10,
    marginLeft: 10,

  },
  ImageIconStyle: {
    height: 50,
    width: 50,
  },
  header: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',

  },
  textheader: {
    fontSize: 40,
    fontWeight: 'bold',
    color:'#005790',
  },
  footer: {
    width: '100%',

    //flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick

  },
  viewoutbutton: {
    flex: 1,
    width: '100%',
    marginTop: 10,

  },
  viewinbutton: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 10,
    backgroundColor: '#005790',
    textTransform: 'lowercase', // Notice this updates the default style
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 10,

  },
  buttontext: {
    fontSize: 30,
    color: '#fff'
  },
  buttontext2: {
    fontSize: 13,
  },

});

export default HomeScreen;