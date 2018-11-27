import React, { Component } from 'react';
import './App.css';
import Toolbar from '../toolbar/toolbar';
import MessageList from '../messageList/messageList';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  async componentDidMount() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}`)
    let resJson = await response.json()


    this.setState({
      ...this.state,
      messages: resJson
    })
  }

  render() {
    return (
      <div className="App">
        <Toolbar />
        <MessageList messages={this.state.messages} />
      </div>
    );
  }
}

export default App;
