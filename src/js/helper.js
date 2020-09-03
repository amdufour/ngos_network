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
  const r = width / 4; // Distance from the center of the visualization

  const posX = (width / 2) + (r * Math.sin(degreeToRadian((2*index + 1) * angle)));
  const posY = (width / 2) + (r * Math.cos(degreeToRadian((2*index + 1) * angle)));

  return [posX, posY];
};

// Get color of a node
const getColor = (type) => {
  const group = getGroup(type);
  switch (group) {
    case 'communications':
      return red;
    case 'civics':
      return orange;
    case 'community':
      return yellow;
    case 'economy':
      return pistachio;
    case 'technology':
      return teal;
    case 'education':
      return blue;
  }
};

// Convert degrees to radians
function degreeToRadian(angle) {
  return angle * Math.PI / 180;
}