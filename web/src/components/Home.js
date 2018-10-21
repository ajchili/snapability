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

class Home extends Component {
  state = {
    post: "",
    platform: ""
  };

  onPostChange = e => {
    this.setState({ post: e.target.value });
  };

  onPlatformChange = e => {
    this.setState({ platform: e.target.value });
  };

  onLoadPost = () => {
    const { post, platform } = this.state;

    if (!post.length || !platform.length) alert("A url and platform are required!");
    else {
      switch (platform) {
        case "twitter":
          let author = post.split('com/')[1].split('/')[0];
          let status = post.split('status/')[1];
          this.props.history.push(`/post/twitter?author=${author}&?status=${status}`);
          break;
        default:
          alert('The platform selected is currently unsupported.');
          break;
      }
    }
  };

  render() {
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
              an accessible way to experience pictures on social media platforms
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
    );
  }
}

export default withRouter(Home);