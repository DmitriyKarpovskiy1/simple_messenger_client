import React, {Component} from 'react';
import axios from 'axios'
import Button from 'react-bootstrap/lib/Button'

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            chat_name: "",
            inviteUser: "",
            inChat: true,
            mes_hash: {},
            users: []
        }
        this.warning = ""
        this.valueInfo = this.valueInfo.bind(this)
        this.inviteUserInfo = this.inviteUserInfo.bind(this)
        this.getChatName()
      }

    valueInfo(event) {
        this.setState({value: event.target.value});
      }

    inviteUserInfo(event) {
        this.setState({inviteUser: event.target.value});
      }

    inviteUser()
      {
        if (this.state.inviteUser != localStorage.getItem('login')){
          axios.get(`https://simple-messenger-server1.herokuapp.com/invite_user?user_name=${this.state.inviteUser}&chat_number=${this.props.match.params.id}`)
          this.setState({ inviteUser: "" })
          this.warning = ""
        }
        else{
          this.warning = "Не стоит инвайтить себя"
        }
      }
  
    userInChat(){
        axios.get(`https://simple-messenger-server1.herokuapp.com/all_users_in_chat?chat_number=${this.props.match.params.id}`).then(res => {
          this.setState({ users: res.data.sensible })
          this.setState({ inChat: res.data.sensible.includes(localStorage.getItem('login')) })
        })
      }

    componentDidMount(){
        this.interval = setInterval(() => {
          this.updateMessages()
          this.userInChat()
        }, 500);
      }
  
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getChatName(){
      axios.get(`https://simple-messenger-server1.herokuapp.com/chat_name?chat_number=${this.props.match.params.id}`).then(res => {
            this.setState({ chat_name: res.data.sensible })
          })
    }

    updateMessages(){
      axios.get(`https://simple-messenger-server1.herokuapp.com/get_messages?chat_number=${this.props.match.params.id}`).then(res => {
        this.setState({ mes_hash: res.data.sensible })
      })
    }

    normalMessages(){
      var normalView = []
      for (var mes in this.state.mes_hash){
        normalView.push(<div class="card"><p><mark>{this.state.mes_hash[mes]['user']}</mark>: {this.state.mes_hash[mes]['messge']}</p></div>)
      }
      return normalView
    }

    sendMessage()
    {
      if( this.state.value != ""){
        axios.get(`https://simple-messenger-server1.herokuapp.com/send_message?user_name=${localStorage.getItem('login')}&chat_number=${this.props.match.params.id}&message=${this.state.value.replaceAll("\n", " ").substr(0, 500)}`).then(res => {
          this.setState({ value: "" })
      })
    }
    }

    allUsersView(){
      var result = []
      for (var user in this.state.users){
        result.push(<p><mark>{this.state.users[user]}</mark></p>)
      }
      return result
    }

    
    render() {
      if (!localStorage.getItem('entered') || !this.state.inChat){
        this.props.history.push('/')
      }
      return (<div className="chat">
                <button class="btn btn-secondary btn-lg btn-block" onClick={() => {
                  localStorage.removeItem('login')
                  localStorage.removeItem('entered')
                  this.props.history.push('/')
                  }}>
                    Выйти из аккаунта
                </button>
                <hr></hr>
                <h1 class="text-center">{this.state.chat_name}</h1>  
                <div class="row">
                  <div class="col-sm-8" style={{ "height": "400", "overflow-y": "scroll", "transform": "rotate(180deg)", "direction": "rtl", "textAlign": "left" }} >
                    <ul style={{"overflow": "hidden", "transform": "rotate(180deg)"}}>
                      {this.normalMessages()}
                    </ul>
                  </div>
                  <div class="col-sm-4">
                    <div>
                      <div>
                        <h4>Все пользователи</h4>
                        <hr></hr>
                        {this.allUsersView()}
                      </div>
                      <hr></hr>
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text" id="basic-addon1">Имя пользователя</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={this.state.inviteUser} onChange={this.inviteUserInfo} />
                      </div>
                      <button class="btn btn-secondary btn-lg btn-block" onClick={() => this.inviteUser()}>
                        Пригласить пользователя в чат
                      </button>
                    </div>
                  </div>
                  <div class="col-sm-8">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">{localStorage.getItem('login')}: </span>
                      </div>
                      <textarea class="form-control" aria-label="With textarea" placeholder="Message" value={this.state.value} onChange={this.valueInfo}></textarea>
                    </div>
                    <button class="btn btn-secondary btn-lg btn-block" onClick={() => this.sendMessage()}>
                      Отправить
                    </button>
                  </div>
                </div>
              </div>
              )
    }
}
