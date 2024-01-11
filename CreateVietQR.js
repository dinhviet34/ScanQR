import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ImageBackground, Text, TextInput, Keyboard, View, TouchableOpacity, Alert, SafeAreaView, Dimensions, Image, ScrollView } from 'react-native';
import { Component } from 'react';
import * as Font from 'expo-font';
import { captureRef } from 'react-native-view-shot';
import { shareAsync } from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VietQR } from 'vietqr';
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Svg, { Path } from "react-native-svg";
import getnameofaccount from './GetNameOfAccount';
import { PixelRatio } from 'react-native';
class CreateVietQR extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stk: '',
            alias: '',
            showqr: false,
            assetsLoaded: false,
            tenkh: '',
            footer: '',
            vietqrlistbank: '',
            vietqrdropdownlist: [],
            openbank: false,
            valuebank: 'VietinBank',
            imageuri: '',
            qrcodesave: '',
            //nameofaccount: '',
            // bin:'970415',
            savebutton: false,


        }
    }
    async componentDidMount() {
        await Font.loadAsync({
            'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf')
        });
        this.setState({ assetsLoaded: true });
        await this.func_get_data_footervietqr();
        await this.func_get_vietqr_list_bank();
        await this.func_get_data_saveqrcode();
    }


    func_get_vietqr_list_bank = async () => {
        let dropdownlist = [];
        let vietQR = new VietQR({
            clientID: '26973b61-8bf0-423d-909b-b84dd823b96b',
            apiKey: 'b8225057-ff8f-4ef2-82db-7bb1661be308',
        })
        await vietQR.getBanks().then((banks) => {
            this.setState({ vietqrlistbank: banks });

        }).catch((error) => {
            console.log(error);
        })

        this.state.vietqrlistbank.data.forEach(element => {
            let el = { label: element.name, value: element.shortName };
            dropdownlist.push(el);
        });
        this.setState({ vietqrdropdownlist: dropdownlist });
        //console.log(this.state.vietqrdropdownlist);

    }
    setOpen = (openbank) => this.setState({ openbank })
    setItems = (vietqrdropdownlist) => this.setState({ vietqrdropdownlist })
    setValue = (callback) => {
        this.setState({ valuebank: callback() });
        /*let bin='';
        let value = this.state.valuebank;
        let listbank = this.state.vietqrlistbank.data;
      
        listbank.forEach(element => {
            if (value === element.shortName) {
                bin = element.bin
            }

        });
        this.setState({bin:bin});*/


    }
    func_get_data_saveqrcode = async () => {
        const value = await AsyncStorage.getItem('@storage_scan_qrsave');
        if (value !== null) {
            this.setState({ qrcodesave: value });
            // console.log(this.state.qrcodesave + "fuvk");
        }
    }
    func_get_data_footervietqr = async () => {
        const value = await AsyncStorage.getItem('@storage_scan_footervietqr');
        if (value === null) {
            this.setState({ footer: '' });
        }
        else {

            this.setState({ footer: value });
            //console.log(this.state.footer);
        }
    }
    func_print_file = async () => {
        this.func_store_data();
        const pixelRatio = PixelRatio.get();
        const result = await captureRef(this.refs.captureframeqr, {
            result: 'tmpfile',
            height: 1100/pixelRatio,
            width: 850/pixelRatio,
            quality: 1,
            format: 'png',
        });
        //console.log(result)
        await shareAsync("file://" + result, { UTI: '.png', mimeType: 'image/png' });
    }
    func_print_all_qr = async () => {
        this.func_store_data();
        const result = await captureRef(this.refs.captureframe_all_qr, {
            result: 'tmpfile',

            quality: 1,
            format: 'png',
        });
        //console.log(result)
        await shareAsync("file://" + result, { UTI: '.png', mimeType: 'image/png' });
    }

    render_logo = () => {
        let value = this.state.valuebank;
        let listbank = this.state.vietqrlistbank.data;
        let logobank = '';
        listbank.forEach(element => {
            if (value === element.shortName) {
                logobank = element.logo
            }

        });
        if (logobank !== '') {
            let napaslogo = 'https://minisiteb.qltns.mediacdn.vn/minisite/63aebd76b0494113b06a8fd3318dfc5b-web/assets/image/Logo.png';
            return (
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Image source={{ uri: logobank }} style={[styles.Imagelogo, { marginBottom: 10 }]}></Image>

                    <Image source={{ uri: napaslogo }} style={[styles.Imagelogo, { width: 90, }]}></Image>
                </View>
            )
        }

    }
    render_picture = () => {
        if (this.state.imageuri !== '') {
            var imageuri = this.state.imageuri;

            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: imageuri }} style={styles.ImageIndividual}></Image>
                </View>
            )
        }
        else {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 1, height: 20, }}>

                </View>
            )

        }
    }

    render_hovaten = () => {

        if (this.state.tenkh !== '') {
            var tenkh = this.state.tenkh;
            return (
                <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>

                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                        {this.func_remove_dautiengviet(tenkh).toUpperCase()}
                    </Text>

                </View>
            )
        }
    }
    render_stk = () => {
        if (this.state.stk !== '') {
            var stk = this.state.stk;
            return (
                <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ marginRight: 5, fontSize: 13, color: "#8B7E74" }}>
                        Số tài khoản
                    </Text>
                    <Text style={{ fontSize: 13 }}>
                        {stk}
                    </Text>

                </View>

            )
        }
    }
    render_alias = () => {
        if (this.state.alias !== '') {
            var alias = this.state.alias;
            return (
                <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ marginRight: 5, fontSize: 13, color: "#8B7E74" }}>
                        Alias tài khoản
                    </Text>
                    <Text style={{ fontSize: 13 }}>
                        {this.func_remove_dautiengviet(alias).toUpperCase()}
                    </Text>

                </View>
            )

        }
    }
    render_qrcode = () => {
        var value = this.state.valuebank;
        var qrimage = 'https://img.vietqr.io/image/' + value + '-' + this.state.stk + '-7Cj6Tw9.jpg';
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                <Image source={{ uri: qrimage }} style={styles.ImageQR}></Image>
            </View>

        )

    }
    render_bankname = () => {
        //console.log("fuck")
        var value = this.state.valuebank;
        let listbank = this.state.vietqrlistbank.data;
        var name = '';
        listbank.forEach(element => {
            //console.log(element.name)
            if (value === element.shortName) {
                name = element.name;

            }
        });
        if (name !== '') {
            return (
                <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center', alignItems: 'center', marginLeft: 20, marginRight: 20, }}>
                    <Text style={{ fontSize: 13, flexShrink: 1, flexWrap: 'wrap', textAlign: 'center' }}>
                        {name}
                    </Text>


                </View>
            )
        }
    }
    render_dong1 = () => {
        if (this.state.footer !== '') {
            var footer = this.state.footer;
            var dong1 = footer.split('-')[0];
            //(dong1);
            if (dong1 !== '') {
                return (
                    <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, }}>
                            {dong1}
                        </Text>


                    </View>
                )

            }
        }
    }
    render_dong2 = () => {
        if (this.state.footer !== '') {
            var footer = this.state.footer;
            var dong2 = footer.split('-')[1];
            if (dong2 !== '') {
                return (
                    <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, }}>
                            {dong2}
                        </Text>


                    </View>
                )

            }
        }
    }
    render_dong3 = () => {

        if (this.state.footer !== '') {

            var footer = this.state.footer;
            var dong3 = footer.split('-')[2];

            if (dong3 !== '') {
                return (
                    <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, }}>
                            {dong3}
                        </Text>


                    </View>
                )

            }
        }
    }
    render_button_save = () => {
        if (this.state.savebutton === true) {
            return (
                <View>
                    <TouchableOpacity style={styles.button} onPress={this.func_store_data}>
                        <View style={styles.viewinbutton}>

                            <Text style={styles.textinbutton}>
                                Lưu lại
                            </Text>

                        </View>

                    </TouchableOpacity>
                </View>
            )
        }
    }
    render_button_share = () => {
        return (
            <View style={styles.buttoninqrview}>
                <TouchableOpacity style={styles.button} onPress={this.func_get_picture}>
                    <View style={styles.viewinbutton}>

                        <Text style={styles.textinbutton}>
                            Ảnh cá nhân
                        </Text>

                    </View>

                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.func_print_file}>
                    <View style={styles.viewinbutton}>

                        <Text style={styles.textinbutton}>
                            Chia sẻ
                        </Text>

                    </View>

                </TouchableOpacity>

                {this.render_button_save()}

                <TouchableOpacity style={styles.button} onPress={() => { this.setState({ showqr: false }) }}>
                    <View style={styles.viewinbutton}>

                        <Text style={styles.textinbutton}>
                            Tắt
                        </Text>

                    </View>

                </TouchableOpacity>
            </View>
        )
    }






    func_remove_dautiengviet = (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
    };
    func_handler_tenkh = (text) => {
        this.setState({ tenkh: text });
    };
    func_handler_stk = async (text) => {
        this.setState({ stk: text });
        // let nameoa = await getnameofaccount(this.state.bin,this.state.stk);
        //this.setState({tenkh:nameoa});
        //console.log(nameoa);
    };

    func_handler_alias = (text) => {
        this.setState({ alias: text });
    };
    func_show_qr = () => {

        this.setState({ showqr: !this.state.showqr });
        this.setState({savebutton:true});
        Keyboard.dismiss()

    }

    func_render_vietQR = () => {
        if (this.state.showqr === true) {
            return (

                <View style={styles.containerMainontop}>
                    <View style={styles.qrview} ref="captureframeqr" collapsable={false}>
                        <ImageBackground resizeMode='stretch' source={require('./assets/VietQRBG.png')} style={styles.imagebackgroud}>
                            <View style={{ flex: 1, with: '100%', height: '100%' }}>
                                {this.render_logo()}

                                {this.render_picture()}
                                {this.render_hovaten()}

                                {this.render_stk()}
                                {this.render_alias()}
                                {this.render_bankname()}
                                {this.render_qrcode()}
                                {this.render_dong1()}
                                {this.render_dong2()}
                                {this.render_dong3()}
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.buttonsview}>
                        {this.render_button_share()}
                    </View>
                </View>
            )
        }
    }
    func_remove_data = async () => {
        Alert.alert(
            //title
            'Dọn dẹp mã QR đã tạo',
            //body
            'Các mã QR sẽ bị xóa hết và không thể khôi phục ?',
            [
                {
                    text: 'Yes', onPress: () => {
                        { this.deletestorge() }
                    }
                },
                {
                    text: 'No',
                    onPress: () => console.log('No Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
        );

    }
    deletestorge = async () => {
        try {
            await AsyncStorage.removeItem('@storage_scan_qrsave');
            this.setState({ qrcodesave: '' });
        }
        catch (exception) {
            console.log(exception)
        }
    }
    func_show_data = (text) => {
        //console.log(text.split('|')[0]);
        this.setState({ tenkh: text.split('|')[0] });
        this.setState({ stk: text.split('|')[1] });
        this.setState({ alias: text.split('|')[2] });
        this.setState({ valuebank: text.split('|')[3] });
        this.setState({ imageuri: '' });
        this.func_show_qr();
        this.setState({savebutton:false});
    }
    func_render_library = () => {
        if (this.state.qrcodesave !== '') {
            //console.log(this.state.qrcodesave)
            try {
                let dataarray = this.state.qrcodesave.split(',');
                let count = dataarray.length;
                //console.log(this.state.qrcodesave + "fuvkkf");
                return (
                    <View style={styles.library}>
                        <View>
                            <TouchableOpacity onPress={this.func_remove_data}>
                                <View style={{ alignContent: 'flex-start', flexDirection: 'row', marginTop: 10, }}>
                                    <Svg
                                        width={20}
                                        height={20}
                                        viewBox="0 0 20 20"
                                    >
                                        <Path fill-rule="evenodd" d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" fill="#000" />
                                    </Svg>
                                    <Text>
                                        Dọn dẹp tổng số {count} mã QR đã được tạo
                                    </Text>

                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.func_print_all_qr}>
                                <View style={{ alignContent: 'flex-start', flexDirection: 'row', marginTop: 10, }}>
                                    <Svg
                                        width={20}
                                        height={20}
                                        viewBox="0 0 20 20"
                                    >
                                        <Path fill-rule="evenodd" d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="#000" />
                                    </Svg>
                                    <Text>
                                        Chia sẻ tất cả tài khoản QR
                                    </Text>

                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 20, height: 300 }}>
                            <ScrollView  >
                                <View ref="captureframe_all_qr" style={{ backgroundColor: '#fff' }} collapsable={false}>
                                    {

                                        dataarray.map((r, key) => {
                                            let name = r.split('|')[0];
                                            let stk = r.split('|')[1];
                                            let alias = r.split('|')[2];
                                            let bankname = r.split('|')[3];
                                            return (



                                                <TouchableOpacity key={key} onPress={() => { this.func_show_data(name + "|" + stk + "|" + alias + "|" + bankname) }}>
                                                    <View style={{
                                                        margin: 10,
                                                        alignContent: 'center',
                                                        borderWidth: 2,
                                                        borderColor: '#1B6B93',
                                                        borderRadius: 10,
                                                        justifyContent: 'center'
                                                    }}>
                                                        <View style={{ flexDirection: 'row', padding: 10, }}>
                                                            <View style={{ justifyContent: 'center' }}>
                                                                <View >


                                                                    <Image source={require('./assets/card.png')} style={[styles.ImageIndividual, { borderRadius: 5, borderWidth: 0, }]}></Image>


                                                                </View>
                                                            </View>
                                                            <View style={{ justifyContent: 'center' }}>
                                                                <Text style={{ marginLeft: 10, color: '#2D4356' }}>
                                                                    Tên: {name}
                                                                </Text>
                                                                <Text style={{ marginLeft: 10, color: '#2D4356' }}>
                                                                    Số tài khoản: {stk}
                                                                </Text>
                                                                <Text style={{ marginLeft: 10, color: '#2D4356' }}>
                                                                    Alias: {alias}
                                                                </Text>
                                                                <Text style={{ marginLeft: 10, color: '#2D4356' }}>
                                                                    Ngân hàng: {bankname}
                                                                </Text>
                                                            </View>

                                                        </View>



                                                    </View>


                                                </TouchableOpacity>

                                            )


                                        })
                                    }

                                </View>
                            </ScrollView>
                        </View>

                    </View>
                );

            }
            catch (exception) {
                console.log(exception)
                this.func_remove_data();
            }

        }

    }
    func_get_picture = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        //console.log(result);
        if (!result.canceled) {
            this.setState({ imageuri: result.assets[0].uri });
        }
    }
    func_store_data = async () => {
        if (this.state.tenkh === '' && this.state.stk === '') {

        }
        else {

            let check = false;
            let dataarray = [];
            //console.log(this.state.qrcodesave + "fuckdk")
            if (this.state.qrcodesave !== '') {
                dataarray = this.state.qrcodesave.split(',');

            }
            else {
                check = true;
            }
            //console.log(dataarray);

            dataarray.forEach(element => {
                if (element.split('|')[1] === this.state.stk) {
                    check = false;

                }
                else {
                    check = true;


                }
            });
            //console.log(check);
            if (check === true) {
                let data = this.state.tenkh + "|" + this.state.stk + "|" + this.state.alias + "|" + this.state.valuebank;
                dataarray.push(data);

                this.setState({ qrcodesave: dataarray.toString() });
                //console.log(this.state.qrcodesave);
            }
            await AsyncStorage.setItem('@storage_scan_qrsave', dataarray.toString());

        }
    }
    render() {
        const { assetsLoaded } = this.state;
        if (!assetsLoaded) {
            return null;
        }
        else {
            //console.log(this.state.valuebank)
            return (
                <SafeAreaView style={styles.container}>
                    <StatusBar style="auto" />
                    <View style={styles.banner}>
                        <Image style={styles.ImageIconStyle} source={{ uri: "https://my.vietqr.io/static/media/logo.30629bedbc818b217775.png" }}></Image>
                    </View>
                    <View style={styles.body}>
                        <View >
                            <Text>Chọn ngân hàng</Text>
                            <DropDownPicker

                                open={this.state.openbank}
                                value={this.state.valuebank}
                                items={this.state.vietqrdropdownlist}
                                setOpen={this.setOpen}
                                setValue={this.setValue}
                                setItems={this.setItems}
                            />

                            <View style={styles.viewbouder}>
                                <Text>Tên khách hàng</Text>
                                <TextInput style={styles.styleinput} onChangeText={(this.func_handler_tenkh)}></TextInput>
                            </View>
                            <View style={styles.viewbouder}>
                                <Text>Số tài khoản</Text>
                                <TextInput style={styles.styleinput} onChangeText={(this.func_handler_stk)}></TextInput>
                            </View>
                            <View style={styles.viewbouder}>
                                <Text>Alias tài khoản</Text>
                                <TextInput style={styles.styleinput} onChangeText={(this.func_handler_alias)}></TextInput>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={styles.button} onPress={this.func_show_qr}>
                                    <View style={styles.viewinbutton}>

                                        <Text style={styles.textinbutton}>
                                            Tạo VietQR
                                        </Text>

                                    </View>

                                </TouchableOpacity>

                            </View>
                        </View>
                        {this.func_render_library()}
                    </View>

                    {this.func_render_vietQR()}
                    <View style={styles.footer}>

                    </View>
                </SafeAreaView>
            )

        }


    }
}

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
        borderWidth: 1,
        borderColor: '#3AA6B9',


    },
    qrview: {
        flex: 7,

    },

    buttonsview: {
        flex: 3,
    },

    buttoninqrview: {
        flexDirection: 'row',
    },
    viewbouder: {
        width: '100%',
        //flexDirection:'row',
    },
    imagebackgroud: {
        flex: 1,
        justifyContent: 'center',


    },
    styleinput: {

        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        //margin: 5,
        width: '100%',
        height: 40,
        padding: 10,

    },
    banner: {
        flex: 1,
        marginTop: 10,
    },
    body: {
        flex: 9,
        width: '95%',

    },
    library: {
        width: '100%',
        height: '100%'
    },
    footer: {
        flex: 1,
    },
    ImageIconStyle: {
        height: 60,
        width: 150,
    },
    ImageQR: {
        height: 210,
        width: 210,
        borderWidth: 1,
        borderColor: '#1B6B93',
        borderRadius: 5,

    },

    Imagelogo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',



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
    ImageIndividual: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#1B6B93',

    },
    button: {
        marginTop: 5,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#005790',
        textTransform: 'lowercase', // Notice this updates the default style
        justifyContent: 'center',
        borderRadius: 10,
        flex: 1,
        margin: 5,
    },
    textinbutton: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    viewinbutton: {
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },
});

export default CreateVietQR;