import React, { useEffect, useState, useRef } from 'react';
import { select, hierarchy, event, tree, linkHorizontal } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader,  IconButton, Typography, useIsFocusVisible } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import treeChartData from "./treeChartData.json";
import './TreeChart.css';

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 150,
    // minWidth: 150,
    // minHeight: 150,
    // maxHeight: 150,
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

function TreeChart4() {

  const classes = useStyles();
  const [ data, setData ] = useState(treeChartData);
  const svgRef = useRef();
  const wrapperRef = useRef()

  useEffect(() => {

  const svg = select(svgRef.current);

    // ************** Generate the tree diagram	 *****************
  var margin = {top: 20, right: 120, bottom: 20, left: 20};
  const width = 960 - margin.right - margin.left;
  const height = 500 - margin.top - margin.bottom;

  var i = 0,
	duration = 750,
	root;

  var thisTree = tree()
    .size([height, width]);

  const diagonal = linkHorizontal().x(d => d.y).y(d => d.x)

  svg
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  root = data;
  root.x0 = height / 2;
  root.y0 = 0;

  update(root);

  // select(self.frameElement).style("height", "500px");

  function update(source) {

    // Compute the new tree layout.
    var nodes = thisTree.nodes(source).reverse(),
    links = thisTree.links(nodes);


  }


  }, [data])

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container spacing={0}>
              <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
                <svg ref={svgRef}>
                  <g className="x-axis" />
                  <g className="y-axis" />
                </svg>
              </div>
          </Grid>
      </CardContent>
    </Card>
    
  )
}

export default TreeChart4
