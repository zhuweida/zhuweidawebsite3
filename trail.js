//var p = document.getElementById("heading");
var firebase11 = firebase.database().ref();
var comment1 = document.getElementById("twist");    //comment tag for texttwist project
var comment2 = document.getElementById("comment2"); //comment tag for project2
var lastcomment = document.getElementById("lastcomment");//comment tag for bigdata project
var imageposition1 = document.getElementById("image");
var firebaseRef = firebase.database().ref();
var userid = "";   // to store the google account name as global variable

//globle variable for time
var date = new Date();
var n = date.toDateString();
var time = date.toLocaleTimeString();
var timenow=n + ' ' + time;
//end



//global variable for image description tag
var image_description=document.getElementById("image_description");
//end


//static part

//function for static part
function displaycomment(node,place){
    firebaseRef.child(node).on('child_added',function(data){
    var  texttwistcomment2 ="<p>"+"comment:"+data.val().content+"</p>";
    var  texttwistauthor = "<p>"+"author:"+data.val().username+"</p>";
    var  commenttime = "<p>"+"time:"+data.val().time+"</p>";
    place.innerHTML = place.innerHTML+texttwistcomment2+texttwistauthor+commenttime+"<br>"+"<br>";});
}


   displaycomment("texttwist",comment1);
   displaycomment("project2",comment2);
   displaycomment("bigdata",lastcomment);
    
    
    
 
    
//static part end



/*unuseful button

function retrieve(){
    var firebaseRef = firebase.database().ref();
   // firebaseRef.child("message").push().set("abccc");
    
    var  firebase1 = firebase.database().ref().child("message");
    firebase1.on('child_added',function(data){
        console.log(data.val());
        p.innerHTML="aaa";
        });
        p.innerHTML="aaaa";
    //var pp = '<p>'+data.val()+'</p>';

}
*/

/*unuseful button
function print(){
var  firebase1 = firebase.database().ref().child("message");
    firebase1.on('child_added',function(data){
        var ppp = data.val();
        console.log(data.val());
        var pp = '<p>'+data.val()+'</p>';
        p.innerHTML+=pp;
        });
        document.write(userid);
   
    
}
*/


function texttwistcomment(){
    
var postData = {
    content: document.getElementById("twist_message").value,
    username: userid,
    time: timenow,

    
};

 // Get a key for a new Post.
 var newPostKey = firebase.database().ref().child('texttwist').push().key;

// Write the new post's data simultaneously in the posts list and the user's post list.
var updates = {};
updates['/texttwist/' + newPostKey] = postData;


return firebase.database().ref().update(updates);

}


function musiccomment2(){
var postData = {
    content: document.getElementById("basicmusic").value,
    username: userid,
    time: timenow,
};
 // Get a key for a new Post.
 var newPostKey = firebase.database().ref().child('project2').push().key;
 // Write the new post's data simultaneously in the posts list and the user's post list.
var updates = {};
updates['/project2/' + newPostKey] = postData;
return firebase.database().ref().update(updates);
}


function last(){
var postData = {
    content: document.getElementById("last").value,
    username: userid,
    time: timenow,
};
 // Get a key for a new Post.
 var newPostKey = firebase.database().ref().child('bigdata').push().key;
 // Write the new post's data simultaneously in the posts list and the user's post list.
var updates = {};
updates['/bigdata/' + newPostKey] = postData;
return firebase.database().ref().update(updates);
}






//google authentification
function login(){
   
    
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    
    
  firebase.auth().signInWithPopup(provider).then(function(result) {
       // This gives you a Google Access Token. You can use it to access the Google API.
       var token = result.credential.accessToken;
       // The signed-in user info.
       var user = result.user;
       // ...
    }).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       // The email of the user's account used.
       var email = error.email;
       // The firebase.auth.AuthCredential type that was used.
       var credential = error.credential;
       // ...
       });
       



    }
    function signout(){firebase.auth().signOut();

    }
    
    firebase.auth().onAuthStateChanged(firebaseUser =>{
    if(firebaseUser){                                               //if login successfully
    
document.getElementById("google").style.visibility='hidden';    
document.getElementById("photo_comment").style.display="inline";  
document.getElementById("index").style.display="inline";
console.log(firebaseUser);
userid=firebaseUser.displayName;    //globalized previously
document.getElementById("heading").innerHTML="Hi, Welcome  "+firebaseUser.displayName;
//p.innerHTML=firebaseUser.displayName;

//if login successfully just show to image-comments
        firebaseRef.child("Post").on('child_added',function(data){
      show_image(data.val().url,data.val().username,data.val().time);
      
      
});

    }          //if login successfully
    
    
    else{


      
    }
  });   
  
  
//google authentification end
  
  
  
  
  
  
  
  
  //firebase storage:
  
 var uploader = document.getElementById('uploader');
 var fileButton = document.getElementById('fileButton');
 
 

 fileButton.addEventListener('change',function(e){
     //get file
     var file = e.target.files[0];
     
     //create a storage ref
     var storageRef = firebase.storage().ref('photo/'+file.name);
     
     
     //uploadfile
     var task = storageRef.put(file);
     
     //update progress bar
     task.on('state_changed',
     
     function progress(snapshot){
         var percentage = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
         uploader.value= percentage;
 },
     
     function error(err){},
     
     function complete(){
    
        var downloadURL = task.snapshot.downloadURL;
       //show_image(downloadURL);
        writeNewPost(downloadURL,"bbb");
       
        //document.write(downloadURL); 
        //var image = '<img src='+downloadURL+  'style="width:500px;height:400px;">';
       //var image= '<img src="decisiontree.png"  style="width:500px;height:400px;">';
        //imageposition1+=image;
         
     }
     );
 });     
 




//function combination:

var firebasename=firebaseUser.displayName.toString();
//the function for writting post
function writeNewPost(url,username1) {
// A post entry.
var postData = {
    url: url,
    username: userid,
    time: timenow,
    description:image_description.value
    
};

 // Get a key for a new Post.
var newPostKey = firebase.database().ref().child('Post').push().key;

// Write the new post's data simultaneously in the posts list and the user's post list.
var updates = {};
updates['/Post/' + newPostKey] = postData;


return firebase.database().ref().update(updates);
}





//show image

function show_image(src,username,time) {
    var img = document.createElement("img");
    img.src = src;
    img.width = 650;
    img.height = 500;
    img.alt = 400;
    var  user ="<p>"+username+"</p>";
    var x = document.createElement("P");
    var t = document.createTextNode("username:"+username);
    x.appendChild(t);
    
    //display time
    var anothertag = document.createElement("P");
    var thetime = document.createTextNode("comment time:"+time);
    anothertag.append(thetime);
    //end
    
    
    //display description:
    var description_tag = document.createElement("P");
    var description = document.createTextNode("comment or description for image:"+image_description.value);
    description_tag.append(description);
    
    //end
    var br1 = document.createElement("br");
    var br2 = document.createElement("br");
    var br3 = document.createElement("br");



    // This next line will just add it to the <body> tag
    document.body.appendChild(img);
    document.body.appendChild(x);
    document.body.appendChild(description_tag);
    document.body.appendChild(anothertag);
    document.body.appendChild(br1);
    document.body.appendChild(br2);
    document.body.appendChild(br3);
}

//show image end






    
