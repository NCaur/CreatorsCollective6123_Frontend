import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { UserContext } from '../UserContext';

import baseurl from '../../constant';

const BASE_URL = baseurl; 
 //const BASE_URL = 'http://192.168.2.38:5001';
//const BASE_URL = "http://localhost:5001"

const DashboardScreen = ({ navigation }) => {
  const { userId, userEmail, isAdmin } = useContext(UserContext);
  const [projectsOverview, setProjectsOverview] = useState({});
  const [tasksOverview, setTasksOverview] = useState({});

  useEffect(() => {
    // Fetch project and tasks overview data from the backend
    const fetchData = async () => {
      try {
        const projectOverviewResponse = await axios.get(
          `${BASE_URL}/api/summary`,
          {
            params: {
              "isAdmin": isAdmin,
              "userId": userId
            }
          }
        );
        setProjectsOverview(projectOverviewResponse.data);
        const taskOverviewResponse = await axios.get(
          `${BASE_URL}/task`,
          {
            params: {
              "isAdmin": isAdmin,
              "userId": userId
            }
          }
        );
        setTasksOverview(taskOverviewResponse.data);
      } catch (error) {
        console.log('Error fetching overview data:', error);
      }
    };

    fetchData();
  }, [userId]);

  // useEffect(() => {
  //   // Fetch project and tasks overview data from the backend
  //   const fetchData = async () => {
  //     try {
  //       const projectOverviewResponse = await axios.get(
  //         `${BASE_URL}/projects/overview/${userId}`
  //       );
  //       const taskOverviewResponse = await axios.get(
  //         `${BASE_URL}/tasks/overview/${userId}`
  //       );

  //       setProjectsOverview(projectOverviewResponse.data);
  //       setTasksOverview(taskOverviewResponse.data);
  //     } catch (error) {
  //       console.log('Error fetching overview data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [userId]);

  const handleProjectButtonPress = () => {
    navigation.navigate('Projects');
  };

  const handleTasksButtonPress = () => {
    navigation.navigate('Tasks');
  };

  return (
    <View style={styles.container}>
      <Text>
        Hello {userEmail} {isAdmin ? '(Admin)' : ''}
      </Text>
      <Text style={styles.title}>Dashboard</Text>
      {isAdmin && (
        <View style={styles.card}>
          <Text style={styles.titleText}>My Projects Overview</Text>
          <Text>Total Projects: {projectsOverview.totalProjects || 0}</Text>
          <Text>Total Cost: ${projectsOverview.totalCost || 0}</Text>
          <Text>Total Hours: {projectsOverview.totalHours || 0}</Text>
          <Text>Completed Projects: {projectsOverview.completedProjects || 0}</Text>
          <Text>In-Progress Projects: {projectsOverview.inProgressProjects || 0}</Text>
          <Text>Total Tasks: {projectsOverview.totalTasks || 0}</Text>
          <Text>Completed Tasks: {projectsOverview.completedTasks || 0}</Text>
          <Text>In-Progress Tasks: {projectsOverview.inProgressTasks || 0}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleProjectButtonPress()}
              style={styles.cardbuttonProjects}
            >
              <Text style={styles.buttonTextProjects}>Projects</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.TasksCard}>
        <Text style={styles.titleText}>My Tasks Overview</Text>
        <Text>Total Tasks: {tasksOverview.totalTasks || 0}</Text>
        <Text>Completed Tasks: {tasksOverview.completedTasks || 0}</Text>
        <Text>In-Progress Tasks: {tasksOverview.inProgressTasks || 0}</Text>
        <Text>Total Cost: ${tasksOverview.totalCost || 0}</Text>
        <Text>Total Hours: {tasksOverview.totalHours || 0}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleTasksButtonPress()}
            style={styles.cardbuttonTasks}
          >
            <Text style={styles.buttonTextTasks}>Tasks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DashboardScreen;


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
    paddingTop: 5,
    paddingBottom: 5,
  },
  titleText: {
    fontSize: 18,
    paddingBottom: 5,
  },
  projectContainer: {
    padding: 10,
  },
  list: {
    marginTop: 20,
  },
  card: {
    backgroundColor: '#F0FFF0',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#90EE90',
    padding: 10,
  },
  TasksCard: {
    backgroundColor: '#F0FFFF',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ADD8E6',
    padding: 10,
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
  cardbuttonProjects: {
    borderWidth: 1,
    borderColor: '#009900',
    width: '30%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonTextProjects: {
    color: '#009900',
    fontWeight: '700',
    fontSize: 16,
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
  cardbuttonComplete: {
    backgroundColor: '#009900',
    width: '30%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  disabledButtonTitle: {
    color: 'gray',
  },
})
