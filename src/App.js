import './App.css';
import './firebase/config';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import Header from './Header';
import './firebase/config';
import Signup from './pages/Signup';
import Login from './pages/Login';
import {UserProvider} from './firebase/UserProvider';
import Profile from './pages/Profile';
import PrivateRoute from './router/PrivateRoute';
import ProfileRedirect from './router/ProfileRedirect';
import AboutUs from './pages/AboutUs';
import Tutors from './pages/Tutors';
import TutorProfile from './pages/TutorProfile';
import JobForm from './pages/JobForm';
import JobPosts from './pages/JobPosts';
import EditProfile from './pages/EditProfile';
import Discussion from './pages/Discussion';
import DiscussionForm from './pages/DiscussionForm';
import DiscussionPage from './pages/DiscussionPage';
import EditDiscussion from './pages/EditDiscussion';


function App() {
  return (
    <div className="App">
      <div>
        <UserProvider>
          <BrowserRouter>
          <Header></Header>
            <Switch>
              <ProfileRedirect exact path ="/signup" component ={Signup} />
              <ProfileRedirect exact path="/login" component={Login} />
              <PrivateRoute exact path="/profile/:id" component={Profile} />
              <Route exact path="/">
                  <Redirect to="/login" />
              </Route>
              <Route exact path= "/aboutus" component = {AboutUs} />
              <Route exact path= "/tutors" component = {Tutors} />
              <Route exact path="/jobPosts" component={JobPosts} />
              <Route exact path="/tutors/profile/:id" component = {TutorProfile} />
              <Route exact path="/jobform" component={JobForm} />
              <Route exact path='/editprofile/:id' component={EditProfile}  />
              <Route exact path='/discussion' component={Discussion} />
              <Route exact path="/discussionForm" component={DiscussionForm} />
              <Route exact path="/discussionPage/:id" component={DiscussionPage}/>
              <Route exact path="/editDiscussion/:id" component={EditDiscussion} />
            </Switch> 
          
          </BrowserRouter>
        </UserProvider>
        
        
      </div>
    </div>
  );
}

export default App;

