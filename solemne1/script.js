// VARIABES GLOBALES
const width = 700; /* Ancho */
const height = 800; /* Alto */
const radius = 300;

const svg = d3.select("#chart") /* Selecciona el div */
  .attr("width", width) /* Ancho */
  .attr("height", height); /* Alto */

const g = svg.append("g")
  .attr("transform", `translate(${width / 2}, ${height - 400})`);

// Tooltip
const tooltip = d3.select("#tooltip");

// CARGA DE DATOS
d3.csv("Coffe_sales.csv").then(data => {
  const counts = d3.rollup(data, v => v.length, d => d.coffee_name);
  const dataset = Array.from(counts, ([name, value]) => ({ name, value }));

// ESCALAS
  const angle = d3.scaleBand() /* Tipo de escala */
    .domain(dataset.map(d => d.name)) 
    .range([Math.PI, 2 * Math.PI]) /* Rango de ángulos */
    .padding(0.05); /* Espacio entre barras */

  const radiusScale = d3.scaleLinear() 
    .domain([0, d3.max(dataset, d => d.value)]) 
    .range([0, radius]); /* Rango radios */

  // BARRAS RADIALES
  g.selectAll("path") 
    .data(dataset) /* Datos */
    .enter()
    .append("path") /* SVG */
    .attr("fill", "#8b4513") /* Color */
    .attr("d", d => { /* Genera arco */
      const rotation = Math.PI / 2;/* Rota -90 grados */
      const startAngle = angle(d.name) + rotation; /* angulo inicial */
      const endAngle = startAngle + angle.bandwidth(); /* angulo final */
      const r = radiusScale(d.value); /* radio */

      // GENERA ARCO
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(r)
        .startAngle(startAngle)
        .endAngle(endAngle);

      return arc();
    })
    //TOOLTIP
    .on("mouseover", function(event, d) { 
      tooltip 
        .style("opacity", 1) /* Hace visibLe */
        .html(`<b>${d.name}</b><br>Cafés vendidos: ${d.value}`); /* Contenido */
    })
    // MOUSE ENTRA EN LA BARRA
    .on("mousemove", function(event) {
      tooltip
        .style("left", (event.offsetX + 5) + "px") /* Posición X etiqueta*/
        .style("top", (event.offsetY - 5) + "px"); /* Posición Y etqueta*/
    })
    // MOUSE SALE DE LA BARRA
    .on("mouseout", function() {
      tooltip
        .style("opacity", 0); /* Oculta */
    });
// IMAGEN TAZA
g.append("image") 
  .attr("xlink:href", "taza-02.png") 
  .attr("x", -80)   /*centra la imagen*/
  .attr("y", -30)  
  .attr("width", 135)   /* ancho */
  .attr("height", 135); /* alto */

  // ETIQUETAS
  g.selectAll(".label") 
    .data(dataset) /* Datos */
    .enter()
    .append("text") /* SVG */
    .attr("class", "label") 
    .attr("transform", d => { /* Posición */
      const a = angle(d.name) + angle.bandwidth() / 2; 
      const r = radius + 20; /* Radio y margen */
      return `translate(${Math.cos(a) * r}, ${Math.sin(a) * r})`; /* Coordenadas */
    })
    .text(d => d.name); /* Texto */
});


/* lo logréeeeee -_-' */
