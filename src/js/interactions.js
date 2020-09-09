/**********************************************/
/* Highlight related elements and fade others */
/**********************************************/

const highlightElements = (id, selected) => {
  let relatedElements = getRelatedElements(id);

  if (selected) {
    highlightedNodes = relatedElements.relatedNodes;
  }
  
  d3.selectAll('.node')
    .classed('faded', d => {
      return (d.id === id || relatedElements.relatedNodes.includes(d.id)) ? false : true;
    });
  d3.select('.selected').classed('selected', false);
  d3.select(`#node-${id}`).classed('selected', true);

  d3.selectAll('.link')
    .classed('highlighted', d => {
      const linkId = `${d.source.id}-to-${d.target.id}`;
      return relatedElements.relatedLinks.includes(linkId) ? true : false;
    })
    .classed('hidden', d => {
      const linkId = `${d.source.id}-to-${d.target.id}`;
      return relatedElements.relatedLinks.includes(linkId) ? false : true;
    });

  if (relatedElements.tags.length > 0) {
    d3.select('#action .action-field').text(relatedElements.tags.join(', '));
    if (relatedElements.tags.length > 1) {
      d3.select('#action .conjugate').text('fields');
    } else if (relatedElements.tags.length == 1) {
      d3.select('#action .conjugate').text('field');
    }

    d3.select('#action').classed('visible', true);
  }
};


/**********************************************/
/* Bring back all elements to front           */
/**********************************************/

const unhighlightElements = () => {
  d3.selectAll('.node')
    .classed('faded', false);
  d3.selectAll('.link')
    .classed('highlighted', false)
    .classed('hidden', false);

  d3.select('#action').classed('visible', false);
};


/**********************************************/
/* Highlight a single node                    */
/**********************************************/

const highlightNode = (id) => {
  d3.select(`#node-${id}`).classed('faded', false);
};


/**********************************************/
/* Un-Highlight a single node                 */
/**********************************************/

const unHighlightNode = (id) => {
  d3.select(`#node-${id}`).classed('faded', true);
};

/**********************************************/
/* Get position and size of a node            */
/**********************************************/

const getNodeParameters = (selectedElement, refCircle, elementClasses, elementRadius) => {
  let nodeParameters = {
    'refRadius': 0,
    'cx': 0,
    'cy': 0
  };

  switch (true) {
    case elementClasses.includes('node-National'):
    case elementClasses.includes('node-Continental'):
      nodeParameters.refRadius = elementRadius;
      nodeParameters.cx = refCircle.attr('cx');
      nodeParameters.cy = refCircle.attr('cy');
      break;
    case elementClasses.includes('node-Regional'):
      nodeParameters.refRadius = 1.5 * refCircle.attr('r');
      nodeParameters.cx = refCircle.attr('cx');
      nodeParameters.cy = refCircle.attr('cy');
      break;
    case elementClasses.includes('node-Global'):
    case elementClasses.includes('node-Bi-National'):
      const bBox = selectedElement.node().getBBox();
      nodeParameters.refRadius = bBox.width / 2;
      nodeParameters.cx = bBox.x + nodeParameters.refRadius;
      nodeParameters.cy = bBox.y + bBox.height / 2;
      break;
  }

  return nodeParameters;
};


/*************************************************/
/* Add background circle behind selected element */
/*************************************************/

const addBackgroundCircle = (id, elementRadius) => {
  // Remove previously added circle
  d3.select('.background-circle').remove();
  
  // Add new circle
  const selectedElement = d3.select(`#node-${id}`);
  const refCircle = d3.select(`#node-${id} circle`);
  const elementClasses = selectedElement.attr('class');
  
  const nodeParameters = getNodeParameters(selectedElement, refCircle, elementClasses, elementRadius);

  let circleRadius = nodeParameters.refRadius >= 30 ? (nodeParameters.refRadius * 1.25) : (nodeParameters.refRadius + 5);

  selectedElement.insert('circle', ':first-child')
    .attr('class', 'background-circle')
    .attr('r', 0)
    .attr('cx', nodeParameters.cx)
    .attr('cy', nodeParameters.cy)
    .attr('fill', grey)
    .attr('fill-opacity', 0.25)
    .attr('stroke', 'none')
    .style('filter', 'url(#glow)')
    .transition()
    .duration(50)
    .attr('r', circleRadius);
};


/*************************************************/
/* Get related links and nodes                   */
/*************************************************/

const getRelatedElements = (id) => {
  let relatedElements = {
    "tags": [],
    "relatedNodes": [],
    "relatedLinks": []
  };

  const addTags = (tags) => {
    for (const tag of tags) {
      if (!relatedElements.tags.includes(tag)) {
        relatedElements.tags.push(tag);
      }
    }
  };

  links.forEach(link => {
    if (link.source.id === id) {
      relatedElements.relatedNodes.push(link.target.id);
      relatedElements.relatedLinks.push(`${link.source.id}-to-${link.target.id}`);
      addTags(link.tags);
    } else if (link.target.id === id) {
      relatedElements.relatedNodes.push(link.source.id);
      relatedElements.relatedLinks.push(`${link.source.id}-to-${link.target.id}`);
      addTags(link.tags);
    }
  });
  return relatedElements;
};


/*************************************************/
/* Unhighlight all elements                      */
/* when user clicks elsewhere on the page        */
/*************************************************/

document.addEventListener('click', (e) => {
  const closestGroup = e.target.closest('g');
  if (isActiveElement && (closestGroup === null || !closestGroup.classList.contains('node'))) {
    isActiveElement = false;
    d3.select('.background-circle').remove();
    highlightedNodes = [];
    unhighlightElements();
    d3.select('#action').classed('visible', false);
  }
});


/**********************************************/
/* Populate and show/hide info box            */
/**********************************************/

const showInfo = (d) => {
  // Find location of the mouse on the page
  const xpos = d3.event.pageX - 15;
  const ypos = d3.event.pageY - 15;

  // Populate info
  const nodeColor = getColor(d.type);
  d3.select('#info .type').text(getGroup(d.type));
  d3.select('#info .type').style('color', nodeColor.hex);
  d3.select('#info h3').text(d.label);
  d3.select('#info .name-background').style('background', nodeColor.hex);
  d3.select('#info .tags').text(d.tags.join(', '));

  d3.select('#info .mission-statement').text(d.description);
  d3.select('#info .mission-container').style('border-left-color', nodeColor.hex);
  const scale = d.location_of_impact === ''
                  ? d.scale
                  : `${d.scale} (${d.location_of_impact})`;
  d3.select('#info .fact-scale').text(scale);
  d3.select('#info .fact-impact').text(d3.format(",")(d.estimated_people_impacted));
  d3.select('#info .fact-url').attr('class', `fact fact-url link-${nodeColor.id}`);
  d3.select('#info .fact-url').attr('href', d.url);
  let url = d.url.replace('http://', '').replace('https://', '').replace('www.', '');
  if (url.endsWith('/')) { url = url.slice(0, -1); }
  d3.select('#info .fact-url').text(url);

  // Make the info box appear at the right location
  d3.select('#info')
    .classed('visible', true);
};

const hideInfo = () => {
  d3.select('#info').classed('visible', false);
};