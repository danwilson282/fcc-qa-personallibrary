/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
let mongoose=require('mongoose');
const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  comments: {type: Array, required: true, default: []},
  commentcount: {type: Number, default: 0}
});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let project = req.params.project;
      const book = mongoose.model("Book", bookSchema, 'books');
      book.find().then(data =>{
        data.forEach(function(item, index){
          data[index].commentcount = item.comments.length
        })
        //data.commentcount = data.comments.length
        res.json(data)
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      const book = mongoose.model("Book", bookSchema, 'books');
      if (req.body.title===""){
        res.send('missing required field title' )
      }
      else if (!req.body.title){
        res.send('missing required field title' )
      }
      else {
        var newBook = new book({
          title: req.body.title || ""
        })
        newBook.save().then(ret => {
          res.json(ret)
        })
      }
    })
    
    .delete(function(req, res){
      const book = mongoose.model("Book", bookSchema, 'books');
      
      book.deleteMany()
      .then(data=>{
        res.send('complete delete successful')
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      const book = mongoose.model("Book", bookSchema, 'books');
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      book.findById(bookid)
      .then(data=>{
        data.commentcount = data.comments.length
        res.send(data)
      })
      .catch(err=>{
        res.send('no book exists')
      })
      
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      const book = mongoose.model("Book", bookSchema, 'books');
      
        book.findById(bookid)
        .then(data=>{
          if (!req.body.comment){
            let error = 'missing required field comment' 
            res.send(error)
          }
          else{
            let commentsArray = data.comments
          commentsArray.push(comment)
          book.findByIdAndUpdate(bookid, {comments: commentsArray}).then(data2=>{
            data2.comments = commentsArray
            data2.commentcount = data2.comments.length
            res.send(data2)
          })
          }
          
          //res.send('ddd')
        })
        .catch(err=>{
          res.send('no book exists')
        })
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      const book = mongoose.model("Book", bookSchema, 'books');
      //if successful response will be 'delete successful'
      book.findById(bookid)
        .then(issue => {
          if (!issue) {
            throw 'no book exists'
          }
          return book.deleteOne({ _id: bookid })
        })
        .then(removed => {
          res.send('delete successful')
        })
        .catch(err => {
          res.send('no book exists')
        })
      
    });
  
};
