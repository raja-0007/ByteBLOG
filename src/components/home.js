import React from 'react'

function home() {
  return (
    <>
    <div class="container-fluid">

        <div class="row h-navrow sticky-top bg-light">
            <div id="h-nav" class="col-md-12 col-11 h-nav  mx-auto">
                <a href="/home"><span class="bzlogotxt"><img class="bzlogo" src="./images/bzlogo.png"
                            alt=""/>B<span>Z</span></span></a>
                <span>
                    <a class="signout" href="/signout">
                        <img src="images/logout.png" width="25px" alt=""/>
                        </a></span>
               {/*<i class="fa-solid fa-arrow-right-from-bracket"></i>*/}

            </div>
        </div>
        <div class="row ">
            <div class="col-12 text-center p-0 h-bzdiv">

                <img src="images/banner5.jpg" class="img-fluid" width="100%" alt=""/>
                <div class="h-bzdivcontent">
                    <span class="h-bztitle text-light">BLOG ZENITH</span>
                    <span class="h-bzquote">Where the Internet is about availability of information,<br/> blogging is
                        about making information creation available to anyone.</span>
                    <a class="newposta" href="/create"><span class="newpost">
                            <span class="newpostin">
                                <i class="fa-solid fa-plus"></i>&nbsp;<span>new blog</span></span></span></a>
                </div>
            </div>
        </div>
    </div>
    </>
    
  )
}

export default home
