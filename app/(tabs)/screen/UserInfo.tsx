import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const UserInfo: React.FC = () => {
  const [user, setUser] = useState({
    fullName: '',
    gender: '',
    dob: '',
    address: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      const storedFullName = await AsyncStorage.getItem('fullName');
      const storedGender = await AsyncStorage.getItem('gender');
      const storedDob = await AsyncStorage.getItem('dob');
      const storedAddress = await AsyncStorage.getItem('address');

      setUser({
        fullName: storedFullName || '',
        gender: storedGender || '',
        dob: storedDob || '',
        address: storedAddress || '',
      });
    };

    loadUserData();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await AsyncStorage.setItem('fullName', user.fullName);
      await AsyncStorage.setItem('gender', user.gender);
      await AsyncStorage.setItem('dob', user.dob);
      await AsyncStorage.setItem('address', user.address);

      Alert.alert('Thông báo', 'Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating user information:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông Tin Người Dùng</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Họ và Tên"
          value={user.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Giới Tính"
          value={user.gender}
          onChangeText={(text) => handleInputChange('gender', text)}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Ngày Sinh"
          value={user.dob}
          onChangeText={(text) => handleInputChange('dob', text)}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Địa Chỉ"
          value={user.address}
          onChangeText={(text) => handleInputChange('address', text)}
          placeholderTextColor="#888"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Cập Nhật</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserInfo;
