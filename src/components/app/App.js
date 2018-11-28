import React, { Component } from 'react';
import './App.css';
import Toolbar from '../toolbar/toolbar';
import Messages from '../Messages/Messages';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  toggleProperty(message, property) {
    const index = this.state.messages.indexOf(message)
    this.setState({
      messages: [
        ...this.state.messages.slice(0, index),
        { ...message, [property]: !message[property] },
        ...this.state.messages.slice(index + 1),
      ]
    })
  }

  toggleSelect = async (message) => {
    this.toggleProperty(message, 'selected')
  }

  toggleStar = async (message) => {
    await this.updateMessages({
      "messageIds": [message.id],
      "command": "star",
      "star": message.starred
    })

    this.toggleProperty(message, 'starred')
  }

  async updateMessages(payload) {
    await this.request(process.env.REACT_APP_API_URL, 'PATCH', payload)
  }

  getMessages = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}`)
    let resJson = await response.json()
    this.setState({
      ...this.state,
      messages: resJson
    })
  }

  request = async (path, method = 'GET', body = null) => {
    if (body) body = JSON.stringify(body)
    return await fetch(process.env.REACT_APP_API_URL, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body
    })
  }

  componentDidMount = async () => {
    this.getMessages()
  }

  render() {
    return (
      <div className="App">
        <Toolbar />
        <Messages
          messages={this.state.messages}
          toggleSelect={this.toggleSelect}
          toggleStar={this.toggleStar}
        />
      </div>
    );
  }
}
