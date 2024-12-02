import React, { useEffect, useState } from 'react'
import './Home.css'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo2 from '../images/bblogo22.png'
import feather from '../images/feather.png'
import Hblog from './Hblog'
import logo from '../images/bblogo2.png'
function Home({ usermail, currentuser }) {

    const [blogs, setBlogs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {

        let getdata = async () => {

            await axios.get('http://localhost:777/home')
                .then(res => {setBlogs(res.data); console.log('dataaaaaa', res.data)})
                .catch(err => console.log(err))

        }

        getdata()





    }, [])

    let delete_byte = async (id) => {

        let src = 'http://localhost:777/delete/' + id
        await axios.get(src)
            .then(res => setBlogs(res.data))
    }

    useEffect(() => {

        let getlikes = () => {

            blogs.forEach((blog, index) => {

                blog.likes.forEach(like => {

                    if (like.user == usermail) {
                        document.getElementById(index).className = 'fa-solid fa-heart op2'



                    }
                })
            })
        }
        if (usermail !== '') {
            getlikes()
        }



    }, [blogs])

    let likehandler = async (index, id) => {
        if (usermail !== '') {
            let className = document.getElementById(index).className
            document.getElementById(index).style.transition = 'all 0s'
            if (className == 'fa-regular fa-heart op') {
                document.getElementById(index).className = 'fa-solid fa-feather op3'
                await axios.post('http://localhost:777/like', { id: id, action: 'like', email: usermail })
                    .then(res => setTimeout(() => liked(index, id, res.data), 500))

            }
            else {
                document.getElementById(index).className = 'fa-regular fa-heart op'
                await axios.post('http://localhost:777/like', { id: id, action: 'unlike', email: usermail })
                    .then(res => setBlogs(blogs.map(blog => blog._id == id ? ({ ...blog, likes: res.data }) : (blog)))
                    )

            }
        }



    }
    let liked = (index, id, likelist) => {
        document.getElementById(index).style.transition = 'all .3s'
        document.getElementById(index).className = 'fa-solid fa-heart op2'
        
        setBlogs(blogs.map(blog => blog._id == id ? ({ ...blog, likes: likelist }) : (blog)))

    }








    return (
        <>
            <div className='row home'>
                <div className='col-12 p-0'>
                    <div className='h-1 ps-3 pe-3'>
                        <div><img className='logo2' src={logo2}></img></div>

                        <div>
                            <span class="h-bztitle text-light">ByteBLOG</span>
                            <span class="h-bzquote">Where the Internet is about availability of information,<br /> blogging is
                                about making information creation available to anyone.</span>
                            {(usermail !== '') ? (
                                <Link class="newposta" to={'/create'}><span class="newpost">

                                    create a byte&nbsp;&nbsp;<img className='feather' src={feather}></img></span></Link>
                            ) : (
                                <Link class="newposta" to={'/login'} state={{ action: 'login/create' }}><span class="newpost">

                                    create a byte&nbsp;&nbsp;<img className='feather' src={feather}></img></span></Link>
                            )}
                        </div>


                    </div>
                </div>
                <div className='col-lg-10 mx-auto mt-5'>
                    <div className='row'>
                        
                        {blogs.map((blog, index) =>
                            <div key={index} className='col-lg-3 col-sm-6 col-12 mb-5'>
                                <div className='blog mx-auto'>
                                    <div className='mx-auto'>
                                        <img src={"http://localhost:777/images/" + blog.image} alt={"image"} className='img-fluid mx-auto'></img>
                                    </div>

                                    <div className='mx-auto'>
                                        <div className='blog-in'>
                                            <span>{blog.title}</span>

                                            <Link to={'/blog'} state={{ blog: blog }}>{blog.content}</Link>

                                        </div>
                                        {usermail == blog.user ?
                                            (<div className='cmtlikediv mx-auto'>
                                                <span>
                                                    <i className="fa-regular fa-heart op" onClick={() => likehandler(index, blog._id)} id={index}></i>
                                                    &nbsp;
                                                    {(blog.likes.length > 1 || blog.likes.length == 0) ? (
                                                        <span className='likecount'>{blog.likes.length} likes</span>
                                                    ) : (
                                                        <span className='likecount'>{blog.likes.length} like</span>
                                                    )}
                                                </span>

                                                <span>
                                                    <Link to={'/edit'} state={{ edit: blog, goto: '/' }}><i class="fa-solid fa-pen-to-square op"></i></Link>
                                                    <i class="fa-solid fa-trash op" onClick={() => delete_byte(blog._id)}></i>

                                                </span>
                                            </div>)
                                            :
                                            (<div className='cmtlikediv mx-auto'>
                                                <span>
                                                    <i className="fa-regular fa-heart op" onClick={() => likehandler(index, blog._id)} id={index}></i>
                                                    &nbsp;
                                                    {(blog.likes.length > 1 || blog.likes.length == 0) ? (
                                                        <span className='likecount'>{blog.likes.length} likes</span>
                                                    ) : (
                                                        <span className='likecount'>{blog.likes.length} like</span>
                                                    )}
                                                </span>

                                                <Link to={'/blog'} state={{ blog: blog }} className='cmt'><i class="fa-solid fa-message op"></i></Link></div>)}
                                       
                                    </div>


                                </div>

                            </div>
                        )}
                    </div>
                </div>

            </div>

        </>
    )
}

export default Home
