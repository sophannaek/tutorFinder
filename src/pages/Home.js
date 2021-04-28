
import React, { Component } from 'react';
import { Link } from '@reach/router';
import { useHistory,useLocation } from 'react-router-dom';
import { useSession } from '../firebase/UserProvider';
import Signup from '../pages/Signup';
import Login from '../pages/Login';

function Home(){
          const biggerLead = {
            fontSize: 1.4 +'em',
            fontWeight: 200
            
        };
        const bigLead={
            // color: '#18728F'
            color:'#097295 ',
            borderColor: '#097295'
        };

        const { user } = useSession(); 

        return(
            
            <div className="container text-center">
        
                <div className="row justify-content-center">
                <div className="col-10 col-md-10 col-lg-8 col-xl-7">
       

                    { !!user && user.isTutor === 'true' ? (
                        <div className="display-4  mt-3 mb-2" style={bigLead}>
                            Find students near you
                           
                        </div>
                        ) : (<div className="display-4  mt-3 mb-2" style={bigLead}>
                           Find an online expert tutor
                    </div>)
                    }
                    
                     <p className="lead" style={biggerLead}>
                            This simple app provides an online platform to allow users 
                            to sign up to be a tutor or seek for an expert to assist in their 
                            learning materials. 
                            { !user && <p>Sign up today, it free!</p>} 
                    </p>

                    { !user && (
                        <Link to="/signup" className="btn btn-outline-light mr-2" style={bigLead}>
                         Sign Up
                        </Link>
                    )}
                    
                    
                    {!user && (
                       <Link to="/login" className="btn btn-outline-light mr-2" style={bigLead}>
                         Log In
                        </Link>
                    )}

                    {user && (user.isTutor === 'true' ? (
                        <Link to="/students" className="btn  btn-light" style={bigLead}>
                         Students
                        </Link>
                    ) : <Link to="/tutors" className="btn  btn-light" style={bigLead}>
                        Tutors
                    </Link>
                   )}
                    
                    
                </div> 
                </div>
            </div>
        );
        
    }

export default Home; 