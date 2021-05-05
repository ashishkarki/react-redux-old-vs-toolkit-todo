import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import { v1 as uuid } from 'uuid'
import { Todo } from '../type'

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: 'Learn React',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux-ToolKit',
    isComplete: false,
  },
]

// Constants for Action Types
const CREATE_TODO = 'Create New Todo'
const EDIT_TODO = 'Edit existing Todo'
const TOGGLE_TODO = 'Toggle completion status of a Todo'
const DELETE_TODO = 'Delete a Todo'
const SELECT_TODO = 'Select a Todo'

// Actions with their Types
interface BaseTodoActionType {
  type: string
  payload: {}
}

interface CreateTodoActionType {
  type: typeof CREATE_TODO
  payload: Todo
}

export const createTodoActionCreator = (data: {
  desc: string
}): CreateTodoActionType => {
  const { desc } = data

  return {
    type: CREATE_TODO,
    payload: {
      id: uuid(),
      desc: desc,
      isComplete: false,
    },
  }
}

interface EditTodoActionType {
  type: typeof EDIT_TODO
  payload: { id: string; desc: string }
}

export const editTodoActionCreator = ({
  id,
  desc,
}: {
  id: string
  desc: string
}): EditTodoActionType => {
  return {
    type: EDIT_TODO,
    payload: {
      id: id,
      desc,
    },
  }
}

interface ToggleTodoActionType extends Omit<BaseTodoActionType, 'type'> {
  type: typeof TOGGLE_TODO
  payload: { id: string; isComplete: boolean }
}

export const toggleTodoActionCreator = ({
  id,
  isComplete,
}: {
  id: string
  isComplete: boolean
}): ToggleTodoActionType => {
  return {
    type: TOGGLE_TODO,
    payload: {
      id,
      isComplete,
    },
  }
}

interface DeleteTodoActionType extends Omit<BaseTodoActionType, 'type'> {
  type: typeof DELETE_TODO
  payload: { id: string }
}

export const deleteTodoActionCreator = ({
  id,
}: {
  id: string
}): DeleteTodoActionType => {
  return {
    type: DELETE_TODO,
    payload: {
      id,
    },
  }
}

interface SelectTodoActionType extends Omit<BaseTodoActionType, 'type'> {
  type: typeof SELECT_TODO
  payload: { id: string }
}

export const selectTodoActionCreator = ({
  id,
}: {
  id: string
}): SelectTodoActionType => {
  return {
    type: SELECT_TODO,
    payload: { id },
  }
}

// reducers
type TodoActionTypes =
  | CreateTodoActionType
  | EditTodoActionType
  | ToggleTodoActionType
  | DeleteTodoActionType

const todosReducer = (
  state: Array<Todo> = todosInitialState,
  action: TodoActionTypes
) => {
  switch (action.type) {
    case CREATE_TODO:
      return [...state, action.payload]

    case EDIT_TODO:
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, desc: action.payload.desc }
          : todo
      )

    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, isComplete: action.payload.isComplete }
          : todo
      )

    case DELETE_TODO:
      return state.filter(todo => todo.id !== action.payload.id)

    default:
      return state
  }
}

type SelectedtodoActionTypes = SelectTodoActionType

const selectedTodoReducer = (
  state: string | null = null,
  action: SelectedtodoActionTypes
) => {
  switch (action.type) {
    case SELECT_TODO:
      const { payload } = action
      return payload.id

    default:
      return state
  }
}

const counterReducer = (state: number = 0, action: TodoActionTypes) => {
  switch (action.type) {
    case CREATE_TODO:
      return state + 1

    case EDIT_TODO:
      return state + 1

    case TOGGLE_TODO:
      return state + 1

    case DELETE_TODO:
      return state + 1

    default:
      return state
  }
}

// combine above reducers
const rootReducer = combineReducers({
  todos: todosReducer,
  selectedTodo: selectedTodoReducer,
  counter: counterReducer,
})

// create our redux store
export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, logger))
)
