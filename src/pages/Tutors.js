import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { Link } from 'react-router-dom';
import {GoMail} from 'react-icons/go';
// import {FaLink} from 'react-icons/fa';
import SearchResults from 'react-filter-search';
import {useForm} from 'react-hook-form';



const Tutors = () =>{
    const [tutors, setTutors] = useState([]);
    const [keyword, setKeyword] = useState('');
    const {register, handleSubmit} = useForm(); 
    const [search, setSearch]= useState(false);

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

    const handleChange = async(e) =>{
        console.log(search)
        e.preventDefault(); 
        console.log(e.target.name + " "+e.target.value)
        if(e.target.value === ''){
          setSearch(false);
          console.log("clear input box")
        }else{
          await setKeyword(e.target.value);
          await setSearch(true);
        }
    }

    const onSubmit = async(keyword) => {
        console.log("Searching for tutors that tutoring  " + keyword);
    };

    function TutorPost(props) {
        return (
            <div className={'card-body px-3 py-2 d-flex align-items-center justify-content-left' } >
            
                <div className="btn-group pr-2">
            
                    <a href={`mailto:${props.tutor.email}`}
                        className ="btn btn-sm btn-outline-secondary"
                        title='Mail attendee'>
                        <GoMail />
                        </a>

                    <button className = "btn btn-sm btn-outline-secondary" title="view profile">
                            <Link className="nav-item nav-link" to={`/tutors/profile/${props.tutor.uid}`}
                            >View Profile</Link> 
                    </button>
                    
                </div>
                <div><b>Tutor:</b> {props.tutor.name}<br/><b>Subjects:</b> {props.tutor.subjectName}</div>
            </div>
        );

    }



    
    return (
        
            <div className="container" >
                <h2>TutorList</h2>
                <div>
                  <form className="row mt-3" 
                    onSubmit={handleSubmit(onSubmit)}
                    >
                    <div className="col-sm-10">
                      <label> Enter your subject keywods: </label>
                    
                      <span>    <input type="text"  
                          name="keyword"
                          {...register('keyword')}
                          onChange={handleChange}
                        />
                      </span>
                      <span>     <button className="btn btn-light" type="submit" >
                        Search
                        </button>    </span>
                    </div>
                  
                  </form>
                </div>
                <hr/>


                <div>

                 {(search ? 
                    <SearchResults value={keyword} data= {tutors}

                    renderResults={results => (
                      <div className="mt-4">
                        {results.map(tutor => (
                          <div className="row" key={tutor.uid}>
                            <div className="card px-3 py-2 mb-2">
                              <TutorPost tutor ={tutor} />
                            </div>   
                          </div>
                        ))}
                      </div>
                    )} />
                  
                  :'')}
                  
                </div>        

                <div style={{textAlign:'left'}}>
                {  !search && tutors.map((tutor)=> (
                        <div className="col-12 col-sm-12 col-md-8 col-lg-6 mb-2 p-0 px-1"
                        key={tutor.uid} >
                        <div className="card ">
                            <TutorPost tutor={tutor} />
                        </div>
                </div>

                ))}
            </div>
        </div>
    );
};

export default Tutors; 