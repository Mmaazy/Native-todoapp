import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Modal,
  Alert,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ToDoApp1 = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title1, setTitle1] = useState('');
  const [description1, setDescription1] = useState('');
  const [todos, setTodos] = useState([
    {id: 1, task: 'Test title', desc: 'Test description', completed: true},
  ]);
  const [searchData, setSearchData] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getTodosFromLocalStorage();
  }, []);

  useEffect(() => {
    saveToLocalStorage(todos);
  }, [todos]);

  const openModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    if (searchText === '') {
      setSearchData(null);
    } else {
      console.log(searchText);

      const todosData = todos.filter(item => item.task.includes(searchText));
      setSearchData(todosData);
    }
  }, [searchText]);

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listitem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: 'blue',
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}:
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: 'blue',
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.desc}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity
            onPress={() => markTodoComplete(todo?.id)}
            style={[styles.actionIcon]}>
            <Icon name="done" size={20} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => deleteTodo(todo?.id)}
          style={[styles.actionIcon, {backgroundColor: 'red'}]}>
          <Icon name="delete" size={25} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const saveToLocalStorage = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (e) {
      console.log(e);
    }
  };

  const getTodosFromLocalStorage = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = () => {
    if (title1 == '' && description1 == '') {
      Alert.alert('Error', 'Please input todo');
    } else {
      const newTodo = {
        id: Math.random(),
        task: title1,
        desc: description1,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTitle1('');
      setDescription1('');
      setModalVisible(!modalVisible);
    }
  };

  const markTodoComplete = todoId => {
    const newTodos = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: true};
      } else {
        return item;
      }
    });
    setTodos(newTodos);
  };

  const deleteTodo = todoId => {
    const newTodos = todos.filter(item => item.id != todoId);
    setTodos(newTodos);
  };

  return (
    <>
      {/* MODAL */}
      <View style={styles.container}>
        <View>
          {modalVisible ? (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TextInput
                    value={title1}
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      backgroundColor: 'grey',
                      borderRadius: 20,
                      width: '100%',
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                    placeholder="Title"
                    onChangeText={text => setTitle1(text)}
                  />
                  <TextInput
                    value={description1}
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      backgroundColor: 'grey',
                      borderRadius: 20,
                      width: '100%',
                      marginTop: 5,
                      marginBottom: 10,
                    }}
                    placeholder="Description"
                    onChangeText={text => setDescription1(text)}
                  />
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={addTodo}>
                    <Text style={styles.textStyle}>Save</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          ) : null}
        </View>

        {/* HEADING */}
        <View style={styles.heading}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}>
            To do application
          </Text>
        </View>

        {/* SEARCH */}
        <View style={styles.inputText}>
          <TextInput
            placeholder="Search"
            onChangeText={value => {
              console.log(value);
              setSearchText(value);
            }}
            style={{marginLeft: 13, fontSize: 20, fontWeight: 'bold'}}
          />
        </View>

        {/* MAIN CONTENT */}
        {searchData === null ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{padding: 20, paddingBottom: 100}}
            data={todos}
            renderItem={({item}) => <ListItem todo={item} />}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{padding: 20, paddingBottom: 100}}
            data={searchData}
            renderItem={({item}) => <ListItem todo={item} />}
          />
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Button
            onPress={openModal}
            title="Add notes"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  heading: {
    alignItems: 'center',
    height: '5%',
  },
  inputText: {
    width: '100%',
    borderRadius: 50,
    backgroundColor: 'grey',
  },
  content: {
    marginTop: 10,
    height: '80%',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#841584',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  listitem: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
});

export default ToDoApp1;
