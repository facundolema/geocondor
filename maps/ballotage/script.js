document.addEventListener("DOMContentLoaded", function () {
  let canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");

  let projection = d3
    .geoOrthographic()
    .scale(4500)
    .rotate([64.75, 40])
    .translate([2000, 2000])
    .precision(0.01);

  let geoGenerator = d3.geoPath().projection(projection).context(context);
  let graticule = d3.geoGraticule().step([10, 10])();

  let colorScale = (feature) => (feature ? "#7CD1F3" : "#B18FCF");

  context.fillStyle = "#e8e0de";
  context.fillRect(0, 0, 4000, 4000);

  context.lineWidth = 3;
  context.strokeStyle = "#ccc";

  context.beginPath();
  geoGenerator(graticule);
  context.stroke();

  d3.json("/data/geodata/world.geojson").then((countries) => {
    let cleangeo = countries.features.filter(
      (d) => d.properties.geounit !== "Argentina"
    );

    context.strokeStyle = "#222";
    context.fillStyle = "#e8e0de";
    context.beginPath();
    geoGenerator({ type: "FeatureCollection", features: cleangeo });
    context.fill();
    context.stroke();

    d3.json("/data/geodata/argentina_adm1.geojson").then((argentina) => {
      d3.json("/data/balotaje.json").then((bd) => {
        argentina.features.forEach((provincia) => {
          console.log(provincia.properties.gid);
          // get province data
          let b_data = bd.find((p) => p.id === provincia.properties.gid);
          console.log(b_data.winner);

          // set province style
          context.lineWidth = 3;
          context.strokeStyle = "#222";
          context.fillStyle = colorScale(b_data.winner);

          // draw province
          context.beginPath();
          geoGenerator(provincia);
          context.fill();
          context.stroke();
        });
      });
    });
  });
});
