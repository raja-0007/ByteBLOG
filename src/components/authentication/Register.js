import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../images/bblogo2.png'
import axios from 'axios'

function Register() {
  const location = useLocation()
  const action = location.state.action
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRepassword] = useState('')
  const [issignup,setIssignup] = useState('')
  let emailhandler = (e) => {
    setEmail(e.target.value)
}
let pwordhandler = (e) => {
  setPassword(e.target.value)
}
let repwordhandler = (e) => {
  setRepassword(e.target.value)
}
let userhandler=(e)=>{
  setUsername(e.target.value)
}
useEffect(()=>{
  let signuphandler=()=>{
    if(issignup){
      navigate('/login',{state:{action:action}})
    }
    else if(issignup === false){
      alert('signup unsuccessful')
    }
  }
  signuphandler()
},[issignup])

let submithandler=async(e)=>{
  e.preventDefault()
  if(password == repassword){
    await axios.post('http://localhost:777/signup',{email:email, username:username, password:password})
    .then(res=>setIssignup(res.data))
    
    
  }
  else{
    alert('please confirm the password')
  }

  
  
}

  return (
    <div className='row l-wrapper'>
      <div class="col-11 l-wrapper2">
        <Link to={'/'} className='logo '><img src={logo} className='img-fluid'></img></Link>
        <form class="signupform" onSubmit={submithandler}>
          <input class="authinp" type="text" placeholder="Enter Username" name="username" value={username} onChange={userhandler} />

          <input class="authinp" type="email" placeholder="Enter Email" name="email" value={email} onChange={emailhandler}/>

          <input class="authinp" type="password" placeholder="Enter Password" name="password" value={password} onChange={pwordhandler} />

          <input class="authinp" type="password" placeholder="Confirm Password" name="repassword" value={repassword} onChange={repwordhandler}/>



          <input type="submit" value="signup" class="btn btn-outline-danger" />
        </form>
        Already a user? <Link to={'/login'} state={{action:action}}><button class="btn btn-outline-success">signin</button></Link>
      </div>
    </div>
  )
}

export default Register
