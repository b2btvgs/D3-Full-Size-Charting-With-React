import React from 'react';
// import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import SunburstChart from '../components/Sunburst/SunburstChart';
import BarChart from '../components/BarChart/BarChart';
import BarChart2 from '../components/BarChart/BarChart2';
import BarChart3 from '../components/BarChart/BarChart3';
// import TreeChart from '../components/TreeChart/TreeChart';
import TreeChart2 from '../components/TreeChart/TreeChart2';
import TreeChart3 from '../components/TreeChart/TreeChart3';
import TreeChart4 from '../components/TreeChart/TreeChart4';
import TreeChart5 from '../components/TreeChart/TreeChart5';
// import BarChartHorizontal from '../components/BarChartHorizontal/BarChartHorizontal';
// import BarChart2 from '../components/BarChart/BarChart2';
// import CurvedLine from '../components/CurvedLineChart/CurvedLineChart';
import { makeStyles } from '@material-ui/core/styles';
import { CenterFocusStrong } from '@material-ui/icons';
// import gridCollection from './gridCollection.json';

const useStyles = makeStyles({

  root: {
    // minWidth: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: '40px',
    paddingRight: '70px'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  background: {
    background: 'aliceblue',
    padding: '17px',
    textAlign: 'center'
  }
});

// const dataSource = gridCollection;

const renderChart = (chart) => {
  // console.log(chart.gridType);
  // switch (chart.gridType) {
  //   case 'SUNBURST':
  //     return <SunburstChart />;
  //     case 'BARCHART':
  //     return <BarChart />;
  //     case 'HORIZONTALBARCHART':
  //     return <BarChartHorizontal />;
  //     case 'BARCHART2':
  //     return <BarChart2 />;
  //   default:
  //     return <BarChartHorizontal />;
  // }
}

const getChart = (chart) => {

  return (
    <Grid item xs={6} sm={3} md={2}>
      {/* { renderChart(chart)} */}
    </Grid>
  )
}

const Content = () => {

  const classes = useStyles();

  return (
    // <Router>
      <Grid container spacing={2} className={classes.root}>
        {/* { dataSource.map(item => getChart(item)) } */}
        {/* <SunburstChart /> */}
        {/* <BarChart2 /> */}
        {/* <BarChart3 /> */}
        <TreeChart5 />

      </Grid>
    //  <div>
    //     <Switch>
    //       {/* <Route exact path="/" component={Home} /> */}
    //       {/* <Route exact path="/barchart" component={BarChart} /> */}
    //       {/* <Route exact pateh="/sunburst" component={SunburstChart} /> */}
    //     </Switch >
    //   </div>
    // </Router>
  )
}

export default Content;
