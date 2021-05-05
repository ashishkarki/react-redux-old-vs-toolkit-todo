import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import uuid from 'uuid'

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
