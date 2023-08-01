// LoginScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import baseurl from '../../constant';

const BASE_URL = baseurl; // Replace with your backend URL
//const BASE_URL = "http://localhost:5001"

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  const { userId, setUserId, userEmail, setUserEmail, isAdmin, setIsAdmin } = useContext(UserContext);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    axios
      .post(`${BASE_URL}/user/login`, { email, password })
      .then((response) => {
        const { userId, userEmail, isAdmin } = response.data;
        // Handle successful login, e.g., store user data in context/state and navigate to the dashboard
        setIsAdmin(isAdmin);
        console.log(userEmail)
        setEmail(userEmail);
        setUserId(userId);

        console.log('Logged in user:', userEmail);
        navigation.push('BottomNavbar', { screen: 'Dashboard' });
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Error', 'Invalid credentials');
      });
  };

  const handleRegister = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    axios
      .post(`${BASE_URL}/register`, { email, password, isAdmin })
      .then((response) => {
        Alert.alert('Success', `${email} registered successfully.`);
      })
      .catch((error) => {
        Alert.alert('Error', 'Error executing registration query');
      });

    // Reset the form
    setEmail('');
    setPassword('');
    setIsAdmin(false);

    // Close the modal
    setIsModalVisible(false);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
        <View>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            autoCapitalize='none'
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleModal}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Registration</Text>
            <TextInput
              style={styles.modalinput}
              placeholder="Email"
              placeholderTextColor="gray"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.modalinput}
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.adminCheckbox}
              onPress={() => setIsAdmin(!isAdmin)}
            >
              <Text style={styles.adminCheckboxText}>Admin</Text>
              <View style={styles.checkbox}>
                {isAdmin && <View style={styles.checkboxInner} />}
              </View>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={toggleModal}
              >
                <Text style={styles.cancelButtonLabel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '30%',
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  adminCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  adminCheckboxText: {
    fontSize: 16,
    marginRight: 10,
    color: 'gray',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#0782F9',
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    margin: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalinput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
    backgroundColor: 'white',
    marginTop: 8,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledModalButton: {
    opacity: 0.5,
  },
});

export default LoginScreen;