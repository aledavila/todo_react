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
      <View style={[styles.row, todo.completed && styles.completed]}>
        <TouchableHighlight onPress={()=>{
          realm.write(()=>{
            todo.completed = !todo.completed

            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(realm.objects('Todo'))
            })
          })
        }}>
          <Text>{todo.taks}</Text>
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
            style={styles.button}
            onPress={this._addTodo}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
        </View>

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
  row: {
    height: 40,
    justifyContent: 'center',
    borderBottomColor: '#AAA',
    borderBottomWidth: 1 / PixelRatio.get(),
    marginLeft: 16,
    backgroundColor: 'red'
  },
  completed: {
    backgroundColor: 'green'
  },
  newTodoWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16
  },
  newTodoField: {
    borderWidth: 1,
    flex: 1
  },
  button: {
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white'
  }
})
