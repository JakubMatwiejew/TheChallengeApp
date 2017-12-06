import React from 'react';
import ReactDOM from 'react-dom';

class LogDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            buttonText: "Sign in!",
            userName: this.props.userName,
            userMail: this.props.userMail,
            actionLogInfo: ''
        }
    }
    handleNameChange = (e) => {
        if( typeof this.props.handleNameChange === 'function'){
            this.props.handleNameChange(e);
        }
    }
    handleMailChange = (e) => {
        if( typeof this.props.handleMailChange === 'function'){
            this.props.handleMailChange(e);
        }
    }
    handleLogClick = (e) => {
            if (this.props.userMail.length == 0 || this.props.userName.length == 0) {
                this.setState({
                    actionLogInfo: "Wypełnij pola!"
                })
            } else if (this.props.userMail.indexOf('@') < 0) {
                this.setState({
                    actionLogInfo: "Podaj prawidłowy adres e-mail!"
                })
            } else {
                this.setState({
                    actionLogInfo: "",
                    displayLog: false,
                    displayChallenge: true
                },() => {
                    let existed = this.findUser();
                    if(existed) {
                        this.props.actionLogin(true, false);
                    }else{
                        this.props.actionLogin(true, true);
                    }
                });
            }
    }
    componentDidUpdate(){
        this.checkUser();
    }
    findUser(){
        let found = false;
        for (let i = 0; i < this.props.users.length; i++) {
            if (this.props.userName == this.props.users[i].name && this.props.userMail == this.props.users[i].mail) {
                found = true;
            }
        }
        return found;
    }
    checkUser(){
        if(this.state.userName != this.props.userName || this.state.userMail != this.props.userMail) {

            if(this.findUser()) {
                this.setState({
                    buttonText: "Log in!",
                    userName: this.props.userName,
                    userMail: this.props.userMail,
                })
            }else{
                this.setState({
                    buttonText: "Sign in!",
                    userName: this.props.userName,
                    userMail: this.props.userMail,
                })
            }
        }
    }
    render(){
        return(<div>
                <p>{this.state.actionLogInfo}</p>
                <input onChange={this.handleNameChange} value={this.props.userName} placeholder={'Your user name'}/><br/>
                <input onChange={this.handleMailChange} value={this.props.userMail} placeholder={'Your e-mail adress'}/><br/>
                <button onClick={this.handleLogClick}>{this.state.buttonText}</button>
            </div>
        )
    }
}

class LogPage extends React.Component{
    render(){
        if(this.props.userLogged == true) return false
        return(<div>
                <h2>Type your user name to log in or register</h2>
                <LogDetails actionLogin={this.props.actionLogin} actionLogInfo={this.props.actionLogInfo} handleLogClick={this.props.handleLogClick} userMail={this.props.userMail} users={this.props.users} userName={this.props.userName} handleMailChange={this.props.handleMailChange} handleNameChange={this.props.handleNameChange}/>
            </div>
        )
    }
}

class NewUserChallenge extends React.Component{
    constructor(props){
        super(props)
    }
    handleChallengeTypeChange = (e) => {
        if( typeof this.props.handleChallengeTypeChange === 'function'){
            this.props.handleChallengeTypeChange;
        }
    }
    handleChallengeGoal = (e) => {
        if( typeof this.props.handleChallengeGoal === 'function'){
            this.props.handleChallengeGoal;
        }
    }
    render(){
        if(this.props.newUser == false) return false
        return(<div>
                <h3>Wybierz typ wyzwania:</h3>
                <select onChange={this.props.handleChallengeTypeChange}>
                    <option value={"programming"}>Programming</option>
                    <option value={"running"}>Running</option>
                </select>
                <h3>Podaj swój cel</h3>
                <input onChange={this.props.handleChallengeGoal}/><br/>
                <button>Rozpocznij wyzwanie!</button>
            </div>
        )
    }
}

class OldUserChallenge extends React.Component{
    constructor(props){
        super(props)
    }
    handleChallengeProgress = (e) => {
        if( typeof this.props.handleChallengeProgress === 'function'){
            this.props.handleChallengeProgress;
        }
    }
    render(){
        if(this.props.newUser == true) return false
        return(<div>
                <h3>Wszisz swoje postępy:</h3>
                <input onChange={this.props.handleChallengeProgress}/><br/>
                <button>Zapisz postępy</button>
            </div>
        )
    }
}

class ChallengeInfo extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if (this.props.userLogged == false) return false
        return(<div>
                <h1>Witaj {this.props.userName}!</h1>
                <NewUserChallenge challengeType={this.props.challengeType} challengeGoal={this.props.challengeGoal} userName={this.props.userName} userMail={this.props.userMail} newUser={this.props.newUser} handleChallengeGoal={this.props.handleChallengeGoal} handleChallengeTypeChange={this.props.handleChallengeTypeChange}/>
                <OldUserChallenge userName={this.props.userName} userMail={this.props.userMail} newUser={this.props.newUser} handleChallengeProgress={this.props.handleChallengeProgress}/>
            </div>
        )
    }
}

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userName: "",
            userMail: "",
            users: null,
            newUser: true,
            challengeType: "programming",
            challengeGoal: "",
            challengeProgress: "",
            displayLog: true,
            userLogged: false
        }
    }

    setLogged = (logged, newUser) => this.setState({userLogged: logged, newUser});


    handleNameChange = (e) => {
        this.setState({
            userName: e.target.value,
        })
    }
    handleMailChange = (e) => {
        this.setState({
            userMail: e.target.value,
        })
    }
    handleChallengeTypeChange = (e) => {
        this.setState({
            challengeType: e.target.value,
        })
    }
    handleChallengeGoal = (e) => {
        this.setState({
            challengeGoal: e.target.value,
        })
    }
    handleChallengeProgress = (e) => {
        this.setState({
            challengeProgress: e.target.value,
        })
    }
    handleLogClick = (e, logged) => {
        if(logged){
            this.setState({
                newUser: false,
            })
        }else {
            if (this.state.userMail.length == 0 || this.state.userName.length == 0) {
                this.setState({
                    actionLogInfo: "Wypełnij pola!"
                })
            } else if (this.state.userMail.indexOf('@') < 0) {
                this.setState({
                    actionLogInfo: "Podaj prawidłowy adres e-mail!"
                })
            } else {
                this.setState({
                    actionLogInfo: "",
                    displayLog: false,
                });
            }
        }
    }
    componentDidMount(){
        fetch('http://localhost:3000/users')
            .then(r => r.json())
            .then( data => {
                this.setState({})
                let users = Object.keys(data).map(id => data[id]);
                this.setState({
                    users: users
                })
            });
    }
    render(){
        if (!this.state.users) {
            return <div />
        }
        return(<div>
                <h1>TheChallengeApp</h1>
                <LogPage userLogged={this.state.userLogged} actionLogin={this.setLogged} display={this.state.displayLog} userMail={this.state.userMail} users={this.state.users} userName={this.state.userName} handleMailChange={this.handleMailChange} handleNameChange={this.handleNameChange}/>
                <ChallengeInfo challengeType={this.state.challengeType} challengeGoal={this.state.challengeGoal} userLogged={this.state.userLogged} newUser={this.state.newUser} handleChallengeProgress={this.handleChallengeProgress} handleChallengeGoal={this.handleChallengeGoal} handleChallengeTypeChange={this.handleChallengeTypeChange} users={this.state.users} userName={this.state.userName} userMail={this.state.userMail}/>
            </div>
        )
    }
}

document.addEventListener('DOMContentLoaded', function(){
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
});
