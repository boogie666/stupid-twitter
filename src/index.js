
var nlp = window.nlp_compromise;

function random_post(){
  var posts = Array.from(jQuery(".tweet"));

  var selection = Math.floor(Math.random() * posts.length);
  return jQuery(posts[selection]);
}


function random_post_at_the_bottom(){
  var posts = Array.from(jQuery(".tweet"));
  posts.splice(0, posts.length/2);
  
  var selection = Math.floor(Math.random() * posts.length);
  return jQuery(posts[selection]);

}

function rand_nth(arr){
  var selection = Math.floor(Math.random() * arr.length);
  return jQuery(arr[selection]);

}


function insert_post(parent, post){
  var tpl = parent.clone();
  tpl.find(".fullname").text(post.author.name);
  tpl.find(".username b").text(post.author.username);
  tpl.find(".TweetTextSize").text(post.body.text);
  tpl.find(".avatar.js-action-profile-avatar").css({"z-index" : 100});
  if(post.body.image){
    tpl.find(".AdaptiveMedia.is-square").find("img").attr("src", post.body.image);
    tpl.find(".AdaptiveMedia.is-square").find(".AdaptiveMedia-photoContainer.js-adaptive-photo ").data("image-url", post.body.image);
  }else {
    tpl.find(".js-media-container").remove();
  }
  tpl.insertAfter(random_post_at_the_bottom());
}

function extract_author(tweet){
  var avatar = jQuery("img.avatar.js-action-profile-avatar", tweet).attr("src");
  var username = jQuery("span.username b", tweet).first().text();
  var name = jQuery("strong.fullname.show-popup-with-id", tweet).text();
  return {
    avatar : avatar,
    username : username,
    name : name
  };
}


function all_authors(){
  return Array.from(jQuery(".tweet")).map(extract_author);
}

function mapcat(f, array){
  var result = [];
  for(var i = 0; i<array.length; i++){
    result = result.concat(f(array[i]));
  }
  return result;
}


function all_texts(){
  return Array.from(jQuery(".TweetTextSize.js-tweet-text.tweet-text")).map(function(tweet){
    var t = jQuery(tweet).clone();
    t.find("a.twitter-timeline-link").remove();
    return t.text()
            .toLowerCase()
            .trim()
  }).join(" ");
}





function createTokens(text) {
  var nlp_text = nlp.text(text);
  var terms = nlp_text.terms();
  var tokens = [];
  for (var i = 0; i < terms.length; i++) {
    tokens.push(terms[i].text);
  }
  return tokens;
}


function chooseStartingToken(tokens) {
  var index = Math.floor(Math.random() * tokens.length);
  return tokens[index];
}


function findNextWord(tokens, currentWord) {
  var nextWords = [];
  for (var w = 0; w < tokens.length-1; w++) {
    if (tokens[w] == currentWord) {
      nextWords.push(tokens[w+1]);
    }
  }
  var word = nextWords[Math.floor(Math.random() * nextWords.length)]; 
  return word;
}


function capitalize(str) {
    return str.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};


function gen_mode(){
  var rand = Math.random();
  if( rand < 0.2){
    return "rage";
  }

  if(rand < 0.4){
    return "question";
  }

  return "normal";
}


function gen_tweet_text() {
  var text = all_texts();
  var tokens = createTokens(text);
  var currentWord = chooseStartingToken(tokens);
  var sentence = [];
  while (currentWord.indexOf(".") < 0 && sentence.length < 16) { // while we haven't found a period
    currentWord = findNextWord(tokens, currentWord);
    sentence.push(currentWord);
  }

  var mode = gen_mode();

  if(mode === "rage"){
    return sentence.toUppercase() + "!!!1!!1!!!";
  }

  if(mode === "question"){
    return "What " + sentence.join(" ").replace(".","") + "???";
  }

  sentence[0] = capitalize(sentence[0]);
  return sentence.join(" ");
}


function gen_tweet(){
  var text = gen_tweet_text();
  var author = rand_nth(all_authors());

  return {
    author : author,
    body : {
      text : text
    }
  };
}

setInterval(function(){
  console.log("randomizing tweet");
  insert_post(random_post(), gen_tweet());
}, 20 * 1000);
