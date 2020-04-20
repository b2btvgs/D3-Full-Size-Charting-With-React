import React, { useRef, useEffect, useState } from "react";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader,  IconButton, Typography, useIsFocusVisible } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import barChartData from "./barChartData.json";
import './BarChart3.css';

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 550,
    // minWidth: 250,
    // minHeight: 250,
    // maxHeight: 550,
    marginLeft: '35px',
    // marginRight: '0px',
    // marginRight: '80px',
    fontSize: '14px',
    // paddingLeft: '0px',
    // paddingRight: '0px',
    background: 'beige',
    // paddingRight: '50px'
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

const BarChart3 = (() => {

  const [ data, setData ] = useState(barChartData);
  const classes = useStyles();
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    console.log(dimensions);

    if (!dimensions) return;

    // scales
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, dimensions.width]) // change
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, 150]) // todo
      .range([dimensions.height, 0]); // change

    const colorScale = scaleLinear()
      .domain([75, 100, 150])
      .range(["green", "orange", "red"])
      .clamp(true);

    // create x-axis
    const xAxis = axisBottom(xScale).ticks(data.length);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    // create y-axis
    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);

    // draw the bars
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -dimensions.height)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (value, index) => {
        svg
          .selectAll(".tooltip")
          .data([value])
          .join(enter => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 8)
          .attr("opacity", 1);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", value => dimensions.height - yScale(value));
  }, [data, dimensions]);

  return (
    // <Card className={classes.root}>
    //   <CardContent>
        // <Grid container spacing={0}>
              <div ref={wrapperRef} style={{ marginBottom: "-0.5rem" }}>
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
})

export default BarChart3
