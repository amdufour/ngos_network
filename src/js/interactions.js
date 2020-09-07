// Fade all elements
const fadeElements = (id) => {
  let relatedElements = getRelatedElements(id);
  console.log(id, relatedElements);
  
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

// Bring back elements to front
const unfadeElements = () => {
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