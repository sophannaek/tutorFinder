
import React, { useState } from 'react';
import { Link } from '@reach/router';
import { useSession } from '../firebase/UserProvider';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import {firestore} from '../firebase/config';


function AboutUs() {
    const { user } = useSession(); 
    const [usertype, setUsertype] = useState("")
    if(user){
        const docRef = firestore.collection('users').doc(user.uid);
        // use snapshot --> provide real time changes without have to refresh the browser
    
        docRef.onSnapshot((doc) =>{
            if(doc.exists){
                const documentData = doc.data(); 
                setUsertype(documentData.userType);
        }});

    }
    return (
        <>
        <div className="container text-center">
                {/* Hello {user} */}
            <div className="row justify-content-center">
                <div className="col-10 col-md-10 col-lg-8 col-xl-7">
                        <div className="display-4  mt-3 mb-2 bigLead">
                            <i>tutorFinder</i>
                            
                        </div>                
                        <p className="lead biggerLead">
                            This simple app provides an online platform to allow users 
                            to sign up to be a tutor or seek for an expert to assist in their 
                            learning materials. 
                            { !user && <span>Sign up today, it free!</span>} 
                        </p>

                    { !user && (
                        <Link to="/signup" className="btn btn-outline-light  mr-2 bigLead" onClick={Signup}>
                            Sign Up
                        </Link>
                    )}
                    
                    
                    {!user && (
                        <Link to="/login" className="btn btn-outline-light mr-2 bigLead"  to="/login" onClick={Login}>
                            Log In
                        </Link>
                    )}

                    {user && (usertype === 'tutor' ? (
                        <Link to="/students" className="btn  btn-light bigLead">
                            Job Posts
                        </Link>
                    ) : <Link to="/tutors" className="btn  btn-light bigLead">
                        Tutors
                    </Link>
                    )}
                        
                </div> 
            </div>
        </div>
        </>
    );
}


export default AboutUs; 
