const axios = require("axios");

const demo = [
  "https://twitter.com/LinusTech/status/1053731363373764608",
  "https://twitter.com/BOOSTLINKS/status/1053830378006315008",
  "https://twitter.com/BOOSTLINKS/status/1053826688822341633",
  "https://twitter.com/BOOSTLINKS/status/1053836520132657152",
  "https://twitter.com/seanallen_dev/status/1053871956682932226",
  "https://www.instagram.com/p/BoKXMzqA5rm",
  "https://www.instagram.com/p/Bo2WOtAHRl_/",
  "https://www.instagram.com/p/BpKZxqsnZHA/",
  "https://www.instagram.com/p/BpHuBMrh-m9/",
  "https://www.instagram.com/p/BpMNLgxnuSf/?tagged=exploration",
  "https://ramibains.tumblr.com/post/172413087381/porsche",
  "https://coolcatgroup.tumblr.com/post/179264527036/theawkwardjossy-i-think-we-can-all-agree-chubs",
  "http://krabby-kronicle.tumblr.com/post/168440292876",
  "http://astalavistasta.tumblr.com/post/175234498819/%C3%B6zg%C3%BCrl%C3%BC%C4%9F%C3%BCn-en-b%C3%BCy%C3%BCk-d%C3%BC%C5%9Fman%C4%B1-halinden-memnun-olan",
  "https://twitter.com/JohnMayer/status/1014968418892636160",
  "https://twitter.com/localgringo/status/923198119784931328",
  "https://twitter.com/DaisyOfNland/status/1053923167197192192",
  "https://twitter.com/UNC_Basketball/status/1053350300801818626",
  "https://twitter.com/selfcareviibess/status/1053946313606381574",
  "https://www.instagram.com/p/BncJVbhlpts/?taken-by=gunnerstahl.us",
  "https://www.instagram.com/p/Bn32gjHg67w/?taken-by=kreayshawn",
  "https://www.instagram.com/p/Bn4GC3oFhVO/?taken-by=classifiedg",
  "https://www.instagram.com/p/BpG1o-TgOQs/?taken-by=oscardona",
  "https://www.instagram.com/p/BpIvk7ZBs2x/?explore=true",
  "http://hifructosemag.tumblr.com/post/179249193402/magnhild-kennedy-the-norwegian-artist-also-known",
  "https://imoutsidelookingin.tumblr.com/post/179274828040/cynthia-harper",
  "http://beakersblog.tumblr.com/post/179272841989",
  "http://scientificillustration.tumblr.com/post/179263990890/humanoidhistory-soviet-space-art-by-andrei"
];

fetchInstagram = url => {
  axios({
    method: "POST",
    url:
      "https://us-central1-snapability-220017.cloudfunctions.net/parseInstagramPost",
    data: {
      url
    }
  })
    .then(res => {})
    .catch(err => {
      console.error("Unable to load instagraam post");
    });
};

fetchTumblr = (username, postId) => {
  axios({
    method: "POST",
    url:
      "https://us-central1-snapability-220017.cloudfunctions.net/parseTumblrPost",
    data: {
      username,
      postId
    }
  })
    .then(res => {})
    .catch(err => {
      console.error("Unable to load tumblr post");
    });
};

fetchTwitter = url => {
  axios({
    method: "POST",
    url:
      "https://us-central1-snapability-220017.cloudfunctions.net/parseTwitterPost",
    data: {
      url
    }
  })
    .then(res => {})
    .catch(err => {
      console.error("Unable to load twitter post");
    });
};
const URLRequest = () => {
  let post = demo[Math.floor(Math.random() * demo.length)];
  if (post.includes("twitter.com")) {
    fetchTwitter(post);
  } else if (post.includes("instagram.com")) {
    fetchInstagram(post);
  } else {
    let username = post.split("://")[1].split("/")[0];
    let postId = post.split("post/")[1];
    fetchTumblr(username, postId);
  }
  console.log("randomized post: " + post);
};

URLRequest();
setInterval(() => {
  URLRequest();
}, 7000);
