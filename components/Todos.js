import React, { Component } from 'react';
import {
  PixelRatio,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import {ListView} from 'realm/react-native';

import realm from '../utils/realm';

export default class Todos extends Component {
  constructor(props) {
    super(props);
    this.state = {pressed: false}
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.state = {
      newTask: '',
      dataSource: dataSource.cloneWithRows(realm.objects('Todo'))
    }

    this._renderTodo            = this._renderTodo.bind(this)
    this._handleTextInputChange = this._handleTextInputChange.bind(this)
    this._addTodo               = this._addTodo.bind(this)
  }

  _renderTodo(todo) {
    return (
      <View style={styles.row}>
        <TouchableHighlight onPress={()=>{
          realm.write(()=>{
            todo.completed = !todo.completed

            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(realm.objects('Todo'))
            })
          })
        }}>
          <Text style={[styles.taskText, todo.completed && styles.completed]}>{todo.taks}</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.deleteButton}
          onPress={()=>{
            realm.write(()=>{
              let task = realm.objects('Todo')[0]
              realm.delete(task)

              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(realm.objects('Todo'))
              })
            })
          }}
        >
          <Text style={styles.buttonText}>X</Text>
        </TouchableHighlight>
      </View>
    )
  }

  _handleTextInputChange(newTask) {
    this.setState({newTask})
  }

  _addTodo() {
    let {newTask} = this.state

    realm.write(()=>{
      realm.create('Todo',{
        taks: newTask
      })
    })

    this.setState({
      newTask: '',
      dataSource: this.state.dataSource.cloneWithRows(realm.objects('Todo'))
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.newTodoWrapper}>
          <TextInput
            style={styles.newTodoField}
            value={this.state.newTask}
            onChangeText={this._handleTextInputChange}
            onSubmitEditing={this._addTodo}
          />
          <TouchableHighlight
            style={this.state.pressed ? styles.pressButton : styles.addButton}
            onPress={this._addTodo}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
        </View>

        <TouchableHighlight
          style={styles.clearButton}
          onPress={()=>{
            realm.write(()=>{
              let tasks = realm.objects('Todo')
              realm.delete(tasks)

              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(realm.objects('Todo'))
              })
            })
          }}
        >
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableHighlight>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderTodo}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  newTodoWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  newTodoField: {
    flex: 1,
    height: 40,
    marginTop: 10,
    fontFamily: 'Avenir Next',
    paddingLeft: 10
  },
  addButton: {
    marginTop: 10,
    backgroundColor: 'white',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pressButton: {
    backgroundColor: 'white'
  },
  buttonText: {
    color: 'black',
    fontFamily: 'Avenir Next'
  },
  clearButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'red',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10
  },
  clearText: {
    fontFamily: 'Avenir Next',
    textAlign: 'center',
    color: 'red'
  },
  taskText: {
    fontFamily: 'Avenir Next',
    color: 'gray'
  },
  row: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 5,
    paddingRight: 15,
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#AAA'
  },
  completed: {
    textDecorationLine: 'line-through'
  }
})
