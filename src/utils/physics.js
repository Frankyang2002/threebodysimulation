
// Function to compute acceleration
export function computeAcceleration(body, bodies) {
  //const G = 6.67430e-11; // Gravitational constant
  const G = 1;
  const softening = 0.01; // Softening factor to prevent singularities and division by zero

  let ax = 0;
  let ay = 0;
  let az = 0;
  
  bodies.forEach(otherBody => {
    if (body.id !== otherBody.id) {
      const dx = otherBody.position[0] - body.position[0];
      const dy = otherBody.position[1] - body.position[1];
      const dz = otherBody.position[2] - body.position[2];
      // pythagoras
      const distanceSquared = dx * dx + dy * dy + dz * dz +  softening;
      // a = G M / r^2
      const accel = (G * otherBody.mass) / distanceSquared;
      // ax = a * cos theta, ay = a * sin theta
      ax += accel * dx / Math.sqrt(distanceSquared);
      ay += accel * dy / Math.sqrt(distanceSquared);
      az += accel * dz / Math.sqrt(distanceSquared);
    }
  });

  return [ax, ay, az];
}

