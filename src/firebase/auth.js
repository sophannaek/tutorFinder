import firebase from 'firebase/app';
import 'firebase/auth';
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


