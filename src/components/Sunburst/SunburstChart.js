import React, { useRef, useEffect, useState } from "react";
import { select, partition, format, hierarchy, arc, scaleOrdinal, 
    quantize, interpolate, interpolateRainbow } from "d3";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader,  IconButton, Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import sourceData from "./data/flare-2.json";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '750px',
    minWidth: '900px',
    // minHeight: 150,
    // maxHeight: 150,
    fontSize: '14px',
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

function SunburstChart () {

const classes = useStyles();

const svgSunburstRef = useRef();
const [ data, setData ] = useState(sourceData);

const width = 900;

const radius = width / 6;

const d3Partition = (data) => {
  const root = hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);
  return partition().size([2 * Math.PI, root.height + 1])(root);
};

format("d");

const d3arc = arc()
  .startAngle((d) => d.x0)
  .endAngle((d) => d.x1)
  .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
  .padRadius(radius * 1.5)
  .innerRadius((d) => d.y0 * radius)
  .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

  const color = scaleOrdinal(
    quantize(interpolateRainbow, data.children.length + 1)
  );

function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
}

function labelVisible(d) {
  return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
}

function labelTransform(d) {
  const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
  const y = ((d.y0 + d.y1) / 2) * radius;
  return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
}

  useEffect(() => {

    const root = d3Partition(data);

    root.each((d) => (d.current = d));

    const svg = select(svgSunburstRef.current)
      .attr("viewBox", [0, 0, width, width])
      .style("font", "10px sans-serif");

      const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", (d) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attr("d", (d) => d3arc(d.current));

    path
      .filter((d) => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    path.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .map((d) => d.data.name)
          .reverse()
          .join("/")}\n${format(d.value)}`
    );

    const label = g
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", (d) => +labelVisible(d.current))
      .attr("transform", (d) => labelTransform(d.current))
      .text((d) => d.data.name);

  const parent = g
      .append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

  function clicked(p) {
          parent.datum(p.parent || root);
  
        root.each(
          (d) =>
            (d.target = {
              x0:
                Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              x1:
                Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              y0: Math.max(0, d.y0 - p.depth),
              y1: Math.max(0, d.y1 - p.depth),
            })
        );
  
        const t = g.transition().duration(750);
  
        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path
          .transition(t)
          .tween("data", (d) => {
            const i = interpolate(d.current, d.target);
            return (t) => (d.current = i(t));
          })
          .filter(function (d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
          })
          .attr("fill-opacity", (d) =>
            arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
          )
          .attrTween("d", (d) => () => d3arc(d.current));
  
        label
          .filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
          })
          .transition(t)
          .attr("fill-opacity", (d) => +labelVisible(d.target))
          .attrTween("transform", (d) => () => labelTransform(d.current));
      }

  }, [data])

  return (
    <Card className={classes.root}>
      {/* <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        // title="Hierarchical Sunburst Chart"
        // subheader="April 12, 2020"
      /> */}
      <CardContent>
        <Grid container spacing={0}>
          <svg ref={svgSunburstRef}></svg>
        </Grid>
        {/* <Typography variant="body2" component="p"> 
            Information about this chart ...
        </Typography> */}
      </CardContent>
      <CardActions>
      <Button size="small" className={ classes.buttonStyling }>Full Size</Button>
    </CardActions>
    </Card>
  )
}

export default SunburstChart;