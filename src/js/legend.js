// Add legend for circles radius
const addRadiusLegend = (radiusL, radiusMd, radiusSm) => {
  const marginTop = 16;
  const lineLength = 90;

  // Append circles
  const legendRadius = d3.select('.legend-radius').append('svg')
    .attr('width', '100%')
    .attr('height', radiusL * 2 + marginTop);
  const legendRadiusCircles = legendRadius.append('g')
    .attr('class', 'circles');
  legendRadiusCircles.append('circle')
    .attr('r', radiusL)
    .attr('cx', radiusL)
    .attr('cy', radiusL + marginTop);
  legendRadiusCircles.append('circle')
    .attr('r', radiusMd)
    .attr('cx', radiusL)
    .attr('cy', 2 * radiusL - radiusMd + marginTop);
  legendRadiusCircles.append('circle')
    .attr('r', radiusSm)
    .attr('cx', radiusL)
    .attr('cy', 2 * radiusL - radiusSm + marginTop);

  // Append lines
  const legendLinesGroup = legendRadius.append('g')
    .attr('class', 'lines');
  legendLinesGroup.append('line')
    .attr('x1', radiusL)
    .attr('y1', marginTop)
    .attr('x2', radiusL + lineLength)
    .attr('y2', marginTop);
  legendLinesGroup.append('line')
    .attr('x1', radiusL)
    .attr('y1', marginTop + 2 * (radiusL - radiusMd))
    .attr('x2', radiusL + lineLength)
    .attr('y2', marginTop + 2 * (radiusL - radiusMd));
  legendLinesGroup.append('line')
    .attr('x1', radiusL)
    .attr('y1', marginTop + 2 * (radiusL - radiusSm))
    .attr('x2', radiusL + lineLength)
    .attr('y2', marginTop + 2 * (radiusL - radiusSm));

  // Append texts
  const legendTextsGroup = legendRadius.append('g')
    .attr('class', 'numbers');
  legendTextsGroup.append('text')
    .attr('x', radiusL + lineLength + 10)
    .attr('y', marginTop + 4)
    .text('1,000,000');
  legendTextsGroup.append('text')
    .attr('x', radiusL + lineLength + 10)
    .attr('y', marginTop + 2 * (radiusL - radiusMd) + 4)
    .text('500,000');
  legendTextsGroup.append('text')
    .attr('x', radiusL + lineLength + 10)
    .attr('y', marginTop + 2 * (radiusL - radiusSm) + 4)
    .text('5,000');
};