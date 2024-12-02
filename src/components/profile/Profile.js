import React, { useEffect, useState } from 'react'
import './Profile.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import $ from 'jquery'
import feather from '../images/feather.png'
function Profile({ currentuser, usermail, pedit, pabout }) {

    const [blogs, setBlogs] = useState([])
    const [isedit, setIsedit] = useState(false)
    const [name, setName] = useState(currentuser)
    const [about, setAbout] = useState(pabout)

    useEffect(() => {

        console.log('mounted')

        let getdata = async () => {

            await axios.get('http://localhost:777/home')
                .then(res => setBlogs(res.data))
                .catch(err => console.log(err))

            console.log('returned')

        }


        getdata()


    }, [])
    useEffect(() => {
        let getlikes = () => {

            blogs.filter(blog => blog.user == usermail).forEach((blog, index) => {

                blog.likes.forEach(like => {

                    if (like.user == usermail) {
                        document.getElementById(index).className = 'fa-solid fa-heart op2'

                    }
                })
            })
        }
        getlikes()
    }, [blogs])

    $(document).ready(() => {

        $('.p-cmtlikediv').hide()
        blogs.filter(blog => blog.user == usermail).forEach((blog, index) => {

            $('#p-blog' + index).mouseenter(() => {
                $('#cmtlkdiv' + index).slideDown(300)
            })
            $('#p-blog' + index).mouseleave(() => {
                $('#cmtlkdiv' + index).slideUp(100)
            })


        })
    })

    let delete_byte = async (id) => {

        let src = 'http://localhost:777/delete/' + id
        await axios.get(src)
            .then(res => setBlogs(res.data))
    }
    let imp = (imgname) => {

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

        setBlogs(blogs.map(blog => blog._id == id ? ({ ...blog, likes: likelist }) : (blog)))

    }
    let edit = () => {
        document.getElementById('profile-heading').innerText = 'Edit Profile'
        setIsedit(true)
        console.log(name, currentuser)
    }

    let namehandler = (e) => {
        setName(e.target.value)
    }
    let abouthandler = (e) => {
        setAbout(e.target.value)
    }

    let done = () => {
        document.getElementById('profile-heading').innerText = 'Profile'
        setIsedit(false)
        if (name !== '') {
            pedit(name, about)
        }
    }
    return (
        <div className='row mt-5'>
            <div className='col-xl-7 col-lg-8 col-md-11 col-11  pf mx-auto'>
                <i class="fa-solid fa-circle-user text-secondary"></i>
                <span>
                    <span className='phead'>
                        <span id='profile-heading'>Profile</span>
                        {isedit ? (<span onClick={done} className='donebtn'>done</span>) : (<span onClick={edit} className='editbtn'>edit profile</span>)}
                    </span>

                    <span className='p-userdetails mx-auto'>
                        <span >
                            {isedit ? (<input className='nameinp' value={name} placeholder={currentuser} onChange={namehandler}></input>) : (<span>{currentuser}</span>)}
                            <img src={feather} className='p-feather'></img>
                        </span>

                        <span>
                            <i class="fa-solid fa-envelope"></i>&nbsp;{usermail}
                        </span>
                    </span>

                    <span className='p-about mx-auto'>
                        <span>About:</span>
                        {isedit ? (<textarea className='aboutinp' placeholder={pabout} onChange={abouthandler}>{pabout}</textarea>) : (<span className='pabout-txt'>{pabout}</span>)}


                    </span>
                </span>
            </div>
            <div className='col-sm-10 col-11 mt-5 myblogs mx-auto'>
                <span >
                    <span>my Bytes</span>
                </span>
                <div className='row mt-4'>
                    {blogs.filter(blog => blog.user == usermail).length !== 0 ? (
                        blogs.filter(blog => blog.user == usermail).map((blog, index) =>
                            <div key={index} className='col-lg-6 col-12 mb-5'>
                                <div className='p-blog mx-auto ' id={'p-blog' + index}>
                                    <div className='mx-auto'>
                                        <img src={"http://localhost:777/images/" + blog.image} alt={"image"} className='img-fluid mx-auto'></img>
                                    </div>

                                    <div className='mx-auto'>
                                        <div className='p-blog-in'>
                                            <span>{blog.title}</span>

                                            <Link to={'/blog'} state={{ blog: blog }}>{blog.content}</Link>

                                        </div>
                                        <div className='p-cmtlikediv mx-auto' id={'cmtlkdiv' + index}>
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
                                                <Link to={'/edit'} state={{ edit: blog, goto: '/profile' }}><i class="fa-solid fa-pen-to-square op"></i></Link>
                                                <i class="fa-solid fa-trash op" onClick={() => delete_byte(blog._id)}></i>

                                            </span>
                                        </div>


                                    </div>


                                </div>

                            </div>
                        )

                    ) : (
                        <div className='nobytes'>No Bytes yet...</div>
                    )}

                </div>

            </div>
        </div>
    )
}

export default Profile
