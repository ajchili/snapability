import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
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
                <CardMedia
                  image={this.state.post.src}
                  title="Contemplative Reptile"
                  style={{
                    height: '400px',
                    width: '100%'
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="headline" component="h2">
                    {type.substring(0, 1).toUpperCase()}{type.substring(1)} Post
                  </Typography>
                  <Typography variant="caption">
                    <a href={url} target="_blank">Original Post</a>
                  </Typography>
                  {this.state.content && this.state.content.map(content => {
                    return (
                      <Chip label={content.name} variant="outlined" />
                    );
                  })}
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                  <Button size="small" color="primary">
                    Learn More
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
