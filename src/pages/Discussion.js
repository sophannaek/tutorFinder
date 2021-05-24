import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import SearchResults from 'react-filter-search';
import {useForm} from 'react-hook-form';


// only show the post that are current up to date 

const DicussionPosts = () =>{
    const [dicussion, setDicussion] = useState([]);
    const [keyword, setKeyword] = useState('');
    const {register, handleSubmit} = useForm(); 
    const [search, setSearch]= useState(false);


    useEffect(() => {
        const dicussionRef = firestore.collection('dicussions');
        const unsubscribe = dicussionRef.onSnapshot((querySnapshot) => {
            //return array of users -- only tutors 
          const dicussions = querySnapshot.docs.map((doc) => doc.data());
          setDicussion(dicussions);
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
          // setKeyword({[e.target.name]: e.target.value});
          await setKeyword(e.target.value);
          await setSearch(true);
        }
    }

    const onSubmit = async(keyword) => {
      console.log("Searching for tutors that tutoring  " + keyword);
    }


    function Post(props){
      return (
        <div className={'card-body justify-content jobpost' } >
          
        <p><b>Need Help With <i>{props.job.subject}</i></b></p>
        <hr/>
          <div>
          <p><b>Created By: </b> {props.job.name} | <b>Max rate:</b> $ {props.job.maxRate} | <b>When:</b> {props.job.time}</p>
          <p><b>Creatd at: </b> {props.job.created.toDate().toDateString()}</p>
          <a href={`mailto:${props.job.email}`}
          className ="btn btn-sm btn-outline-secondary"
          title='jobpost'>
          Contact This Student
          </a>
        </div>
      </div>
      );
    };


   


    return (
            <div className="container mt-4">
              <h2>Available Job Posts</h2>
              <hr/>
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
                <div >

                 {(search ? 
                    <SearchResults value={keyword} data= {dicussion}

                    renderResults={results => (
                      <div className="mt-4">
                        {results.map(job => (
                          <div className="row" jey={job.uid}>
                            <div className="card px-3 py-2 mb-2">
                              <Post job ={job} />
                            </div>   
                          </div>
                        ))}
                      </div>
                    )} />
                  
                  :'')}
                  
                </div>        

            {  !search && dicussion.map((job)=> (
                  <div className="row" key={job.uid} > 
                    <div className="card px-3 py-2 mb-2">
                      <Post job ={job} />
                    </div>
                  </div>

              ))}
                </div>
    );
};

export default DicussionPosts; 