import React, { useEffect, useState } from 'react'
import './Edit.css'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import feather from '../images/feather.png'
import uplogo from '../images/image_upload.png'
function Edit({editbyte}) {
    const navigate = useNavigate()
    const location = useLocation()
    const [title,setTitle] = useState(location.state.edit.title)
    const [content,setContent] = useState(location.state.edit.content)
    const [image,setImage] = useState(location.state.edit.image)
    const goto = location.state.goto
    console.log(goto)
    let titlehandler=(e)=>{
        setTitle(e.target.value)
    }
    let contenthandler=(e)=>{
        setContent(e.target.value)
    }
    let imagehandler=(e)=>{
        console.log(e.target.files)
        setImage(e.target.files[0])
        document.getElementById('imginp_txt').innerHTML = e.target.files[0].name
    }
    let submithandler=async(e)=>{
        e.preventDefault()
        console.log(image)
        editbyte(location.state.edit._id, title, content, image)
        const formdata = new FormData()
        formdata.append('title',title)
        formdata.append('content',content)
        formdata.append('image',image)
        let src = 'http://localhost:777/update/'+location.state.edit._id
        console.log(src)
        await axios.post(src,formdata)
        .then(navigatefn())
        
    }
    let navigatefn=()=>{
        if(goto == '/'){
            navigate('/')
        }
        else if(goto == '/profile'){
            navigate('/profile')
        }
    }
  return (
    <div class="row mt-2">
            <div class="col-lg-8 col-md-10 mx-auto">
                <h3 class="heading mx-auto">Edit Your <span>Byte</span><img className='c-feather' src={feather}></img></h3>
                <form class="c-blogform"  onSubmit={submithandler} enctype="multipart/form-data">
                    <div class="rounded">
                        <input type="c-text" class="c-title" placeholder="title" name="title" value={title} onChange={titlehandler} id=""/>
                        <span class="addimg">
                        <input type="file" name="image" accept="image/*" id="imgfile" onChange={imagehandler}/>
                        <label for='imgfile' className='img-inp'><img src={uplogo}></img><span id='imginp_txt'>upload image</span></label>
                        </span>
                        
                        <button id="postbtn" class="c-pbtn" type="submit">post</button>
                    </div>
                    
                    <textarea placeholder="Blog Content..." name="content" id=""
                        className="blogcontent" onChange={contenthandler}>{content}</textarea>
                        <button id="postbtn2" class=" btn btn-outline-warning " type="submit">post</button>


                </form>
            </div>
        </div>
  )
}

export default Edit
