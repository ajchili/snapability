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

export default class extends Component {
  state = {
    platform: ""
  };

  onPlatformChange = e => {
    this.setState({ platform: e.target.value });
  };

  render() {
    return (
      <div>
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
            spacing="32"
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
              spacing="32"
            >
              <Grid item xs={6} sm={3}>
                <TextField
                  id="outlined-dense"
                  label="Enter URL"
                  margin="dense"
                  variant="outlined"
                  fullWidth
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
            <Button variant="outlined" color="primary">
              Search
            </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}
