import {
  configureStore,
  createSlice,
  getDefaultMiddleware,
  PayloadAction,
} from '@reduxjs/toolkit'
import logger from 'redux-logger'
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

// interfaces or types to use
type IdPayloadType = {
  id: string
}

type DescPayloadType = {
  desc: string
}

type IdDescPayloadType = IdPayloadType & DescPayloadType

type IsCompletePayloadType = {
  isComplete: boolean
}

type IdIsCompletePayloadType = IdPayloadType & IsCompletePayloadType

type WholeTodoType = IdDescPayloadType & IsCompletePayloadType

const findElemByIdInTodoArray = (arr: Array<Todo>, key: string) => {
  return arr.find(elem => elem.id === key)
}

// slices
const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    // create: (state, { payload }: PayloadAction<DescPayloadType>) => {},
    create: {
      reducer: (state, { payload }: PayloadAction<WholeTodoType>) => {
        state.push(payload)
      },
      prepare: ({ desc }: DescPayloadType) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
    },
    edit: (state, action: PayloadAction<IdDescPayloadType>) => {
      const { payload } = action
      const editedTodo = findElemByIdInTodoArray(state, payload.id)
      //state.find(todo => todo.id === payload.id)

      if (editedTodo) {
        editedTodo.desc = payload.desc
      }
    },
    remove: (state, { payload }: PayloadAction<IdPayloadType>) => {
      const deletedTodoIdx = state.findIndex(todo => todo.id === payload.id)

      if (deletedTodoIdx !== -1) {
        state.splice(deletedTodoIdx, 1)
      }
    },
    toggle: (state, { payload }: PayloadAction<IdIsCompletePayloadType>) => {
      const toggledTodo = findElemByIdInTodoArray(state, payload.id)
      // state.find(todo => todo.id === payload.id)

      if (toggledTodo) {
        toggledTodo.isComplete = payload.isComplete
      }
    },
  },
})

const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState: null as string | null,
  reducers: {
    select: (_state, { payload }: PayloadAction<IdPayloadType>) => payload.id,
  },
})

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {}, // doesn't have its own state and so reducers
  extraReducers: {
    [todosSlice.actions.create.type]: state => state + 1,
    [todosSlice.actions.edit.type]: state => state + 1,
    [todosSlice.actions.toggle.type]: state => state + 1,
    [todosSlice.actions.remove.type]: state => state + 1,
  },
})

// also export our actions
export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todosSlice.actions

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions

// combine reducers by just using an objec/map notation
const rootReducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
}

// create store
export default configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), logger],
})
