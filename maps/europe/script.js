d3.json("/data/geodata/world.geojson").then((bb) => {
  let width = 750, height = 600;
  let projection = d3.geoConicConformal()
    .parallels([35, 65])
    .rotate([-20, 0])
    .scale(width*1.25)
    .center([-5, 53.5])
    .translate([width / 2, height / 2])
    .clipExtent([[0, 0], [width, height]])
    .precision(0.2)
  let geoGenerator = d3.geoPath().projection(projection);

  let svg = d3
    .select("#container")
    .append("svg")
    .style("width", width)
    .style("height", height);

  svg
    .append("g")
    .selectAll("path")
    .data(bb.features)
    .join("path")
    .attr("d", geoGenerator)
    .attr("name", (d) => d.properties.geounit)
    .attr("stroke", "#222")
    .attr("fill", (d) => {
      switch (d.properties.SUBREGION) {
        case "Southern Europe": return "#aec1c7";
        case "Western Europe": return "#e47356";
        case "Northern Europe": return "#74625d";
        case "Eastern Europe": return "#7a8e6a";
        default: return "#e8e0de";
      }
    })

  let markers = [];

  d3.json("/data/geodata/markers.json").then((data) => {
    for (const country of data) {
      for (const marker of country.locations) {
        markers.push({
          lat: marker.lat,
          long: marker.lng,
        });
      }
    }

    svg
      .selectAll(".m")
      .data(markers)
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", 1.5)
      .attr("cy", 1.5)
      .attr("fill", "#fff")
      .attr("stroke", "#222")
      .attr("stroke-width", "1.5")
      .attr("transform", (d) => {
        let p = projection([d.long, d.lat]);
        return `translate(${p[0] - 1.5}, ${p[1] - 1.5})`;
      });
  });
});
