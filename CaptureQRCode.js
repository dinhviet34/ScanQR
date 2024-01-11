import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { Component } from 'react';
import Constants from 'expo-constants';
import { AutoFocus, Camera, CameraType } from 'expo-camera';
import Svg, { Path } from "react-native-svg";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { DataTable } from 'react-native-paper';
import * as Font from 'expo-font';
import * as MailComposer from 'expo-mail-composer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';

class CaptureQRCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasCameraPermission: null,
      scanned: true,
      renderresult: false,
      listqrcode: [],
      sendto: '',
      imageuri: '',
    }
  }
  async componentDidMount() {

    this.getPermissionsAsync();
    this.func_get_data();
  }
  func_get_data = async () => {
    const value = await AsyncStorage.getItem('@storage_scan_sendto')

    if (value !== null) {

      this.setState({ sendto: value });

    }

  }
  func_get_picture = async () => {
    try {
      const { status } = await RNImagePicker.requestMediaLibraryPermissionsAsync()
      if (status === 'granted') {
        const result = RNImagePicker.launchImageLibraryAsync({
          options: {
            allowsMultipleSelection: false
          }
        })
        if (result && (await result).assets[0].uri) {
          const results = await BarCodeScanner.scanFromURLAsync((await result).assets[0].uri)

          let data = results[0].data;
          //let type = result[0].type;
          alert('Kiểu dữ liệu:' + data);
          let listqrodel = this.state.listqrcode;
          listqrodel.push(data);
          this.setState({ listqrcode: listqrodel });
        }

      }
    } catch (error) {
      console.debug(error)
      alert('Không thể đọc được qrcode trên ảnh này');
    }


  }



  getPermissionsAsync = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    alert(`Kiểu ${type} dữ liệu: ${data}`);
    let listqrodel = this.state.listqrcode;
    listqrodel.push(data);
    this.setState({ listqrcode: listqrodel });
  };
  func_render_table = () => {
    if (this.state.listqrcode !== "") {
      let bodytable = [];
      //console.log(this.state.date);
      let result = this.state.listqrcode;
      for (let i = 0; i < result.length; i++) {
        bodytable.push(

          <DataTable.Row key={i}>
            <DataTable.Cell>{result[i]}</DataTable.Cell>

          </DataTable.Row>
        )
      }
      return (
        <View>
          {bodytable}
        </View>

      )



    }
    else {
      return (
        <DataTable.Row>
        </DataTable.Row>
      )
    }
  }
  func_render_sendbutton = () => {
    console.log(this.state.listqrcode)
    if (this.state.listqrcode.length !== 0) {
      return (
        <View>
          <TouchableOpacity style={styles.button2} onPress={this.func_send_edmail}>
            <View style={styles.viewinbutton}>
              <Svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
              >
                <Path fill-rule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" fill="#fff" />



              </Svg>
              <Text style={styles.buttontext}>
                Gửi Email
              </Text>
            </View>

          </TouchableOpacity>

        </View>
      )
    }
  }
  func_render_result = () => {
    console.log(this.state.renderresult);
    if (this.state.renderresult === true) {
      return (

        <View style={styles.containerMainontop}>
          <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-end', margin: 10, }}>
            <TouchableOpacity onPress={() => this.func_close_result()}>
              <Svg
                width={40}
                height={40}
                viewBox="0 0 20 20"
              >
                <Path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" fill="#000" />
              </Svg>

            </TouchableOpacity>
          </View>
          {this.func_render_table()}
          {this.func_render_sendbutton()}
        </View>
      )
    }

  }
  func_close_result = () => {
    this.setState({ renderresult: false });
  }
  func_send_edmail = () => {
    let bodyemail = "";
 
    let listqrcode = this.state.listqrcode;
   

    if (Platform.OS === 'ios') {
      const html1 =
      `<html xmlns="http://www.w3.org/1999/xhtml">
      <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin: 0; padding: 0;">
      <table align="center" border="1" cellpadding="0" cellspacing="0">`


    const html3 = `</table ></body ></html > `
   
    let html2 = '';
    listqrcode.forEach(element => {
      let realvalue = '';
      if (element.includes('|')) {

        let tachelement = element.split('|');

        console.log(tachelement[1]);

        if (tachelement.length === 7) {
          realvalue =
            ' Số CCCD:' + tachelement[0] + '</br>' +
            ' Số CMND:' + tachelement[1] + '</br>' +
            ' Họ và tên:' + tachelement[2] + '</br>' +
            ' Giới tính:' + tachelement[4] + '</br>' +
            ' Ngày sinh:' + tachelement[3] + '</br>' +
            ' Nơi thường trú:' + tachelement[5] + '</br>' +
            ' Ngày cấp:' + tachelement[6];
          html2 = html2 + `<tr><td>` + realvalue + `</tr></td>`

        }
        else {
          html2 = html2 + `<tr><td>` + element + `</tr></td>`

        }

      }
      else {
        html2 = html2 + `<tr><td>` + element + `</tr></td>`
      }

    });

      bodyemail = html1 + html2 + html3;
    }
    else {
      let textforandroid = '';

      listqrcode.forEach(element => {
        let realvalue = '';
        if (element.includes('|')) {
  
          let tachelement = element.split('|');
  
          console.log(tachelement[1]);
  
          if (tachelement.length === 7) {
            realvalue =
              ' Số CCCD:' + tachelement[0] + '   ' +
              ' Số CMND:' + tachelement[1] + '   ' +
              ' Họ và tên:' + tachelement[2] + '   ' +
              ' Giới tính:' + tachelement[4] + '   ' +
              ' Ngày sinh:' + tachelement[3] + '   ' +
              ' Nơi thường trú:' + tachelement[5] + '   ' +
              ' Ngày cấp:' + tachelement[6];
            textforandroid = textforandroid + `_________________` + realvalue + `_________________`;
          }
          else {
            textforandroid = textforandroid + `_________________` + element + `_________________`;
  
          }
        }
        else {
          textforandroid = textforandroid + `_________________` + element + `_________________`;

        }
       
        
      });
      console.log(textforandroid);
      bodyemail = textforandroid;
    }

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + " "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();
    console.log(this.state.sendto);

    MailComposer.composeAsync({
      isHtml: true,
      recipients:
        [this.state.sendto],
      subject: 'Dữ liệu QRCode ' + datetime,
      body: bodyemail
    });
  }
  render() {


    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        >
          <View style={styles.maskOutter}>
            <View
              style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]}
            />

            <View style={[{ flex: 40 }, styles.maskCenter]}>
              <View style={[{ width: maskColWidth }, styles.maskFrame]} />
              <View style={styles.maskInner}>
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 10,
                    borderColor: "#FFFFFF",
                    borderTopWidth: 1
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 10,
                    borderColor: "#FFFFFF",
                    borderBottomWidth: 1
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 20,
                    height: "100%",
                    borderColor: "#FFFFFF",
                    borderLeftWidth: 1
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 20,
                    height: "100%",
                    borderColor: "#FFFFFF",
                    borderRightWidth: 1
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 30,
                    height: 30,
                    borderColor: "#00BED6",
                    borderTopWidth: 4,
                    borderLeftWidth: 4
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 30,
                    height: 30,
                    borderColor: "#00BED6",
                    borderTopWidth: 4,
                    borderRightWidth: 4
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 30,
                    height: 30,
                    borderColor: "#00BED6",
                    borderBottomWidth: 4,
                    borderLeftWidth: 4
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 30,
                    height: 30,
                    borderColor: "#00BED6",
                    borderBottomWidth: 4,
                    borderRightWidth: 4
                  }}
                />
              </View>
              <View style={[{ width: maskColWidth }, styles.maskFrame]} />
            </View>
            <View
              style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]}
            />
          </View>

        </BarCodeScanner>

        {scanned && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={this.func_get_picture}>
              <Svg
                width={40}
                height={40}
                viewBox="0 0 20 20"
              >
                <Path fill-rule="evenodd" d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="#000" />
                <Path fill-rule="evenodd" d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" fill="#000" />


              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => this.setState({ scanned: false })}>
              <Svg
                width={40}
                height={40}
                viewBox="0 0 20 20"
              >
                <Path fill-rule="evenodd" d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z" fill="#000" />
                <Path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z" fill="#000" />
                <Path fill-rule="evenodd" d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z" fill="#000" />
                <Path fill-rule="evenodd" d="M9 2h5v5H9V2Zm1 1v3h3V3h-3ZM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8Zm2 2H9V9h1v1Zm4 2h-1v1h-2v1h3v-2Zm-4 2v-1H8v1h2Z" fill="#000" />
                <Path fill-rule="evenodd" d="M12 9h2V8h-2v1Z" fill="#000" />
              </Svg>

            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => this.setState({ renderresult: true })}>
              <Svg
                width={40}
                height={40}
                viewBox="0 0 20 20"
              >
                <Path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" fill="#000" />
                <Path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" fill="#000" />
              </Svg>
            </TouchableOpacity>
          </View>
        )}
        {this.func_render_result()}
      </View>

    );


  }
}
const { height, width } = Dimensions.get("window");
const maskRowHeight = Math.round((height - 200) / 20);
const maskColWidth = (width - 200) / 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: "13%",
  },
  containerMainontop: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    position: 'absolute',
    marginTop: '13%',

  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    textTransform: 'lowercase', // Notice this updates the default style
  },
  viewinbutton: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  button2: {
    alignItems: 'center',
    width: '100%',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#005790',
    textTransform: 'lowercase', // Notice this updates the default style
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  buttontext: {
    fontSize: 20,
    color: '#fff'
  },
  cameraView: {
    flex: 1,
    justifyContent: "flex-start"
  },
  maskOutter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  maskInner: {
    width: 300,
    backgroundColor: "transparent"
  },
  maskFrame: {
    backgroundColor: "#1C355E",
    opacity: 0.7
  },
  maskRow: {
    width: "100%"
  },
  maskCenter: { flexDirection: "row" },
  rectangleText: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flex: 1,
    textAlign: "center",
    color: "white"
  },
  footer: {
    width: '100%',
    height: 90,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick

  },
});

export default CaptureQRCode;