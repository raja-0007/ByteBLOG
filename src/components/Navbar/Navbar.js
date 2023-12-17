import React, { useEffect } from 'react'
import './Navbar.css'
import logo from '../images/bblogo2.png'
import logo2 from '../images/bzlogo.png'
import { Link, useNavigate } from 'react-router-dom'


function Navbar({ usermail, currentuser, logouthandler }) {
    const navigate = useNavigate()

    window.addEventListener('scroll', () => {

        if (usermail !== '') {
            if (window.scrollY > 100) {

                if (window.innerWidth > 599) {
                    document.getElementById('nb').style.height = '60px'
                    document.getElementById('logo').style.width = '160px'
                    
                }
                else {
                    document.getElementById('nb').style.height = '80px'
                    document.getElementById('logo').style.width = '150px'
                    
                }

            }
            else {
                if (window.innerWidth > 599) {
                    document.getElementById('nb').style.height = '80px'
                    document.getElementById('logo').style.width = '200px'
                    
                }
                else {
                    document.getElementById('nb').style.height = '120px'
                    document.getElementById('logo').style.width = '160px'
                    
                }


            }
        }
        else {
            if (window.scrollY > 100) {

                if (window.innerWidth > 599) {
                    document.getElementById('nb').style.height = '60px'
                    document.getElementById('logo').style.width = '160px'

                }
                else {
                    document.getElementById('nb').style.height = '80px'
                    document.getElementById('logo').style.width = '150px'

                }

            }
            else {
                if (window.innerWidth > 599) {
                    document.getElementById('nb').style.height = '80px'
                    document.getElementById('logo').style.width = '200px'

                }
                else {
                    document.getElementById('nb').style.height = '120px'
                    document.getElementById('logo').style.width = '160px'

                }


            }
        }

    })


    let logouthandler2 = () => {
        logouthandler()

        navigate('/')
        


    }
    

    return (
        <div className='row sticky-top bg-light'>
            <div className='col-lg-12 mx-auto nb' id='nb'>
                <Link to={'/'} className='logo ' id='logo'><img src={logo} className='img-fluid'></img></Link>


                {currentuser !== '' ? (
                    <div className='loggednb'>
                        <Link to={'/create'} className='n-newb'><i class="fa-regular fa-square-plus"></i>new Byte</Link>
                        <div class="dropdown rounded">
                                <span className=' bg-secondary-subtle p-1 ps-2 pe-2 dropdown-toggle rounded' data-bs-toggle="dropdown" aria-expanded="false" >
                                    <span>
                                        <i class="fa-solid fa-user"></i>&nbsp;
                                        <span className='username'>{currentuser}</span>
                                    </span>
                                </span>

                                <ul class="dropdown-menu">
                                    <li><Link to={'/profile'} className='dropdown-item'>view profile</Link></li>
                                    <li><Link to={'/'} onClick={logouthandler2} className='dropdown-item'><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;Logout</Link></li>
                                    
                                </ul>
                            </div>
                        


                    </div>

                ) :
                    (<div className=' p-1 ps-2 pe-2 logsign'><Link to={'/login'} state={{ action: 'login' }}>Login</Link>/<Link to={'/register'} state={{ action: 'login' }}>Signup</Link></div>)
                }

            </div>

        </div>

    )
}

export default Navbar
