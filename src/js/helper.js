/*************************************/
/* Helper functions                  */
/*************************************/

// Get main group type of a node
const getGroup = (type) => {
  switch (type) {

    case 'Media':
    case 'Art & Culture':
      return 'communications';

    case 'Politics':
    case 'Civics':
    case 'Democracy':
      return 'civics';

    case 'Community':
    case 'Intercultural':
    case 'Service':
    case 'Conflict resolution':
    case 'Anti-Hate':
    case 'Polarization':
    case 'Religion':
    case 'Interfaith':
      return 'community';

    case 'Sharing Economy':
    case 'Business':
    case 'International Relief':
      return 'economy';

    case 'Technology':
    case 'Digital Equity':
    case 'Interdependence':
      return 'technology';

    case 'Education':
    case 'Research':
      return 'education';
  }
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