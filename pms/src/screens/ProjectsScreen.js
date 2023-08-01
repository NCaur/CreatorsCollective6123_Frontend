import React, { useEffect, useState, useRef, useContext, useNavigation } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { UserContext } from '../UserContext';
import axios from 'axios';
import baseurl from '../../constant';

const BASE_URL = baseurl; 
//const BASE_URL = 'http://192.168.2.38:5001'; // Replace with your backend URL
//const BASE_URL = "http://localhost:5001";

const ProjectsScreen = ({ route, navigation }) => {
  const { userId, userEmail, isAdmin } = useContext(UserContext);
  const [isProjectModalVisible, setProjectModalVisible] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [projectList, setProjectList] = useState([]);
  const titleInputRef = useRef(null);

  const fetchProjects = async () => {
    try {
      // const response = await axios.get(`${BASE_URL}/projects?adminId=${userId}`);
      const response = await axios.get(
        `${BASE_URL}/api`,
        {
          params: {
            "isAdmin": isAdmin,
            "userId": userId
          }
        }
      );
      const data = response.data;
      setProjectList(data);
    } catch (error) {
      console.log('Error fetching projects: ', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (isProjectModalVisible) {
      titleInputRef.current.focus();
    }
  }, [isProjectModalVisible]);

  const projectCount = projectList.length

  const renderItem = ({ item }) => {
    let cardStyle = styles.card
    if (item.status === 'Completed') {
      cardStyle = { ...cardStyle, ...styles.completedCard }
    } else {
      cardStyle = { ...cardStyle, ...styles.inProgressCard }
    }

    const isCompleted = item.status === 'Completed'

    handleButtonPress = (projectId) => {
      console.log('Project Id: ', projectId);
      navigation.navigate('ProjectTasks', { projectId: projectId });
    }

    return (
      <View style={cardStyle}>
        <View style={styles.projectContainer}>
          <Text style={styles.titleText}>
            Project:{item.title}
          </Text>
          <Text style={styles.admin}>Admin: {item.adminemail}</Text>
          <Text>Total Hours: {item.totalHours}</Text>
          <Text>Total Cost: ${item.totalCost}</Text>
          <Text>Total Tasks: {item.totalTasks}</Text>
          <Text>In-Progress Tasks: {item.inprogressTasks}</Text>
          <Text>Completd Tasks: {item.completedTasks}</Text>
          <Text>Status: {item.status}</Text>
          <View>
            {isCompleted && <Text>Completed By: {item.completedBy}</Text>}
            {isCompleted && <Text>Completed At: {item.completedDateTime}</Text>}
          </View>
          <View style={styles.buttonContainer}>
            {/*             <TouchableOpacity onPress={() => {}} style={styles.cardbuttonTasks}>
              <Text style={styles.buttonTextTasks}>Tasks</Text>
            </TouchableOpacity> 
             !isCompleted && item.adminid === userId &&*/}
           
            {true && (
              <TouchableOpacity
                //onPress={toggleAddHoursModal}
                onPress={() => handleDeleteProject(item._id)}
                style={styles.cardbuttonDelete}
              >
                <Text style={styles.buttonTextDelete}>Delete</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              //onPress={toggleAddHoursModal}
              onPress={() => handleButtonPress(item._id)}
              style={styles.cardbuttonTasks}
            >
              <Text style={styles.buttonTextTasks}>Tasks</Text>
            </TouchableOpacity>

            {!isCompleted && item.adminid === userId && (
              <TouchableOpacity
                onPress={() => handleComplete(item.id)}
                style={styles.cardbuttonComplete}
                disabled={isCompleted}
              >
                <Text style={styles.buttonTextComplete}>Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    )
  }

  const handleAddProject = async () => {
    const trimmedTitle = newProjectTitle.trim();
    const completedByUserId = '';
    const completedDateTime = '';

    if (trimmedTitle.length === 0) {
      console.log('Project title is empty.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api`,
        {
          title: trimmedTitle,
          userId: userId,
          isAdmin: "false",
        }
      );

      const newProject = response.data;
      setNewProjectTitle('');
      toggleModal();
      setProjectList([...projectList, newProject]);
    } catch (error) {
      console.log('Error adding project: ', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`${BASE_URL}/api/${projectId}`);
      setProjectList(projectList.filter((project) => project.id !== projectId));
    } catch (error) {
      console.log('Error deleting project: ', error);
    }
    fetchProjects();
  };

  const toggleModal = () => {
    setProjectModalVisible(!isProjectModalVisible);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>
          Hello {userEmail} {isAdmin ? <Text>(Admin)</Text> : null}
        </Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>My Projects</Text>
        <TouchableOpacity onPress={toggleModal} style={styles.button}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={projectList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      {/* Modal */}
      <Modal visible={isProjectModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Project</Text>
            <TextInput
              style={styles.input}
              ref={titleInputRef}
              placeholder="Project Title"
              value={newProjectTitle}
              onChangeText={setNewProjectTitle}
            />
            <TouchableOpacity
              style={[
                styles.modalButton,
                newProjectTitle ? null : styles.disabledModalButton,
              ]}
              onPress={handleAddProject}
              disabled={!newProjectTitle}
            >
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
              <Text style={styles.cancelButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

export default ProjectsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '20%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectContainer: {
    padding: 10,
  },
  list: {
    marginTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  completedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#009900',
  },
  inProgressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCC00',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardbuttonTasks: {
    borderWidth: 1,
    borderColor: '#0782F9',
    width: '30%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonTextTasks: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  cardbuttonDelete: {
    borderWidth: 1,
    borderColor: 'red',
    width: '30%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonTextDelete: {
    color: 'red',
    fontWeight: '700',
    fontSize: 16,
  },
  cardbuttonComplete: {
    borderWidth: 1,
    borderColor: '#009900',
    width: '30%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonTextComplete: {
    color: '#009900',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  disabledButtonTitle: {
    color: 'gray',
  },
  admin: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
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
  input: {
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
})
