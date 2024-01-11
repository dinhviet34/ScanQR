import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, TextInput, Alert, SafeAreaView, Dimensions, Image, ScrollView } from 'react-native';
import { Component } from 'react';
import Svg, { Path } from "react-native-svg";
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaperProvider, Switch } from 'react-native-paper';
import DropDownPicker from "react-native-dropdown-picker";
import { RadioButton } from 'react-native-paper';


class Setting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assetsLoaded: false,
            sendto: '',
            iscompress: false,
            itemscompress: [
                { label: "0.1", value: "0.1" },
                { label: "0.2", value: "0.2" },
                { label: "0.3", value: "0.3" },
                { label: "0.4", value: "0.4" },
                { label: "0.5", value: "0.5" },
                { label: "0.6", value: "0.6" },
                { label: "0.7", value: "0.7" },
                { label: "0.8", value: "0.8" },
                { label: "0.9", value: "0.9" },
                { label: "1", value: "1" },
            ],
            opencompress: false,
            valuecompess: null,
            isresize: false,
            valueresize: '0.5',
            footervietqr_dong1: '',
            footervietqr_dong2: '',
            footervietqr_dong3: '',
            isfootervietqr: false,
            isopenfootervietqr: false,
          





        }
    }

    async componentDidMount() {
        await Font.loadAsync({
            'Inter-Black': require('./assets/fonts/Inter-Black.ttf')
        });
        this.setState({ assetsLoaded: true });
        //console.log(this.state.iscompress);
        this.func_get_data();
        this.func_get_data_compress();
        this.func_get_data_resize();
        this.func_get_data_footervietqr();
    }
    func_get_data_footervietqr = async () => {
        const value = await AsyncStorage.getItem('@storage_scan_footervietqr');
        if (value === null) {
            this.setState({ isfootervietqr: false });
        }
        else {
            this.setState({ isfootervietqr: true });
            this.setState({ footervietqr: value });
            this.setState({footervietqr_dong1:value.split('-')[0]});
            this.setState({footervietqr_dong2:value.split('-')[1]});
            this.setState({footervietqr_dong3:value.split('-')[2]});
        }
    }
    func_get_data_resize = async () => {
        const value = await AsyncStorage.getItem('@storage_scan_resize');
        if (value === null) {
            this.setState({ isresize: false });
        }
        else {
            this.setState({ isresize: true });
            this.setState({ valueresize: value });
        }
    }
    func_get_data_compress = async () => {
        const value = await AsyncStorage.getItem('@storage_scan_compress');
        if (value === null) {
            this.setState({ iscompress: false });
        }
        else {
            this.setState({ iscompress: true });
            this.setState({ valuecompess: value });
        }
    }
    func_get_data = async () => {
        const value = await AsyncStorage.getItem('@storage_scan_sendto')

        if (value !== null) {

            this.setState({ sendto: value });

        }

    }
    func_handler_sendto = (text) => {
       
        this.setState({ sendto: text });
    };
    func_handler_footervietqr_dong1 = (text) => {
        if(text.includes("-") === true){
            this.setState({footervietqr_dong1:text.replace("-"," ")})
        }
        else{
            this.setState({ footervietqr_dong1: text });
        }
      
        //console.log(this.state.footervietqr);
    };
    func_handler_footervietqr_dong2 = (text) => {
        if(text.includes("-") === true){
            this.setState({footervietqr_dong2:text.replace("-"," ")})
        }
        else{
            this.setState({ footervietqr_dong2: text });
        }
        //console.log(this.state.footervietqr);
    };
    func_handler_footervietqr_dong3 = (text) => {
        if(text.includes("-") === true){
            this.setState({footervietqr_dong3:text.replace("-"," ")})
        }
        else{
            this.setState({ footervietqr_dong3: text });
        }
        //console.log(this.state.footervietqr);
    };

    func_store_data_footervietqr = async () => {
        if (this.state.footervietqr === '') {
            Alert.alert('Thông báo', 'Phải nhập footer cho vietqr');
        }
        else {
            let data = this.state.footervietqr_dong1 + "-" + this.state.footervietqr_dong2 + "-" + this.state.footervietqr_dong3;
            await AsyncStorage.setItem('@storage_scan_footervietqr', data);
            this.setState({ isopenfootervietqr: false });
            Alert.alert('Thông báo', 'Thành công');
        }
    }
    func_store_data = async () => {
        if (this.state.sendto === '') {
            Alert.alert('Thông báo', 'Phải nhập đầy đủ thông tin');
        }
        else {
            let data = this.state.sendto;
            await AsyncStorage.setItem('@storage_scan_sendto', data);
            Alert.alert("Thông báo", "Thành công");
        }

    }

    func_store_data_compress = async () => {
        if (this.state.valuecompess === null) {
            Alert.alert('Thông báo', 'Chưa chọn tỉ lệ nén')
        }
        else {
            let data = this.state.valuecompess;
            await AsyncStorage.setItem('@storage_scan_compress', data);

            Alert.alert("Thông báo", "Thành công");
        }
    }

    func_store_data_resize = async () => {
        if (this.state.valueresize === null) {
            Alert.alert('Thông báo', 'Chưa chọn tỉ lệ kích thước ảnh')
        }
        else {
            let data = this.state.valueresize;
            await AsyncStorage.setItem('@storage_scan_resize', data);
            Alert.alert("Thông báo", "Thành công");
        }
    }
    func_remove_data = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch (exception) {
            return false;
        }
    }


    setValue = (callback) => {
        this.setState({ valuecompess: callback() });

    }
    setOpen = (opencompress) => this.setState({ opencompress })
    setItems = (itemscompress) => this.setState({ itemscompress })

    func_render_select_compress = () => {
        if (this.state.iscompress !== false) {
            return (
                <View style={{

                    alignItems: 'center',
                    justifyContent: 'center',

                }}>

                    <DropDownPicker

                        open={this.state.opencompress}
                        value={this.state.valuecompess}
                        items={this.state.itemscompress}
                        setOpen={this.setOpen}
                        setValue={this.setValue}
                        setItems={this.setItems}
                        placeholder=' Chọn tỉ lệ nén'



                    />

                    <TouchableOpacity style={styles.button} onPress={this.func_store_data_compress}>
                        <View style={styles.viewinbutton}>
                            <Svg
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                            >
                                <Path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" fill="#fff" />



                            </Svg>
                            <Text style={styles.buttontext}>
                                Lưu
                            </Text>
                        </View>

                    </TouchableOpacity>


                </View>
            );
        } else {
            return null; // Trả về null nếu không cần hiển thị gì
        }
    };
    func_render_footervietqr = () => {
        if (this.state.isopenfootervietqr === true) {
            
            return (
                <View style={styles.containerMainontop}>
                    <TextInput style={styles.styleinput} placeholder='Dòng 1' onChangeText={(this.func_handler_footervietqr_dong1)}>{this.state.footervietqr_dong1}</TextInput>
                    <TextInput style={styles.styleinput} placeholder='Dòng 2' onChangeText={(this.func_handler_footervietqr_dong2)}>{this.state.footervietqr_dong2}</TextInput>
                    <TextInput style={styles.styleinput} placeholder='Dòng 3' onChangeText={(this.func_handler_footervietqr_dong3)}>{this.state.footervietqr_dong3}</TextInput>
                    <View style={{ flexDirection: 'column' }}>
                        <TouchableOpacity style={styles.button} onPress={this.func_store_data_footervietqr}>
                            <View style={styles.viewinbutton}>
                                <Svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                >
                                    <Path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" fill="#fff" />



                                </Svg>
                                <Text style={styles.buttontext}>
                                    Lưu
                                </Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { this.setState({ isopenfootervietqr: false }); this.setState({ isopenfootervietqr: false }) }}>
                            <View style={styles.viewinbutton}>
                                <Svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                >
                                    <Path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" fill="#fff" />



                                </Svg>
                                <Text style={styles.buttontext}>
                                    Tắt
                                </Text>
                            </View>

                        </TouchableOpacity>
                    </View>

                </View>
            )
        }
    }
    func_render_select_resize = () => {
        if (this.state.isresize === true) {
            return (
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                            <RadioButton
                                color='#005790'
                                value="1"
                                status={this.state.valueresize === '1' ? 'checked' : 'unchecked'}
                                onPress={() => { this.setState({ valueresize: '1' }); }}
                            />


                            <Text>
                                Ảnh gốc
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <RadioButton
                                color='#005790'
                                value="0.5"
                                status={this.state.valueresize === '0.5' ? 'checked' : 'unchecked'}
                                onPress={() => { this.setState({ valueresize: '0.5' }); }}
                            />
                            <Text>
                                Giảm một nửa
                            </Text>

                        </View>


                    </View>
                    <TouchableOpacity style={styles.button} onPress={this.func_store_data_resize}>
                        <View style={styles.viewinbutton}>
                            <Svg
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                            >
                                <Path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" fill="#fff" />



                            </Svg>
                            <Text style={styles.buttontext}>
                                Lưu
                            </Text>
                        </View>

                    </TouchableOpacity>
                </View>



            )
        }

    }

    func_set_iscompress = async () => {
        if (this.state.iscompress === true) {
            await this.setState({ iscompress: false });
            await this.func_remove_data('@storage_scan_compress');
        }
        else {
            await this.setState({ iscompress: true })
        }
    }
    func_set_isresize = async () => {
        if (this.state.isresize === true) {
            await this.setState({ isresize: false });
            await this.func_remove_data('@storage_scan_resize');
        }
        else {
            await this.setState({ isresize: true })
        }
    }
    func_set_isfootervietqr = async () => {
        if (this.state.isfootervietqr === true) {
            await this.setState({ isfootervietqr: false });
            await this.setState({ isopenfootervietqr: false });
            await this.func_remove_data('@storage_scan_footervietqr');
        }
        else {
            await this.setState({ isfootervietqr: true });
            await this.setState({ isopenfootervietqr: true });
        }
    }

    render() {
        const { assetsLoaded } = this.state;
        if (!assetsLoaded) return null;
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="auto" />


                <View style={styles.stylecard}>


                    <View>
                        <Text>
                            Địa chỉ email
                        </Text>
                        <TextInput style={styles.styleinput} placeholder="Địa chỉ nhận mail" onChangeText={(this.func_handler_sendto)}>
                            {this.state.sendto}
                        </TextInput>
                    </View>


                    <TouchableOpacity style={styles.button} onPress={this.func_store_data}>
                        <View style={styles.viewinbutton}>
                            <Svg
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                            >
                                <Path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" fill="#fff" />



                            </Svg>
                            <Text style={styles.buttontext}>
                                Lưu
                            </Text>
                        </View>

                    </TouchableOpacity>



                </View>

                <View style={styles.stylecard}>
                    <View style={{ flexDirection: 'row', alignContent: 'center', marginBottom: 10, }}>
                        <View style={{ marginTop: 5, marginRight: 5, }}>
                            <Text>
                                Nội dung chân VietQR
                            </Text>
                        </View>
                        <View>
                            <Switch color='#005790' value={this.state.isfootervietqr} onValueChange={this.func_set_isfootervietqr}></Switch>

                        </View>
                        <View style={{ marginTop: 5, marginRight: 5, marginLeft:10,}}>
                            <TouchableOpacity onPress={()=>{[this.setState({isopenfootervietqr:!this.state.isopenfootervietqr}),this.func_get_data_footervietqr()]}}>
                                <Text>
                                    Xem nội dung
                                </Text>
                            </TouchableOpacity>
                        </View>


                    </View>

                </View>
                <View style={styles.stylecard}>
                    <View style={{ flexDirection: 'row', alignContent: 'center', marginBottom: 10, }}>
                        <View style={{ marginTop: 5, marginRight: 5, }}>
                            <Text>
                                Kích thước ảnh
                            </Text>
                        </View>
                        <View>
                            <Switch color='#005790' value={this.state.isresize} onValueChange={this.func_set_isresize}></Switch>
                        </View>

                    </View>
                    {this.func_render_select_resize()}
                </View>
                <View style={styles.stylecard}>
                    <View style={{ flexDirection: 'row', alignContent: 'center', marginBottom: 10, }}>
                        <View style={{ marginTop: 5, marginRight: 5, }}>
                            <Text>
                                Nén ảnh
                            </Text>
                        </View>
                        <View>
                            <Switch color='#005790' value={this.state.iscompress} onValueChange={this.func_set_iscompress}></Switch>

                        </View>

                    </View>

                    {this.func_render_select_compress()}
                </View>


                {this.func_render_footervietqr()}
            </SafeAreaView>
        )

    }
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',

        marginTop: "13%",
        fontFamily: 'Inter-Black',
        marginLeft: 10,
        marginRight: 10,

    },
    stylecard: {
        borderColor: '#116A7B',
        width: '100%',
        borderWidth: 1,
        margin: 10,
        padding: 10,

    },

    styleinput: {
        width: '100%',

        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        height: 50,
        padding: 10,

    },
    viewinbutton: {
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },
    button: {
        alignItems: 'center',
        width: '100%',
        borderRadius: 5,
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
    containerMainontop: {
        flex: 1,
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%',
        position: 'absolute',

    },
});

export default Setting;
