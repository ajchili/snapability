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
} from '@material-ui/core';
import { Redirect } from 'react-router-dom';

const allowedTypes = [
  'twitter'
];

export default class extends Component {
  state = {
    post: null,
    err: null,
    content: null
  };

  _fetchTweet = url => {
    if (this.state.err || this.state.post) return;

    axios({
      method: 'POST',
      url: 'https://us-central1-snapability-220017.cloudfunctions.net/parseTwitterPost',
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
          err: 'Error parsing tweet.'
        });
      });
  }

  _fetchContent = url => {
    if (this.state.content) return;

    axios({
      method: 'POST',
      url: 'https://us-central1-snapability-220017.cloudfunctions.net/predictImage',
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
  }

  render() {
    let type = this.props.match.params.type;
    let url = null;
    if (!allowedTypes.includes(type)) type = null;
    else {
      switch (type) {
        case 'twitter':
          let author = this.props.location.search.split('author=')[1];
          let status = this.props.location.search.split('status=')[1];
          if (author && status) {
            url = `https://twitter.com/${author.split('&')[0]}/status/${status}`;
            this._fetchTweet(url)
          }
          break;
        default:
          break;
      }
    }

    if (!!this.state.post) {
      this._fetchContent(this.state.post.src);
    }

    return (
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
          <Grid item m={4} xs={4} sm={4}>
            {this.state.post && 
              <Card>
                {this.state.post ? (
                  <CardMedia
                    image={this.state.post.src}
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
                    {type.substring(0, 1).toUpperCase()}{type.substring(1)} Post
                  </Typography>
                  {this.state.content ? (
                    <Grid
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                      spacing={8}
                      style={{
                        marginTop: '5px'
                      }}
                    >
                      {this.state.content
                        .map(content => {
                          return (
                            <Grid
                              item
                              key={content.name}
                            >
                              {content.value >= .9 &&
                                <Chip label={content.name} variant="outlined" color="primary"/>
                              }
                              {content.value < .9 && content.value >= .7 &&
                                <Chip label={content.name} variant="outlined"/>
                              }
                              {content.value < .7 &&
                                <Chip label={content.name} variant="outlined" color="secondary"/>
                              }
                            </Grid>
                          );
                        })
                      }
                    </Grid>
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
            }
          </Grid>
        ) : (
          <Redirect to="/" />
        )}
      </Grid>
    );
  }
}
