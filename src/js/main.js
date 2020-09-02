/*************************************/
/* Initialize variables              */
/*************************************/

// Screen size's related variables
const screenWidth = window.innerWidth;
const width = screenWidth > 1200 ? 1200 : screenWidth;
const height = 800;



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

  // Simulation function
  // Used to position the nodes on the screen
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width/2, height/2));

  // Append svg
  const viz = d3.select('#visualization')
    .append('svg')
    .attr('viewbox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  // Append nodes
  const node = viz.append('g')
    .attr('class', 'nodes-group')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
      .data(nodes)
      .join('circle')
        .attr('r', 5)
        .attr('fill', '#000');

  // Append links
  const link = viz.append('g')
    .attr('class', 'links-group')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', 2)
    .selectAll('line')
      .data(links)
      .join('line');


  // Call the simulation
  simulation.on('tick', () => {
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
  });
};