import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, SafeAreaView,ImageBackground, Dimensions, Image, ScrollView } from 'react-native';
import { Component } from 'react';
import { AutoFocus, Camera, CameraType } from 'expo-camera';
import Svg, { Path } from "react-native-svg";
import { ImageEditor } from "expo-crop-image";
import * as Font from 'expo-font';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
//import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator } from 'expo-image-crop'


const { width, height } = Dimensions.get('window')
      
class CaptureSignature extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      imageuri: null,
      renderimage: false,
      listimages: [],
      assetsLoaded: false,
      totalsize: 0,
      sendto: '',
      isVisible: false,
    }
  }
  async componentDidMount() {
    console.log(width + "," + height)
    await Font.loadAsync({
      'Inter-Black': require('./assets/fonts/Inter-Black.ttf')
    });
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === 'granted' });
    this.setState({ assetsLoaded: true });
    this.func_get_data();
  }
  func_get_data = async () => {
    const value = await AsyncStorage.getItem('@storage_scan_sendto')

    if (value !== null) {

      this.setState({ sendto: value });

    }

  }
  func_redirect_capturesignature = () => {
    this.props.navigation.navigate('CaptureSignature');
  }

  func_redirect_captureqrcode = () => {
    this.props.navigation.navigate('CaptureQRCode');
  }
  func_flip_camera = () => {
    this.setState({
      type: this.state.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    });
  }
  func_render_quota = () => {
    const sizeInMB = (this.state.totalsize / (1024 * 1024)).toFixed(2);
    let phantram = (sizeInMB * 100) / 5;
    if (this.state.usequota !== "") {
      return (
        <View>
          <ProgressBar progress={phantram / 100} color="#009FBD" />
        </View>
      )
    }

  }
  func_get_picture = async () => {
    const sizeInMB = (this.state.totalsize / (1024 * 1024)).toFixed(2);
    
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      option: { allowsMultipleSelection: false },    
    });

    if (!photo.canceled) {
      //console.log(result.assets[0]);
      if (sizeInMB < 5) {
       

        this.setState({ imageuri:  photo.assets[0].uri });
        this.setState({ renderimage: true });
      }
      else {
        Alert.alert("Thông báo", "Dung lượng cho phép là 5MB đã vợt quá dung lượng cho phép, xóa bớt ảnh hoặc thoát chương trình thự hiện lại từ đầu")
      }


    }


  }
  func_take_photo = async () => {
    const sizeInMB = (this.state.totalsize / (1024 * 1024)).toFixed(2);
    let { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Thông báo", "Camera đã không được cho phép, vui lòng vào phần cài đặt để thay đổi quyền truy cập camera");
    }
    else {
      if (sizeInMB <= 5) {
        var photo = await this.camera.takePictureAsync();
        
        //console.log(resizeimage.uri);
        this.setState({ imageuri: photo.uri });
        this.setState({ renderimage: true });

      }
      else {
        Alert.alert("Thông báo", "Dung lượng cho phép là 5MB đã vợt quá dung lượng cho phép, xóa bớt ảnh hoặc thoát chương trình thự hiện lại từ đầu")
      }



    }
  }
  onToggleModal = () => {
    const { isVisible } = this.state
    this.setState({ isVisible: !isVisible })
}
  func_render_image = () => {
    if (this.state.renderimage === true) {
   
      console.log(this.state.imageuri)
      let uri= this.state.imageuri
      
      return (
       

        <ImageBackground
              resizeMode="cover"
              style={{
                  justifyContent: 'center', alignItems: 'center', height, width, backgroundColor: 'black',
              }}
              source={ {uri}}
          >
         
              <ImageManipulator
                  photo={{uri}}
                  isVisible={true}
                  //fixedMask={{ width: 150, height: 150 }}
                  onPictureChoosed={async({ uri: uriM }) =>{
                    this.setState({ imageuri: uriM })
                    let listimages = this.state.listimages;
                    listimages.push(uriM);
                 
                    let fileInfo = await FileSystem.getInfoAsync(uriM);
                    let sizefile = fileInfo.size;
                    let totalsize = this.state.totalsize;
                    totalsize = totalsize + sizefile;
    
                    this.setState({ totalsize: totalsize });
                    console.log(this.state.totalsize);
    
                    this.setState({ listimages: listimages })
    
                    this.func_close_image();
                  }}
                  onToggleModal={this.onToggleModal}
              />
          </ImageBackground>


      )
    }

  }

  func_close_image = () => {
    this.setState({ renderimage: false });
  }
  func_remove_selected_image = (value) => {
    let listimages = this.state.listimages;
    var index = listimages.indexOf(value);
    if (index > -1) {
      listimages.splice(index, 1);
    }
    this.setState({ listimages: listimages });
  }
  func_set_selecteddelete = (value) => {
    Alert.alert(
      'Xác nhận',
      'Bạn muốn xóa ảnh này?',
      [
        { text: 'Xóa', onPress: () => this.func_remove_selected_image(value) },
        { text: 'Hủy' },
      ],
      { cancelable: false }
    )

  }
  func_send_edmail = () => {
    if (this.state.listimages.length !== 0) {
      var currentdate = new Date();
      var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
      //console.log(this.state.sendto);

      MailComposer.composeAsync({
        isHtml: true,
        recipients:
          [this.state.sendto],
        subject: 'Dữ liệu Capture ' + datetime,
        body: "Hình ảnh được ghi lại",
        attachments: this.state.listimages,
      });
    }
    else {
      Alert.alert("Thông báo", "Bạn cần thực hiện việc chụp ảnh trước khi gửi email");
    }

  }

  func_render_listimage = () => {
    let listimages = this.state.listimages;
    return (
      <ScrollView horizontal>
        {
          listimages.map((item, i) => {

            return (
              <View key={i} style={{ flex: 1, justifyContent: 'center', alignContent: 'center', marginRight: 5, }}>
                <TouchableOpacity onPress={() => this.func_set_selecteddelete(item)}>
                  <Image
                    source={{
                      uri: item,
                    }}
                    style={styles.imageinlist}></Image>
                </TouchableOpacity>
              </View>
            )


          })


        }


      </ScrollView>

    )




  }





  render() {
    const { assetsLoaded } = this.state;
    if (!assetsLoaded) return null;
    const sizeInMB = (this.state.totalsize / (1024 * 1024)).toFixed(2);
    const { height, width } = Dimensions.get("window");
    const maskRowHeight = Math.round((height - 100) / 15);
    const maskColWidth = (width - 200) / 2;
    //console.log(maskRowHeight + "," + maskColWidth);
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Camera đã không được cho phép, vui lòng vào phần cài đặt để thay đổi quyền truy cập camera</Text>;
    } else {

      return (
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />




          <View style={styles.camera}>




            <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => (this.camera = ref)}>
              <View style={styles.header}>
                <View style={styles.viewinhead}>
                  <Text>
                    {sizeInMB}
                  </Text>
                </View>
                <View style={styles.viewinhead}>
                  <TouchableOpacity style={styles.button} onPress={this.func_flip_camera}>
                    <Svg
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                    >
                      <Path fill-rule="evenodd" d="M11 1H5a1 1 0 0 0-1 1v6a.5.5 0 0 1-1 0V2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a.5.5 0 0 1-1 0V2a1 1 0 0 0-1-1Zm1 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a.5.5 0 0 0-1 0v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2a.5.5 0 0 0-1 0v2ZM1.713 7.954a.5.5 0 1 0-.419-.908c-.347.16-.654.348-.882.57C.184 7.842 0 8.139 0 8.5c0 .546.408.94.823 1.201.44.278 1.043.51 1.745.696C3.978 10.773 5.898 11 8 11c.099 0 .197 0 .294-.002l-1.148 1.148a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708l1.145 1.144L8 10c-2.04 0-3.87-.221-5.174-.569-.656-.175-1.151-.374-1.47-.575C1.012 8.639 1 8.506 1 8.5c0-.003 0-.059.112-.17.115-.112.31-.242.6-.376Zm12.993-.908a.5.5 0 0 0-.419.908c.292.134.486.264.6.377.113.11.113.166.113.169 0 .003 0 .065-.13.187-.132.122-.352.26-.677.4-.645.28-1.596.523-2.763.687a.5.5 0 0 0 .14.99c1.212-.17 2.26-.43 3.02-.758.38-.164.713-.357.96-.587.246-.229.45-.537.45-.919 0-.362-.184-.66-.412-.883-.228-.223-.535-.411-.882-.571ZM7.5 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1Z" fill="#000" />



                    </Svg>


                  </TouchableOpacity>
                </View>


              </View>
              {this.func_render_quota()}
              <View style={styles.listimages}>
                {this.func_render_listimage()}
              </View>
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
                <TouchableOpacity style={styles.button} onPress={this.func_take_photo}>
                  <Svg
                    width={40}
                    height={40}
                    viewBox="0 0 20 20"
                  >
                    <Path fill-rule="evenodd" d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" fill="#000" />



                  </Svg>

                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.func_send_edmail}>
                  <View style={styles.viewinbutton}>
                    <Svg
                      width={40}
                      height={40}
                      viewBox="0 0 20 20"
                    >
                      <Path fill-rule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" fill="#000" />



                    </Svg>

                  </View>

                </TouchableOpacity>




              </View>

            </Camera>

          </View>

          {this.func_render_image()}

        </SafeAreaView>
      )


    }
  }
}
const win = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: "13%",
  },
  button2: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 10,
    backgroundColor: '#005790',
    textTransform: 'lowercase', // Notice this updates the default style
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  button: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
    textTransform: 'lowercase', // Notice this updates the default style
  },
  viewinbutton: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  buttontext: {
    fontSize: 20,
  },
  buttontext2: {
    fontSize: 13,
  },
  imageinlist: {
    width: 150,
    height: 100,
  },
  image: {
    flex: 1,
    alignSelf: 'center',
    width: win.width,
    height: win.height,
  },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',


  },
  viewinhead: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listimages: {
    height: 100,
    width: '100%',
    backgroundColor: '#fff',
    opacity: 0.8,

  },
  containerMainontop: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    position: 'absolute',

  },
  footer: {
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    flexDirection: 'row',
  },

  camera: {
    height: '100%',
    width: '100%',
    flex: 1,
  },

});

export default CaptureSignature;