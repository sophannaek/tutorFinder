import {useState} from 'react';
import { useSession } from '../firebase/UserProvider';
import {useForm} from 'react-hook-form';
import { firestore} from '../firebase/config';
import firebase from 'firebase';

// need to add timestamp 

const DiscussionForm = (props) => {
    const { user } = useSession();
    const { register, handleSubmit, reset } = useForm();
    const [isLoading, setLoading] = useState(false);

    const createDiscussion = async(data) =>{
        console.log(user.uid)
        // const docRef = firestore.doc(`/discussions/${user.uid}`).collection('posts');

        //works
        const docRef = firestore.collection('discussions');
        // create a job object
        const post = {
            uid: user.uid,
            id: '',
            name:user.displayName,
            email:user.email,
            topic: data.topic,
            detail: data.detail, 
            likes: 0, 
            comments: [],
            // time: data.time,
            created: firebase.firestore.FieldValue.serverTimestamp()

        }
        await docRef.add(post).then((doc) => {
            docRef.doc(doc.id).update({id: doc.id});
        });
        return docRef;
    };

    const onSubmit = async (data) => {
        console.log('creating dicussion form')
        let newForm;
        setLoading(true);
        newForm = await createDiscussion(data);
        reset(); 
        if (newForm) {
            console.log("succesfully created a discussion post");
            //redirect to the discussion board 
            props.history.push(`/discussion`);
        } else {
            setLoading(false);
        }
    }
    

    const formClassname = `container mt-3 ${isLoading ?'loading': ''}`;
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
                        <h3 className="font-weight-light mb-3">Your Post</h3>
                        <hr/>
                        <div className="form-row">
                            <section className="col-sm-12 form-group">
                         
                            <input
                                className="form-control"
                                type="text"
                                id="displayName"
                                placeholder=" Discussion topic?  "
                                name="topic"
                                required
                                {...register('topic')}
                                
                            />
                            </section>
                        </div>
                        <section className="form-group">
                            <textarea
                            className="form-control"
                            type="text"
                            placeholder="Details about the topic you'd like to discuss."
               
                            name="detail"
                            {...register('detail')}
                            />
                        </section>
            


                        <div className="form-group text-right mb-0">
                            <button className="btn custom-btn" type="submit" >
                            Create
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


};

export default DiscussionForm; 