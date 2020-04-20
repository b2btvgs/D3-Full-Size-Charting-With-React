import React, { useEffect, useState, useRef } from 'react';
import { select, hierarchy, event, tree, linkHorizontal } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader,  IconButton, Typography, useIsFocusVisible } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import D3TreeChart from '../../d3Components/D3TreeChart';
import treeChartData from "./treeChart5Data.json";
import './TreeChart.css';

const width = 800;
const height = 400;

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 1100,
    // maxHeight: 700,
    // minWidth: 150,
    // minHeight: 150,
    // fontSize: '11px',
    // padding: '15px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  buttonStyling: {
    fontSize: '0.5em'
  }
}));

const useResizeObserver = ref => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

const TreeChart5 = (() => {

  const classes = useStyles();
  const [ data, setData ] = useState(treeChartData);
  const svgRef = useRef();
  const wrapperRef = useRef()

  // when the <div> containing the <svg> canvas is resized,
  // the ResizeObserver provides the new width and height
  const dimensions = useResizeObserver(wrapperRef);

  // when the component boots up and when either the data
  // or the resized dimensions (width/height) change the draw function is called
  useEffect(() => {

    if (!dimensions) return;
    svgRef.current.innerHTML = "";

    const d3TreeChart = new D3TreeChart(height, width, data, svgRef, dimensions);
    d3TreeChart.draw(height, width, data, svgRef, dimensions);
    
}, [data, dimensions]);

  return (
    // <Card className={classes.root}>
    //   <CardContent>
        <Grid container spacing={0}>
              <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
                <svg ref={svgRef}>
                  {/* <g className="x-axis" />
                  <g className="y-axis" /> */}
                </svg>
              </div>
          </Grid>
    //   </CardContent>
    // </Card>
  )
})

export default TreeChart5
