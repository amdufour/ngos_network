/*************************************/
/* Initialize variables              */
/*************************************/

// Screen size's related variables
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const width = screenWidth > 1200 ? 1200 : screenWidth;
const height = screenHeight - 100;

// Colors
const red = '#F94144';
const orange = '#F3722C';
const yellow = '#F9C74F';
const pistachio = '#90BE6D';
const teal = '#43AA8B';
const blue = '#577590';

// Data related variables
const groups = ['communications', 'civics', 'community', 'economy', 'technology', 'education'];
const radiusMin = 5;  // Minimum radius of a node
const radiusMax = 60; // Maximum radius of a node



/*************************************/
/* Load data                         */
/*************************************/

d3.json('../data/network.min.json').then(data => {
  createVisualization(data.nodes, data.links);
});


/*************************************/
/* Create and append visualization   */
/*************************************/

const createVisualization = (nodes, links) => {

  // Scales
  const nodeRadiusScale = d3.scaleLinear()
    .domain(d3.extent(nodes, d => d.estimated_people_impacted))
    .range([radiusMin, radiusMax]);

  // Simulation function
  // Used to position the nodes on the screen
  const simulation = d3.forceSimulation(nodes)
    // Pushes linkes nodes together or apart
    .force('link', d3.forceLink(links)
      .id(d => d.id))
    // Center the overall network
    .force('center', d3.forceCenter(width/2, height/2))
    // Give starting position to each node
    .force('x', d3.forceX()
      .x(d => {
        return getPosition(d.type)[0];
      })
      .strength(1))
    .force('y', d3.forceY()
      .y(d => {
        return getPosition(d.type)[1];
      })
      .strength(1))
    .force('collide', d3.forceCollide(d => {
      const radius = d.estimated_people_impacted == 'nan' ? 5 : nodeRadiusScale(d.estimated_people_impacted);
      return radius + 15;
    })
      .strength(0.1));

  // Append svg
  const viz = d3.select('#visualization')
    .append('svg')
    .attr('viewbox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  // Append links
  const link = viz.append('g')
    .attr('class', 'links-group')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.2)
    .attr('stroke-width', 1)
    .selectAll('line')
      .data(links)
      .join('line');


  // Append nodes
  const node = viz.append('g')
    .attr('class', 'nodes-group')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
      .data(nodes)
      .join('circle')
        .attr('r', d => {
          return d.estimated_people_impacted == 'nan' ? 5 : nodeRadiusScale(d.estimated_people_impacted);
        })
        .attr('fill', d => {
          return getColor(d.type);
        });


  // Call the simulation
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => {
        // Bound the visualization to the horizontal limits of the svg container
        return d.x = Math.max(radiusMax, Math.min(width - radiusMax, d.x));
      })
      .attr('cy', d => {
        // Bound the visualization to the vertical limits of the svg container
        return d.y = Math.max(radiusMax, Math.min(height - radiusMax, d.y)); 
      });
  });
};