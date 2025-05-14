// src/components/TodoDetail.tsx

import React, { useEffect, useState } from 'react';

import { Todo } from '../types/todo-type';

interface TodoDetailProps {
  todoId: number;
}
/**
 * TodoDetail component fetches and displays the details of a specific todo item based on the provided todoId.
 * It uses the useEffect hook to fetch the todo details from the API when the component mounts or when the todoId changes.
 * @param todoId - The ID of the todo item to fetch and display.
 */
export const TodoDetail: React.FC<TodoDetailProps> = ({ todoId }) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Replace with the actual todoId you want to fetch
  useEffect(() => {
    const fetchTodo = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        );
        if (!response.ok) {
          throw new Error('HTTP error! Status: ' + response.status);
        }
        const todoData: Todo = await response.json();
        setTodo(todoData);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      }
      setLoading(false);
    };
    fetchTodo();
  }, [todoId]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading todo: {error}</div>;
  }

  return (
    <div className="todo-detail">
      <h2>Todo Details</h2>
      {todo ? (
        <div>
          <h3>{todo.title}</h3>
          <p>{todo.completed ? 'Completed' : 'Not Completed'}</p>
        </div>
      ) : (
        <p>No todo found.</p>
      )}
    </div>
  );
};
