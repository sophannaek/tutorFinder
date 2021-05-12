import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { Link } from 'react-router-dom';
import {GoMail} from 'react-icons/go';
// import {FaLink} from 'react-icons/fa';
import SearchResults from 'react-filter-search';
import {useForm} from 'react-hook-form';



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
        });
        return unsubscribe;
      }, []);


    return (
        // <div>{JSON.stringify(users)}</div>

        <div className="left">{JSON.stringify(users)}</div>


        // <div>{users}</div>
        // <div style={{textAlign:'left'}}>
        //         {users.map((tutor)=> (
        //                 <div className="col-12 col-sm-12 col-md-8 col-lg-6 mb-2 p-0 px-1"
        //                 key={tutor.uid} >
        //                      {JSON.stringify([tutor])}
                            
        //                 </div>
        //         ))}
        //     </div>
    );
};

export default UserApi; 