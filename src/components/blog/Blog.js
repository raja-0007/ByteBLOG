import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Blog.css'
import logo from '../images/feather.png'
import axios from 'axios'
function Blog({ usermail, currentuser }) {
    const navigate = useNavigate()
    const location = useLocation()
    const id = location.state.blog._id

    var title = location.state.blog.title
    var content = location.state.blog.content
    var image = location.state.blog.image
    var username = location.state.blog.username
    var o_user = location.state.blog.user
    var [comments, setComments] = useState([])
    var [likes, setLikes] = useState([])

    const [comment, setComment] = useState('')

    let setimg = (img) => {

        return require('../images/' + img)
    }
    let commenthandler = (e) => {
        e.preventDefault()
        setComment(e.target.value)
    }
    let delcmt = async (index) => {

        let src = 'http://localhost:777/cmtdelblog/' + id + '/cmtdelcmt/' + index
        await axios.get(src)
            .then(res => setComments(res.data))
        let src2 = 'http://localhost:777/comments/' + id
        

    }
    let submithandler = async (e) => {
        e.preventDefault()


        await axios.post('http://localhost:777/comment', { id: id, comment: comment, username: currentuser, email: usermail })
            .then(res => setComments(res.data.comments))
        let src = 'http://localhost:777/comments/' + id

        setComment('')

    }
    useEffect(() => {
        window.screenY = 0
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        })
        let getdata = async () => {
            let src = 'http://localhost:777/comments-likes/' + id
            await axios.get(src)
                .then(res => setcred(res.data))

        }
        getdata()

    }, [])
    let setcred = (details) => {
        setComments(details.comments)
        setLikes(details.likes)
    }
    useEffect(() => {

        likes.forEach(like => {
            if (like.user == usermail) {

                document.getElementById('like-icon').className = 'fa-solid fa-heart op2'
            }
        })

    }, [likes])

    let likehandler = async () => {
        if (usermail !== '') {
            let className = document.getElementById('like-icon').className
            
            document.getElementById('like-icon').style.transition = 'all 0s'
            if (className == 'fa-regular fa-heart op') {
                document.getElementById('like-icon').className = 'fa-solid fa-feather op3'
                await axios.post('http://localhost:777/like', { id: id, action: 'like', email: usermail })
                    .then(res => setTimeout(() => liked(res.data), 500))

            }
            else {
                document.getElementById('like-icon').className = 'fa-regular fa-heart op'
                await axios.post('http://localhost:777/like', { id: id, action: 'unlike', email: usermail })
                    .then(res => setLikes(res.data))

            }
        }


    }
    let liked = (likelist) => {
        document.getElementById('like-icon').style.transition = 'all .3s'
        document.getElementById('like-icon').className = 'fa-solid fa-heart op2'
        setLikes(likelist)
    }
    let getprofile = () => {
        if (usermail !== o_user) {
            navigate('/profile2', { state: { user: o_user } })
        }
        else {
            navigate('/profile')
        }

    }


    return (
        <div className='row p-0 mt-5'>
            <div className='col-sm-10 col-11 p-0 pb-5 mb-5 mx-auto blog-wrapper'>

                <div className='imgdiv mx-auto'><img src={"http://localhost:777/images/" + image} alt={"image"} className='img-fluid mx-auto'></img></div>
                <div className='blogdiv mx-auto'>
                    <span>{title}</span>
                    <span>{content}</span>
                </div>
                <div className='authordiv' onClick={getprofile}><i class="fa-solid fa-circle-user"></i>&nbsp;{username}<img src={logo} className='author-logo'></img></div>
                <div className='b-likes mt-4'>
                    <span>
                        <i className="fa-regular fa-heart op" id='like-icon' onClick={likehandler}></i>
                        &nbsp;
                        {(likes.length > 1 || likes.length == 0) ? (
                            <span className='likecount'>{likes.length} likes</span>
                        ) : (
                            <span className='likecount'>{likes.length} like</span>
                        )}
                    </span>



                </div>

                <div className='comments-wrapper mx-auto mt-1'>
                    <span>Comments: </span>
                    {comments.length == 0 ? (
                        <div className='nocommentsdiv'>No comments yet...</div>
                    ) : (
                        <div className='commentsdiv'>
                            {comments.map((comment, index) =>
                                <div key={index} className='comment'>
                                    <i class="fa-solid fa-circle-user"></i>
                                    <span>
                                        <span><span className='cmtuser'>{comment.user}</span><span className='cmtdate'>{comment.date}</span></span>
                                        {(comment.user == currentuser || username == currentuser) ? (
                                            <span className='cmttxt'>
                                                {comment.comment}
                                                <i class="fa-solid fa-trash op" onClick={() => delcmt(index)}></i>
                                            </span>
                                        ) : (
                                            <span className='cmttxt'>{comment.comment}</span>
                                        )}

                                    </span></div>
                            )}

                        </div>
                    )}

                    <div>
                        {usermail !== '' ? (
                            <form onSubmit={submithandler} className='cmtform'>
                                <textarea className='cmtinp' value={comment} onChange={commenthandler} placeholder='Leave a comment...'></textarea>
                                <span>
                                    <i class="fa-solid fa-paper-plane" onClick={submithandler}></i>
                                </span>

                            </form>
                        ) : ('')}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Blog
