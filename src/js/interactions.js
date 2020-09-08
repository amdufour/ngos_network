// Highlight related elements and fade others
const highlightElements = (id, selected) => {
  let relatedElements = getRelatedElements(id);
  
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
};

// Bring back all elements to front
const unhighlightElements = () => {
  d3.selectAll('.node')
    .classed('faded', false);
  d3.selectAll('.link')
    .classed('highlighted', false)
    .classed('hidden', false);
};

// Highlight a single node
const highlightNode = (id) => {
  d3.select(`#node-${id}`).classed('faded', false);
};

// Un-highlight a single node
const unHighlightNode = (id) => {
  d3.select(`#node-${id}`).classed('faded', true);
};

// Add background circle behind selected element
const addBackgroundCircle = (id, elementRadius) => {
  // Remove previously added circle
  d3.select('.background-circle').remove();
  
  // Add new circle
  const selectedElement = d3.select(`#node-${id}`);
  const refCircle = d3.select(`#node-${id} circle`);
  const elementClasses = selectedElement.attr('class');
  
  let refRadius = 0;
  let cx = 0;
  let cy = 0;

  switch (true) {
    case elementClasses.includes('node-National'):
    case elementClasses.includes('node-Continental'):
      refRadius = elementRadius;
      cx = refCircle.attr('cx');
      cy = refCircle.attr('cy');
      break;
    case elementClasses.includes('node-Regional'):
      refRadius = 1.5 * refCircle.attr('r');
      cx = refCircle.attr('cx');
      cy = refCircle.attr('cy');
      break;
    case elementClasses.includes('node-Global'):
    case elementClasses.includes('node-Bi-National'):
      const bBox = selectedElement.node().getBBox();
      refRadius = bBox.width / 2;
      cx = bBox.x + refRadius;
      cy = bBox.y + bBox.height / 2;
      break;
  }

  let circleRadius = refRadius >= 30 ? (refRadius * 1.25) : (refRadius + 5);

  selectedElement.append('circle')
    .attr('class', 'background-circle')
    .attr('r', 0)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill', grey)
    .attr('fill-opacity', 0.25)
    .attr('stroke', 'none')
    .style('filter', 'url(#glow)')
    .transition()
    .duration(50)
    .attr('r', circleRadius);
};

// Get related links and nodes
const getRelatedElements = (id) => {
  let relatedElements = {
    "relatedNodes": [],
    "relatedLinks": []
  };
  links.forEach(link => {
    if (link.source.id === id) {
      relatedElements.relatedNodes.push(link.target.id);
      relatedElements.relatedLinks.push(`${link.source.id}-to-${link.target.id}`);
    } else if (link.target.id === id) {
      relatedElements.relatedNodes.push(link.source.id);
      relatedElements.relatedLinks.push(`${link.source.id}-to-${link.target.id}`);
    }
  });
  return relatedElements;
};

// Unhighlight all elements when user clicks elsewhere on the page
document.addEventListener('click', (e) => {
  const closestGroup = e.target.closest('g');
  if (isActiveElement && (closestGroup === null || !closestGroup.classList.contains('node'))) {
    isActiveElement = false;
    d3.select('.background-circle').remove();
    unhighlightElements();
  }
});