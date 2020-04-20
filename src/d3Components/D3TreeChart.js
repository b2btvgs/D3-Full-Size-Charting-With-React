import { select, hierarchy, event, tree, linkHorizontal } from "d3";

const draw = ((height, width, data, svgRef, dimensions) => {

  const margin = { left: 40, right: 40, top: 20, bottom: 20 };
  const innerWidth = dimensions.width - margin.left - margin.right;
 
  const svg = select(svgRef.current);
    svg.attr('transform', `translate(${margin.left},${margin.top})`);

    var i = 0;
    var duration = 750;

    const g = svg.append("g");


    // Declares a tree layout and assigns the size
  const treemap = tree().size([height, innerWidth]);
  let nodes = hierarchy(data, d => d.children);
  nodes = treemap(nodes);
  const treeRoot = hierarchy(data)

  const diagonal = linkHorizontal().x(d => d.y).y(d => d.x)

  const node = g.selectAll(".node")
    .data(nodes.descendants())
    .enter().append("g")
    .attr("class", d => "node" + (d.children
        ? " node--internal"
        : " node--leaf"))
    .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

  const link = g.selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .style("stroke", d => d.data.level)
    .attr("d", d => {
        return "M" + d.y + "," + d.x
           + "C" + (d.y + d.parent.y) / 2 + "," + d.x
           + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
           + " " + d.parent.y + "," + d.parent.x;
    });

  node.append("circle")
    .attr("r", d => d.data.value)
    .style("stroke", d => d.data.type)
    .style("fill", d => d.data.level);

  node.append("text")
    .attr("dy", ".35em")
    .attr("x", d => d.children ? (d.data.value + 5) * -1 :
       d.data.value + 5)
    .attr("y", d => d.children && d.depth !== 0 ?
       -(d.data.value + 5) : d)
    .style("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name);
})

function D3TreeChart(height, width, data, svgRef, dimensions) {
  this.height = height;
  this.width = width;
  this.data = data;
  this.svgRef = svgRef;
  this.dimensions = dimensions;
  this.draw = draw;
}

export default D3TreeChart;

