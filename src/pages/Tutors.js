import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { Link } from 'react-router-dom';
import {GoMail} from 'react-icons/go';
// import {FaLink} from 'react-icons/fa';


const Tutors = () =>{
    const [tutors, setTutors] = useState([]);

    useEffect(() => {
        const usersRef = firestore.collection('users');
        const tutorList = []
        const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
            //return array of users -- only tutors 
          const users = querySnapshot.docs.map((doc) => doc.data());
          for (let item in users){
            if(users[item].userType === "tutor"){
                tutorList.push(users[item]);
            }
          }
          setTutors(tutorList);
        });
        return unsubscribe;
      }, []);

    return (
        
            <div className="container" >
                <h2>TutorList</h2>
                <hr/>
                <div style={{textAlign:'left'}}>
                {  tutors.map((tutor)=> (
                        <div className="col-12 col-sm-12 col-md-8 col-lg-6 mb-2 p-0 px-1"
                        key={tutor.uid} >
                        <div className="card ">
                            <div
                            className={'card-body px-3 py-2 d-flex align-items-center justify-content-left' } >
                            
                                <div className="btn-group pr-2">
                            
                                    <a href={`mailto:${tutor.email}`}
                                        className ="btn btn-sm btn-outline-secondary"
                                        title='Mail attendee'>
                                        <GoMail />
                                        </a>

                                    <button className = "btn btn-sm btn-outline-secondary" title="view profile">
                                            <Link className="nav-item nav-link" to={`/tutors/profile/${tutor.uid}`}
                                            >View Profile</Link> 
                                    </button>
                                    
                                </div>
                                <div><b>Tutor:</b> {tutor.name}<br/><b>Subjects:</b> {tutor.subjectName}</div>
                            </div>
                        </div>
                </div>

                ))}
            </div>
        </div>
    );
};

export default Tutors; 