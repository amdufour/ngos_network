// Highlight related elements and fade others
const highlightElements = (id) => {
  let relatedElements = getRelatedElements(id);
  
  d3.selectAll('.node')
    .classed('faded', d => {
      return (d.id === id || relatedElements['relatedNodes'].includes(d.id)) ? false : true;
    });

  d3.selectAll('.link')
    .classed('highlighted', d => {
      const linkId = `${d.source.id}-to-${d.target.id}`;
      return relatedElements['relatedLinks'].includes(linkId) ? true : false;
    })
    .classed('hidden', d => {
      const linkId = `${d.source.id}-to-${d.target.id}`;
      return relatedElements['relatedLinks'].includes(linkId) ? false : true;
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

// Get related links and nodes
const getRelatedElements = (id) => {
  let relatedElements = {
    "relatedNodes": [],
    "relatedLinks": []
  };
  links.forEach(link => {
    if (link.source.id === id) {
      relatedElements['relatedNodes'].push(link.target.id);
      relatedElements['relatedLinks'].push(`${link.source.id}-to-${link.target.id}`);
    } else if (link.target.id === id) {
      relatedElements['relatedNodes'].push(link.source.id);
      relatedElements['relatedLinks'].push(`${link.source.id}-to-${link.target.id}`);
    }
  });
  return relatedElements;
};

// Unhighlight all elements when user clicks elsewhere on the page
document.addEventListener('click', (e) => {
  const closestGroup = e.target.closest('g');
  if (isActiveElement && (closestGroup === null || !closestGroup.classList.contains('node'))) {
    isActiveElement = false;
    unhighlightElements();
  }
});