import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import App from './App'
// import store from './redux/redux-previous'
import reduxToolkitStore from './redux/redux-toolkit'

ReactDOM.render(
  <Provider store={reduxToolkitStore}>
    <App />
  </Provider>,
  document.getElementById('root')
)
