import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig)

function App() {
  const [newUser , setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo:''
   
  });

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const  fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignIn = () => {
   firebase.auth()
    .signInWithPopup(googleProvider)
    .then(res => {
      const {displayName ,email, photoURL} = res.user;
      const isSignedUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(isSignedUser);
      console.log(displayName, email, photoURL);
    })
    .catch(err => {
        console.log(err.code)
        console.log(err.message);
    })
  }
 
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const userSignOut = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        success:false
      }
      setUser(userSignOut);
    })
  }

  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
   .then((res) => {
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success = true;
      setUser(newUserInfo);
      updateUserInfo(user.name)

  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then( res => {
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    console.log(res.user)
  })
  .catch( error => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
    }

       e.preventDefault();
  }

  const handleOnBlur = (e) => {
    let isFeildValid = true;
    if(e.target.name === 'email'){
    isFeildValid = /\S+@\S+\.\S+/.test(e.target.value)
    }
    if(e.target.name === 'password'){
      const passwordValidation = e.target.value.length > 6 ;
      const passwordHashNumber = /\d{1}/.test(e.target.value)
      isFeildValid = passwordValidation && passwordHashNumber;
    }
    // eita ektu confusion 
    if(isFeildValid){
     const newUserInfo = {...user};
     newUserInfo[e.target.name] = e.target.value;
     setUser(newUserInfo);
    }
  } 
     // user info update method 
      const updateUserInfo = name => {
        const user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: name
        }).then(function() {
         console.log('user info update succesfuly')
        }).catch((error) => {
          console.log(error)
});
      }
      const handleSignInFacebook = () => {
        firebase
        .auth()
        .signInWithPopup(fbProvider)
        .then((res) => {
          console.log(res.user)
         
        })
        .catch((error) => {
          var errorMessage = error.message;
          console.log(errorMessage)
        });
      }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>sign out</button>
          : <button onClick={handleSignIn}>sign in</button>
      }
         <button onClick={handleSignInFacebook}>sign in Facebook</button>
        
        {
          user.isSignedIn && <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="This is email photo" />
      </div>
        }
  
        <h1>Our Own Authentication</h1>
        <input onChange={() => setNewUser(!newUser)} type="checkbox" name="newUser" id="chackbox-id" />
        <label htmlFor="chackbox-id">New user Sign Up</label>
        <form onSubmit={handleSubmit}>
           {
             newUser &&  <input onBlur={handleOnBlur} type="text" name="name" placeholder="Your name" /> 
           }
           <br/>
           <input onBlur={handleOnBlur} type="text" name="email" placeholder="Enter Your Email" required /><br/>
           <input onBlur={handleOnBlur} type="password" name="password" placeholder="Enter Your Password" required /><br/>
           <input type="submit" value={newUser ? 'Sign up': 'Sign in'} />
        </form>
        <p style={{color:'red'}}>{user.error}</p>
        {
          user.success && <p style={{color:'green'}}>user {newUser ? 'Created' : 'Log in'} succesfully</p>
        }
    </div>
  );
}

export default App;
