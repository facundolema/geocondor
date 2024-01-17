document.addEventListener("DOMContentLoaded", function () {
  let canvas = document.querySelector("canvas");

  const context = canvas.getContext("2d");

  let projection = d3
    .geoAzimuthalEqualArea()
    .scale(700)
    .rotate([64.75, 50])
    .translate([1500, 1500])
    .precision(0.01);

  let svgProjection = d3
    .geoAzimuthalEqualArea()
    .scale(240)
    .rotate([64.75, 50])
    .translate([500, 500])
    .precision(0.01);

  let geoGenerator = d3.geoPath().projection(projection).context(context);
  let svgGenerator = d3.geoPath().projection(svgProjection)
  let graticule = d3.geoGraticule10();

  context.fillStyle = "#e8e0de";
  context.fillRect(0, 0, 4000, 4000);

  context.lineWidth = 1;
  context.strokeStyle = "#ccc";

  context.beginPath();
  geoGenerator(graticule);
  context.stroke();

  
  d3.json("/data/geodata/imperio_austral_adm1.geojson").then((argentina) => {
    d3.json('/data/geodata/world.geojson').then((world) => {
      context.strokeStyle = "#000";
      context.fillStyle = "#e8e0de";
      context.beginPath();
      geoGenerator(world);
      context.fill();
      context.stroke();

      argentina.features.forEach((provincia) => {
          console.log(provincia.properties.ADM1_ES);
          // set province style
          context.lineWidth = 0;
          context.fillStyle = "#74acdf";
          
          // draw province
          context.beginPath();
          geoGenerator(provincia);
          context.fill();
          context.stroke();
        });
      
        let lines = d3.select("g.graticule")
          .selectAll('path')
          .data([graticule])
          .enter()
          .append('path')
          .classed('graticule', true)
          .attr('d', svgGenerator)
          .attr('stroke', '#ccc')
          .attr('fill', 'none');

       let svg = d3.select("g.map")
         .selectAll('path')
         .data(world.features)
         .enter()
         .append("path")
         .attr("d", svgGenerator)
         .attr("stroke", "#222")
         .attr("stroke-width", "0.5")
         .attr("fill", "#e8e0de")
         
         let argentinaSvg = d3.select("g.argentina")
         .selectAll('path')
         .data(argentina.features)
         .enter()
         .append("path")
         .attr("d", svgGenerator)
         .attr("stroke", "#222")
         .attr("stroke-width", "0.25")
         .attr("fill", "#74acdf")
      
    });
  })

})
