const express = require('express')
const mongoose = require('mongoose')
const bparser = require('body-parser')
const app = express()
const multer = require('multer')
const mongoclient = require('mongodb')
const cors = require('cors')
const corsoptions = {
    origin: '*',
    optionSuccessStatus: 200
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/components/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }
})
const upload = multer({ storage: storage })
const connectdb = async () => {
    //updater
    /*
    await mongoose.connect('mongodb://127.0.0.1:27017/blogzenith')
        .then(console.log('db connected...'))
        .catch(err => console.log('err in db connection', err))
        */
    const url = 'mongodb+srv://raja:07rajams@cluster0.akcklga.mongodb.net/?retryWrites=true&w=majority'
    const client = new mongoclient(url,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    try{
        await client.connect()
        .then(console.log('success'))
    }
    catch(err){
        console.log(err)
    }
}
connectdb()
app.use(bparser.json())

app.use(cors(corsoptions))


const userschema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    about:String

})
const users = mongoose.model('users', userschema)
const blogschema = mongoose.Schema({
    title: String,
    content: String,
    username: String,
    user: String,
    image: String,
    comments: Array,
    likes: Array
})
const blogs = mongoose.model('blogs', blogschema)
var currentuser = ''
var currentusername = ''

app.post('/login', async (req, res) => {
    const pword = req.body.password
    const userslist = await users.find({ email: req.body.email })
    if (userslist.length !== 0) {
        currentuser = req.body.email
        currentusername = userslist[0].username
        const about = await users.find({email:currentuser})
        if(pword == about[0].password){
            res.send({
                login: true,
                user: currentusername,
                email: currentuser,
                about:about[0].about,
                pstatus:true,
                exist:true
            })
        }
        else{
            res.send({
                login: false,
                user: '',
                email: '',
                pstatus:false,
                exist:true
            })
        }
        
    }
    else {
        res.send({
            login: false,
            user: '',
            email: '',
            pstatus:false,
            exist:false
        })
    }
})


app.post('/signup', async (req, res) => {

    const userslist = await users.find({ email: req.body.email })
    if (userslist.length == 0) {
        const user = new users({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            about:'-'
        })
        await user.save()
            .then(() => console.log('signup success'))
            .then(() => res.send(true))
    }
    else {
        res.send(false)
    }
})
app.get('/authentication', async (req, res) => {
    if (currentuser == '') {
        res.send({
            login: false,
            user: '',
            email: ''
        })
    }
    else {
        const about = await users.find({email:currentuser})
        console.log(about)
        res.send({
            login: true,
            user: currentusername,
            email: currentuser,
            about: about[0].about
        })
    }

})
app.get('/home', async (req, res) => {

    await blogs.find({})
        .then((result) => res.json(result.reverse()))

})

app.post('/create', upload.single('image'), async (req, res) => {

    const newblog = new blogs({
        title: req.body.title,
        content: req.body.content,
        username: currentusername,
        user: currentuser,
        image: req.file.filename,
        comments: [],
        likes: []
    })
    await newblog.save()
        .then(() => console.log('blog created'))
        .then(() => res.send('blog created'))
})


app.get('/logout', (req, res) => {
    currentuser = ''
    username = ''
    res.send('logged out')
})

app.get('/delete/:id', async (req, res) => {
    await blogs.findByIdAndDelete(req.params.id)
        .then(result => console.log(result))
    await blogs.find({})
        .then(result => res.json(result.reverse()))
})

app.post('/update/:id', upload.single('image'), async (req, res) => {

    try {
        await blogs.findByIdAndUpdate(req.params.id, req.body)
            .then(result => console.log(result))
        await blogs.findByIdAndUpdate(req.params.id, { image: req.file.filename }, { new: true })
            .then(result => console.log(result))
            .then(res.send('done'))
    }
    catch {
        await blogs.findByIdAndUpdate(req.params.id, req.body)
            .then(result => console.log(result))
            .then(res.send('done'))
    }

})
app.get('/comments-likes/:id', async (req, res) => {

    await blogs.findById(req.params.id)
        .then(result => res.send(result))
        .catch(err => console.log(err))
})


app.post('/comment', async (req, res) => {
    let dateobj = new Date()
    const options = { day: 'numeric', year: 'numeric', month: 'short' }
    let date = dateobj.toLocaleDateString('en-US', options)

    const comment = { comment: req.body.comment, user: currentusername, date: date }
    const id = req.body.id
    const blog = await blogs.findById(id)
    const comments = blog.comments
    console.log(comments)
    comments.unshift(comment)


    await blogs.findByIdAndUpdate(id, { comments: comments })
        .then(console.log('comment added'))
    await blogs.findById(id)
        .then(result => res.send(result))
})

app.get('/cmtdelblog/:blogid/cmtdelcmt/:cmtindex', async (req, res) => {
    var blogid = req.params.blogid
    var cmtindex = req.params.cmtindex
    let blog = await blogs.findById(blogid)
    let comments = blog.comments
    comments.splice(cmtindex, 1)

    await blogs.findByIdAndUpdate(req.params.blogid, { comments: comments })
        .then(console.log('cmt deleted'))
    await blogs.findById(req.params.blogid)
        .then(result => res.send(result.comments))
        .catch(err => console.log(err))
})
app.post('/like', async (req, res) => {
    let id = req.body.id

    let blog = await blogs.findById(id)
    let likes = blog.likes
    let action = req.body.action
    if (action == 'like') {
        likes.unshift({ user: currentuser })
        await blogs.findByIdAndUpdate(id, { likes: likes })
            .then(console.log('liked'))
        await blogs.findById(req.body.id)
            .then(result => res.send(result.likes))
    }
    else if (action == 'unlike') {

        likes = likes.filter(like => like.user !== currentuser)
        console.log(likes)
        await blogs.findByIdAndUpdate(id, { likes: likes },{new:true})
            .then(res.send(likes))

    }

})
app.post('/editprofile',async(req,res)=>{
    const name = req.body.name
    const about = req.body.about
    
    const userdata = await users.find({email:currentuser})
    
    await users.findByIdAndUpdate(userdata[0]._id,{username:name, about:about},{new: true})
    .then(result=>console.log(result))
    currentusername = name
})
app.get('/getprofile/:user',async(req,res)=>{
    const user = req.params.user
    console.log(user)

    await users.find({email:user})
    .then(result=>res.send(result))
})

app.listen(777, console.log('server started...'))