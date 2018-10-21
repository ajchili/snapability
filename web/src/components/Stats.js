import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Typography
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import Chart from "react-apexcharts";

class Stats extends Component {
  state = {
    statistics: null,
    err: null
  };

  componentDidMount() {
    this._fetchData();

    setInterval(() => {
      this._fetchData();
    }, 15000);
  }

  _fetchData = () => {
    axios.get('https://us-central1-snapability-220017.cloudfunctions.net/fetchStatistics')
      .then(res => {
        this.setState({
          statistics: res.data[0]
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          err
        });
      });
  }

  render() {
    let totalPlatformUsage = [0, 0, 0];
    if (this.state.statistics) {
      this.state.statistics.forEach(statistic => {
        switch (statistic.type) {
          case "twitter":
            totalPlatformUsage[0]++;
            break;
          case "tumblr":
            totalPlatformUsage[1]++;
            break;
          case "instagram":
            totalPlatformUsage[2]++;
            break;
        }
      })
    }

    let usagePerMinute = [{
      name: 'Twitter',
      data: [null, null, null, null, null, null, null, null, null, null]
    }, {
      name: 'Tumblr',
      data: [null, null, null, null, null, null, null, null, null, null]
    }, {
      name: 'Instagram',
      data: [null, null, null, null, null, null, null, null, null, null]
    }];
    if (this.state.statistics) {
      this.state.statistics.forEach(statistic => {
        let usage = Math.floor((new Date().getTime() - statistic.time) / 1000 / 60);
        console.log(usage);
        switch (statistic.type) {
          case "twitter":
            if (usage <= 9) {
              if (!usagePerMinute[0].data[usage]) usagePerMinute[0].data[usage] = 0; 
              usagePerMinute[0].data[usage]++;
            }
            break;
          case "tumblr":
            if (usage <= 9) {
              if (!usagePerMinute[1].data[usage]) usagePerMinute[1].data[usage] = 0; 
              usagePerMinute[1].data[usage]++;
            }
            break;
          case "instagram":
            if (usage <= 9) {
              if (!usagePerMinute[2].data[usage]) usagePerMinute[2].data[usage] = 0; 
              usagePerMinute[2].data[usage]++;
            }
            break;
        }
      });

      usagePerMinute[0].data.reverse();
      usagePerMinute[1].data.reverse();
      usagePerMinute[2].data.reverse();
    }


    let abc = {
      chart: {
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      stroke: {
        width: [5,5,4],
        curve: 'straight'
      },
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse(),
      fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            gradientToColors: [ '#FDD835'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
        },
      },
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
            minHeight: "100vh",
            overflowY: "scroll"
          }}
        >
        <Grid item l={4} m={6} xs={8} sm={10}>
          {this.state.statistics ? (
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={32}
              style={{
                marginTop: '5px'
              }}
            >
              <Grid item>
                <Card>
                  <div className="donut">
                    <Chart options={{labels: ['Twitter', 'Tumblr', 'Instagram']}} series={totalPlatformUsage} type="donut" />
                  </div>
                  <CardContent>
                    <Typography variant="display1">
                      All requests ever made using Snapability
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card>
                  <div className="line">
                    <Chart options={abc} series={usagePerMinute} type="line" />
                  </div>
                  <CardContent>
                    <Typography variant="display1">
                      All requests made within the past 10 minutes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
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
        </Grid>
      </div>
    );
  }
}

export default withRouter(Stats);
