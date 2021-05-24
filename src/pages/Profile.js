import React, {useEffect, useState} from 'react';
import { useSession } from '../firebase/UserProvider';
import {firestore} from '../firebase/config';
import {useParams, Link} from 'react-router-dom';
import { ProfileImage } from '../ProfileImage';
import Alert from 'react-bootstrap/Alert'
import FormError from '../FormError';

const Profile = () => {
  const { user } = useSession();
  const params = useParams(); 
  const [isLoading, setLoading]= useState(false);
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
      name: user.name,
      email:'',
      userType:'',
      payRate: 0,
      address:'',
      city:'',
      zip:'',
      state:'',
      phone:'',
      subjectName:'',
      bio:'',
      hoursTutored:0
  });

  //this effect depends on user.uid and the setValue 
  useEffect(()=>{
    // console.log(params.id)
    setLoading(true);
    const docRef = firestore.collection('users').doc(params.id);

    // use snapshot --> provide real time changes without have to refresh the browser
    const unsubscribe = docRef.onSnapshot((doc) =>{
        console.log(doc)
      if(doc.exists){
        const documentData = doc.data(); 
        setForm(documentData);
        setLoading(false);       
      }
    });
    return unsubscribe; 
  },[ user.uid,params.id]);

  const deactivate = async()=>{
    setShow(false);
    console.log("deleting...")
    await deleteUser(user);
  }

  const deleteUser = async(user,props) =>{
    // console.log("starting deleting "+user.displayName);
    await user.delete().then(function(){
    //   console.log('user deleted');
      props.history.push(`/signup`);
  
    }).catch(function(error){
        setErrorMsg(error.message);      
    });
  }

  const formClassname = `container mt-3 ${isLoading ?'loading': ''}`;
  
  return (
    
    <div className={formClassname}>
        <p className="left"> Welcome back <b>{form.name}</b>!</p>
        <hr/>

        <div className="row">
            <div className="col-sm-4">
                <div className="mt-2" style={{ maxWidth: 560}}>
                    <ProfileImage id={params.id} readOnly={true} />
                </div>
                <div className="mt-5">
                    <button className = "btn btn-sm btn-outline-secondary" title="view profile">
                    <Link className="nav-item nav-link"
                         to={`/JobForm/`}
                    >Create a tutoring request</Link> 
              </button>

                </div>
            </div>
            <div className="col-sm-6 ml-4">
    
                        <h2><center>Your Profile Info</center></h2>
                        <table className='table left'>
                            <tr>
                                <th>Display Name</th>
                                <td>{form.name}</td>
                            </tr>
                            <tr>
                                <th>Email Address</th>
                                <td>{form.email}</td>
                            </tr>
                            <tr>
                                <th>User Type</th>
                                <td>{form.userType}</td>
                            </tr>
                            <tr>
                                <th>Bio</th>
                                <td>{form.bio}</td>
                            </tr>
                            <tr>
                                {form.userType === 'tutor' ? <th> Expertise </th>:<th>Need Help With</th> }
                                <td>{form.subjectName}</td>
                            </tr>
                            <tr>
                                {form.userType ==='tutor' ? <th>Hourly Rate</th>: <th>Max Affordable Rate</th>}
                                
                                <td>$ {form.payRate}</td>
                            </tr>
                            <tr>
                                <th>Street Address</th>
                                <td>{form.address}</td>
                            </tr>
                            <tr>
                                <th>City</th>
                                <td>{form.city}</td>
                            </tr>
                            <tr>
                                <th>State</th>
                                <td>{form.State}  {form.zip}</td>
                            </tr>
                            <tr>
                                <th>Phone Number</th>
                                <td>{form.phone}</td>
                            </tr>

                           
                        </table>
                        <hr/>
                        {!show && !errorMsg &&
                            <div className='row'>
                                <div className='col-sm-6'>
                                    <button className = "btn btn-sm btn-outline-secondary" title="deactivate profile">
                                        <Link className="nav-item nav-link"
                                            onClick={() => {setShow(true)}}
                                        >Deactivate Your Account </Link> 
                                        {/* Deactivate Your Account */}
                                    </button>
                                </div>
                                <div className='col-sm-4'>
                                    <button className = "btn btn-sm btn-outline-secondary" title="edit profile">
                                        <Link className="nav-item nav-link"
                                            to={`/editprofile/${params.id}`}
                                        >Edit Your Profile</Link> 
                                    </button>
                                </div>

                            </div> 
                        }
                        
                        {!!errorMsg && 
                            <FormError 
                            theMessage={errorMsg} 
                             />
  
                        }
                    
                        {!!show &&
                            <Alert variant="danger">
                                <div>
                                <p>Are you sure you want to deactivate your account?</p>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <button className="btn btn-sm btn-outline-danger" 
                                        onClick={deactivate}
                                        >Deactivate Now</button>
                                    </div>
                                    <div className="col-sm-6">
                                        <button className="btn btn-sm btn-outline-danger" onClick={()=>{setShow(false)}}>Not Now</button>
                                    </div>
                                </div>
                                
                                </div>
                                
                            </Alert>
                        }

                        
                       
                </div>
        </div>
    </div>   
   
  )}

export default Profile;





