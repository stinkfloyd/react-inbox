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
  // Makes the request to the API. Method is defaulted to GET and Body is null.
  request = async (method = 'GET', body = null) => {
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
  // When app component mounts, get the messages.
  componentDidMount = async () => {
    this.getMessages()
  }
  // Requests the messages from the API then sets the state.
  getMessages = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}`)
    let resJson = await response.json()
    this.setState({
      ...this.state,
      messages: resJson
    })
  }
  // Updates the messages with the attached payload.
  updateMessages = async (payload) => {
    await this.request('PATCH', payload)
  }
  // Finds a message in the state, and then toggles the given message's property value to be the opposite value.
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
  // This function handles the star in the inbox. Keeps the state and the information on the database in sync. The function will call the API to update the starred property with the "star" command and then toggle the state of the message property starred. 
  toggleStar = async (message) => {
    await this.updateMessages({
      "messageIds": [message.id],
      "command": "star",
      "star": message.starred
    })

    this.toggleMessageProperty(message, 'starred')
  }
  // This function handles the selection of messages in the inbox. The function will toggle the state of which messages are selected indivually. 
  toggleSelect = async (message) => {
    this.toggleMessageProperty(message, 'selected')
  }
  // This function handles the selection of messages in the inbox via the select-all button. When called, if no messages are previously selected then it will toggle all messages selected, if some are previously selected it will select the rest, and if all messages are selected it will unselect all messages.
  toggleSelectAll = () => {
    const selectedMessages = this.state.messages.filter(message => message.selected)
    const selected = selectedMessages.length !== this.state.messages.length
    this.setState({
      messages: this.state.messages.map(message => (
        message.selected !== selected ? { ...message, selected } : message
      ))
    })
  }
  // This function handles the read property of selected messages in the inbox. Keeps the state and the information on the database in sync. The function will call the API to update the read property with the "read" command to true and then toggle the state of the selected message property read to true. 
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
  // This function handles the read property of selected messages in the inbox. Keeps the state and the information on the database in sync. The function will call the API to update the read property with the "read" command to false and then toggle the state of the selected message property read to false. 
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
  // Simply deletes the message from the inbox. Uses the API command delete, then updates state.
  deleteMessages = async () => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "delete"
    })

    const messages = this.state.messages.filter(message => !message.selected)
    this.setState({ messages })
  }
  // This handles the add label functionality of the inbox. Updates selected messages with the given label with an API call command "add label", then updates the state.
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
  // This handles the remove label functionality of the inbox. Removes selected label from the given message with an API call command "add label", then updates the state.
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
  // Shows or Hides the compose component.
  toggleCompose = () => {
    this.setState({ composing: !this.state.composing })
  }
  // POST request to API then update state.
  sendMessage = async (message) => {
    const response = await this.request('POST', {
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
  // HTML from style guide, with correct updates for assignment.
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
            // If composing is true, show component 'ComposeMessage'
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
