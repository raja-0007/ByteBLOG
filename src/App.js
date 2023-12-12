import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap/dist/js/bootstrap.js'
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home.js';
import Create from './components/Create/Create.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './components/authentication/Login.js';
import Register from './components/authentication/Register.js';
import Edit from './components/edit/Edit.js';
import Blog from './components/blog/Blog.js';
import Profile from './components/profile/Profile.js';
import Profile2 from './components/profile/Profile2.js';

function App() {
  
  const [currentuser, setCurrentuser] = useState('')
  const [usermail, setUsermail] = useState('')
  const [about,setAbout] = useState('')
  const [blogs, setBlogs] = useState([])
  useEffect(() => {
    let authentication = async () => {
      await axios.get('http://localhost:777/authentication')
        .then(res => setcred(res.data))

    }
    let getdata = async () => {

      await axios.get('http://localhost:777/home')


        .then(res => setBlogs(res.data))
        .catch(err => console.log(err))

    }
    getdata()
    authentication()


  }, [])
  async function setcred(cred) {
    setUsermail(cred.email)

    setCurrentuser(cred.user)

    setAbout(cred.about)
    //console.log(cred.about)
  }
  async function logouthandler() {
    await axios.get('http://localhost:777/logout')
      .then(res => console.log(res.data))
    setCurrentuser('')
    setUsermail('')
  }
  async function loginhandler(mail, user) {

    setUsermail(mail)
    setCurrentuser(user)
  }

  let addbyte = async (title, content, image) => {
    setBlogs([...blogs, { title: title, content: content, image: image, user: usermail, username: currentuser, comments: [] }])
    
  }
  let editbyte = async (id,title, content, image) => {
    setBlogs(blogs.map(blog=> blog._id == id ? ({...blog, title: title, content: content, image: image}):(blog)))
    
  }

  let pedit=async(name,about)=>{
     setCurrentuser(name)
     setAbout(about)
     await axios.post('http://localhost:777/editprofile',{name:name,about:about})
     .then(console.log('profile edited'))
  }
  
  

  return (

    <BrowserRouter>
      <div className="container-fluid">

        <Routes>
          <Route path='/' element={
            <>
              <Navbar currentuser={currentuser} logouthandler={logouthandler} />
              <Home usermail={usermail} currentuser={currentuser} />
            </>
          }></Route>
          <Route path='/create' element={
            <>
              <Navbar logouthandler={logouthandler} currentuser={currentuser} />
              <Create addbyte={addbyte} />
            </>
          }></Route>
          <Route path='/edit' element={
            <>
              <Navbar logouthandler={logouthandler} currentuser={currentuser} />
              <Edit editbyte={editbyte}/>
            </>
          }></Route>
          <Route path='/profile' element={
            <>
              <Navbar logouthandler={logouthandler} currentuser={currentuser} />
              <Profile currentuser={currentuser} usermail={usermail} pedit={pedit} pabout={about}/>
            </>
          }></Route>
          <Route path='/profile2' element={
            <>
              <Navbar logouthandler={logouthandler} currentuser={currentuser} />
              <Profile2 usermail={usermail}/>
            </>
          }></Route>
          <Route path='/blog' element={
            <>
              <Navbar logouthandler={logouthandler} currentuser={currentuser} />
              <Blog usermail={usermail} currentuser={currentuser} />
            </>
          }></Route>
          <Route path='/login' element={<Login loginhandler={loginhandler} />}></Route>
          <Route path='/register' element={<Register />}></Route>
        </Routes>


      </div>
    </BrowserRouter>

  );
}

export default App;
