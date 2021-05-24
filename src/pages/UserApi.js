import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { Link } from 'react-router-dom';
import {GoMail} from 'react-icons/go';
// import {FaLink} from 'react-icons/fa';
import SearchResults from 'react-filter-search';
import {useForm} from 'react-hook-form';

const fs = require('fs');

const UserApi = () =>{
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const usersRef = firestore.collection('users');
        const tutorList = []
       
        const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
            //return array of users -- only tutors 
          const users = querySnapshot.docs.map((doc) => doc.data());
          for (let item in users){
            if(users[item].userType === "tutor"){
                tutorList.push(users[item]);
                // tutorList.push(JSON.stringify(users[item]));
                console.log(users[item])
            }
          }
          tutorList.sort();
          setUsers(tutorList);
          let data = JSON.stringify(tutorList);
          let jsonData = JSON.parse(data);//this is what i want 
          console.log(data)
          console.log(jsonData)
    
        });
        return unsubscribe;
      }, []);


    return (

        <div className="left">{JSON.stringify(users)}</div>
    );
};

export default UserApi; 