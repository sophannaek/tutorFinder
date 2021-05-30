import React, {useState} from 'react';
import {FaUser,FaUsers, FaAngleDown, FaBlackberry} from 'react-icons/fa';
import {Link} from '@reach/router';
import { logout } from './firebase/auth';
import { useHistory,useLocation } from 'react-router-dom';
import { useSession } from './firebase/UserProvider';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import {GoListUnordered} from 'react-icons/go';
import Profile from './pages/Profile';
import Tutors from './pages/Tutors';
import {firestore} from './firebase/config';
import JobPosts from './pages/JobPosts';


function Header(){
    const history = useHistory(); 
    const { user } = useSession();
    const location = useLocation();
    console.log("location is in "+ location.pathname)
    // console.log(user.uid)
    let isLoginPage = false;
    const [usertype, setUsertype] = useState("")
    if(user){
        const docRef = firestore.collection('users').doc(user.uid);    
        docRef.onSnapshot((doc) =>{
            if(doc.exists){
                const documentData = doc.data(); 
                setUsertype(documentData.userType);
        }});

    }
    

    // Get the location for nav bar
    if(location.pathname === '/login'){
        isLoginPage = true; 
    }

    const logoutUser = async() =>{
        await logout(); 
        history.push('/login');
    };

    const gotoDiscussion = () =>{
        history.push('/discussion');
    }

    const navStyle={
        // backgroundColor: '#097295',
        backgroundColor: '#4E5052'
    };
    const anchor={
        color:"white"
    };

    return (
        <nav className="site-nav family-sans navbar navbar-expand navbar-light higher"
        style={navStyle}>
           <div className="container-fluid">
           <Link to="/aboutus" className="navbar-brand" onClick={AboutUs} style={anchor} >
              <FaUsers className="mr-1 brand-color" />
               tutorFinder
           </Link>
           <div className="navbar-nav ml-auto">
               {!!user ? ( 
                   <Link className="nav-item nav-link" to={`/profile/${user.uid}`} 
                    onClick = {Profile}
                    style={anchor}>
                   <FaUser size={16} className="mr-1 brand-color" />{user.displayName}
                   </Link>
               )
               
               : (
               <Link className="nav-item nav-link" to="/aboutus" onClick={AboutUs}  style={anchor}>
                   About Us
                   <FaAngleDown />
                   </Link>) 
               
               }
               
               { !!user  && ( usertype ==='tutor' ?
                (
                   <Link className="nav-item nav-link"  to="/jobPosts"  onClick={JobPosts} style={anchor}>
                      <GoListUnordered /> JobList
                  </Link>
                   ): <Link className="nav-item nav-link" to="/tutors" onClick={Tutors} style={anchor}>
                      <GoListUnordered /> TutorList
                   </Link> ) }

               {/* {!!user && (
                   <Link className="nav-item nav-link" to="/discussion" style={anchor}>Discussion</Link>
               )} */}

               {!user && !isLoginPage && (
                   <Link className="nav-item nav-link" to="/login" onClick={Login} style={anchor}>
                   Log In
               </Link>
               )}
               
               {!user && isLoginPage && (
                   <Link className="nav-item nav-link" to="/signup" onClick={Signup} style={anchor}>
                   Sign Up
               </Link>
               )}
               {
                   !!user && (
                        <Link className="nav-item nav-link" to="/discussion" onClick={gotoDiscussion} style={anchor}>
                        Discussion
                        </Link>
                   )
               }

               { !!user  && (
                   <Link className="nav-item nav-link" to="/login" onClick={logoutUser} style={anchor}>
                   Log Out
               </Link>
               )}
               
               
               
           </div>
           </div>
       </nav>
    );
}

export default Header;