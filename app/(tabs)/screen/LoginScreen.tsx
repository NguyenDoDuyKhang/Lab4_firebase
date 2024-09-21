import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../index'; 

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>(); 

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      setNotification('Đăng xuất thành công!');
      navigation.navigate('Welcome'); 
    } catch (error: any) {
      let message = 'Đăng nhập thất bại.';

      switch (error.code) {
        case 'auth/wrong-password':
          message = 'Mật khẩu không chính xác.';
          break;
        case 'auth/user-not-found':
          message = 'Tài khoản không tồn tại.';
          break;
        case 'auth/invalid-email':
          message = 'Email không hợp lệ.';
          break;
        default:
          message = error.message;
      }

      setNotification(message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Đăng Ký Tài Khoản</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Quên Mật Khẩu?</Text>
      </TouchableOpacity>

      {notification ? (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e9f5ff', // Changed background color to a soft blue
  },
  title: {
    fontSize: 30, // Increased font size
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1a1a1a', // Darker text for contrast
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10, // More rounded corners
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#ccc', // Subtle border
    borderWidth: 1,
  },
  button: {
    height: 50,
    backgroundColor: '#3b82f6', // Blue color for the button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    color: '#3b82f6', // Match the button color for consistency
    fontSize: 16,
    marginBottom: 10,
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#f43f5e', // Soft red color
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  notification: {
    padding: 10,
    backgroundColor: '#fffbeb', // Light yellow for notifications
    borderColor: '#ffeeba',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  notificationText: {
    color: '#856404',
  },
});

export default LoginScreen;
