import React from 'react'
import './Footer.css'
import flogo from '../images/footer_logo2.png'

function Footer() {
    return (
        <div className='row p-0'>
            <div className='col-12 footer'>
                <span>
                    <img src={flogo} className='img-fluid'></img>
                    <span>ByteBLOG</span>
                </span>
                <span>
                    <span>Where the Internet is about availability of information,<br /> blogging is
                        about making information creation available to anyone.</span>
                    <span>
                        create / edit / delete your blogs
                    </span>
                    <span>
                        support other bloggers by liking and commenting their blogs
                    </span>

                </span>
            </div>
        </div>
    )
}

export default Footer
