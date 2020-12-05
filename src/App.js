import React, { Component } from 'react';
import Main from './main.js';
import Chats from './chats.js'
import Chat from './chat.js'
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <html lang="en">
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous"></link>
          <title>Simple Messager</title>
        </head>
        <body>
          <div>
            <Router basename={process.env.PUBLIC_URL}>
              <div className="App">
                <header className="App-header">
                  <div class="text-center">
                    <Link to="/"><h1>Simple Messenger</h1></Link>
                  </div>
                </header>
                <Switch>
                  <Route exact path='/' component={Main} />
                  <Route exact path='/chats' component={Chats} />
                  <Route exact path='/chat/:id' component={Chat} />
                </Switch>
              </div>
            </Router>
          </div>
          <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>
        </body>
      </html>
    );
  }
}

export default App;
