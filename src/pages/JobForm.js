import {useState} from 'react';
import { useSession } from '../firebase/UserProvider';
import {useForm} from 'react-hook-form';
import { firestore, storage} from '../firebase/config';


const JobForm= (props) => {
    const { user } = useSession();
    const { register, handleSubmit, reset } = useForm();
    const [isLoading, setLoading] = useState(false);
    // const userId = user.uid; 

    const createJob = async(data) =>{
        // console.log(userId)
        const docRef = firestore.doc(`/jobs/${user.uid}`);
        console.log(docRef)
        // create a job object
        const job = {
            uid: user.uid,
            name:user.displayName,
            email:user.email,
            subject: data.subject,
            maxRate: data.maxRate, 
            time: data.time
        }
        
        await docRef.set(job)
        return docRef;
    };

    const onSubmit = async (data) => {
        let newForm;
        setLoading(true);
        newForm = await createJob(data);
        reset(); 
        if (newForm) {
            console.log("succesfully created a job post");
            props.history.push(`/profile/${user.uid}`);
        } else {
            setLoading(false);
        }
    }
    

    const formClassname = `container mt-3 ${isLoading ?'loading': ''}`;
    return (
        <div className={formClassname}>
            <h3>Job Form</h3>
            <hr/>

            <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                    <div className="card bg-light">
                        <div className="card-body">
                        <h3 className="font-weight-light mb-3">Tutoring Request Form</h3>
                        <hr/>
                        <div className="form-row">
                            <section className="col-sm-12 form-group">
                         
                            <input
                                className="form-control"
                                type="text"
                                id="displayName"
                                placeholder=" What subject do you need help on? "
                                name="subject"
                                required
                                {...register('subject')}
                                
                            />
                            </section>
                        </div>
                        <section className="form-group">
                            <textarea
                            className="form-control"
                            type="text"
                            placeholder="Tell a little bit about yourself"
               
                            name="description"
                            {...register('description')}
                            />
                        </section>
              
                        <div className="form-row">
                            <section className="col-sm-6 form-group">
                            <input
                                className="form-control"
                                type="number"
                                name="maxRate"
                                placeholder="Maximum Rate "
                                {...register('maxRate')}
                            
                            />
                            </section>
                            <section className="col-sm-6 form-group">
                            <input
                                className="form-control"
                                type="text"
                                required
                                name="time"
                                placeholder="How soon you need it?"
                                {...register('time')}
                                
                            />
                            </section>
                            {/* <p>{errorMessage}</p> */}
                        </div>


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

export default JobForm; 