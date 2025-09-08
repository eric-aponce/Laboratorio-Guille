import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm" /*importa librería*/
import data from './data.json' with {type : 'json'} /*Importa el archivo datos -formato JSON*/

/*MAPA*/
const projection=d3.geoMercator() /*proyección del mapa*/
 .fitSize([500,500],data) /*tamaño mapa*/

 const path= d3.geoPath(projection) /*genera el camino del mapa*/ 

 /*COLOR Y ESCALA*/
 const colorScale = d3.scaleSequential() /*color secuencial*/
  .domain(d3.extent(data.features, d => d.properties.poblacion)) /*valores mín y max de población*/
  .interpolator(d3.interpolateViridis) /*degradado de color verde y azules, tira color en una gama de intensidad baja-alta*/

  /*DIBUJA EL MAPA, yei -_-*/
 d3.select('.mapa') 
  .selectAll('path') /*selecciona los path*/
  .data(data.features) /*datos de las comunas*/
  .join('path') /*conecta los path con los datos de alguna forma*/
  .attr('d', path) /*define la forma*/
  .attr('fill', d => colorScale(d.properties.poblacion || 0)) /*color población*/
  .attr('stroke-width', 0.6) /*grosor borde*/
  .attr('stroke','green') /*color borde- verde xq si*/
    .attr('opacity', 0.8) /*baja opacidad del mapa en general pa q se vea mejor*/

    /*CREA EL DIV DEL CUERPO-BODY*/
  const etiqueta = d3.select('body').append('div') 
      .classed('etiqueta', true) 
  
      /*MOUSE*/
  d3.select('.mapa').selectAll('path') 
  .on('mouseenter', (e, d) => { /*cuadno el mouse 'entra' en una comuna*/
          etiqueta.style('opacity', 1) /*aparece la etiqueta*/
          etiqueta.style('top', e.pageY + 10 + 'px') /*posición Y la etiqueta junto al cursor*/
          etiqueta.style('left', e.pageX + 10 + 'px') /*posición X la etiqueta junto al cursor*/
          etiqueta.html(`<p>${d.properties.Comuna}, ${d.properties.poblacion}<p>`) /*muestra nombre comuna y población*/
      })
      .on('mouseout', (e, d) => { /*cuando el mouse 'sale' de la comuna*/
          etiqueta.style('opacity', 0) /*desaparece la etiqueta*/
      })