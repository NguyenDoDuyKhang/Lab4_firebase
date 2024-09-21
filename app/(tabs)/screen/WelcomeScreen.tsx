import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../index';
import { Menu, Avatar, IconButton } from 'react-native-paper'; 
import { launchImageLibrary } from 'react-native-image-picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState(user?.photoURL || '');

  useEffect(() => {
    const loadAvatar = async () => {
      const storedAvatarUri = await AsyncStorage.getItem('avatarUri');
      if (storedAvatarUri) {
        setAvatarUri(storedAvatarUri);
      }
    };

    loadAvatar();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Logout failed', error.message);
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleChangeAvatar = async () => {
    closeMenu();

    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets) {
        const selectedUri = response.assets[0].uri; 
        setAvatarUri(selectedUri);
        await AsyncStorage.setItem('avatarUri', selectedUri);
      }
    });
  };

  const handleViewInfo = () => {
    closeMenu();
    navigation.navigate('UserInfo');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://toigingiuvedep.vn/wp-content/uploads/2022/04/hinh-dong-de-thuong-ve-tinh-yeu.gif' }} // Thay đổi URL thành hình ảnh HD
      style={styles.container
        
      }
      resizeMode="cover"
    >
      

      <View style={styles.avatarContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon={() => (
                <Avatar.Image
                  size={40}
                  source={{ uri: avatarUri || 'https://placehold.co/40' }} 
                />
              )}
              onPress={openMenu}
            />
          }
        >
          <Menu.Item onPress={handleChangeAvatar} title="Change Avatar" />
          <Menu.Item onPress={handleViewInfo} title="View Info" />
          <Menu.Item onPress={handleLogout} title="Logout" />
        </Menu>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  message: {
    fontSize: 18,
    marginBottom: 8,
    color: '#fff',
  },
  email: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default WelcomeScreen;
