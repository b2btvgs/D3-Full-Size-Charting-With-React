import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, axisRight, scaleLinear, scaleBand, max } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader,  IconButton, Typography, useIsFocusVisible } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import './BarChart.css';
import barChartData from "./barChartData.json";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: '100%',
    maxWidth: '50%',
    padding: '10px',
    // minWidth: 150,
    // minHeight: 150,
   
    fontSize: '14px',
    padding: '15px'
  },
  media: {
    height: 0,
    // paddingTop: '56.25%', // 16:9
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

function BarChart() {

  const classes = useStyles();
  const [ data, setData ] = useState(barChartData);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    // console.log(dimensions);

    if (!dimensions) return;

    // scales
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, dimensions.width]) // change
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, max(data)]) // todo
      .range([dimensions.height+10, 0]); // change

    const colorScale = scaleLinear()
      .domain([75, 100, 150])
      .range(["green", "orange", "red"])
      .clamp(true);

    svg.attr('transform', `translate(${-10},${0})`);

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
      .attr("class", "grid")
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
          .attr("y", yScale(value) - 7)
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
        <Grid container spacing={0} className={classes.root}>
            <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
              <svg ref={svgRef} height='500' width='900'>
                <g className="x-axis" />
                <g className="y-axis" />
              </svg>
            </div>
        </Grid>
    //   </CardContent>
    // </Card>
  );
}

export default BarChart;