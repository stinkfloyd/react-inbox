import React, { Component } from 'react';
import './App.css';
import Toolbar from '../toolbar/toolbar';
import MessageList from '../messageList/messageList';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  starCallback = (value, id) => {

  }

  getMessages = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}`)
    let resJson = await response.json()


    this.setState({
      ...this.state,
      messages: resJson
    })
  }

  componentDidMount = async () => {
    await this.getMessages()
  }

  render() {
    return (
      <div className="App">
        <Toolbar />
        <MessageList starCallback={this.starCallback} messages={this.state.messages} />
      </div>
    );
  }
}
