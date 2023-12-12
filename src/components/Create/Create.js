import React, { useEffect, useState } from 'react'
import './Create.css'
import axios, { formToJSON } from 'axios'
import { useNavigate } from 'react-router-dom'
import feather from '../images/feather.png'
import uplogo from '../images/image_upload.png'
function Create({ addbyte }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState('')
    const navigate = useNavigate('')
    let titlehandler = (e) => {
        setTitle(e.target.value)
    }
    let contenthandler = (e) => {
        setContent(e.target.value)
    }
    let imagehandler = (e) => {
        console.log(e.target.files)
        if(e.target.files.length !== 0){
            setImage(e.target.files[0])
            document.getElementById('imginp_txt').innerHTML = e.target.files[0].name
        }
       

    }
    let submithandler = async (e) => {
        e.preventDefault()
        console.log(image)
        addbyte(title, content, image)
        const formdata = new FormData()
        formdata.append('title', title)
        formdata.append('content', content)
        formdata.append('image', image)
        await axios.post('http://localhost:777/create', formdata)
            .then(navigate('/'))
        

    }

    return (

        <div class="row mt-2">
            <div class="col-lg-8 col-md-10 col-sm-12 mx-auto">
                <h3 class="heading mx-auto" >Create Your <span>Byte</span><img className='c-feather' src={feather}></img></h3>
                <form class="c-blogform" onSubmit={submithandler} enctype="multipart/form-data" >
                    <div class="rounded">
                        <input type="text" class="c-title" value={title} placeholder="Title" name="title" onChange={titlehandler} id="" />

                        <span class="addimg">
                            <input type="file" name="image" accept="image/*" id="imgfile" onChange={imagehandler} />
                            <label for='imgfile' className='img-inp'>{/*<i class="fa-solid fa-cloud-arrow-up"></i>*/}<img src={uplogo}></img><span id='imginp_txt'>upload image</span></label>
                        </span>
                        <button id="postbtn" class="c-pbtn" type="submit">post</button>
                    </div>
                    <textarea placeholder="Blog Content..." name="content" id="" class="blogcontent" onChange={contenthandler}>{content}</textarea>
                    <button id="postbtn2" class=" btn btn-outline-warning " type="submit">post</button>


                </form>
            </div>
        </div>
    )
}

export default Create
