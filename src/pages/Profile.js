import React, {useEffect, useState} from 'react';
import { useSession } from '../firebase/UserProvider';
import {firestore} from '../firebase/config';
import {useParams, Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { updateUserDocument } from '../firebase/user';
import { ProfileImage } from '../ProfileImage';


const Profile = () => {
  const { user } = useSession();
  const params = useParams(); 
  //add form register
  const {register, setValue, handleSubmit} = useForm(); 
  const [isLoading, setLoading]= useState(false);
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
    const docRef = firestore.collection('users').doc(params.id);

    // use snapshot --> provide real time changes without have to refresh the browser
    const unsubscribe = docRef.onSnapshot((doc) =>{
        console.log(doc)
      if(doc.exists){
        const documentData = doc.data(); 
        setForm(documentData);
      }
    });
    return unsubscribe; 
  },[ user.uid, setValue,params.id]);

  const handleChange = async(e) =>{
      e.preventDefault(); 
      console.log(form);
      //use spread operator 
    await setForm({
        ...form,
        [e.target.name]:e.target.value,
    });
    // console.log(form)
  }

  const onSubmit = async(form) => {
    try{
        console.log("updating")
        console.log(form)
      setLoading(true);
      // add the document using  uid and add the rest of the document 
      await updateUserDocument({uid: params.id,  ...form});
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  }
  if (!form) {
      console.log("document is null");
    return null;
  }
  //class name for the form with repsect to the loading state
  const formClassname = `container mt-3 ${isLoading ?'loading': ''}`;
  
  return (
    
    <div className={formClassname}>
        <h2 className="font-weight-dark mt-2 mb-5">Profile Page</h2>
        <p>edit information</p>
        <hr/>
        <div className="row">
            <div className="col-sm-4">
                <div className="mt-2" style={{ maxWidth: 560}}>
                    <ProfileImage id={params.id} />
                </div>
                <div className="mt-5">
                    {/* <p>create a tutoring request</p> */}
                    <button className = "btn btn-sm btn-outline-secondary" title="view profile">
                    <Link className="nav-item nav-link"
                         to={`/JobForm/`}
                    >Create a tutoring request</Link> 
              </button>
                </div>
            </div>
            <div className="col-sm-8">
                 
            <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="container">
                    {/* <h3 style={{ textAlign: 'left'}}>Edit your info</h3> */}
                    {/* <div className="col-sm-8 "> */}
                    
                
                    <div className="form-row">
                        <section className="col-sm-6 form-group">

                        <label >Display Name</label>
                        <input
                            className="form-control"
                            type="text"
                            id="displayName"
                            name="name"
                            value = {form.name}
                            {...register('name')}
                            onChange={handleChange}
                            
                            
                        />
                        </section>
                        <section className="col-sm-6 form-group">

                        <label >Email</label>
                        <input
                            className="form-control"
                            type="email"
                            id="email"
                            name="email"
                            disabled
                            value = {form.email}
                            // {...register('email')}
                            // onChange ={e => setName(e.target.value )}
                            onChange={handleChange}
                            
                        />
                        </section>
                    </div>

                    <div className="form-row">
                        <label> Update Your Bio</label>
                        <textarea className="form-control"
                            type="text"
                            name="bio"
                            value={form.bio}
                            {...register('bio')}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-row">
                        <section className="col-sm-6 form-group">

                            <label> User Type</label>
                            <select className="form-control" 
                                id="userType"
                                name="userType"
                                value={form.userType}
                                {...register('userType')}
                                onChange={handleChange}
                                >
                                <option value="signup">Sign Up As ...</option>
                                <option value="tutor">Tutor</option>
                                <option value="tutee">Tutee</option>
                            </select>

                        </section>
                        <section className="col-sm-6 form-group">

                        <label>Pay Rate (USD)</label>
                        <input
                            className="form-control"
                            type="number"
                            id="payRate"
                            name="payRate"
                            value = {form.payRate}
                            {...register('payRate')}
                            onChange={handleChange}
                            
                        />
                        </section>
                    </div>
                    <div className="form-group">
                        <label>Subjects </label>
                        <textarea type="text" className="form-control"
                            name="subjectName"
                            value={form.subjectName}
                            {...register('subjectName')}
                            onChange={handleChange}
                         />
                    </div>
                    <hr/>
                    <h3>Personal Information</h3>
                    <div className="form-row">
                        <section className="col-sm-6 form-group">

                        <label> Address</label>
                        <input
                            className="form-control"
                            type="text"
                            id="address"
                            name="address"
                            value = {form.address}
                            {...register('address')}
                            onChange={handleChange}
                            
                        />
                        </section>
                        <section className="col-sm-6 form-group">

                        <label>City</label>
                        <input
                            className="form-control"
                            type="text"
                            id="city"
                            name="city"
                            value = {form.city}
                            {...register('city')}
                            // onChange ={e => setName(e.target.value )}
                            onChange={handleChange}
                            
                        />
                        </section>
                    </div>

                    <div className="form-row">
                        <section className="col-sm-6 form-group">

                        <label>State</label>
                        <input
                            className="form-control"
                            type="text"
                            id="state"
                            name="state"
                            value = {form.state}
                            {...register('state')}
                            onChange={handleChange}
                            
                        />
                        </section>
                        <section className="col-sm-6 form-group">

                        <label>Zip Code</label>
                        <input
                            className="form-control"
                            type="text"
                            id="zip"
                            name="zip"
                            value = {form.zip}
                            {...register('zip')}
                            onChange={handleChange}
                            
                        />
                        </section>
                    </div>
                    <div>
                        <label>Phone</label>
                        <input
                            className="form-control"
                            type='text'
                            name='phone'
                            value={form.phone}
                            {...register('phone')}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group text-right mb-0">
                        <button className="btn custom-btn" type="submit" >
                        Submit
                        </button>
                    </div>
                    </div>
            {/* </div> */}
        </form>

            </div>
        </div>
           
    </div>   


  )
}

export default Profile;





