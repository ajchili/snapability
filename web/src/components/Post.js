import React, { Component } from "react";
import axios from "axios";

const allowedTypes = [
  'twitter'
];

export default class extends Component {
  state = {
    post: null,
    err: null,
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

    return (
      <div>
        {type ? (
          <div>
            <h3>Type: {type}</h3>
            {url}
          </div>
        ) : (
          <h3>No type speified.</h3>
        )}
      </div>
    );
  }
}
