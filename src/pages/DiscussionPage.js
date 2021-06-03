import React, {useEffect, useState} from 'react';
import { useSession } from '../firebase/UserProvider';
import {firestore} from '../firebase/config';
import {FaTrashAlt,FaRegCalendarAlt,FaUserCircle, FaPencilAlt} from 'react-icons/fa';
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import {Link, useHistory} from 'react-router-dom';
import {useForm} from 'react-hook-form';




const DiscussionPage = (post) => {
    const { user } = useSession(); 
    const history = useHistory(); 
    const [discussion, setDiscussion] = useState(null);
    const [isLoading, setLoading]= useState(false);
    const {register, handleSubmit, reset} = useForm(); 
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [like, setLike] = useState(false);
    const [placeholder, setPlaceholder] = useState('Add Your comment.');
    const [discussionID,setDiscussionID] = useState(null);
    const [whoLiked, setWhoLiked] = useState([]);
    const [likeCount, setLikeCount] = useState(0);

    
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
              var whoLikedList = []
              const documentData = doc.data(); 
              setDiscussion(documentData);
              whoLikedList = documentData.whoLiked;
            //   console.log(discussion)
              commentList = documentData.comments;
              if (commentList.length === 0){
                  setPlaceholder("Be the first to comment!");
              }
              setComments(commentList);
              setWhoLiked(whoLikedList);
              if( whoLikedList.length !== 0 && whoLikedList.includes(user.uid) ){
                  setLike(true);
                  console.log("i already Liked ")
              }  
              setLikeCount(whoLikedList.length);
              setComments(commentList);
           
            }
          });
         
        return unsubscribe; 
        },[post, user.displayName,user.uid]);

    const addComment = async(data) =>{
        console.log('adding comment');
        // console.log(data);
        console.log(comments)
        const docRef = firestore.collection('discussions').doc(discussionID);
        const comment = {
            discussionID: discussionID,
            content: data.comment,
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
    const toggle = async(like) =>{
        const thisLike = !like
        setLike(thisLike);
        let count = likeCount; 
        console.log("count ", count);
        if(thisLike === false){
            count -= 1; 
            //remove user from the likedlist if user is in
            const index = whoLiked.indexOf(user.uid);
            if (index > -1){
                whoLiked.splice(index,1);
            }
        }else{
            count += 1; 
            whoLiked.push(user.uid);
        }
        setLikeCount(count);
        
        setWhoLiked(whoLiked);

        const docRef = firestore.collection('discussions').doc(discussionID);
        await docRef.update({whoLiked: whoLiked});


        // await updateLike(whoLiked);
        console.log(whoLiked);
        //updateLike(thisLike)
        // console.log("count ", count);


    }

    // const updateLike = async(whoLiked) =>{
    //     //update youLiked -- shouldbe whoLikes --> [uid]
    //     const docRef = firestore.collection('discussions').doc(discussionID);
    //     await docRef.update({whoLiked: whoLiked});
    //     return docRef
    //     //update likeCount --> can just be hte length of whoLikes array 
    // }



    if (!discussion) {
        console.log("discussion is null");
        return null;
    }



    const deletePost = async(post,props) =>{
    
        console.log('Deleting discussion');
        await firestore.collection('discussions').doc(discussionID)
        .delete()
        .then(()=>{
            console.log("Discussion usccessfully deleted!");
            history.push('/discussion');
        })
        .catch((error)=>{
            console.log(error.message)
        })
   
    };

    //class name for the form with repsect to the loading state
    const formClassname = `container mt-5 ${isLoading ?'loading': ''}`;
    return (
    
        <div className='container mt-4 discussionPage'>
            <div className='row'>
                <div className='col-sm-6'>
                    <p className='mb-0 left'><FaUserCircle/> {discussion.name}</p>
                    <p className='small mt-0 left'><FaRegCalendarAlt /> {discussion.created.toDate().toDateString()}</p>
                    
                </div>
                {
                    !!user && (user.uid === discussion.uid) &&
                    (<div className='col-sm-6 small right'>
                        <div className='row'>
                            <div className='col-sm-6'></div>
                            <div className='col-sm-3 ml-0'>
                            {/* <span><FaPencilAlt /></span> */}
                                <Link className="nav-item nav-link link"
                                    to={`/editDiscussion/${discussion.id}`}
                                >
                                
                                    <FaPencilAlt/>
                                </Link>
                            </div>
                            <div className='col-sm-3 right'>
                                <Link className="nav-item nav-link link"
                                    onClick={deletePost}
                                ><FaTrashAlt/></Link> 
                                    
                                {/* <span><FaTrashAlt/></span> */}
                            </div>
                        </div>
                         
                    
                    </div>)
                }
                
            </div>

            <div className='row'>
                <div className='center col-sm-12'>
                    <p><strong>Topic: {discussion.topic}</strong> </p>
                    <hr className='mt-0'/>
                </div>
            </div>
                <div className='left'>
                    <p>{discussion.detail}</p>
                </div>
                <hr className=' mb-0'/>
                <div className='row'>
                    <div className='col-sm-6 left'>
                   
                      <Link className='link ml-2' onClick={() => toggle(like) }>
                        {
                            like === false ? <AiOutlineLike /> : <AiFillLike className="brand-color"/>
                        }
                    </Link>
                    <span>{likeCount}</span> 
                      
                    </div>
                    <div className='col-sm-6 right'>
                        <p>{discussion.comments.length} Comments</p>
                    </div>
                </div>
                <hr className="mb-1 mt-0"/>
                 
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
                    <input type="text" className="form-control" placeholder={placeholder} 
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
