import * as React from 'react';
import { Todo } from './App';

interface Props {
  todos: Todo[];
  onToggle: (todo: Todo) => void;
}

export default class TodoList extends React.Component<Props> {
  render() {
    const { todos } = this.props;
    return (
      <ul>
      {todos.map(todo => {
        return (<li key={todo.id}>
          <input type="checkbox" onClick={() => this.props.onToggle(todo)} checked={todo.completed} /> {todo.text}
        </li>);
      })}
      </ul>
    );
  }
}
