import React, {Component} from 'react'
import axios from 'axios'

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: "",
                      login: "",
                      warning: "",
                      password: ""};
        this.loginInfo = this.loginInfo.bind(this);
        this.passwordInfo = this.passwordInfo.bind(this);
      }
    
      loginInfo(event) {
        this.setState({login: event.target.value});
      }

      passwordInfo(event) {
        this.setState({password: event.target.value});
      }

      login() {
        this.setState({warning: ""})
        if (this.state.login == ""){
          this.setState({warning: "Логин слишком короткий"})
          return
        }
        if (this.state.password == ""){
          this.setState({warning: "Пароль слишком короткий"})
          return
        }
        if (this.state.login.length > 60){
          this.setState({warning: "Логин слишком длинный (60 максимум)"})
          return
        }
        if (this.state.password.length > 60){
          this.setState({warning: "Пароль слишком длинный (60 максимум)"})
          return
        }
        axios.get(`https://simple-messenger-server1.herokuapp.com/check_password?user_name=${this.state.login}&password=${this.state.password}`)
          .then(res => {
            localStorage.setItem('login', this.state.login)
            localStorage.setItem('entered', true)
            this.props.history.push('chats')
          })
          .catch(error => {
            this.setState({ warning: error.response.data.content })
          })
      }

      register() {
        this.setState({warning: ""})
        if (this.state.login == ""){
          this.setState({warning: "Логин слишком короткий"})
          return
        }
        if (this.state.password == ""){
          this.setState({warning: "Пароль слишком короткий"})
          return
        }
        if (this.state.login.length > 60){
          this.setState({warning: "Логин слишком длинный (60 максимум)"})
          return
        }
        if (this.state.password.length > 60){
          this.setState({warning: "Пароль слишком длинный (60 максимум)"})
          return
        }
        axios.get(`https://simple-messenger-server1.herokuapp.com/create_user?user_name=${this.state.login}&password=${this.state.password}`)
          .then(res => {
            localStorage.setItem('login', this.state.login)
            localStorage.setItem('entered', true)
            this.props.history.push('chats')
          })
          .catch(error => {
            this.setState({ warning: error.response.data.content })
          })
        
      }

      render() {
        if (localStorage.getItem('entered'))
          this.props.history.push('chats')
        return (<div>
                  <div class="badge badge-warning text-wrap">
                    {this.state.warning}
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">Введите ваше имя</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Login" aria-label="Login" aria-describedby="basic-addon" value={this.state.login} onChange={this.loginInfo} ></input>
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">Введите ваш пароль</span>
                    </div>
                    <input type="password" class="form-control" placeholder="Password" aria-label="Login" aria-describedby="basic-addon" value={this.state.password} onChange={this.passwordInfo} ></input>
                  </div>
                <div class="text-center">
                  <button type="button" class="btn btn-secondary btn-lg btn-block" onClick={() => this.login()}>
                    Войти
                  </button>
                  <button type="button" class="btn btn-secondary btn-lg btn-block"  onClick={() => this.register()}>
                    Зарегистрироваться
                  </button>
                </div>
              </div>)
      }
}