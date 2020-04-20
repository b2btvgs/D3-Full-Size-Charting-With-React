import React, { useRef, useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { select, axisBottom, axisLeft, scaleLinear, scaleBand, max, format } from "d3";
import { Card, CardContent } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

import './BarChartHorizontal.css';
import barchartHorizontalData from './barchartHorizontalData.json';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 150,
    minWidth: 150,
    minHeight: 150,
    maxHeight: 150,
    padding: '15px',
    fontSize: '10px'
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

const titleText = 'Top 10 Most Populous Countries';
const xAxisLabelText = 'Population';

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

const BarChartHorizontal = () => {

  const [ data, setData ] = useState(barchartHorizontalData);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const classes = useStyles();
  // console.log(data);

  useEffect( () => {

    const svg = select(svgRef.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    // console.log(dimensions);

    if (!dimensions) return;

    const xValue = d => d['population'] * 1000;
    const yValue = d => d.country;
    const margin = { top: 22, right: 10, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleLinear()
      .domain([0, max(data, xValue)])
      .range([0, dimensions.width]);

    const yScale = scaleBand()
      .domain(data.map(yValue))
      .range([0, dimensions.height])
      .padding(.2);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left-5},${margin.top - 50})`);

    const xAxisTickFormat = number =>
      format('.3s')(number)
      .replace('G', 'B');

    const xAxis = axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize(dimensions.height)

    g.append('g')
      .style("font", "4px times")
      .attr('transform', `translate(${margin.left - 20},${margin.top - 10})`)
      .call(axisLeft(yScale))
      .selectAll('.domain, .tick line')
      .remove();

    console.log(dimensions.height);
  

    const xAxisG = g.append('g')
      .style("font-size", "5px")
      .call(xAxis)
      .attr('transform', `translate(${-5},${10})`);
    
    xAxisG.select('.domain').remove();

    xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', dimensions.height + 15)
      .attr('x', 100 / 2)
      .attr('fill', 'black')
      .attr('font-size', '1.4em')
      .text(xAxisLabelText);

    g.selectAll('rect').data(data)
      .enter().append('rect')
      .attr('transform', `translate(${margin.left - 25},${margin.top - 10})`)
      .attr('y', d => yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth())

    g.append('text')
      .attr('class', 'title')
      .attr('transform', `translate(${margin.left - 25},${margin.top - 17})`)
      .style("font-size", "6.5px")
      .attr('y', 0)
      .text(titleText);

    }, [data, dimensions]);


  return (
    <Card className={classes.root}>
      <CardContent>
      <Grid container spacing={0}>
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
          <svg ref={svgRef}>
          </svg>         
        </div>
      </Grid>
      </CardContent>
    </Card>
  )
}

export default BarChartHorizontal;