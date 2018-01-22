var mongoose   =  require("mongoose"),
    Campground =  require("./models/campground"),
    Comment    =  require("./models/comment");
   
   
var data = [
     {
       name: "Scooby Camp", 
       image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg",
       description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate doloribus aspernatur praesentium quia dolorum non neque ipsa, optio autem. Laboriosam explicabo deserunt maxime voluptate recusandae aperiam quo, soluta blanditiis fuga."
     },
     {
       name: "mandela goose", 
       image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
       description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate doloribus aspernatur praesentium quia dolorum non neque ipsa, optio autem. Laboriosam explicabo deserunt maxime voluptate recusandae aperiam quo, soluta blanditiis fuga."
     },
     {
       name: "Lovina floor", 
       image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg",
       description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate doloribus aspernatur praesentium quia dolorum non neque ipsa, optio autem. Laboriosam explicabo deserunt maxime voluptate recusandae aperiam quo, soluta blanditiis fuga."
     }
 ];
// remove all campgrounds
function seedDB(){
  Campground.remove({}, function(err){
    if(err){
     console.log(err);
    } else{
     console.log("removed campgrounds");
   // add a few campgrounds
     data.forEach(function(seed){
       Campground.create(seed, function(err, campground){
        if (err){
         console.log(err);
        } else {
         console.log("added a campground");
         Comment.create(
               {
                  text: "Beautiful camp, but no internet!",
                  author: "Kemi"
               }, function(err, comment){
                    if(err){
                     console.log("comment not added", err);
                   } else {
                     campground.comments.push(comment._id);
                     campground.save();
                     console.log("created new comment");
                   }
          });
        }
       });
     });
    }
 });
 
// add a few comments
}
module.exports = seedDB;


