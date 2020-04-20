import React, { useRef, useEffect, useState } from "react";
import { select, hierarchy, tree } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader,  IconButton, Typography, useIsFocusVisible } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import './TreeChart.css';
import treeChartData from "./treeChartData.json";

const width = 900;
  const margin = ({top: 10, right: 120, bottom: 10, left: 40});

  const dx = 10;
  let dy = 128.16666666666666;
  dy = width / 6;

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

function TreeChart2() {

  const [ data, setData ] = useState(treeChartData);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect = ( () => {


})

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  )
}

export default TreeChart2
