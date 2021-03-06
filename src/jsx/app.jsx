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
                    actionLogInfo: "Fill the form!!"
                })
            } else if (this.props.userMail.indexOf('@') < 0) {
                this.setState({
                    actionLogInfo: "Wrong e-mail adress!!"
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
                <p style={{color: 'red'}}>{this.state.actionLogInfo}</p>
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
                <h2>Type your user name and e-mail adress to log in or register</h2>
                <LogDetails actionLogin={this.props.actionLogin} actionLogInfo={this.props.actionLogInfo} handleLogClick={this.props.handleLogClick} userMail={this.props.userMail} users={this.props.users} userName={this.props.userName} handleMailChange={this.props.handleMailChange} handleNameChange={this.props.handleNameChange}/>
            </div>
        )
    }
}

class NewUserChallenge extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            clicked: false,
            newGoal: "",
            type: "programming",
            typeInfo: ""
        }
    }
    handleChallengeTypeChange = (e) => {
        if( typeof this.props.handleChallengeTypeChange === 'function'){
            this.props.handleChallengeTypeChange(e);
        }
    }
    handleChallengeGoal = (e) => {
        if( typeof this.props.handleChallengeGoal === 'function'){
            this.props.handleChallengeGoal(e);
        }
    }
    componentDidUpdate(){
        console.log(this.props.challengeGoal);
        if(this.state.newGoal != this.props.challengeGoal){
            this.setState({
                newGoal: this.props.challengeGoal
            })
        }if(this.state.type != this.props.challengeType){
            this.setState({
                type: this.props.challengeType
            })
        }
    }
    startChallenge = () => {
        if( isNaN(parseInt(this.state.newGoal)) || this.state.newGoal.length <= 0){
            this.setState({
                typeInfo: "Type a number higher than 0!"
            })
        }else{
            let startDate = new Date();
            var dd = startDate.getDate();
            var mm = startDate.getMonth()+1;
            var yyyy = startDate.getFullYear();
            const challengeDetails = {
                start: startDate,
                dd: dd,
                mm: mm,
                yyyy: yyyy,
                name: this.props.userName,
                mail: this.props.userMail,
                type: this.props.challengeType,
                goal: this.props.challengeGoal,
                progress: 0
            };
            fetch('http://localhost:3000/users',{
                method: 'POST',
                body: JSON.stringify(challengeDetails),
                headers: {"Content-Type" : "application/json"}
            }).then(console.log(challengeDetails));
            this.setState({
                clicked: true
            })
        }
    }
    render(){
        if(this.props.newUser == false) return false;
        if(this.state.clicked == true){
            return(
                <h3>Challenge accepted!</h3>
            )
        }
        return(<div>
                <h3>Type of challenge:</h3>
                <select onChange={this.handleChallengeTypeChange}>
                    <option value={"programming"}>Programming</option>
                    <option value={"running"}>Running</option>
                </select>
                <h3>Your goal:</h3>
                <p>Type number of hours you want to spend on {this.state.type}</p>
                <p style={{color: 'red'}}>{this.state.typeInfo}</p>
                <input onChange={this.handleChallengeGoal}/><br/>
                <button onClick={this.startChallenge}>Start your challenge!</button>
            </div>
        )
    }
}

class OldUserChallenge extends React.Component{
    constructor(props){
        super(props);
        this.state={
            startDate: "",
            actualDate: "",
            dayOfTheChallenge: "",
            challengeGoal: "",
            challengeType: "",
            challengeProgress: "",
            todaysProgress: "",
            indexNr: "",
            dbAdress: "",
            clicked: false,
            progressInfo: ""
        }
    }
    handleChallengeProgress = (e) => {
        this.setState({
            todaysProgress: e.target.value,
        })
    }
    handleProgress = (e) => {
        if( isNaN(parseInt(this.state.todaysProgress)) || this.state.todaysProgress.length <= 0){
            this.setState({
                progressInfo: "Type a number higher than 0!"
            })
        }else{
            const progress = {
                progress: parseInt(this.state.challengeProgress) + parseInt(this.state.todaysProgress)
            }
            fetch(this.state.dbAdress,{
                method: 'PATCH',
                body: JSON.stringify(progress),
                headers: {"Content-Type" : "application/json"}
            }).then(console.log(progress));
            this.setState({
                clicked: true
            })
        }
    }
    getNumber = (value, arr, prop) => {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                return i;
            }
        }
        return -1;
    }
    newChallenge = () => {
        window.location.reload();
        fetch(this.state.dbAdress,{
            method: 'DELETE',
        }).then(console.log("Deleted"));
    }
    componentDidMount(){
        var indexNr = this.getNumber (this.props.userName, this.props.users, "name");
        var dd = this.props.users[indexNr].dd;
        var mm = this.props.users[indexNr].mm;
        var yyyy = this.props.users[indexNr].yyyy;
        var oneDay = 24*60*60*1000;
        var firstDate = new Date(yyyy,mm-1,dd);
        var secondDate = new Date();
        var diffDays = Math.ceil(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
        this.setState({
            startDate: this.props.users[indexNr].start,
            actualDate: new Date(),
            dayOfTheChallenge: diffDays,
            challengeType: this.props.users[indexNr].type,
            challengeGoal: this.props.users[indexNr].goal - this.state.todaysProgress,
            challengeProgress: this.props.users[indexNr].progress,
            dbAdress: 'http://localhost:3000/users/'+(indexNr+1),
            indexNr: indexNr+1
        },()=>{
            console.log('test');
            this.props.setBackground(this.state.challengeType)
        })
    }
    render(){
        if(this.props.newUser == true) return false;
        let toGo = this.state.challengeGoal - this.state.challengeProgress;
        if(this.state.dayOfTheChallenge > 7){
            return (<div>
                    <h3>Your challenge has ended!</h3>
                    <button onClick={this.newChallenge}>Start new challenge!</button>
                </div>
            )
        }
        if(toGo<=0) {
            return (<div>
                    <h3>You already finished your challenge!</h3>
                    <button onClick={this.newChallenge}>Start new challenge!</button>
                </div>
            )
        }
        if(this.state.clicked == true){
            if((toGo-this.state.todaysProgress)<=0){
                return(<div>
                        <h3>Goal achieved! Good job!</h3>
                        <button onClick={this.newChallenge}>Start new challenge!</button>
                    </div>
                )
            }else{
                return(
                    <div>
                        <h3>Progress saved!</h3>
                        <p>You still have {toGo-this.state.todaysProgress} hours to achieve your goal!</p>
                    </div>
                )
            }
        }
        return(<div>
                <p>Your goal: <strong>{this.state.challengeGoal}</strong></p>
                <p>Hours to achieve your goal: <strong>{toGo}</strong></p>
                <p>Day of your challenge: <strong>{this.state.dayOfTheChallenge}</strong></p>
                <p>Type of challenge: <strong>{this.state.challengeType}</strong></p>
                <p>Your latest progress:</p>
                <p style={{color: 'red'}}>{this.state.progressInfo}</p>
                <input onChange={this.handleChallengeProgress}/><br/>
                <button onClick={this.handleProgress}>Save your progress</button>
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
                <h1>Hi {this.props.userName}!</h1>
                <NewUserChallenge challengeType={this.props.challengeType} challengeGoal={this.props.challengeGoal} userName={this.props.userName} userMail={this.props.userMail} newUser={this.props.newUser} handleChallengeGoal={this.props.handleChallengeGoal} handleChallengeTypeChange={this.props.handleChallengeTypeChange}/>
                <OldUserChallenge setBackground={this.props.setBackground} users={this.props.users} userName={this.props.userName} userMail={this.props.userMail} newUser={this.props.newUser} />
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
            userLogged: false,
            backgroundUrl: "./dist/img/background.jpg"
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
    handleLogClick = (e, logged) => {
        if(logged){
            this.setState({
                newUser: false,
            });
        }else {
            if (this.state.userMail.length == 0 || this.state.userName.length == 0) {
                this.setState({
                    actionLogInfo: "Fill the form!"
                })
            } else if (this.state.userMail.indexOf('@') < 0) {
                this.setState({
                    actionLogInfo: "Wrong e-mail adress!"
                })
            } else {
                this.setState({
                    actionLogInfo: "",
                    displayLog: false,
                });
            }
        }
    }
    setBackground = (url) => {
        this.setState({
            backgroundUrl: "./dist/img/"+url+".jpg"
        })
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
        return(<div className='app'>
                <div className='left'>
                    <h1>The Challenge App</h1>
                    <p>Created to help you achieve your goals!</p>
                    <LogPage userLogged={this.state.userLogged} actionLogin={this.setLogged} display={this.state.displayLog} userMail={this.state.userMail} users={this.state.users} userName={this.state.userName} handleMailChange={this.handleMailChange} handleNameChange={this.handleNameChange}/>
                    <ChallengeInfo setBackground={this.setBackground} users={this.state.users} challengeType={this.state.challengeType} challengeGoal={this.state.challengeGoal} userLogged={this.state.userLogged} newUser={this.state.newUser} handleChallengeGoal={this.handleChallengeGoal} handleChallengeTypeChange={this.handleChallengeTypeChange} users={this.state.users} userName={this.state.userName} userMail={this.state.userMail}/>
                </div>
                <div className='right' style={{backgroundImage: "url(" + this.state.backgroundUrl + ")"}}>
                </div>
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
