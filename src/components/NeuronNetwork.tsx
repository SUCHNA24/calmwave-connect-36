import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface NeuronProps {
  position: [number, number, number];
  index: number;
  connections: number[];
  neurons: Array<{ position: [number, number, number]; active: boolean }>;
  mousePosition: { x: number; y: number };
}

function Neuron({ position, index, connections, neurons, mousePosition }: NeuronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Pulsing effect based on activity
      const pulse = Math.sin(clock.getElapsedTime() * 2 + index * 0.5) * 0.1 + 1;
      meshRef.current.scale.setScalar(pulse);
      
      // Mouse interaction - neurons react to mouse proximity
      const mouseInfluence = Math.max(0, 1 - (
        Math.sqrt(
          Math.pow(mousePosition.x - position[0], 2) + 
          Math.pow(mousePosition.y - position[1], 2)
        ) / 3
      ));
      
      // Change color based on mouse proximity
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const baseColor = neurons[index].active ? 0x22c55e : 0x1ea7dc;
      const glowIntensity = 0.3 + mouseInfluence * 0.7;
      material.color.setHex(baseColor);
      material.emissive.setHex(baseColor);
      material.emissiveIntensity = glowIntensity * 0.2;
    }
    
    // Connection line animation disabled for stability
    // (We can reintroduce with a safer implementation later)

  });

  // Create connection lines
  const connectionLines = useMemo(() => {
    return connections.map((connectionIndex) => {
      if (connectionIndex >= neurons.length) return null;
      const targetPosition = neurons[connectionIndex].position;
      const points = [
        new THREE.Vector3(...position),
        new THREE.Vector3(...targetPosition)
      ];
      return (
        <Line
          key={`${index}-${connectionIndex}`}
          points={points}
          color={neurons[index].active && neurons[connectionIndex].active ? "#22c55e" : "#1ea7dc"}
          transparent
          opacity={0.3}
        />
      );
    }).filter(Boolean);
  }, [position, connections, neurons, index]);

  return (
    <group>
      {/* Connection lines */}
      <group ref={linesRef}>
        {connectionLines}
      </group>
      
      {/* Neuron sphere */}
      <Sphere ref={meshRef} position={position} args={[0.08, 16, 16]}>
        <meshStandardMaterial
          color={neurons[index].active ? "#22c55e" : "#1ea7dc"}
          emissive={neurons[index].active ? "#22c55e" : "#1ea7dc"}
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Glow effect */}
      <Sphere position={position} args={[0.12, 8, 8]}>
        <meshBasicMaterial
          color={neurons[index].active ? "#22c55e" : "#1ea7dc"}
          transparent
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
}

function NetworkBackground() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
      groupRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.15) * 0.05;
    }
  });

  // Create floating particles
  const particles = useMemo(() => {
    const particlePositions = [];
    for (let i = 0; i < 100; i++) {
      particlePositions.push([
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ]);
    }
    return particlePositions;
  }, []);

  return (
    <group ref={groupRef}>
      {particles.map((position, i) => (
        <Sphere key={i} position={position as [number, number, number]} args={[0.02, 4, 4]}>
          <meshBasicMaterial
            color="#1ea7dc"
            transparent
            opacity={0.4}
          />
        </Sphere>
      ))}
    </group>
  );
}

export default function NeuronNetwork() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Generate neuron network
  const networkData = useMemo(() => {
    const neurons = [];
    const numNeurons = 50;
    
    // Create neuron positions in 3D space
    for (let i = 0; i < numNeurons; i++) {
      const angle = (i / numNeurons) * Math.PI * 4;
      const radius = 2 + Math.random() * 2;
      const height = (Math.random() - 0.5) * 3;
      
      neurons.push({
        position: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5,
          height,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5
        ] as [number, number, number],
        active: Math.random() > 0.7 // 30% chance of being active
      });
    }
    
    // Create connections between nearby neurons
    const connections = neurons.map((neuron, index) => {
      const neuronConnections: number[] = [];
      neurons.forEach((otherNeuron, otherIndex) => {
        if (index !== otherIndex) {
          const distance = Math.sqrt(
            Math.pow(neuron.position[0] - otherNeuron.position[0], 2) +
            Math.pow(neuron.position[1] - otherNeuron.position[1], 2) +
            Math.pow(neuron.position[2] - otherNeuron.position[2], 2)
          );
          
          // Connect neurons within a certain distance
          if (distance < 1.5 && neuronConnections.length < 4) {
            neuronConnections.push(otherIndex);
          }
        }
      });
      return neuronConnections;
    });
    
    return { neurons, connections };
  }, []);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#22c55e" />
        
        <NetworkBackground />
        
        {networkData.neurons.map((neuron, index) => (
          <Neuron
            key={index}
            position={neuron.position}
            index={index}
            connections={networkData.connections[index]}
            neurons={networkData.neurons}
            mousePosition={mousePosition}
          />
        ))}
      </Canvas>
    </div>
  );
}

// Fix missing import
import { useState } from 'react';