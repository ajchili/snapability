import React, { Component } from "react";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default class extends Component {
  state = {
    platform: "",
    labelWidth: 0
  };

  render() {
    return (
      <div>
        <div className="styles.titleDiv">
          <div>
            <h1>Snapability</h1>
            <h4>explain a picture, or whatever.</h4>
          </div>
          <div>
            <TextField
              id="outlined-dense"
              label="Enter URL"
              margin="dense"
              variant="outlined"
            />
          </div>
          <div>
            <FormControl>
              <Select
                value={this.state.age}
                onChange={this.handleChange}
                input={<Input platform="platform" />}
              >
                <MenuItem value={"Twitter"}>Twitter</MenuItem>
                <MenuItem value={"Tumblr"}>Tumblr</MenuItem>
                <MenuItem value={"Instagram"}>Instagram</MenuItem>
              </Select>
              <FormHelperText>Select platform</FormHelperText>
            </FormControl>
          </div>
        </div>
      </div>
    );
  }
}
