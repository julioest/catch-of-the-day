/*
  Fish
  <Fish/>
*/

import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBOE9Hq5vC6qV27rSnhakqLUhD-RS__dkY",
    authDomain: "catch-of-the-day-1f506.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-1f506.firebaseio.com",
    storageBucket: "catch-of-the-day-1f506.appspot.com",
  };

firebase.initializeApp(config);
var rootRef = firebase.database().ref();
var auth = firebase.auth();



@autobind
class Inventory extends React.Component {

  constructor(){
    super();

    this.state = {
      uid : ''
    }
  }

  authenticate(provider){
    console.log("Trying to auth with " + provider);
    var provider = new firebase.auth.TwitterAuthProvider();
    auth.signInWithPopup(provider).then(function() {
      console.log('Succesfully signed in!');
      var uid = this.state.uid;
    }).catch(function(error) {
      // An error occurred
      console.log('An error as ocurred. We are doomed!')
    });
  }

/*  authHandler(err, authData){
    if(err){
      console.err(err);
      return;
    }

    const storeRef = rootRef.child(this.props.params.storeId);
    console.log(storeRef);
  }*/

  renderLogin(){
    return (
      <nav className="login">
        <p>Sign in to manage your store's inventory</p>
        {/* <button className="github" onClick={this.authenticate.bind(this, 'github')}>Log In with Github</button> */}
        {/* <button className="facebook" onClick={this.authenticate.bind(this, 'facebook')}>Log In with Facebook</button> */}
        <button className="twitter" onClick={this.authenticate.bind(this, 'twitter')}>Log In with Twitter</button>
      </nav>
    )
  }

  renderInventory(key){
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={key}>
          <input type="text" valueLink={linkState('fishes.' + key + '.name')}/>
          <input type="text" valueLink={linkState('fishes.' + key + '.price')}/>
        <select valueLink={linkState('fishes.'+ key + '.status')}>
          <option value="unavailable">Sold Out!</option>
          <option value="available">Fresh!</option>
        </select>
        <textarea valueLink={linkState('fishes.'+ key + '.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.' + key + '.image')}/>
      <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
      </div>
    )
  }



  render(){
    let logoutButton = <button>Log Out!</button>

    //first check if they aren't logged in
    if(!this.state.uid) {
      return (
        <div>{this.renderLogin()}</div>
      )
    }

    // then check if they aren't the owner of the current store
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you are not the Owner of the store</p>
          {logoutButton}
        </div>
      )
    }



    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}

        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes!</button>
      </div>
    )
  }
};

Inventory.propTypes = {
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  fishes: React.PropTypes.object.isRequired,
  linkState: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
}

export default Inventory;
