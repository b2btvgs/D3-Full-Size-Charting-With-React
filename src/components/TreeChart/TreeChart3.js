import React, { useEffect, useState, useRef } from 'react';
import { select, hierarchy, event, tree, linkHorizontal } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader,  IconButton, Typography, useIsFocusVisible } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import treeChartData from "./flare-2.json";
import './TreeChart.css';

const margin = ({top: 10, right: 120, bottom: 10, left: 40});

const width = 900;
const height = 900;
const dx = 10;
const dy = width / 6;

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 150,
    // minWidth: 150,
    // minHeight: 150,
    // maxHeight: 150,
    fontSize: '16px',
    padding: '15px'
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

function TreeChart3() {

  const [ data, setData ] = useState(treeChartData);
  // console.log(data);
  const svgRef = useRef();
  const wrapperRef = useRef();
  // const dimensions = useResizeObserver(wrapperRef);
  const classes = useStyles();

  useEffect(() => {

    const svg = select(svgRef.current);
    // console.log(dimensions);

    // if (!dimensions) return;

    svg.attr('transform', `translate(${200},${200})`);

    const root = hierarchy(data);

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    svg
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("font", "10px sans-serif")
      .style("user-select", "none");

    // console.log('margin is: ' + JSON.stringify(margin));

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    function update(source) {

      console.log('update initiated');

      const duration = event && event.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });


    // const height = right.x - left.x + margin.top + margin.bottom;
    // console.log('right is: ' + right.x);
    // console.log('height is: ' + height);

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // console.log('width is: ' + width);
    // console.log('height is: ' + height);

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", d => {
          d.children = d.children ? null : d._children;
          update(d);
        });

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
        .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    const diagonal = linkHorizontal().x(d => d.y).y(d => d.x)

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  // return svg.node();


  }, [data]);
 
  return (
    // <Card className={classes.root}>
    //   <CardContent>
        // <Grid container spacing={0}>
              <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
                <svg ref={svgRef}>
                  <g className="x-axis" />
                  <g className="y-axis" />
                </svg>
              </div>
          // </Grid>
    //   </CardContent>
    // </Card>
    // <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
    //   <svg ref={svgRef}>
    //     <g className="x-axis" />
    //     <g className="y-axis" />
    //   </svg>
    // </div>
  )
}

export default TreeChart3
