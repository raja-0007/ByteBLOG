import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import feather from '../images/feather.png'

function Profile2({usermail}) {
    const location = useLocation()
    const o_user = location.state.user
    const [blogs,setBlogs] = useState([])
    const [name,setName] = useState('')
    const [about,setAbout] = useState('')
    
    useEffect(() => {

        console.log('mounted')
        
        let getdata = async () => {

            console.log(o_user)
            await axios.get('http://localhost:777/getprofile/'+o_user)
                .then(res => setcred(res.data))
                .catch(err => console.log(err))
            
            await axios.get('http://localhost:777/home')
                .then(res => setBlogs(res.data))
                .catch(err => console.log(err))

        }
        

        getdata()
        
        
    }, [])
    let setcred=(details)=>{
        console.log(details)
        setName(details[0].username)
        setAbout(details[0].about)
    }
    useEffect(()=>{
        let getlikes = () => {
            //console.log(blogs)
            blogs.filter(blog => blog.user == o_user).forEach((blog, index) => {

                blog.likes.forEach(like => {
                    //console.log(like.user, usermail)
                    if (like.user == usermail) {
                        document.getElementById(index).className = 'fa-solid fa-heart op2'
                        //console.log(document.getElementById(index).className)


                    }
                })
            })
        }
        getlikes()
    },[blogs])
    
    $(document).ready(() => {

        $('.p-cmtlikediv').hide()
        blogs.filter(blog => blog.user == o_user).forEach((blog, index) => {

            $('#p-blog' + index).mouseenter(() => {
                $('#cmtlkdiv' + index).slideDown(300)
            })
            $('#p-blog' + index).mouseleave(() => {
                $('#cmtlkdiv' + index).slideUp(100)
            })


        })
    })

    let imp = (imgname) => {

        //console.log(imgname)

        return require('../images/' + imgname)

    }
    let likehandler = async (index, id) => {
        if (usermail !== '') {
            let className = document.getElementById(index).className
            document.getElementById(index).style.transition = 'all 0s'
            if (className == 'fa-regular fa-heart op') {
                document.getElementById(index).className = 'fa-solid fa-feather op3'
                await axios.post('http://localhost:777/like', { id: id, action: 'like' })
                    .then(res => setTimeout(() => liked(index, id, res.data), 500))

            }
            else {
                document.getElementById(index).className = 'fa-regular fa-heart op'
                await axios.post('http://localhost:777/like', { id: id, action: 'unlike' })
                    .then(res => setBlogs(blogs.map(blog => blog._id == id ? ({ ...blog, likes: res.data }) : (blog)))
                    )

            }
        }


    }
    let liked = (index, id, likelist) => {
        document.getElementById(index).style.transition = 'all .3s'
        document.getElementById(index).className = 'fa-solid fa-heart op2'
        //setLikes([...likes,{user:usermail}])
        setBlogs(blogs.map(blog => blog._id == id ? ({ ...blog, likes: likelist }) : (blog)))

    }
    
    
    let namehandler=(e)=>{
        setName(e.target.value)
    }
    let abouthandler=(e)=>{
        setAbout(e.target.value)
    }

    
  return (
    <div className='row mt-5'>
            <div className='col-lg-7 col-11 p-3 pf mx-auto'>
                <i class="fa-solid fa-circle-user text-secondary"></i>
                <span>
                    <span className='phead'>
                        <span id='profile-heading'>Profile</span> 
                        
                    </span>

                    <span className='p-userdetails mx-auto'>
                        <span >
                            <span>{name}</span>
                            <img src={feather} className='p-feather'></img>
                        </span>

                        <span>
                            <i class="fa-solid fa-envelope"></i>&nbsp;{o_user}</span>
                    </span>

                    <span className='p-about mx-auto'>
                        <span>About:</span>
                        <span className='pabout-txt'>{about}</span>
                        
                        
                    </span>
                </span>
            </div>
            <div className='col-10 mt-5 myblogs mx-auto'>
                <span >
                    <span>my bytes</span>
                </span>
                <div className='row mt-4'>
                    {blogs.filter(blog => blog.user == o_user).map((blog, index) =>
                        <div key={index} className='col-lg-6 col-12 mb-5'>
                            <div className='p-blog mx-auto ' id={'p-blog' + index}>
                                <div className='mx-auto'>
                                    <img src={imp(blog.image)} className='img-fluid mx-auto'></img>
                                </div>

                                <div className='mx-auto'>
                                    <div className='p-blog-in'>
                                        <span>{blog.title}</span>

                                        <Link to={'/blog'} state={{ blog: blog }}>{blog.content}</Link>

                                    </div>
                                    <div className='p-cmtlikediv mx-auto' id={'cmtlkdiv' + index}>
                                        <span>
                                            {/* blog.likes.includes({user:usermail}) ? (<i className="fa-regular fa-heart op2" onClick={() => likehandler(index, blog._id)} id={index}></i>):(<span id={index}>hell</span>)*/}
                                            <i className="fa-regular fa-heart op" onClick={() => likehandler(index, blog._id)} id={index}></i>
                                            &nbsp;
                                            {(blog.likes.length > 1 || blog.likes.length == 0) ? (
                                                <span className='likecount'>{blog.likes.length} likes</span>
                                            ) : (
                                                <span className='likecount'>{blog.likes.length} like</span>
                                            )}
                                        </span>

                                        <Link to={'/blog'} state={{ blog: blog }} className='cmt'><i class="fa-solid fa-message op"></i></Link>
                                    </div>


                                    {/*<i class="fa-solid fa-heart"></i>*/}
                                </div>


                            </div>

                        </div>
                    )}
                </div>

            </div>
        </div>
  )
}

export default Profile2
