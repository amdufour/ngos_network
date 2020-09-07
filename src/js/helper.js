/*************************************/
/* Helper functions                  */
/*************************************/

// Get main group type of a node
const getGroup = (type) => {
  switch (type) {
    case 'Media':
    case 'Art & Culture':
      return groups[0];

    case 'Politics':
    case 'Civics':
    case 'Democracy':
      return groups[1];

    case 'Community':
    case 'Intercultural':
    case 'Service':
    case 'Conflict resolution':
    case 'Anti-Hate':
    case 'Polarization':
    case 'Religion':
    case 'Interfaith':
      return groups[2];

    case 'Sharing Economy':
    case 'Business':
    case 'International Relief':
      return groups[3];

    case 'Technology':
    case 'Digital Equity':
    case 'Interdependence':
      return groups[4];

    case 'Education':
    case 'Research':
      return groups[5];
  }
};

// Get position of a group
const getPosition = (type) => {
  const group = getGroup(type);
  const index = groups.findIndex(item => item === group);
  const angle = 360 / (groups.length * 2);
  const r = width / 3.5; // Distance from the center of the visualization

  const posX = (width / 2) + (r * Math.sin(degreeToRadian((2*index + 1) * angle)));
  const posY = (width / 2) + (r * Math.cos(degreeToRadian((2*index + 1) * angle)));

  return [posX, posY];
};

// Get color of a node
const getColor = (type) => {
  const group = getGroup(type);
  switch (group) {
    case 'communications':
      return colors.find(color => color.id === 'red');
    case 'civics':
      return colors.find(color => color.id === 'yellow');
    case 'community':
      return colors.find(color => color.id === 'blue');
    case 'economy':
      return colors.find(color => color.id === 'orange');
    case 'technology':
      return colors.find(color => color.id === 'teal');
    case 'education':
      return colors.find(color => color.id === 'pistachio');
  }
};

// Get colors for link gradient
const getGradientColors = (source, target) => {
  const sourceColor = getColor(source).id;
  const targetColor = getColor(target).id;
  return `${sourceColor}-to-${targetColor}`;
};

// Generate path between 2 nodes
const generatePath = (sourceX, sourceY, targetX, targetY) => {
  const midpointX = (sourceX + targetX) / 2;
  const midpointY = (sourceY + targetY) / 2;
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  const normalize = Math.sqrt((dx * dx) + (dy * dy));
  const offset = normalize < 100 ? 10 : 50;

  const offsetX = midpointX + offset * (dy / normalize);
  const offsetY = midpointY - offset * (dx / normalize);

  return `M ${sourceX} ${sourceY} Q ${offsetX} ${offsetY} ${targetX} ${targetY}`;
};

// Convert degrees to radians
function degreeToRadian(angle) {
  return angle * Math.PI / 180;
}