/*************************************/
/* Initialize variables              */
/*************************************/

// Screen size's related variables
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const width = screenWidth > 1200 ? (1200 / 12 * 8) : (screenWidth - 30);
const height = screenHeight - 100;

// Colors
const colors = [
  { id: 'red', hex: '#F94144' },
  { id: 'orange', hex: '#F3722C' },
  { id: 'yellow', hex: '#F9C74F' },
  { id: 'pistachio', hex: '#90BE6D' },
  { id: 'teal', hex: '#43AA8B' },
  { id: 'blue', hex: '#577590' }
];
const white = '#FBFDFE';
const grey = '#727A87';

// Data related variables
const groups = ['communications', 'civics', 'community', 'economy', 'technology', 'education'];
const radiusMin = 8;  // Minimum radius of a node
const radiusMax = 60; // Maximum radius of a node

// State variable
let isActiveElement = false;
let highlightedNodes = [];



/*************************************/
/* Load data                         */
/*************************************/

let nodes = [];
let links = [];
d3.json('../data/network.min.json').then(data => {
  nodes = data.nodes;
  links = data.links;
  createVisualization();
});


/*************************************/
/* Create and append visualization   */
/*************************************/

const createVisualization = () => {

  // Scales
  const nodeRadiusScale = d3.scaleLinear()
    .domain(d3.extent(nodes, d => d.estimated_people_impacted))
    .range([radiusMin, radiusMax]);

  // Get radius of a node
  const getRadius = (peopleImpacted) => {
    return peopleImpacted == 'nan' ? 5 : nodeRadiusScale(peopleImpacted);
  };

  /*************************************/
  /* Simulation function               */
  /*************************************/

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

  /*************************************/
  /* Append svg                        */
  /*************************************/
  
  const viz = d3.select('#visualization')
    .append('svg')
    .attr('viewbox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  /*************************************/
  /* Append defs                       */
  /*************************************/
  
  const defs = viz.append('defs');

  // Append gradients
  colors.forEach(colorStart => {
    colors.forEach(colorEnd => {
      if (colorStart !== colorEnd) {
        const gradient = defs.append('linearGradient')
          .attr('id', `${colorStart.id}-to-${colorEnd.id}`)
          .attr('x1', '0%')
          .attr('y1', '50%')
          .attr('y2', '50%');
        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', colorStart.hex);
        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', colorEnd.hex);
      }
    });
  });

  // Append blur filter
  let filters = defs.append('filter')
    .attr('id', 'glow');
  // Apply blur
  filters.append('feGaussianBlur')
    .attr('stdDeviation', '3.5')
    .attr('result', 'coloredBlur');
  // Place the original (sharp) element on top of the blured one
  let feMerge = filters.append('feMerge');
  feMerge.append('feMergeNode')
    .attr('in', 'coloredBlur');
  feMerge.append('feMergeNode')
    .attr('in', 'SourceGraphic');

  
  /*************************************/
  /* Append network links              */
  /*************************************/
  
  const link = viz.append('g')
    .attr('class', 'links-group')
    .attr('fill', 'none')
    .selectAll('path')
      .data(links)
      .join('path')
        .attr('id', d => d.source_to_target)
        .attr('class', 'link')
        .attr('stroke', d => {
          return getGroup(d.source.type) === getGroup(d.target.type) 
            ? getColor(d.source.type).hex
            : `url(#${getGradientColors(d.source.type, d.target.type)})`;
        })
        .attr('stroke-opacity', d => {
          const strokeOpacity = d.strength === 1 ? 0.1 : 0.5;
          return strokeOpacity;
        })
        .attr('stroke-width', d => {
          const strokeWidth = d.strength === 1 ? 1 : 2;
          return strokeWidth;
        });


  /*************************************/
  /* Append network nodes              */
  /*************************************/
  
  const nodeGroup = viz.append('g')
    .attr('class', 'nodes-group')
    .selectAll('g.node')
      .data(nodes)
      .join('g')
        .attr('id', d => `node-${d.id}`)
        .attr('class', d => `node node-${d.scale}`)
        .on('mouseenter', d => {
          d3.event.stopPropagation();
          isActiveElement ? highlightNode(d.id) : highlightElements(d.id, false);
          showInfo(d);
        })
        .on('mouseleave', d => {
          isActiveElement
            ? !highlightedNodes.includes(d.id) ? unHighlightNode(d.id) : null
            : unhighlightElements();
          hideInfo();
        })
        .on('click', d => {
          isActiveElement = true;
          highlightElements(d.id, true);
          addBackgroundCircle(d.id, getRadius(d.estimated_people_impacted));
        });

  // Append nodes with "National" scale
  const nodesNationalGroup = d3.selectAll('.node-National')
    .attr('fill', d => getColor(d.type).hex);
  const nodesNationalOuter = nodesNationalGroup.append('circle')
    .attr('r', d => getRadius(d.estimated_people_impacted))
    .attr('fill-opacity', 0.7)
    .attr('stroke', d => getColor(d.type).hex)
    .attr('stroke-width', 2);
  const nodesNationalInner = nodesNationalGroup.append('circle')
    .attr('r', d => {
      const radius = getRadius(d.estimated_people_impacted);
      return 0.75 * radius;
    })
    .attr('stroke', 'none');

  // Append nodes with "Regional" scale
  const nodesRegional = d3.selectAll('.node-Regional')
  const nodesRegionalOuter =  nodesRegional.append('circle')
    .attr('r', d => getRadius(d.estimated_people_impacted))
    .attr('fill', d => getColor(d.type).hex)
    .attr('fill-opacity', 0.8)
    .attr('stroke', 'none');
  const nodesRegionalInner = nodesRegional.append('circle')
    .attr('r', d => 0.3 * getRadius(d.estimated_people_impacted))
    .attr('fill', white)
    .attr('stroke', 'none');

  // Append nodes with "Continental" scale
  const nodesContinentalGroup = d3.selectAll('.node-Continental')
    .attr('fill', white)
    .attr('stroke', d => getColor(d.type).hex);
  const nodesContientalOuter = nodesContinentalGroup.append('circle')
    .attr('class', 'outer-circle')
    .attr('r', d => getRadius(d.estimated_people_impacted))
    .attr('stroke-width', 2);
  const nodesContientalInner = nodesContinentalGroup.append('circle')
    .attr('class', 'inner-circle')
    .attr('r', d => getRadius(d.estimated_people_impacted) - 4)
    .attr('stroke-width', 1);

  // Append nodes with "Bi-National" scale
  const nodesBiNationalGroup = d3.selectAll('.node-Bi-National')
    .attr('fill', d => getColor(d.type).hex)
    .attr('fill-opacity', 0.6)
    .attr('stroke', d => getColor(d.type).hex)
    .attr('stroke-width', 1);
  const nodesBiNationalLeft = nodesBiNationalGroup.append('circle')
    .attr('class', 'left-circle')
    .attr('r', d => getRadius(d.estimated_people_impacted));
  const nodesBiNationalRight = nodesBiNationalGroup.append('circle')
    .attr('class', 'right-circle')
    .attr('r', d => getRadius(d.estimated_people_impacted));

  // Append nodes with "Global" scale
  const nodesGlobalGroup = d3.selectAll('.node-Global')
    .attr('fill', d => getColor(d.type).hex)
    .attr('fill-opacity', 0.6)
    .attr('stroke', d => getColor(d.type).hex)
    .attr('stroke-width', 1);
  for (let i = 0; i < 5; i++) {
    nodesGlobalGroup.append('circle')
      .attr('class', `circle-global-${i+1}`)
      .attr('r', d => 0.5 * getRadius(d.estimated_people_impacted))
      .attr('cx', d => {
        const angle = 360 / 5;
        const radius = getRadius(d.estimated_people_impacted);
        const factor = radius >= 30 ? 0.3 : 0.5;
        return factor * radius * Math.sin(degreeToRadian((2*i + 1) * angle));
      })
      .attr('cy', d => {
        const angle = 360 / 5;
        const radius = getRadius(d.estimated_people_impacted);
        const factor = radius >= 30 ? 0.3 : 0.5;
        return factor * radius * Math.cos(degreeToRadian((2*i + 1) * angle));
      });
  }


  /*************************************/
  /* Call the simulation               */
  /*************************************/
  
  simulation.on('tick', () => {
    link
      .attr('d', d => {
        return generatePath(d.source.x, d.source.y, d.target.x, d.target.y);
      });

    nodesNationalOuter
      .attr('cx', d => d.x = Math.max(radiusMax, Math.min(width - radiusMax, d.x)))
      .attr('cy', d => d.y = Math.max(radiusMax, Math.min(height - radiusMax, d.y)));
    nodesNationalInner
      .attr('cx', d => d.x = Math.max(radiusMax, Math.min(width - radiusMax, d.x)))
      .attr('cy', d => d.y = Math.max(radiusMax, Math.min(height - radiusMax, d.y)));

    nodesRegionalOuter
      .attr('cx', d => d.x = Math.max(radiusMax, Math.min(width - radiusMax, d.x)))
      .attr('cy', d => d.y = Math.max(radiusMax, Math.min(height - radiusMax, d.y)));
    nodesRegionalInner
      .attr('cx', d => d.x = Math.max(radiusMax, Math.min(width - radiusMax, d.x)))
      .attr('cy', d => d.y = Math.max(radiusMax, Math.min(height - radiusMax, d.y)));

    nodesContientalOuter
      .attr('cx', d => d.x = Math.max(radiusMax, Math.min(width - radiusMax, d.x)))
      .attr('cy', d => d.y = Math.max(radiusMax, Math.min(height - radiusMax, d.y)));
    nodesContientalInner
      .attr('cx', d => d.x = Math.max(radiusMax, Math.min(width - radiusMax, d.x)))
      .attr('cy', d => d.y = Math.max(radiusMax, Math.min(height - radiusMax, d.y)));

    nodesBiNationalLeft
      .attr('cx', d => d.x = Math.max(radiusMax, Math.min(width - radiusMax, d.x - 7)))
      .attr('cy', d => d.y = Math.max(radiusMax, Math.min(height - radiusMax, d.y)));
    nodesBiNationalRight
      .attr('cx', d => d.x = Math.max(radiusMax, Math.min(width - radiusMax, d.x + 7)))
      .attr('cy', d => d.y = Math.max(radiusMax, Math.min(height - radiusMax, d.y)));

    nodesGlobalGroup
      .attr('transform', d => `translate(${d.x = Math.max(radiusMax, Math.min(width - radiusMax, d.x))},${d.y = Math.max(radiusMax, Math.min(height - radiusMax, d.y))})`);
  });


  /*************************************/
  /* Append legend                     */
  /*************************************/
  addRadiusLegend(getRadius(1000000), getRadius(500000), getRadius(5000));
};