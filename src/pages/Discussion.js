import React, {useState, useEffect } from 'react';
import { useSession } from '../firebase/UserProvider';
import { firestore } from '../firebase/config';
import SearchResults from 'react-filter-search';
import {useForm} from 'react-hook-form';
import {Link} from 'react-router-dom';
import {FaTrashAlt,FaRegCalendarAlt,FaUserCircle, FaCommentAlt, FaPencilAlt} from 'react-icons/fa';



const DiscussionPosts = () =>{
    const { user } = useSession();
    const [discussions, setDiscussion] = useState([]);
    const [keyword, setKeyword] = useState('');
    const {register, handleSubmit} = useForm(); 
    const [search, setSearch]= useState(false);


    useEffect(() => {
        //it works 
        // const discussionRef = firestore.collection(`discussions`).doc(user.uid).collection('posts');
        
        // console.log(user.uid)
        const discussionRef = firestore.collection('discussions');
        const unsubscribe = discussionRef.onSnapshot((querySnapshot) =>{
          console.log('here....')
          const Discussions = querySnapshot.docs.map((doc)=> doc.data()); 

          // return most recent post first 
          Discussions.sort(function(a,b) {
            return b.created - a.created;
          });
          setDiscussion(Discussions);
          
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
          <div className="card">
            <div>    
              <h5 className='card-header'>{props.discussion.topic}</h5>
            </div>
    
            <div className="card-body">
              <p className="card-text">{props.discussion.detail}</p>
              <hr className='small mb-0'/>
              <div className='row small'>
                <div className='col-sm-4'>
                  <p><FaUserCircle/> {props.discussion.name}</p>
                </div>
                <div className='col-sm-4 '>
                  <p><FaRegCalendarAlt /> {props.discussion.created.toDate().toDateString()}</p>
                </div>
                <div className='col-sm-4'>
                  <FaCommentAlt/> {props.discussion.comments.length}
                </div>
              </div>
             
              <button className="btn btn-sm btn-outline-dark" 
                // onClick={deactivate}
                >
                  <Link className="nav-item nav-link small" to={`/discussionPage/${props.discussion.id}`}
                              >View Discussion</Link> 
                </button>
            </div>
          </div>
      
      );
    };

    return (
            <div className="container mt-4">
              <h2>Discussion Board</h2>
              <hr/>
              <div className="row">
                <div className="col-sm-8">
                  <form className="row mt-3" 
                      onSubmit={handleSubmit(onSubmit)}
                      >
                      <div className="col-sm-12">
                        <div className="input-group mb-3">
                          <input type="text" className="form-control" placeholder="Enter your search keywords" 
                          name="keyword"
                          {...register('search')}
                          onChange={handleChange}
                          />     
                          <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="submit" 
                            >Search</button>
                          </div>
                        </div>
                        
                      </div>
                    
                    </form>
                </div>
                <div className="col-sm-4">
                  <button className = "btn btn-sm btn-outline-secondary" title="New discussion">
                    <Link className="nav-item nav-link"
                         to={`/discussionForm`}
                    >Create a new discussion</Link> 
                  </button>

                </div>

              </div>
              <hr/> 
                <div className='row'>
              
                  <div className="col-sm-12">
                    {(search ? 
                      <SearchResults value={keyword} data= {discussions}

                      renderResults={results => (
                        <div className="mt-4 ml-5">
                          {results.map(discussion => (
                            <div className="row" Key={discussion.id}>
                              <div className="discussion-post px-3 py-2 mb-2">
                                <Post discussion ={discussion} />
                              </div>   
                            </div>
                          ))}
                        </div>
                      )} />
                    
                    :'')}
                    

                    {  !search && discussions.map((discussion)=> (
                    <div className="row" key={discussion[0]} > 
                      {/* <div className="card px-3 py-2 mb-2"> */}
                      <div className="discussion-post">
                        <Post discussion ={discussion} />
                      </div>
                    </div>

                  ))}


                  </div>
                 
                </div>        

            
          </div>
    );
};

export default DiscussionPosts; 