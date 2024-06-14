
// Function to compute acceleration
export function computeAcceleration(body, bodies) {
  //const G = 6.67430e-11; // Gravitational constant
  const G = 1;
  const softening = 0.1; // Softening factor to prevent singularities

  let ax = 0;
  let ay = 0;

  bodies.forEach(otherBody => {
    if (body.id !== otherBody.id) {
      const dx = otherBody.position[0] - body.position[0];
      const dy = otherBody.position[1] - body.position[1];
      const distanceSquared = dx * dx + dy * dy + softening;
      const force = (G * otherBody.mass) / distanceSquared;
      ax += force * dx / Math.sqrt(distanceSquared);
      ay += force * dy / Math.sqrt(distanceSquared);
    }
  });

  return [ax, ay];
}

// Function to detect and handle collisions
export function detectAndHandleCollisions(bodies) {
  const restitution = 0.8; // Coefficient of restitution (bounciness)
  //const damping = 0.8; // Damping factor for energy loss in collisions

  return bodies.map(body => {
    let { position, velocity } = body;

    // Check collisions with boundaries (simple example)
    // Modify or remove this part as per your specific simulation needs
    if (position[0] < -10 || position[0] > 10) {
      velocity[0] *= -restitution; // Reverse velocity with restitution
      position[0] = position[0] < -10 ? -10 : 10; // Reset position within bounds
    }
    if (position[1] < -10 || position[1] > 10) {
      velocity[1] *= -restitution; // Reverse velocity with restitution
      position[1] = position[1] < -10 ? -10 : 10; // Reset position within bounds
    }

    // Check collisions between bodies
    bodies.forEach(otherBody => {
      if (body.id !== otherBody.id) {
        // Calculate distance between centers
        const dx = otherBody.position[0] - position[0];
        const dy = otherBody.position[1] - position[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate sum of radii
        const sumRadii = body.radius + otherBody.radius; // Assuming bodies have `radius` property

        // If they are touching or overlapping
        if (distance <= sumRadii) {
          // Combine masses and momentums
          const combinedMass = body.mass + otherBody.mass;
          const combinedVelocityX = (body.mass * velocity[0] + otherBody.mass * otherBody.velocity[0]) / combinedMass;
          const combinedVelocityY = (body.mass * velocity[1] + otherBody.mass * otherBody.velocity[1]) / combinedMass;

          // Calculate impulse magnitude
          const relativeVelocityX = velocity[0] - otherBody.velocity[0];
          const relativeVelocityY = velocity[1] - otherBody.velocity[1];
          const relativeVelocityAlongNormal = relativeVelocityX * (dx / distance) + relativeVelocityY * (dy / distance);
          const j = -(1 + restitution) * relativeVelocityAlongNormal;

          // Apply impulses
          const impulseX = j * (dx / distance);
          const impulseY = j * (dy / distance);
          velocity[0] += impulseX / body.mass;
          velocity[1] += impulseY / body.mass;
          otherBody.velocity[0] -= impulseX / otherBody.mass;
          otherBody.velocity[1] -= impulseY / otherBody.mass;

          // Combine masses and update velocities
          body.mass = combinedMass;
          velocity = [combinedVelocityX, combinedVelocityY];

          // Remove the other body from the simulation
          otherBody.mass = 0; // Mark for removal (could be filtered out later)
        }
      }
    });

    return { ...body, position, velocity };
  }).filter(body => body.mass > 0); // Filter out bodies with mass zero (removed bodies)
}

// Function to combine colliding bodies and add their momentums
export function combineCollidingBodies(bodies) {
  const newBodies = [...bodies];

  for (let i = 0; i < newBodies.length; i++) {
    for (let j = i + 1; j < newBodies.length; j++) {
      const bodyA = newBodies[i];
      const bodyB = newBodies[j];

      // Assuming bodyA and bodyB have a `radius` property (or a bounding box)

      // Calculate the distance between the bodies' centers
      const dx = bodyB.position[0] - bodyA.position[0];
      const dy = bodyB.position[1] - bodyA.position[1];
      const distanceSquared = dx * dx + dy * dy;

      // Calculate the combined radius (or use bounding box intersection logic)
      const combinedRadius = bodyA.radius + bodyB.radius;

      // Check if bodies are colliding (using sprites touch logic)
      if (distanceSquared <= combinedRadius ** 2) {
        // Combine masses and momenta
        const totalMass = bodyA.mass + bodyB.mass;
        const momentumX = bodyA.velocity[0] * bodyA.mass + bodyB.velocity[0] * bodyB.mass;
        const momentumY = bodyA.velocity[1] * bodyA.mass + bodyB.velocity[1] * bodyB.mass;
        const combinedVelocity = [
          momentumX / totalMass,
          momentumY / totalMass,
        ];

        // Create a new body at the position of bodyA
        const newBody = {
          id: Math.random(), // Replace with proper id generation logic
          position: bodyA.position,
          velocity: combinedVelocity,
          mass: totalMass,
          radius: combinedRadius, // Set combined radius or bounding box size
        };

        // Remove both bodies from newBodies array
        newBodies.splice(j, 1);
        newBodies.splice(i, 1);

        // Add the new combined body
        newBodies.push(newBody);

        // Since bodies array is modified, break the inner loop
        break;
      }
    }
  }

  return newBodies;
}