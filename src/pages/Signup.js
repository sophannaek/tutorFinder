import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signup,signInWithGoogle, signInWithGitHub } from '../firebase/auth';
import FormError from '../FormError';
import {Link} from 'react-router-dom';


function Signup(props){
    const { register, handleSubmit, reset } = useForm();
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setError] = useState(null);
    let errorMessage = null;

    const onSubmit = async (data) => {
        let newUser;
        let info; 
        setLoading(true);
        if(data.password !== data.RepeatedPassword){
            errorMessage = "passwords do not match!";
            setError(errorMessage)
        }else if (data.password.length < 6 ){
            console.log("password is too short");
            errorMessage = "Password must be at least 6 characters long";
            setError(errorMessage)
        }else{
            try {
                info ={"displayName":data.displayName,"email": data.email, "password": data.password,"userType":data.userType}
                console.log(info)
                // newUser = await signup(data);
                newUser = await signup(info);
                reset();
            } catch (error) {
                console.log(error);
                errorMessage = error.message; 
                setError(errorMessage);
            }

            if (newUser) {
                props.history.push(`/profile/${newUser.uid}`);
            } else {
                setLoading(false);
            }
        }
    };

    const googleSignIn = async()=>{
        try {
          await signInWithGoogle();
        } catch (error) {
            console.log(error.message);
        }
      }
    
    const githubSignIn = async()=>{
        try {
          await signInWithGitHub();
        } catch (error) {
          console.log(error.message)        
        }
      }

    
    const formClassName = `text-center mt-4 ${isLoading ? 'loading': ''} `;

    return(
    <div className={formClassName}>
        <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                <div className="card bg-light">
                    <div className="card-body">
                    <h3 className="font-weight-light mb-3">Sign Up</h3>
                    <div className="form-row">
                        {errorMsg !== null ? (
                            <FormError 
                                theMessage={errorMsg} 
                            />
                         ): null } 
                        <section className="col-sm-12 form-group">
                        <label
                            className="form-control-label sr-only"
                            htmlFor="displayName"
                        >
                                Display Name
                            </label>
                        <input
                            className="form-control"
                            type="text"
                            id="displayName"
                            placeholder="Display Name"
                            name="displayName"
                            required
                            {...register('displayName')}
                            
                        />
                        </section>
                    </div>
                    <section className="form-group">
                        <label
                            className="form-control-label sr-only"
                            htmlFor="email"
                            >
                        Email
                        </label>
                        <input
                        className="form-control"
                        type="email"
                        id="email"
                        placeholder="Email Address"
                        required
                        name="email"
                        {...register('email')}
                        />
                    </section>

                    <div className="form-row">
                        <section className="col-sm-6 form-group">
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            placeholder="Password"
                            {...register('password')}
                         
                        />
                        </section>
                        <section className="col-sm-6 form-group">
                        <input
                            className="form-control"
                            type="password"
                            required
                            name="RepeatedPassword"
                            placeholder="Repeat Password"
                            {...register('RepeatedPassword')}
                            
                        />
                        </section>
                        <p>{errorMessage}</p>
                    </div>
                    <div className="form-group text-right mb-0">
                        <button className="btn custom-btn" type="submit">
                        Sign Up
                        </button>
                    </div>
                    
                    </div>
                <hr/>
                   
                <div className='form-row justify-content-left ml-3'>
                    <p>You can also sign up with any of these services</p>
                    <div>
                        <button className="btn btn-outline-dark mr-2" type="button" onClick={googleSignIn}>
                            Sign up with Google
                        </button>
                        <button className="btn btn-outline-dark" type="button" onClick={githubSignIn}>
                            Sign up with GitHub
                        </button>
                    </div> 
                </div>
                <div>
                    <hr/>
                    <p className="form-row justify-content-left ml-3">Already have an account?  <span> 
                        <Link style={{color:'#DF734E'}}
                         to={`/login`}
                    > Login</Link></span></p>
                </div>
            
                
            
                </div>
                </div>
                
            </div>
            
            </div>
            
        </form>
        
    </div>   
);    
}
export default Signup;
