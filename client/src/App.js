import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Grommet } from 'grommet'; 
import theme from 'theme.js';
import Header from 'components/layout/header.js';
import Body from 'components/layout/body.js';
import Router from 'components/pages/router.js';

function App() {
  return (
    <Grommet theme={theme} full>
      <div className="App">
        <Header/>
        <Body>
          <Router/>
        </Body>
      </div>
    </Grommet>
  );
}

export default App;
