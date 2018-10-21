import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Chip,
  Typography
} from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";

const allowedTypes = ["twitter", "tumblr", "instagram"];

class Post extends Component {
  state = {
    post: null,
    err: null,
    content: null
  };

  _fetchTweet = url => {
    if (this.state.err || this.state.post) return;

    axios({
      method: "POST",
      url:
        "https://us-central1-snapability-220017.cloudfunctions.net/parseTwitterPost",
      data: {
        url
      }
    })
      .then(res => {
        this.setState({
          post: res.data
        });
      })
      .catch(() => {
        this.setState({
          err: "Error parsing tweet."
        });
      });
  };

  _fetchPost = (username, postId) => {
    if (this.state.err || this.state.post) return;

    axios({
      method: "POST",
      url:
        "https://us-central1-snapability-220017.cloudfunctions.net/parseTumblrPost",
      data: {
        username,
        postId
      }
    })
      .then(res => {
        this.setState({
          post: res.data
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          err: "Error parsing tumblr post."
        });
      });
  };

  _fetchInstagramPost = post => {
    if (this.state.err || this.state.post) return;

    axios({
      method: "POST",
      url:
        "https://us-central1-snapability-220017.cloudfunctions.net/parseInstagramPost",
      data: {
        url: `https://www.instagram.com/p/${post}`
      }
    })
      .then(res => {
        this.setState({
          post: res.data
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          err: "Error parsing tumblr post."
        });
      });
  };

  _fetchContent = url => {
    if (this.state.content) return;

    axios({
      method: "POST",
      url:
        "https://us-central1-snapability-220017.cloudfunctions.net/predictImage",
      data: {
        url
      }
    })
      .then(res => {
        this.setState({
          content: res.data
        });
      })
      .catch(err => console.error(err));
  };

  render() {
    let type = this.props.match.params.type;
    let url = null;
    if (!allowedTypes.includes(type)) type = null;
    else {
      let author, status, username, postId;

      switch (type) {
        case "twitter":
          author = this.props.location.search.split("author=")[1];
          status = this.props.location.search.split("status=")[1];
          if (author && status) {
            url = `https://twitter.com/${
              author.split("&")[0]
            }/status/${status}`;
            this._fetchTweet(url);
          } else {
            return <Redirect to="/" />;
          }
          break;
        case "tumblr":
          username = this.props.location.search
            .split("author=")[1]
            .split("&")[0];
          postId = this.props.location.search.split("post=")[1];
          url = `https://${username}/post/${postId}`;
          if (username && postId) {
            this._fetchPost(username, postId);
          } else {
            return <Redirect to="/" />;
          }
          break;
        case "instagram":
          postId = this.props.location.search.split("post=")[1];
          if (postId) {
            this._fetchInstagramPost(postId);
          } else {
            return <Redirect to="/" />;
          }
          break;
        default:
          break;
      }
    }

    if (!!this.state.post) {
      if (type !== "tumblr") {
        this._fetchContent(this.state.post.src);
      } else {
        this.state.post.forEach(src => {
          this._fetchContent(src);
        });
      }
    }

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
          onClick={() => this.props.history.push("/")}
        >
          Back
        </Button>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={{
            height: "100vh"
          }}
        >
          {type ? (
            <Grid item l={4} m={6} xs={8} sm={10}>
              {this.state.post ? ( 
                <Card>
                  {this.state.post ? (
                    <CardMedia
                      image={type !== 'tumblr' ? this.state.post.src : this.state.post[0]}
                      title={`${type} post provided by user`}
                      style={{
                        height: '400px',
                        width: '100%'
                      }}
                    />
                  ) : (
                    <Grid
                      container
                      direction="column"
                      justify="center"
                      alignItems="center"
                      spacing={8}
                      style={{
                        marginTop: '5px'
                      }}
                    >
                      <Grid item>
                        <CircularProgress />
                      </Grid>
                      <Grid item>
                        <Typography variant="caption">
                          Loading image...
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                    <CardContent>
                      <Typography gutterBottom variant="headline" component="h2">
                        {type.substring(0, 1).toUpperCase()}
                        {type.substring(1)} Post
                      </Typography>
                      {this.state.content ? (
                        <Grid
                          container
                          direction="row"
                          justify="flex-start"
                          alignItems="center"
                          spacing={8}
                          style={{
                            marginTop: "5px"
                          }}
                        >
                          {this.state.content.map(content => {
                            return (
                              <Grid item key={content.name}>
                                {content.value >= 0.9 && (
                                  <Chip
                                    label={content.name}
                                    variant="outlined"
                                    color="primary"
                                  />
                                )}
                                {content.value < 0.9 &&
                                  content.value >= 0.7 && (
                                    <Chip
                                      label={content.name}
                                      variant="outlined"
                                    />
                                  )}
                                {content.value < 0.7 && (
                                  <Chip
                                    label={content.name}
                                    variant="outlined"
                                    color="secondary"
                                  />
                                )}
                              </Grid>
                            );
                          })}
                        </Grid>
                      ) : (
                        <Grid
                          container
                          direction="column"
                          justify="center"
                          alignItems="center"
                          spacing={8}
                          style={{
                            marginTop: "5px"
                          }}
                        >
                          <Grid item>
                            <CircularProgress />
                          </Grid>
                          <Grid item>
                            <Typography variant="caption">
                              Loading descriptions...
                            </Typography>
                          </Grid>
                        </Grid>
                      )
                    }
                    </CardContent>
                  <CardActions>
                    <Button 
                      size="small"
                      color="primary"
                      onClick={() => window.open(url, '_blank')}
                    >
                      Original Post
                    </Button>
                    <Button size="small" color="primary">
                      Share
                    </Button>
                  </CardActions>
                </Card>
              ) : (
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  spacing={8}
                  style={{
                    marginTop: '5px'
                  }}
                >
                  {this.state.err ? (
                  <Grid item>
                    <Typography variant="display1">
                      There was an error loading this post :(
                    </Typography>
                    <Typography variant="display4">
                      Please refresh the page or try again later
                    </Typography>
                  </Grid>
                  ) : (
                    <Grid item>
                      <CircularProgress size={150} />
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          ) : (
            <Redirect to="/" />
          )}
        </Grid>
      </div>
    );
  }
}

export default withRouter(Post);
