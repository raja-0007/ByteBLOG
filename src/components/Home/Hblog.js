import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Hblog({ usermail, blog, index, delete_byte }) {
    const [likes,setLikes] = useState(blog.likes)
    const [islike, setIslike] = useState(false)
    let imp = (imgname) => {


        return require('../images/' + imgname)

    }
    let likehandler=async(index,id)=>{
        
        let className = document.getElementById(index).className
        document.getElementById(index).style.transition = 'all 0s'
        if(className == 'fa-regular fa-heart op'){
            document.getElementById(index).className = 'fa-solid fa-feather op3'
            await axios.post('http://localhost:777/like',{id:id, action:'like'})
            .then(res=>setTimeout(()=>liked(index,id,res.data),500))
            
        }
        else{
            document.getElementById(index).className = 'fa-regular fa-heart op'
            await axios.post('http://localhost:777/like',{id:id, action:'unlike'})
            .then(setLikes(likes.filter(like=> like.user !== usermail))
            )
            
        }
    }
    let liked=(index,id,likelist)=>{
        document.getElementById(index).style.transition = 'all .3s'
        document.getElementById(index).className = 'fa-solid fa-heart op2'
        setLikes([...likes,{user:usermail}])
        
    }

    useEffect(() => {

            likes.forEach(like=>{
                if(like.user == usermail){
                    setIslike(true)
                    
                    
                }
            })
            console.log('likes determined')
    }, [])
    useEffect(()=>{
        if(islike){
            document.getElementById(index).className = 'fa-solid fa-heart op2'
                    
        }
    },[islike])
    return (
        <div key={index} className='col-lg-4 col-sm-6 col-12 mb-5'>
            <div className='blog mx-auto bg-light'>
                <div className='mx-auto'>
                    <img src={imp(blog.image)} className='img-fluid mx-auto'></img>
                </div>

                <div className='mx-auto'>
                    <div className='blog-in'>
                        <span>{blog.title}{index}</span>

                        <Link to={'/blog'} state={{ blog: blog }}>{blog.content}</Link>

                    </div>
                    {usermail == blog.user ?
                        (<div className='cmtlikediv mx-auto'>
                            <span>
                                <i className="fa-regular fa-heart op" onClick={() => likehandler(index, blog._id)} id={index}></i>
                                &nbsp;
                                {(likes.length > 1 || likes.length == 0) ? (
                                    <span className='likecount'>{likes.length} likes</span>
                                ) : (
                                    <span className='likecount'>{likes.length} like</span>
                                )}
                            </span>

                            <span>
                                <Link to={'/edit'} state={{ edit: blog }}><i class="fa-solid fa-pen-to-square op"></i></Link>
                                <i class="fa-solid fa-trash op" onClick={() => delete_byte(blog._id)}></i>

                            </span>
                        </div>)
                        :
                        (<div className='cmtlikediv mx-auto'>
                            <span>
                                <i className="fa-regular fa-heart op" onClick={() => likehandler(index, blog._id)} id={index}></i>
                                &nbsp;
                                {(likes.length > 1 || likes.length == 0) ? (
                                    <span className='likecount'>{likes.length} likes</span>
                                ) : (
                                    <span className='likecount'>{likes.length} like</span>
                                )}
                            </span>

                            <Link to={'/blog'} state={{ blog: blog }} className='cmt'><i class="fa-solid fa-message op"></i></Link></div>)}
                    
                </div>


            </div>

        </div>
    )
}

export default Hblog
