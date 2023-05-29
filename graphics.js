const width = 1000;
const height = 800;
const radius = 20;
const cell_size = 40;
const grid_cell_width = 22;
const grid_cell_height = 18;
const svg_x_shift = 50;
const svg_y_shift = 50;
const grid_width = cell_size * grid_cell_width;
const grid_height = cell_size * grid_cell_height;

const black = "black";
const purple = "#9999FF";
const red = "red";
const green = "green";
const orange = "orange";
const yellow = "yellow";
const blue = "blue";
const light_blue = "#33FFFF";

let svg = d3.select("svg");

function DrawGrid() {
  let grid = svg.append("g");
  for (let i = 0; i < grid_cell_width; i++) {
    for (let j = 0; j < grid_cell_height; j++) {
      grid
        .append("rect")
        .attr("x", i * cell_size + svg_x_shift)
        .attr("y", j * cell_size + svg_y_shift)
        .attr("width", cell_size)
        .attr("height", cell_size)
        .attr("stroke", "black")
        .attr("opacity", 0.15)
        .attr("fill", "none");
    }
  }
  // Draw the x axis
  svg
    .append("path")
    .attr(
      "d",
      d3.line()([
        [svg_x_shift, svg_y_shift + grid_height],
        [svg_x_shift + grid_width, svg_y_shift + grid_height],
      ])
    )
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  // Draw x arrowhead
  svg
    .append("path")
    .attr(
      "d",
      d3.line()([
        [svg_x_shift + grid_width + 10, svg_y_shift + grid_height],
        [svg_x_shift + grid_width - 5, svg_y_shift + grid_height - 5],
        [svg_x_shift + grid_width, svg_y_shift + grid_height],
        [svg_x_shift + grid_width - 5, svg_y_shift + grid_height + 5],
      ])
    )
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  // Draw the y axis
  svg
    .append("path")
    .attr(
      "d",
      d3.line()([
        [svg_x_shift, svg_y_shift],
        [svg_x_shift, svg_y_shift + grid_height],
      ])
    )
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  // Draw y arrowhead
  svg
    .append("path")
    .attr(
      "d",
      d3.line()([
        [svg_x_shift, svg_y_shift - 10],
        [svg_x_shift + 5, svg_y_shift + 5],
        [svg_x_shift, svg_y_shift],
        [svg_x_shift - 5, svg_y_shift + 5],
      ])
    )
    .attr("stroke", "black")
    .attr("stroke-width", 2);
}

function InsertCircleWithText(x, y, text, color = "#9999FF") {
  const circle = svg
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("fill", color)
    .attr("stroke", "black")
    .attr("r", radius);

  svg
    .append("text")
    .attr("x", x)
    .attr("y", y)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-weight", "bold")
    .text(text);
}

function DeleteCircleWithText(x, y) {
  svg.select(`circle[cx="${x}"][cy="${y}"]`).remove();
  svg.select(`text[x="${x}"][y="${y}"]`).remove();
}

function AddArrow(cx1, cy1, cx2, cy2, color = "black") {
  let angle = Math.atan2(cy2 - cy1, cx2 - cx1);
  let x1 = cx1 + radius * Math.cos(angle);
  let y1 = cy1 + radius * Math.sin(angle);
  let x2 = cx2 - radius * Math.cos(angle);
  let y2 = cy2 - radius * Math.sin(angle);

  let lineGenerator = d3
    .line()
    .x(function (d) {
      return d.x;
    })
    .y(function (d) {
      return d.y;
    })
    .curve(d3.curveLinear);

  let pathData = lineGenerator([
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ]);
  let edgeid = "edge-" + cx1 + cy1 + cx2 + cy2;
  let defsid = "defs-" + cx1 + cy1 + cx2 + cy2 + color;
  let markerid = "marker-" + cx1 + cy1 + cx2 + cy2 + color;

  let svg = d3.select("svg");
  let path = svg
    .append("path")
    .attr("id", edgeid)
    .attr("d", pathData)
    .attr("stroke", color)
    .attr("stroke-width", 2)
    .attr("marker-end", `url(#${markerid})`);
  if (color === "red") {
    path.attr("stroke-dasharray", "5,5");
  }
  svg
    .append("defs")
    .attr("id", defsid)
    .append("marker")
    .attr("id", markerid)
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 8)
    .attr("refY", 5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .attr("fill", color)
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z");
}

function DeleteArrow(cx1, cy1, cx2, cy2) {
  let edgeid = "edge-" + cx1 + cy1 + cx2 + cy2;
  svg.select(`path[id="${edgeid}"]`).remove();
}

function DrawNode(x, y, color = "#9999FF") {
  InsertCircleWithText(
    svg_x_shift + x * cell_size - cell_size / 2,
    svg_y_shift + grid_height - y * cell_size + cell_size / 2,
    x + ";" + y,
    color
  );
}

function UndrawNode(x, y) {
  DeleteCircleWithText(
    svg_x_shift + x * cell_size - cell_size / 2,
    svg_y_shift + grid_height - y * cell_size + cell_size / 2
  );
}

function RecolorNode(x, y, color) {
  UndrawNode(x, y);
  DrawNode(x, y, color);
}

function DrawEdge(cx1, cy1, cx2, cy2, color = "black") {
  AddArrow(
    svg_x_shift + cx1 * cell_size - cell_size / 2,
    svg_y_shift + grid_height - cy1 * cell_size + cell_size / 2,
    svg_x_shift + cx2 * cell_size - cell_size / 2,
    svg_y_shift + grid_height - cy2 * cell_size + cell_size / 2,
    color
  );
}

function UndrawEdge(cx1, cy1, cx2, cy2) {
  DeleteArrow(
    svg_x_shift + cx1 * cell_size - cell_size / 2,
    svg_y_shift + grid_height - cy1 * cell_size + cell_size / 2,
    svg_x_shift + cx2 * cell_size - cell_size / 2,
    svg_y_shift + grid_height - cy2 * cell_size + cell_size / 2
  );
}

function RecolorEdge(cx1, cy1, cx2, cy2, color) {
  UndrawEdge(cx1, cy1, cx2, cy2);
  DrawEdge(cx1, cy1, cx2, cy2, color);
}
