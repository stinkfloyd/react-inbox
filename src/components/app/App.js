import React, { Component } from 'react'
import './App.css'
import Toolbar from '../Toolbar/Toolbar'
import Messages from '../Messages/Messages'
import ComposeMessage from '../ComposeMessage/ComposeMessage'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
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

  getMessages = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}`)
    let resJson = await response.json()
    this.setState({
      ...this.state,
      messages: resJson
    })
  }

  updateMessages = async (payload) => {
    await this.request(process.env.REACT_APP_API_URL, 'PATCH', payload)
  }

  toggleMessageProperty = (message, property) => {
    const index = this.state.messages.indexOf(message)
    this.setState({
      messages: [
        ...this.state.messages.slice(0, index),
        { ...message, [property]: !message[property] },
        ...this.state.messages.slice(index + 1),
      ]
    })
  }

  toggleStar = async (message) => {
    await this.updateMessages({
      "messageIds": [message.id],
      "command": "star",
      "star": message.starred
    })

    this.toggleMessageProperty(message, 'starred')
  }

  toggleSelect = async (message) => {
    this.toggleMessageProperty(message, 'selected')
  }

  toggleSelectAll = () => {
    const selectedMessages = this.state.messages.filter(message => message.selected)
    const selected = selectedMessages.length !== this.state.messages.length
    this.setState({
      messages: this.state.messages.map(message => (
        message.selected !== selected ? { ...message, selected } : message
      ))
    })
  }

  markRead = async () => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "read",
      "read": true
    })

    this.setState({
      messages: this.state.messages.map(message => (
        message.selected ? { ...message, read: true } : message
      ))
    })
  }

  markUnread = async () => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "read",
      "read": false
    })

    this.setState({
      messages: this.state.messages.map(message => (
        message.selected ? { ...message, read: false } : message
      ))
    })
  }

  deleteMessages = async () => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "delete"
    })

    const messages = this.state.messages.filter(message => !message.selected)
    this.setState({ messages })
  }

  addLabel = async (label) => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "addLabel",
      "label": label
    })

    const messages = this.state.messages.map(message => (
      message.selected && !message.labels.includes(label) ?
        { ...message, labels: [...message.labels, label].sort() } :
        message
    ))
    this.setState({ messages })
  }

  removeLabel = async (label) => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "removeLabel",
      "label": label
    })

    const messages = this.state.messages.map(message => {
      const index = message.labels.indexOf(label)
      if (message.selected && index > -1) {
        return {
          ...message,
          labels: [
            ...message.labels.slice(0, index),
            ...message.labels.slice(index + 1)
          ]
        }
      }
      return message
    })
    this.setState({ messages })
  }

  toggleCompose = () => {
    this.setState({ composing: !this.state.composing })
  }

  sendMessage = async (message) => {
    const response = await this.request('/api/messages', 'POST', {
      subject: message.subject,
      body: message.body,
    })
    const newMessage = await response.json()

    const messages = [...this.state.messages, newMessage]
    this.setState({
      messages,
      composing: false,
    })
  }

  render = () => {
    return (
      <div>
        <div className="navbar navbar-default" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="/">Tzavaras Inbox Project</a>
            </div>
          </div>
        </div>

        <div className="container">
          <Toolbar messages={this.state.messages} markAsRead={this.markRead} markAsUnread={this.markUnread} deleteMessages={this.deleteMessages} toggleSelectAll={this.toggleSelectAll} toggleCompose={this.toggleCompose} applyLabel={this.addLabel} removeLabel={this.removeLabel} />
          {
            this.state.composing ?
              <ComposeMessage sendMessage={this.sendMessage} /> :
              null
          }
          <Messages messages={this.state.messages} toggleSelect={this.toggleSelect} toggleStar={this.toggleStar} />
        </div>
      </div>
    )
  }
}
