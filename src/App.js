import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import MyApp from './MyApp';
function App() {
  return (
    <Provider store={store}>
      <MyApp />
    </Provider>
  );
}

export default App;


