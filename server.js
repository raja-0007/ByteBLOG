const express = require('express')
const mongoose = require('mongoose')
const bparser = require('body-parser')
const app = express()
const multer = require('multer')

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
    await mongoose.connect('mongodb://127.0.0.1:27017/blogzenith')
        .then(console.log('db connected...'))
        .catch(err => console.log('err in db connection', err))
}
connectdb()
app.use(bparser.urlencoded({
    extended: false
})
)

/*app.use(express.static('./views'))
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(session({
    secret:'raja',
    resave:false,
    saveUninitialized:false
}))*/
const userschema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    gender: String
})
const users = mongoose.model('users', userschema)
const blogschema = mongoose.Schema({
    title: String,
    content: String,
    username: String,
    user: String,
    image: String,
    comments:Array
})
const blogs = mongoose.model('blogs', blogschema)
var currentuser = ''
var currentusername = ''
app.get('/', (req, res) => {

    res.render('signin')
})
app.post('/signin', async (req, res) => {

    const userslist = await users.find({ email: req.body.email })
    if (userslist.length !== 0) {
        currentuser = req.body.email
        currentusername = userslist[0].username

        res.redirect('/home')
    }
    else {
        res.send('please signup')
    }
})
app.get('/signup', async (req, res) => {


    res.render('signup')
})
app.post('/signup', async (req, res) => {

    const userslist = await users.find({ email: req.body.email })
    if (userslist.length == 0) {
        const user = new users({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        await user.save()
            .then(() => console.log('signup success'))
            .then(() => res.redirect('/'))
    }
    else {
        console.log('already registered')
    }
})
app.get('/home', async (req, res) => {

    await blogs.find({})
        .then((result) => res.render('home', { currentuser: currentuser, username: currentusername, blogs: result.reverse() }))

})
app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', upload.single('image'), async (req, res) => {
    console.log(req.file.filename)
    const newblog = new blogs({
        title: req.body.title,
        content: req.body.content,
        username: currentusername,
        user: currentuser,
        image: req.file.filename,
        comments:[]
    })
    await newblog.save()
        .then(() => console.log('blog created'))
        .then(() => res.redirect('/home'))
})
app.get('/signout', (req, res) => {
    currentuser = ''
    username = ''
    res.redirect('/')
})
app.get('/delete/:id', async (req, res) => {
    await blogs.findByIdAndDelete(req.params.id)
        .then(res.redirect('/home'))
})
var editblog = ''
app.get('/editpage',async(req,res)=>{
    res.render('edit',{blog:editblog})
})
app.get('/edit/:id', async (req, res) => {
    const result = await blogs.findById(req.params.id)
    editblog = result
    res.redirect('/editpage')

})
app.post('/update/:id', upload.single('image'), async (req, res) => {
    try{
        await blogs.findByIdAndUpdate(req.params.id, req.body)
            .then(result => console.log(result))
        await blogs.findByIdAndUpdate(req.params.id, { image: req.file.filename }, { new: true })
            .then(result => console.log(result))
            .then(res.redirect('/home'))
    }
    catch{
        await blogs.findByIdAndUpdate(req.params.id, req.body)
            .then(result => console.log(result))
            .then(res.redirect('/home'))
    }

})

app.post('/comment/:id',async(req,res)=>{
    let dateobj =new Date()
    const options = {day:'numeric',year:'numeric',month:'short'}
    let date = dateobj.toLocaleDateString('en-US',options)
    
    const comment = {comment:req.body.comment, user:currentusername, date:date}
    
    const blog = await blogs.findById(req.params.id)
    const comments = blog.comments
    comments.unshift(comment)
    
    const scrollpos = req.body.scrollposition || 0
    req.session.scrollposition = scrollpos
    console.log(scrollpos)
    await blogs.findByIdAndUpdate(req.params.id,{comments:comments})
    .then(res.redirect('/home'))
})
app.get('/cmtdelblog/:blogid/cmtdelcmt/:cmtindex',async(req,res)=>{
    var blogid = req.params.blogid
    var cmtindex = req.params.cmtindex
    let blog = await blogs.findById(blogid)
    let comments = blog.comments
    comments.splice(cmtindex,1)
    console.log(comments)
    await blogs.findByIdAndUpdate(req.params.blogid,{comments:comments})
    .then(res.redirect('/home'))
})
app.listen(3000, console.log('server started...'))