import React, {useEffect, useState} from 'react';
import { useSession } from '../firebase/UserProvider';
import {firestore} from '../firebase/config';
import {getDownloadUrl} from '../firebase/user';

const TutorProfile = (tutor) => {
    const { user } = useSession(); 
    // need an ability to pass the tutorId to this page 
    // const params = useParams(); 
    //add form register
    const [tutorDocument, setTutorDocument] = useState(null);
    const [isLoading, setLoading]= useState(false);
    const [location, setLocation] = useState("N/A");
    const [imageUrl, setImageUrl] = useState("");
    

  //this effect depends on user.uid and the setValue 
  useEffect(()=>{
    //get the tutor ID to fetch the data from firestore
    const tutorId = tutor['match']['params'].id;

    // const imageUrl = getDownloadUrl(tutorId);
    getDownloadUrl(tutorId)
    .then((url) => !!url && setImageUrl(url))
    .catch((error) =>{
        console.log(error);
    });

    const docRef = firestore.collection('users').doc(tutorId);
    // use snapshot --> provide real time changes without have to refresh the browser
    const unsubscribe = docRef.onSnapshot((doc) =>{
      if(doc.exists){
        const documentData = doc.data(); 
        console.log(documentData)
        setTutorDocument(documentData);
        if(documentData.state !== ''){
            setLocation(`${documentData.city}, ${documentData.state}`);
        }}
    });
    return unsubscribe; 
    },[]);
 
  if (!tutorDocument) {
      console.log("document is null");
    return null;
  }
  //class name for the form with repsect to the loading state
  const formClassname = `container mt-3 ${isLoading ?'loading': ''}`;
  
  return (
      <div className={formClassname}> 

          <div className="container" >
            <div className="row">
               
                <div className="col-sm-4">
                    <img className="ui image" 
                        src = {imageUrl || "/profile-placeholder.png"} 
                        alt="profile"
                        width="100%"
                        // height="50%"
                    />
                    <div>
                    <a className="nav-item nav-link" href={`mailto:${tutor.email}`}>Schedule a lesson with <b>{tutorDocument.name}</b> today! </a>

                    </div>
                    

                </div>
                <div className="col-sm-8">
                <h3>{tutorDocument.name}</h3>
                    <table className='table left'>
                        <tr>
                            <th>Bio</th>
                            <td>{tutorDocument.bio}</td>
                        </tr>
                        <tr>
                            <th>Expertise</th>
                            <td>{tutorDocument.subjectName}</td>
                        </tr>
                        <tr>
                            <th>Rate</th>
                            <td>$ {tutorDocument.payRate}</td>
                        </tr>
                        <tr>
                            <th>Hours Tutored</th>
                            <td>{tutorDocument.hoursTutored}</td>
                        </tr>
                        <tr>
                            <th>Based In</th>
                            <td>{location}</td>
                        </tr>
                    </table>
                
                </div>

            </div>
            
          
                
          </div>
          
      </div>
  );

}

export default TutorProfile; 