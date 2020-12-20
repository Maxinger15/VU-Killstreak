export default function getPoints(r, num, cx = null, cy = null) {
    let points = [];
    let centerX = cx || r;
    let centerY = cy || r;
    let leastX;
    let leastY;
    let greatestX;
    let greatestY;
  
    for (let i = 1; i < num + 1; i++) {
      points.push({
        x: centerX + Math.round(r * Math.sin((Math.PI / (num / 2)) * -i)),
        y: centerY + Math.round(r * Math.cos((Math.PI / (num / 2)) * -i))
      });
  
      let index = i - 1;
  
      if (i === 1) {
        leastX = points[index].x;
        leastY = points[index].y;
        greatestX = points[index].x;
        greatestY = points[index].y;
      } else {
        if (leastX > points[index].x) {
          leastX = points[index].x;
        }
        if (leastY > points[index].y) {
          leastY = points[index].y;
        }
        if (greatestX < points[index].x) {
          greatestX = points[index].x;
        }
        if (greatestY < points[index].y) {
          greatestY = points[index].y;
        }
      }
    }
  
    let retPoints = [];
  
    retPoints = points.slice(Math.floor(points.length / 2));
    retPoints = retPoints.concat(
      points.slice(null, Math.floor(points.length / 2))
    );
    return {
      points: retPoints,
      leastX: leastX,
      leastY: leastY,
      greatestX: greatestX,
      greatestY: greatestY
    };
  }