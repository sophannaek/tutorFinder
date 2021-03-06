import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login,signInWithGoogle, signInWithGitHub } from '../firebase/auth';
import FormError from '../FormError';



function Login(props) {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [errorMsg, setError] = useState(null);

  const onSubmit = async (data) =>{
      let user; 
      setLoading(true);
      try{
          user = await login(data);
          console.log("succesffully login "+ user);
          reset(); 
      }catch(error){
          console.log(error);
          setError(error.message);
      }

      if(user){
          props.history.push(`/profile/${user.uid}`);
        //   routeOnLogin(user);
      }else{
          setLoading(false);
      }
};
const googleSignIn = async()=>{
    try {
      await signInWithGoogle();
    } catch (error) {
    //   this.setState({ error: error.message });
    }
  }

const githubSignIn = async()=>{
    try {
      await signInWithGitHub();
    } catch (error) {
      console.log(error)
    //   this.setState({ error: error.message });
    }
  }


const formClassName = `mt-3 ${isLoading ? 'loading': ''} `;
return(
    <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
        <div className="container">
            <div className="row justify-content-center">
            <div className="col-lg-6">
                <div className="card bg-light">
                <div className="card-body">
                    <h3 className="font-weight-light mb-3">Log in</h3>
                    {errorMsg !== null ? (
                            <FormError 
                                theMessage={errorMsg} 
                            />
                         ): null } 
                    <section className="form-group">
                   
                    <label
                        className="form-control-label sr-only"
                        htmlFor="Email">
                        Email
                    </label>
                    <input
                        required
                        className="form-control"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        {...register('email')}
                  
                    />
                    </section>
                    <section className="form-group">
                    <input
                        required
                        className="form-control"
                        type="password"
                        name="password"
                        placeholder="Password"
                        {...register('password')}
                   
                    />
                    </section>
                    <div className="form-group text-right mb-0">
                    <button className="btn custom-btn" type="submit">
                        Log in
                    </button>
               
                    </div>
                </div>

                <hr/>
                   
                <div className='form-row justify-content-left ml-3 mb-3'>
               
                    <div>
                        <button className="btn btn-outline-dark mr-2" type="button" onClick={googleSignIn}>
                            Sign up with Google
                        </button>
                        <button className="btn btn-outline-dark" type="button" onClick={githubSignIn}>
                            Sign up with GitHub
                        </button>
                    </div> 
                </div>
               
                </div>
            </div>
            </div>
        </div>
</form>
    
);

}


export default Login; 




