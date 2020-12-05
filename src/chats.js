import React, {Component} from 'react';
import axios from 'axios'
import Button from 'react-bootstrap/lib/Button'
import { BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';

export default class Chats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {chats: {},
                      chatName: "",
                      old_chats_hash: {},
                      chats_hash: {},
                      old_notif_hash: {},
                      notif_hash: {}};
        this.chatName = this.chatName.bind(this);
      }

    componentDidMount(){
      this.interval = setInterval(() => {
        this.updateChats()
        this.updateNotifications()
      }, 500);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    createChat(){
      if (this.state.chatName != ""){
        axios.get(`https://simple-messenger-server1.herokuapp.com/create_chat?user_name=${localStorage.getItem('login')}&chat_name=${this.state.chatName}`)
        this.setState({ chatName: "" })}
    }

    updateChats(){
      this.setState(state => 
        {
          const old_chats_hash = state.chats_hash
          return {old_chats_hash}
        })
      this.setState({chats_hash: {}})
      axios.get(`https://simple-messenger-server1.herokuapp.com/all_chats_for_user?user_name=${localStorage.getItem('login')}`)
          .then(res => {
            res.data.sensible.forEach((element) => {
              axios.get(`https://simple-messenger-server1.herokuapp.com/chat_name?chat_number=${element}`).then(res =>
              {
                this.setState(state => {
                  const chats_hash = state.chats_hash
                  chats_hash[element] = res.data.sensible
                  return {chats_hash}
                })
              })
            })
          })
    }

    chatsForHuman(){
      var result = []
      for (var id in this.state.old_chats_hash){
        result.push(<div class="container">
                      <div class="get-quote">
                        <div class="row">
                          <div class="col-sm-10 col-12">
                            <Link to={`/chat/${id}`}><h4>{this.state.old_chats_hash[id]}</h4></Link>
                          </div>
                          <div class="col-sm-2 col-12">
                            <button class="btn btn-danger" id={id} onClick={e => this.leaveChat(e.target.id)}> Покинуть </button>
                          </div>
                        </div>
                      </div>
                      <hr></hr>
                    </div>)
      }
      return result
    }

    chatName(event) {
      this.setState({chatName: event.target.value});
    }

    leaveChat(id){
      console.log(id)
      axios.get(`https://simple-messenger-server1.herokuapp.com/leave_chat?user_name=${localStorage.getItem('login')}&chat_number=${id}`)
    }


    updateNotifications(){
      this.setState(state => 
        {
          const old_notif_hash = state.notif_hash
          return {old_notif_hash}
        })
      this.setState({notif_hash: {}})
      axios.get(`https://simple-messenger-server1.herokuapp.com/get_chat_notifications?user_name=${localStorage.getItem('login')}`)
          .then(res => {
            res.data.sensible.forEach((element) => {
              axios.get(`https://simple-messenger-server1.herokuapp.com/chat_name?chat_number=${element}`).then(res =>
              {
                this.setState(state => {
                  const notif_hash = state.notif_hash
                  notif_hash[element] = res.data.sensible
                  return {notif_hash}
                })
              })
            })
          })
    }


    normalViewNotifications(){
      var normalNot = []
      for (var id in this.state.old_notif_hash){
        normalNot.push(<div>
          <h4>{this.state.old_notif_hash[id]}</h4>
          <button class="btn btn-success" id={id} onClick={(e) => this.joinChat(e.target.id)}>
            Принять
          </button>
          <button class="btn btn-danger" id={id} onClick={(e) => this.deleteNotify(e.target.id)}>
            Отклонить
          </button>
          <hr></hr>
        </div>)
      }
      return normalNot
    }

    joinChat(id)
    {
      axios.get(`https://simple-messenger-server1.herokuapp.com/join_chat?user_name=${localStorage.getItem('login')}&chat_number=${id}`)
      .then(res => {
        this.props.history.push(`/chat/${id}`)
      })
    }

    deleteNotify(id)
    {
      axios.get(`https://simple-messenger-server1.herokuapp.com/delete_chat_notification?user_name=${localStorage.getItem('login')}&chat_number=${id}`)
    }

    render() {
      if (!localStorage.getItem('entered'))
          this.props.history.push('/')
      return (<div className="chats">
                <button class="btn btn-secondary btn-lg btn-block" onClick={() => {
                  localStorage.removeItem('login')
                  localStorage.removeItem('entered')
                  this.props.history.push('/')
                  }}>
                    Выйти из аккаунта
                </button>
                <hr></hr>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Введите имя чата для создания</span>
                  </div>
                  <input type="text" class="form-control" placeholder="Name" aria-label="Name" aria-describedby="basic-addon" value={this.state.chatName} onChange={this.chatName} ></input>
                </div>
                <div>
                  <button class="btn btn-secondary btn-lg btn-block" onClick={() => this.createChat()}>
                    Создать чат
                  </button>
                </div>
                <div class="text-center">
                  <div class="row">
                    <div class="col-sm-8">
                      <h3>Чаты</h3>
                      <hr></hr>
                      {this.chatsForHuman()}
                    </div>
                    <div class="col-sm-4">
                      <h3>Приглашения</h3>
                      <hr></hr>
                      {this.normalViewNotifications()}
                    </div>
                  </div>
                </div>
              </div>)
    }
}
