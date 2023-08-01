import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import axios from 'axios';
import { UserContext } from '../UserContext';
import baseurl from '../../constant';

const API_BASE_URL = baseurl; 
 //const API_BASE_URL = 'http://192.168.2.38:5001';
//const API_BASE_URL = "http://localhost:5001"

const TasksScreen = () => {
  const { userId, setUserId, userEmail, setUserEmail, isAdmin, setIsAdmin } =
    useContext(UserContext)
  const [isTaskModalVisible, setTaskModalVisible] = useState(false)
  const [isAddHoursModalVisible, setAddHoursModalVisible] = useState(false)
  const [tasksList, setTasksList] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState('')
  const [projectTasks, setProjectTasks] = useState([])
  const [selectedDependencyTask, setSelectedDependencyTask] = useState(0)
  const [assignedTo, setAssignedTo] = useState('')
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [hourlyRate, setHourlyRate] = useState('')
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [hoursWorked, setHoursWorked] = useState('')
  const [currentHours, setcurrentHours] = useState('')
  const titleInputRef = useRef(null)
  const hoursWorkedInputRef = useRef(null)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [selectedHourlyRate, setselectedHourlyRate] = useState(0)
  const [showMyTasks, setShowMyTasks] = useState(false)
  const [tasksCount, setTasksCount] = useState('')

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/task`, {
        params: {
          "isAdmin": isAdmin,
          "userId": userId
        }
      });
      //console.log("sdfsdfsdfsdfsdF", response.data)
      const tasksList = response.data.filteredTasks?.map((task) => {
        return {
          id: task._id,
          title: task.title,
          description: task.description,
          projectId: task.projectId,
          selectedDependencyTask: task.selectedDependencyTask?._id,
          startDate: new Date(task.startDate),
          endDate: new Date(task.endDate),
          hourlyRate: task.hourlyRate,
          assignedTo: task.assignedToUserId,
          status: task.status,
          hourlyrate: task.hourlyRate,
          hoursworked: task.hoursWorked,
          cost: task.totalCost,
          startDate: new Date(task.startDate)?.toLocaleDateString(),
          endDate: new Date(task.endDate)?.toLocaleDateString(),
          createdByUserId: task.createdByUserId,
          completedByUserId: task.completedByUserId,
          completedBy: task.completedBy,
          completedDateTime: task.completedDateTime,
        };
      });
      const sortedTasks = tasksList.sort((a, b) => b.id - a.id);
      setTasksList(sortedTasks);
      setTasksCount(sortedTasks.length);
    } catch (error) {
      console.log('Error fetching Tasks:', error);
    }
  };

  // const fetchProjects = async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/projects`);
  //     const projectsList = response.data.map((project) => {
  //       return {
  //         id: project._id,
  //         title: project.title,
  //         adminid: project.adminId,
  //         adminemail: project.email,
  //         totalHours: project.totalHours,
  //         totalCost: project.totalCost,
  //         status: project.status,
  //       };
  //     });
  //     setProjectsList(projectsList);
  //   } catch (error) {
  //     console.log('Error fetching Projects:', error);
  //   }
  // };

  // const fetchUsers = async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/users`);
  //     const usersList = response.data.map((user) => {
  //       return {
  //         id: user._id,
  //         email: user.email,

  //       };
  //     });
  //     setUsersList(usersList);
  //   } catch (error) {
  //     console.log('Error fetching Users:', error);
  //   }
  // };

  useEffect(() => {
    fetchTasks();
    // fetchProjects();
    // fetchUsers();
  }, []);

  const toggleTaskModal = () => {
    setTaskModalVisible(!isTaskModalVisible);
  };

  const handleCreateTask = async () => {
    if (
      title.trim() === '' ||
      description.trim() === '' ||
      projectId === '' ||
      startDate === '' ||
      endDate === '' ||
      hourlyRate === '' ||
      assignedTo === ''
    ) {
      Alert.alert('Missing Details', 'Please enter all the details of the task.');
    } else {
      const newTask = {
        title,
        description,
        projectId,
        selectedDependencyTask,
        startDate,
        endDate,
        createdByUserId: userId,
        assignedTo,
        completedByUserId: '',
        completedDateTime: '',
        status: 'In Progress',
        hourlyRate,
        hoursWorked: 0,
        totalCost: 0,
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/tasks`, newTask);
        console.log('New task created with ID:', response.data._id);
      } catch (error) {
        console.log('Error creating task:', error);
      }

      // Reset the form fields
      setTitle('');
      setDescription('');
      setProjectId('');
      setStartDate(new Date());
      setEndDate(new Date());
      setHourlyRate('');
      setAssignedTo('');
      // Close the modal
      toggleTaskModal();
      fetchTasks();
      fetchProjects();
      fetchUsers();
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await axios.get(`${API_BASE_URL}/task`,
        {
          params: {
            "projectId": projectId,
            "userId": userId,
          }
        }
      ).then((response) => {
        let depTask = response.data.filteredTasks?.find((task) => task._id === taskId)?.dependencyTaskId;
        console.log("depTask", depTask)
        if (depTask != null && depTask != 'Completed') {
          Alert.alert('Error', 'Depedency task is not completed.')
          return;
        }
      })

      await axios.put(`${API_BASE_URL}/task/complete/${taskId}`,
        {
          "userId": userId,
        }
      )
        .then((response) => {
          console.log('Task marked as complete successfully.')
        }
        ).catch((error) => {
          console.log('Error marking task as complete: ', error)
        })

    } catch (error) {
      console.log('Error fetching task details:', error);
    }
    // Check if the task has any dependencies


    // db.transaction((tx) => {
    //   tx.executeSql(
    //     `SELECT Tasks.id as id, Tasks.hoursWorked as hoursWorked, DepTasks.id as depid,  DepTasks.status as depstatus
    //      FROM tasks Tasks
    //      LEFT JOIN tasks DepTasks 
    //      ON Tasks.dependencyTaskId = DepTasks.id
    //      WHERE Tasks.id  = ?`,
    //     [taskId],
    //     (_, { rows }) => {
    //       if (rows.length > 0) {
    //         const results = rows._array
    //         if (
    //           results[0].depstatus != null &&
    //           results[0].depstatus != 'Completed'
    //         ) {
    //           Alert.alert('Error', 'Depedency task is not completed.')
    //         } else if (results[0].hoursWorked > 0) {
    //           // Update the task status to 'Complete' in the database
    //           tx.executeSql(
    //             'UPDATE tasks SET status = ?, completedByUserId = ?, completedDateTime = CURRENT_TIMESTAMP WHERE id = ?',
    //             ['Completed', userId, taskId],
    //             (tx, results) => {
    //               if (results.rowsAffected > 0) {
    //                 console.log(`Task with ID ${taskId} marked as complete.`)
    //                 // Perform any additional actions or updates after marking the task as complete
    //               } else {
    //                 console.log(`No task found with ID ${taskId}.`)
    //               }
    //             },
    //             (tx, error) => {
    //               console.log('Error updating task status: ', error)
    //             }
    //           )
    //         } else {
    //           Alert.alert('Error', 'No working hours added to task.')
    //         }
    //       } else {
    //         // Alert.alert('Error', 'No Data available')
    //       }
    //     },
    //     (tx, error) => {
    //       console.log('Error fetching projects: ', error)
    //     }
    //   )
    // })

    // Refresh the task list or perform any other necessary actions
    fetchTasks()
  }

  const handleAddHours = async () => {
    if (hoursWorked.trim() === '') {
      Alert.alert('Missing Details', 'Please enter no of hours worked.')
    } else {
      // Update the task's hours worked in the database
      axios.put(`${API_BASE_URL}/task/hours-worked/${selectedTaskId}`, {
        "hoursWorked": hoursWorked,
      }).then((response) => {
        console.log('Task hours worked updated successfully.')
      }).catch((error) => {
        console.log('Error updating task hours worked: ', error)
      })


      // db.transaction((tx) => {
      //   const newHours = parseFloat(hoursWorked) + parseFloat(currentHours)
      //   const newCost = parseFloat(selectedHourlyRate) * parseFloat(newHours)

      //   tx.executeSql(
      //     'UPDATE tasks SET hoursWorked = ?, totalCost = ? WHERE id = ?',
      //     [newHours, newCost, selectedTaskId],
      //     (tx, results) => {
      //       if (results.rowsAffected > 0) {
      //         // Refresh the task list or perform any other necessary actions
      //       } else {
      //         console.log(`No task found with ID ${selectedTaskId}.`)
      //       }
      //     },
      //     (tx, error) => {
      //       console.log('Error updating task hours worked: ', error)
      //     }
      //   )
      // })
      fetchTasks()
      // Reset the hoursWorked state
      setHoursWorked('')
      setcurrentHours(0)
      setselectedHourlyRate(0)
      setSelectedTaskId('')
      toggleAddHoursModal()
    }
  }

  const handleOpenAddHoursModal = async (taskId, hoursWorked, hourlyRate, projectId) => {
    try {
      await axios.get(`${API_BASE_URL}/task`,
        {
          params: {
            "projectId": projectId,
            "userId": userId,
          }
        }
      ).then((response) => {
        let depTask = response.data.filteredTasks?.find((task) => task._id === taskId)?.dependencyTaskId;
        console.log("depTask", depTask)
        if (depTask != null && depTask != 'Completed') {
          Alert.alert('Error', 'Depedency task is not completed.')
          return;
        }
        setSelectedTaskId(taskId)
        setselectedHourlyRate(hourlyRate)
        if (hoursWorked !== null) {
          setcurrentHours(hoursWorked)
        } else {
          setcurrentHours(0)
        }
        setAddHoursModalVisible(true)
      })

    } catch (error) {
      console.log('Error fetching task details:', error);
    }
  }

  const toggleAddHoursModal = () => {
    setAddHoursModalVisible(!isAddHoursModalVisible)
    setHoursWorked('')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      <Text style={styles.subtitle}>Total Tasks: {tasksCount}</Text>

      <FlatList
        data={tasksList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.taskItem, { backgroundColor: '#eef', padding: 20, borderWidth: 1, borderRadius: 20 }]}>
            {isCompleted = item.status === 'Completed'}
            {isAssigned = item.assignedTo === userId}
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <Text style={styles.taskProperty}>Start Date: {item.startDate}</Text>
            <Text style={styles.taskProperty}>End Date: {item.endDate}</Text>
            <Text style={styles.taskProperty}>Hourly Rate: ${item.hourlyRate}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
              {!isCompleted && isAssigned && (
                <TouchableOpacity
                  onPress={() =>
                    handleOpenAddHoursModal(
                      item.id,
                      item.hoursworked,
                      item.hourlyrate,
                      item.projectId
                    )
                  }
                  style={styles.cardbuttonTasks}
                >
                  <Text style={styles.buttonTextTasks}>Add Hours</Text>
                </TouchableOpacity>
              )}
              {!isCompleted && isAssigned && (
                <TouchableOpacity
                  onPress={() => handleComplete(item.id)}
                  style={styles.cardbuttonComplete}
                  disabled={isCompleted}
                >
                  <Text style={styles.buttonTextComplete}>Complete</Text>
                </TouchableOpacity>)}
            </View>
          </TouchableOpacity>

        )}
      />

      {isAdmin && (<TouchableOpacity style={styles.addButton} onPress={toggleTaskModal}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>)}

      {/* Task Modal */}
      <Modal visible={isTaskModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          {/* ... Add other input fields for creating a new task ... */}
          <TouchableOpacity style={styles.addButton} onPress={handleCreateTask}>
            <Text style={styles.addButtonText}>Create Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={toggleTaskModal}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={isAddHoursModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Hours Worked</Text>
            <TextInput
              style={styles.input}
              ref={hoursWorkedInputRef}
              placeholder="Enter hours worked"
              value={hoursWorked}
              onChangeText={setHoursWorked}
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddHours}
              >
                <Text style={styles.addButtonLabel}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={toggleAddHoursModal}
              >
                <Text style={styles.cancelButtonLabel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    borderWidth: 2,
    borderColor: 'gray',
    padding: 20,
    margin: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  addButton: {
    backgroundColor: '#0782F9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  dateInput: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    marginBottom: 4,
  },
  dateInputLabel: {
    fontSize: 16,
    color: 'gray',
  },
  toggleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  dependencyContainer: {
    marginTop: 16,
  },
  dependencyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dependencyTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  dependencyDescription: {
    fontSize: 12,
    color: '#888888',
  },
})

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginTop: 8,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginTop: 8,
  },
  placeholder: {
    color: 'gray',
  },
}

export default TasksScreen;
