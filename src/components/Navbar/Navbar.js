import React from 'react'
import './Navbar.css'
import logo from '../images/bblogo2.png'
import logo2 from '../images/bzlogo.png'
import { Link, useNavigate } from 'react-router-dom'


function Navbar({ currentuser, logouthandler }) {
    const navigate = useNavigate()
    window.addEventListener('scroll', () => {
       
        if (window.scrollY > 100) {
            document.getElementById('nb').style.height = '60px'
            document.getElementById('logo').style.width = '160px'
        }
        else {
            document.getElementById('nb').style.height = '80px'
            document.getElementById('logo').style.width = '200px'
        }
    })
    let logouthandler2=()=>{
        logouthandler()
        navigate('/')

    }

    return (
        <div className='row sticky-top bg-light'>
            <div className='col-lg-12 mx-auto nb' id='nb'>
                <Link to={'/'} className='logo ' id='logo'><img src={logo} className='img-fluid'></img></Link>


                {currentuser !== '' ? (
                    <div>
                        <Link to={'/create'} className='n-newb'>new byte</Link>
                        <span  className='dropdown-btn bg-secondary-subtle p-1 ps-2 pe-2'>
                            <i class="fa-solid fa-user"></i>&nbsp;
                            <span className='username'>{currentuser} <i class="fa-solid fa-chevron-down"></i></span>
                            <div className='dropdown '>
                                <Link to={'/profile'}>view profile</Link>
                                <Link onClick={logouthandler2}><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;Logout</Link>
                            </div>
                        </span>


                    </div>

                ) :
                    (<Link to={'/login'} state={{ action: 'login' }}>Login/Signup</Link>)
                }

            </div>

        </div>
        
    )
}

export default Navbar
