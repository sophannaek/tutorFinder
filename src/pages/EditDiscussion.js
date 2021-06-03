import React, {useEffect, useState} from 'react';
import { useSession } from '../firebase/UserProvider';
import {firestore} from '../firebase/config';
import {useForm} from 'react-hook-form';




const EditDiscussion = (post) => {
    const { user } = useSession(); 
    const [discussion, setDiscussion] = useState(null);
    const [isLoading, setLoading]= useState(false);
    const {register, handleSubmit, reset} = useForm(); 
    const [discussionID,setDiscussionID] = useState(null);

    
    useEffect(()=>{
        //get the tutor ID to fetch the data from firestore
        const discussionId = post['match']['params'].id;
        const docRef = firestore.collection('discussions').doc(discussionId);
        
        setDiscussionID(discussionId);
        const unsubscribe = docRef.onSnapshot((doc) =>{
            if(doc.exists){
              const documentData = doc.data(); 
            //   console.log(documentData);
              setDiscussion(documentData);
            }
          });
         
        return unsubscribe; 
        },[]);

    if (!discussion) {
        console.log("discussion is null");
        return null;
    }
    const handleChange = async(e) =>{
        e.preventDefault(); 
        //use spread operator 
      await setDiscussion({
          ...discussion,
          [e.target.name]:e.target.value,
      });
      
    }

    const updateDiscussion = async(data) =>{
        // console.log(user.uid)
        const docRef = firestore.collection('discussions').doc(discussionID);

        await docRef.update({topic: data.topic, detail: data.detail});
        return docRef;
    };

    const onSubmit = async (data) => {
        console.log('creating dicussion form')
        let newForm;
        setLoading(true);
        newForm = await updateDiscussion(data);
        reset(); 
        if (newForm) {
            console.log("succesfully created a discussion post");
            //redirect to the discussion board 
            post.history.push(`/discussion`);
        } else {
            setLoading(false);
        }
    }


    //class name for the form with repsect to the loading state
    const formClassname = `container mt-5 ${isLoading ?'loading': ''}`;
    return (
    
        <div className={formClassname}>
            <h3>Discussion Board</h3>
            <hr/>

            <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                    <div className="card bg-light">
                        <div className="card-body">
                        <h3 className="font-weight-light mb-3">Edit Your Post</h3>
                        <hr/>
                        <div className="form-row">
                            <section className="col-sm-12 form-group">
                         
                            <input
                                className="form-control"
                                type="text"
                                id="displayName"
                                placeholder=" Discussion topic?  "
                                name="topic"
                                value={discussion.topic}
                                required
                                {...register('topic')}
                                onChange={handleChange}    

                                
                            />
                            </section>
                        </div>
                        <section className="form-group">
                            <textarea
                            className="form-control"
                            type="text"
                            placeholder="Details about the topic you'd like to discuss."
               
                            name="detail"
                            value={discussion.detail}
                            {...register('detail')}
                            onChange={handleChange}    

                            />
                        </section>
            
                        <div className="form-group text-right mb-0">
                            <button className="btn custom-btn" type="submit" >
                            Update
                            </button>


                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </form>
        </div>
    

    );
    
}

export default EditDiscussion; 
