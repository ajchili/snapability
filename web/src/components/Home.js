import React, { Component } from "react";
import {
  Button,
  Input,
  TextField,
  Grid,
  MenuItem,
  FormHelperText,
  FormControl,
  Typography,
  Select
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

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
  "https://twitter.com/selfcareviibess/status/1053946313606381574"
];

class Home extends Component {
  state = {
    post: "",
    platform: ""
  };

  onPostChange = e => {
    this.setState({ post: e.target.value });
    if (e.target.value.includes("twitter")) {
      this.setState({ platform: "twitter" });
    } else if (e.target.value.includes("tumblr")) {
      this.setState({ platform: "tumblr" });
    } else if (e.target.value.includes("instagram")) {
      this.setState({ platform: "instagram" });
    } else if (!e.target.value.length) {
      this.setState({ platform: "" });
    }
  };

  onPlatformChange = e => {
    this.setState({ platform: e.target.value });
  };

  onLoadPost = () => {
    const { post, platform } = this.state;
    let author, status, _post;

    if (!post.length || !platform.length)
      alert("A url and platform are required!");
    else {
      switch (platform) {
        case "twitter":
          author = post.split("com/")[1].split("/")[0];
          status = post.split("status/")[1];
          this.props.history.push(
            `/post/twitter?author=${author}&?status=${status}`
          );
          break;
        case "tumblr":
          author = post.split("://")[1].split("/")[0];
          _post = post.split("post/")[1];
          if (_post.includes("/")) _post = _post.split("/")[0];
          this.props.history.push(
            `/post/tumblr?author=${author}&?post=${_post}`
          );
          break;
        case "instagram":
          _post = post.split("/p/")[1];
          if (_post.includes("/")) _post = _post.split("/")[0];
          this.props.history.push(`/post/instagram?post=${_post}`);
          break;
        default:
          alert("The platform selected is currently unsupported.");
          break;
      }
    }
  };

  render() {
    return (
      <div>
        <Button
          style={{
            top: 5,
            left: 5,
            position: "absolute"
          }}
          variant="text"
          color="primary"
          onClick={() => this.props.history.push('/stats')}
        >
          Statistics
        </Button>
        <Button
          style={{
            top: 5,
            right: 5,
            position: "absolute"
          }}
          variant="text"
          color="primary"
          onClick={() => {
            let post = demo[Math.floor(Math.random() * demo.length)];
            this.setState({ post });
            this.onPostChange({ target: { value: post } });
            setTimeout(() => this.onLoadPost(), 300);
          }}
        >
          Demo
        </Button>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={{
            height: "100vh",
            overflowX: "hidden"
          }}
        >
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={32}
          >
            <Grid item>
              <Typography variant="display1" align="center">
                Snapability
              </Typography>
              <Typography variant="caption" align="center">
                an accessible way to experience pictures on social media
                platforms
              </Typography>
            </Grid>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={32}
            >
              <Grid item xs={6} sm={3}>
                <TextField
                  id="outlined-dense"
                  label="Enter URL"
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  onChange={this.onPostChange}
                  value={this.state.post}
                />
              </Grid>
              <Grid item>
                <FormControl>
                  <Select
                    value={this.state.platform}
                    onChange={this.onPlatformChange}
                    input={<Input platform="platform" />}
                  >
                    <MenuItem value={"twitter"}>Twitter</MenuItem>
                    <MenuItem value={"tumblr"}>Tumblr</MenuItem>
                    <MenuItem value={"instagram"}>Instagram</MenuItem>
                  </Select>
                  <FormHelperText>Select platform</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.onLoadPost}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Home);
