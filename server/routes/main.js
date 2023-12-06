const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
/**
 * GET/
 * HOME
 */
router.get('',async(req,res)=>{
    try{
        const locals ={
            title:"NodeJs Blog",
            description:"Simple Blog created with NodeJs,Express & MongoDb."
        }
        let perPage = 7;
        let page = req.query.page || 1;
        const data = await Post.aggregate([{$sort:{createdAt:-1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        res.render('index',{
            locals,
            data,
            current:page,
            nextPage:hasNextPage ? nextPage : null
        });
    }catch(error){
        console.log(error);
    }
    
});

//router.get('',async(req,res)=>{
    //const locals ={
        //title:"NodeJs Blog",
        //description:"Simple Blog created with NodeJs,Express & MongoDb."
    //}
    //try{
        //const data = await Post.find();
        //res.render('index',{locals,data});
    //}catch(error){
        //console.log(error);
    //}
    
//});

/**
 * GET/
 * Post :id
 */

router.get('/post/:id',async(req,res)=>{
    try{
        let slug = req.params.id;
        const data = await Post.findById({_id:slug});
        const locals ={
            title: data.title,
            description:"Simple Blog created with NodeJs,Express & MongoDb."
        }
        res.render('post',{locals,data});
    }catch(error){
        console.log(error);
    }
    
});

//function insertPostData (){
    //Post.insertMany([
        //{
            //title:"Building a Blog",
            //body:"This is the body text"
        //},
        //{
            //title:"Build real-time,event-driven applications in Node.js",
            //body:"Socket.io:Learn how to use Socket.io to build real-time, event-driven application in Node.js."
        //},
        //{
            //title:"Discover how to use Express.js",
            //body:"Discover how to use Express.js, a popular Node.js web framework, to build web applications."
        //},
        //{
            //title:"Asynchronous programming with Node.js",
            //body:"Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for node."
        //},
        //{
            //title:"Learn the basics of Node.js and its architecture",
            //body:"Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
        //},
        //{
            //title:"NodeJs Limiting Network Traffic",
            //body:"Learn how to limit network traffic."
        //},
        //{
            //title:"Learn Morgan - HTTP Request logger for NodeJs",
            //body:"Learn Morgan."
        //},
    //])
//}
//insertPostData();

/**
 * POST /
 * Post - searchTerm
 */
router.post('/search',async(req,res)=>{
    try{
        const locals ={
            title:"Search",
            description:"Simple Blog created with NodeJs,Express & MongoDb."
        }
        let searchTerm = req.body.searchTerm;
        const searchNoSpeacialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"")
        const data = await Post.find({
            $or:[
                {title:{$regex:new RegExp(searchNoSpeacialChar,'i')}},
                {body:{$regex:new RegExp(searchNoSpeacialChar,'i')}}
            ]
        });
        res.render("search",{
            data,
            locals
        });
    }catch(error){
        console.log(error);
    }
    
});


router.get('/about',(req,res)=>{
    res.render('about');
});

module.exports = router;