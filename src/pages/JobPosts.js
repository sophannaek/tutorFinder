import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { Link } from 'react-router-dom';
import {GoStar,GoMail} from 'react-icons/go';
import {FaLink} from 'react-icons/fa';


const JobPosts = () =>{
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const jobsRef = firestore.collection('jobs');
        const jobList = []
        const unsubscribe = jobsRef.onSnapshot((querySnapshot) => {
            //return array of users -- only tutors 
          const jobs = querySnapshot.docs.map((doc) => doc.data());
          setJobs(jobs);
        });
        return unsubscribe;
      }, []);



    return (
            <div className="container">
            <h2>Job List</h2>
            <hr/>

          {  jobs.map((job)=> (
                <div className="row">
                <div className="card" key={job.uid}>
                    <div
                    className={'card-body justify-content' } >
       
              <p><b>Need Help With <i>{job.subject}</i></b></p>
              <hr/>
              <div>
                <p><b>Created By: </b> {job.name} | <b>Max rate:</b> $ {job.maxRate} | <b>When:</b> {job.time}</p>
                <a href={`mailto:${job.email}`}
                className ="btn btn-sm btn-outline-secondary"
                title='Mail attendee'>
                {/* <GoMail /> */}
                Contact This Student
                </a>
              </div>
              </div>
          
            
          </div>
      </div>

            ))}
                </div>
    );
};

export default JobPosts; 