import React, {Component} from 'react';
import {
  StatusBar,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Toast from 'react-native-toast-message';
import {Root} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataInput: '',
      todoData: [],
    };
  }

  showAlert = (pesan, status) => {
    Toast.show({
      type: status,
      position: 'top',
      text1: pesan,
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 70,
      bottomOffset: 40,
      onShow: () => {},
      onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
      onPress: () => {},
      borderRadius: 10,
    });
  };
  cekData = (item, index) => {
    let alldata = this.state.todoData;
    let datacek = item;
    if (datacek.status == 'Selesai') {
      datacek.status = 'Belum Selesai';
      this.showAlert('Acara Belum Selesai', 'error');

      // console.log(datacek.status)
    } else {
      datacek.status = 'Selesai';
      this.showAlert('Acara Selesai', 'info');
      // console.log(datacek.status);
    }
    alldata[index].status = datacek.status;
    this.setState(
      {
        todoData: alldata,
      },
      () => this.saveData(),
    );
  };

  deleteData = index => {
    let alldata = this.state.todoData;
    this.state.todoData.splice(index, 1);
    this.setState({todoData: alldata}, () => this.saveData());
    this.showAlert('Acara Dihapus', 'error');
  };

  deleteDataBox = (index, pesan) => {
    Alert.alert('Hapus', 'Anda yakin ingin menghapus', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Hapus',
        onPress: () => this.deleteData(index),
      },
    ]);
  };

  addData = key => {
    let alldata = key;
    console.log(alldata);
    if (this.state.dataInput !== '') {
      alldata.push({judul: this.state.dataInput, status: 'Belum Selesai'});
      this.setState({todoData: alldata, dataInput: ''}, () => this.saveData());
      this.showAlert('Acara Ditambah', 'success');
    } else {
      this.showAlert('Harap isi Acara', 'error');
    }
  };

  saveData = async () => {
    try {
      await AsyncStorage.setItem(
        '@datainsert',
        JSON.stringify(this.state.todoData),
      );
      console.log('Data baru dimasukkan');
    } catch (err) {
      console.log('Data baru dimasukkan');
    }
  };

  getData = async key => {
    try {
      let nilaidisimpan = await AsyncStorage.getItem(key);
      nilaidisimpan = JSON.parse(nilaidisimpan);
      if (nilaidisimpan !== null) {
        this.setState({todoData: nilaidisimpan});
        console.log('DAta berhasil diload');
      } else {
        this.setState({todoData: this.state.datakosong});
      }
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this.getData('@datainsert');
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#C9CCD5'}}>
        <StatusBar barStyle="light-content" backgroundColor="#93B5C6" />
        <View
          style={{
            backgroundColor: '#93B5C6',
            padding: 15,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderWidth: 5,
            borderColor: '#FFE3E3',
          }}>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>
            My Todolist
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                width: 250,
                height: 40,
                marginLeft: 10,
                marginRight: 10,
                borderWidth: 3,
                borderRadius: 10,
                textAlign: 'center',
                color: 'black',
              }}
              value={this.state.dataInput}
              onChangeText={value => this.setState({dataInput: value})}
              placeholder="Masukan Acara"
              placeholderTextColor="#000"
            />

            <TouchableOpacity
              style={{
                backgroundColor: '#93B5C6',
                width: 70,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 1,
                borderRadius: 8,
              }}
              onPress={() => this.addData(this.state.todoData)}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Tambah</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: 18,
              marginTop: 10,
              marginLeft: 20,
              padding: 5,
            }}>
            Daftar Acara
          </Text>
        </View>

        <FlatList
          data={this.state.todoData}
          keyExtractor={item => item.judul}
          renderItem={({item, index}) => (
            <View
              style={{
                backgroundColor: '#93B5C6',
                padding: 7,
                marginLeft: 18,
                marginRight: 18,
                borderRadius: 15,
                marginBottom: 7,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#FFE3E3',
                  padding: 7,
                  marginLeft: 2,
                  marginRight: 2,

                  // justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 15,
                  borderWidth: 2,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
                    {item.judul}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => this.cekData(item, index)}>
                  <Icon
                    name={item.status == 'Selesai' ? 'check-square' : 'ban'}
                    size={30}
                    color={item.status == 'Selesai' ? 'green' : 'red'}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.deleteDataBox(index)}>
                  <Icon
                    name="minus-circle"
                    size={30}
                    color="red"
                    style={{marginLeft: 5}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <Toast ref={reff => Toast.setRef(reff)} />
      </View>
    );
  }
}

export default App;
