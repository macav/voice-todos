import * as React from 'react';
import './App.css';

const logo = require('./logo.svg');

interface SpeechRecognition {
  continous: boolean;
  interimResults: boolean;
  onresult: Function;
  onend: Function;
  lang: string;
  start: Function;
  stop: Function;

  new(): this;
}

interface SpeechWindow extends Window {
  webkitSpeechRecognition: SpeechRecognition;
  id: number;
}

interface SpeechSubresult {
  transcript: string;
  confidence: number;
}

interface SpeechResult {
  isFinal: boolean;
  results: SpeechSubresult[];
}

interface SpeechEvent {
  results?: SpeechResult[];
}

interface State {
  recognizing: boolean;
  result?: string;
  todos: Todo[];
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

(window as SpeechWindow).id = 0;

class App extends React.Component<{} | undefined, State> {
  recognition: SpeechRecognition;
  input: HTMLInputElement | null;

  constructor(props?: {}) {
    super(props);
    this.state = { recognizing: false, todos: [] };
  }

  componentDidMount() {
    this.input!.focus();
  }

  startRecording = () => {
    this.recognition = new (window as SpeechWindow).webkitSpeechRecognition();
    this.recognition.continous = true;
    console.log('starting');
    this.recognition.interimResults = true;
    this.recognition.onresult = (event: SpeechEvent) => {
      if (!event.results) {
        return;
      }
      console.log(event.results);
      const firstResult = event.results[0];
      if (!firstResult.isFinal) {
        return;
      }
      this.setState({ result: firstResult[0].transcript });
    };
    this.recognition.onend = () => {
      this.setState({ recognizing: false });
    };
    this.recognition.lang = 'en-US';
    this.recognition.start();
    this.setState({ recognizing: true });
  }

  stopRecording = () => {
    this.setState({ recognizing: false });
    this.recognition.stop();
  }

  toggleRecording = () => {
    this.state.recognizing ? this.stopRecording() : this.startRecording();
  }

  addTodo = (text: string) => {
    const todos = this.state.todos;
    todos.push({ id: (window as SpeechWindow).id++, text: text, completed: false });
    this.setState({ todos });
    this.input!.value = '';
    this.input!.focus();
    console.log(this.state.todos);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <button onClick={this.toggleRecording}>{this.state.recognizing ? 'Stop' : 'Start'} recording</button>
        </p>
        {this.state.result && <p>{this.state.result}</p>}
        <form onSubmit={event => { this.addTodo(this.input!.value); event.preventDefault(); }}>
          <input ref={node => this.input = node} />
          <button type="submit">Add</button>
        </form>
        <ul>
          {this.state.todos.map(todo => {
          return (<li key={todo.id}><input type="checkbox" checked={todo.completed}/> {todo.text}</li>);
          })}
        </ul>
      </div>
    );
  }
}

export default App;
