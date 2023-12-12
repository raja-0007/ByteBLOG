import React, { useEffect, useState } from 'react'
import './Login.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../images/bblogo2.png'

import axios from 'axios'
function Login({ loginhandler }) {
    const location = useLocation()
    const action = location.state.action

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const [currentuser, setCurrentuser] = useState('')
    const [usermail, setUsermail] = useState('')
    let userhandler = (e) => {
        setEmail(e.target.value)
    }
    let pwordhandler = (e) => {
        setPassword(e.target.value)
    }
    let submithandler = async (e) => {
        e.preventDefault()


        await axios.post('http://localhost:777/login', { email: email, password: password })
            .then(res => setcred(res.data))




    }
    let setcred = (cred) => {
        if (cred.login) {
            setCurrentuser(cred.user)
            setUsermail(cred.email)
        }


    }
    useEffect(() => {
        if (usermail !== '') {
            if(action == 'login'){
                navigate('/')
            }
            else if(action == 'login/create'){
                navigate('/create')
            }
            
        }
        loginhandler(usermail, currentuser)
    }, [usermail, currentuser])
    return (
        <div className='row l-wrapper'>

            <div class="col-11 l-wrapper2">
                <Link to={'/'} className='logo '><img src={logo} className='img-fluid'></img></Link>
                <form class="signinform" onSubmit={submithandler}>
                    <input class="authinp" type="text" placeholder="Enter Email" name="email" onChange={userhandler} value={email}  />

                    <input class="authinp" type="password" placeholder="Password" name="password" onChange={pwordhandler} value={password}  />

                    <input class="btn btn-outline-success" type="submit" value="signin" />
                </form>
                Are you a new user? <Link to={"/register"} state={{action:action}}><button class="btn btn-outline-danger">signup</button></Link>
            </div>
        </div>
    )
}

export default Login
