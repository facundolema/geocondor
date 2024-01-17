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

  let colorScale = (feature) => {
    console.log(feature);
    let colors = [
      "#ffffffff",
      "#d8f3dcff",
      "#b7e4c7ff",
      "#95d5b2ff",
      "#74c69dff",
      "#52b788ff",
      "#40916cff",
      "#2d6a4fff",
      "#1b4332ff",
      "#081c15ff",
    ];

    if (feature < 5) {
      return colors[0];
    } else if (feature < 10) {
      return colors[1];
    } else if (feature < 15) {
      return colors[2];
    } else if (feature < 20) {
      return colors[3];
    } else if (feature < 25) {
      return colors[4];
    } else if (feature < 30) {
      return colors[5];
    } else if (feature < 35) {
      return colors[6];
    } else {
      return colors[7];
    }
  };

  context.fillStyle = "#e8e0de";
  context.fillRect(0, 0, 4000, 4000);

  context.lineWidth = 3;
  context.strokeStyle = "#ccc";

  context.beginPath();
  geoGenerator(graticule);
  context.stroke();

  const draw = async () => {
    const countries = (
      await d3.json("/data/geodata/world.geojson")
    ).features.filter((d) => d.properties.geounit !== "Argentina");

    context.strokeStyle = "#222";
    context.fillStyle = "#e8e0de";
    context.beginPath();
    geoGenerator({ type: "FeatureCollection", features: countries });
    context.fill();
    context.stroke();

    const argentina = (await d3.json("/data/geodata/argentina_adm1.geojson"))
      .features;
    const data = await d3.json("/data/data.json");

    argentina.forEach((provincia) => {
      // get province data
      let p_data = data.find((p) => p.id === provincia.properties.gid);

      // set province style
      context.lineWidth = 3;
      context.strokeStyle = "#222";
      context.fillStyle = colorScale(p_data.population.rural_percentage);

      // draw province
      context.beginPath();
      geoGenerator(provincia);
      context.fill();
      context.stroke();
    });
  };

  draw();
});
