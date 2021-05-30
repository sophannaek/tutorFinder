import React, {useEffect, useState} from 'react';
import { useSession } from '../firebase/UserProvider';
import {firestore} from '../firebase/config';
import {FaTrashAlt,FaRegCalendarAlt,FaUserCircle, FaCommentAlt, FaPencilAlt, FaVihara} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';




const DiscussionPage = (post) => {
    const { user } = useSession(); 
    const [discussion, setDiscussion] = useState(null);
    const [isLoading, setLoading]= useState(false);
    const {register, handleSubmit, reset} = useForm(); 
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    // const [comment, setComment] = useState('');
    const [loopData,setLoopData] = useState('');
    const [discussionID,setDiscussionID] = useState(null);

    
    useEffect(()=>{
        //get the tutor ID to fetch the data from firestore
        const discussionId = post['match']['params'].id;
        console.log(discussionId)
        console.log("user"+ user.displayName)
        const docRef = firestore.collection('discussions').doc(discussionId);
        // console.log(discussionId);
        
        setDiscussionID(discussionId);
        const unsubscribe = docRef.onSnapshot((doc) =>{
            if(doc.exists){
              var commentList = [];
              const documentData = doc.data(); 
              setDiscussion(documentData);
              console.log(discussion)
              commentList = documentData.comments;
              setComments(commentList);
               var loopData = '';
                for(let item in commentList){        
                  const comm = commentList[item];
                  console.log(comm.name)
                  loopData += commentPost(comm)



              }
              setLoopData(loopData);
              setComments(commentList);
           
            }
          });
         
        return unsubscribe; 
        },[]);

    const addComment = async(data) =>{
        console.log('adding comment');
        // console.log(data);
        console.log(comments)
        const docRef = firestore.collection('discussions').doc(discussionID);
        const comment = {
            discussionID: discussionID,
            content: data.comment,
            // timestamps: 
            uid: user.uid,
            username: user.displayName,
            timestamp: Date.now()
        }
        comments.push(comment);
        setComments(comments);
        
        await docRef.update({comments: comments});

        reset(); 
        // const showAllComments = () => {
        // //show all comments for each post 
        // setShowComments = true; 
        // console.log('adding comments...');
        // }
    }

    function formatTime(timestamp) {
        const d = new Date(timestamp);
        const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
        return time;
    }

    const commentPost = (comment)=>{
        return (
            `<div class="comment-post">
                <div class='col-sm-4'>
                        <span><FaUserCircle /></span>
                        
                    <p> <FaCommentAlt /> ${comment.username}</p>

                </div>
                <div class='col-sm-8'>
                    <p>${comment.content}</p>
                    <p class='small'>${formatTime(comment.timestamp)}</p>
                </div>
                
            </div>`
        );
        
    }

    if (!discussion) {
        console.log("discussion is null");
        return null;
    }

    //class name for the form with repsect to the loading state
    const formClassname = `container mt-5 ${isLoading ?'loading': ''}`;
    return (
    
        <div className='container mt-4'>
            <div className='row'>
                <div className='col-sm-4'>
                    <p className='mb-0 left'><FaUserCircle/> {discussion.name}</p>
                    <p className='small mt-0 left'><FaRegCalendarAlt /> {discussion.created.toDate().toDateString()}</p>
                    
                </div>
                {
                    !!user && (user.uid === discussion.uid) &&
                    (<div className='col-sm-6 small right'>
                        <span><FaPencilAlt />    </span>  <span><FaTrashAlt/></span>
                    
                    </div>)
                }
                
            </div>
           
            <div className='center'>
                <p><strong>Topic: {discussion.topic}</strong> </p>
                <hr className='mt-0'/>
            </div>
            
           
          <div className='left'>
            <p>{discussion.detail}</p>
          </div>
          <hr className='col-sm-12 mb-0'/>
          <div className=' col-sm-12 right'>
                {discussion.comments.length} Comments

            </div>
          <hr className="mb-1 mt-0"/>
         
        {/* show comments here! */}
            {/* <div className='col-sm-12 left'>
                <div dangerouslySetInnerHTML={{__html: loopData}}></div>
            </div> */}
    

         
          
  
          <div>

     


              {
                  comments.map(comment =>{
                      return (
                        <div key = {formatTime(comment.timestamp)}> 
                            <div className='comment-post left ml-2'>
                                <div className='comment-header small'><FaUserCircle/>  {comment.username}  {formatTime(comment.timestamp)}</div>
                                <p className='ml-1'>{comment.content}</p>
                              
                               
                            </div>
                        </div>);
                  })
              }
              </div> 

              <div className='col-sm-12 mt-2'>
            {/* add comment section --> works! */}
            {
              !showComments  && 
              (<form 
              onSubmit={handleSubmit(addComment)}
              >
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Add your comment" 
                    name="comment"
                    required
                    {...register('comment')}
                    
                    />     
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="submit" 
                      >Reply</button>
                  </div>

                </div>
              </form>)
            
            }
            
          </div>
        
        </div>
    

    );
    
}

export default DiscussionPage; 
