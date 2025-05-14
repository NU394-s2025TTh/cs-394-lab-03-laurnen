// src/components/TodoList.tsx

import React, { useEffect } from 'react';

import { Todo } from '../types/todo-type';
// todo: id, title, completed

interface TodoListProps {
  onSelectTodo: (id: number) => void;
}
interface FetchTodosParams {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}
/**
 * fetchTodos function fetches todos from the API and updates the state.
 * @param setTodos - React setState Function to set the todos state.
 * @param setFilteredTodos - React setState Function to set the filtered todos state.
 * @param setLoading - react setState Function to set the loading state.
 * @param setError - react setState Function to set the error state.
 *
 * @returns {Promise<void>} - A promise that resolves when the todos are fetched and state is updated.  You should call this in useEffect.
 * setup useEffect to call this function when the component mounts
 * wraps the fetch API call in a try-catch block to handle errors gracefully and update the loading and error states accordingly.
 * The function uses async/await syntax to handle asynchronous operations, making the code cleaner and easier to read.
 * fetch from the URL https://jsonplaceholder.typicode.com/todos
 */
// remove eslint-disable-next-line @typescript-eslint/no-unused-vars when you use the parameters in the function
export const fetchTodos = async ({
  setTodos,
  setFilteredTodos,
  setLoading,
  setError,
}: FetchTodosParams): Promise<void> => {
  try {
    setLoading(true);

    //fetch data from API
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!response.ok) {
      throw new Error('HTTP error! Status: ' + response.status);
    }

    //parse JSON response
    const todos: Todo[] = await response.json();

    //update state
    setTodos(todos);
    setFilteredTodos(todos);
  } catch (error) {
    setError(error instanceof Error ? error.message : String(error));
  } finally {
    setLoading(false);
  }
};

/**
 * TodoList component fetches todos from the API and displays them in a list.
 * It also provides filter buttons to filter the todos based on their completion status.
 * @param onSelectTodo - A function that is called when a todo is selected. It receives the todo id as an argument.
 * @returns
 */

// remove the following line when you use onSelectTodo in the component

export const TodoList: React.FC<TodoListProps> = ({ onSelectTodo }) => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = React.useState<Todo[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<string>('all');

  useEffect(() => {
    fetchTodos({
      setTodos,
      setFilteredTodos,
      setLoading,
      setError,
    });
  }, []);

  // handle filter button clicks
  const handleFilter = (filter: string) => {
    setFilter(filter);
    let filtered: Todo[] = [];
    switch (filter) {
      case 'all':
        filtered = todos;
        setFilter('all');
        break;
      case 'completed':
        filtered = todos.filter((todo) => todo.completed);
        setFilter('completed');
        break;
      case 'open':
        filtered = todos.filter((todo) => !todo.completed);
        setFilter('open');
        break;
    }
    setFilteredTodos(filtered);
  };

  // handle click on todo item

  if (loading) {
    return <div>Loading todos...</div>;
  }
  if (error) {
    return <div>Error loading todos: {error}</div>;
  }

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <p>
        These are the filter buttons. the tests depend on the data-testids; and use
        provided styles. Implement click event handlers to change the filter state and
        update the UI accordingly to show just those todo&apos;s. other hints: you can
        change the styling of the button with <code>className</code> property. if the
        className of a button is &quot;active&quot; it will use the{' '}
        <code> .todo-button.completed</code> CSS style in App.css
      </p>
      <div className="filter-buttons">
        <button
          data-testid="filter-all"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => handleFilter('all')}
        >
          All
        </button>
        <button
          data-testid="filter-open"
          className={filter === 'open' ? 'active' : ''}
          onClick={() => handleFilter('open')}
        >
          Open
        </button>
        <button
          data-testid="filter-completed"
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => handleFilter('completed')}
        >
          Completed
        </button>
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <button
            key={todo.id}
            data-testid={'todo: ' + todo.id}
            className={'todo-button' + (todo.completed ? ' completed' : '')}
            onClick={() => onSelectTodo(todo.id)}
            aria-label={`Select todo: ${todo.title}`}
          >
            <h3>{todo.title}</h3>
            <p>{todo.completed ? ' (completed)' : ' (open)'}</p>
          </button>
        ))}
      </ul>
    </div>
  );
};
