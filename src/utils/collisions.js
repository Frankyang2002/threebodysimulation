
// Function to detect and resolve collisions
export function resolveCollisions(bodies) {
    const collisions = [];
  
    // Detect collisions
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const bodyA = bodies[i];
        const bodyB = bodies[j];
  
        const dx = bodyB.position[0] - bodyA.position[0];
        const dy = bodyB.position[1] - bodyA.position[1];
        const dz = bodyB.position[2] - bodyA.position[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
        if (distance < bodyA.radius + bodyB.radius) {
          collisions.push([bodyA, bodyB]);
        }
      }
    }
  
    // Resolve collisions
    collisions.forEach(([bodyA, bodyB]) => {
      const dx = bodyB.position[0] - bodyA.position[0];
      const dy = bodyB.position[1] - bodyA.position[1];
      const dz = bodyB.position[2] - bodyA.position[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const normal = [dx / distance, dy / distance, dz / distance];
  
      const vx = bodyB.velocity[0] - bodyA.velocity[0];
      const vy = bodyB.velocity[1] - bodyA.velocity[1];
      const vz = bodyB.velocity[2] - bodyA.velocity[2];
  
      const velocityAlongNormal = vx * normal[0] + vy * normal[1] + vz * normal[2];
  
      if (velocityAlongNormal > 0) return;
  
      const restitution = 1; //How bouncy something is, make it 1 so that it is elastic collisions
        
      // vrel is relative velocity along normal direciton, (vb-va)*n   <- dot product
      // Just momentum things Impulse scalar = (-(1 + e)vrel/(1/ma + 1/mb))
      const impulseScalar = -(1 + restitution) * velocityAlongNormal / (1 / bodyA.mass + 1 / bodyB.mass);
      const impulse = [
        impulseScalar * normal[0],
        impulseScalar * normal[1],
        impulseScalar * normal[2],
      ];
  
      bodyA.velocity = [
        bodyA.velocity[0] - impulse[0] / bodyA.mass,
        bodyA.velocity[1] - impulse[1] / bodyA.mass,
        bodyA.velocity[2] - impulse[2] / bodyA.mass,
      ];
  
      bodyB.velocity = [
        bodyB.velocity[0] + impulse[0] / bodyB.mass,
        bodyB.velocity[1] + impulse[1] / bodyB.mass,
        bodyB.velocity[2] + impulse[2] / bodyB.mass,
      ];
  
      // Adjust positions to prevent overlap
      const overlap = 0.5 * (distance - bodyA.radius - bodyB.radius);
      bodyA.position = [
        bodyA.position[0] - overlap * normal[0],
        bodyA.position[1] - overlap * normal[1],
        bodyA.position[2] - overlap * normal[2],
      ];
  
      bodyB.position = [
        bodyB.position[0] + overlap * normal[0],
        bodyB.position[1] + overlap * normal[1],
        bodyB.position[2] + overlap * normal[2],
      ];
    });
  }