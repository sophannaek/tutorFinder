import firebase from 'firebase/app';
import 'firebase/auth';
import {firestore} from '../firebase/config';
import { createUserDocument } from './user';


export const signup = async ({ displayName,email, password}) => {    
  const resp = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  const user = resp.user;
  await user.updateProfile({displayName:`${displayName}`});
  await createUserDocument(user);
  return user;
};

export const signInWithGoogle = async()=>{
  const provider = new firebase.auth.GoogleAuthProvider(); 
  const resp = await firebase
  .auth()
  .signInWithPopup(provider);
  const user = resp.user;
  const docRef = firestore.doc(`/users/${user.uid}`);  
  if (!docRef.exists()){
    await createUserDocument(user);  
  }  
}

export const signInWithGitHub = async()=>  {
  const provider = new firebase.auth.GithubAuthProvider();
  const resp = await firebase.auth().signInWithPopup(provider);
  const user = resp.user;
  const docRef = firestore.doc(`/users/${user.uid}`);  
  if (!docRef.exists()){
    await createUserDocument(user);  
  } 
}

export const logout = () => {
  return firebase.auth().signOut();
};

export const login = async ({ email, password }) => {
  const resp = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  console.log(resp.user);
  return resp.user;
};



