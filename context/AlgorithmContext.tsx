'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AlgorithmContextType {
  currentAlgorithm: string | null;
  visualizationState: number[];
  animationSteps: number[][];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  setCurrentAlgorithm: (algorithm: string) => void;
  generateNewData: () => void;
  setIsPlaying: (playing: boolean) => void;
  nextStep: () => void;
  previousStep: () => void;
  setSpeed: (speed: number) => void;
}

const AlgorithmContext = createContext<AlgorithmContextType | undefined>(undefined);

export function AlgorithmProvider({ children }: { children: ReactNode }) {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string | null>(null);
  const [visualizationState, setVisualizationState] = useState<number[]>([]);
  const [animationSteps, setAnimationSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // milliseconds between steps

  const generateBubbleSortSteps = (arr: number[]): number[][] => {
    const steps: number[][] = [arr.slice()];
    const n = arr.length;
    const array = arr.slice();

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          steps.push(array.slice());
        }
      }
    }
    return steps;
  };

  const generateNewData = () => {
    const newData = Array.from({ length: 15 }, () => 
      Math.floor(Math.random() * 80) + 10
    );
    setVisualizationState(newData);
    setCurrentStep(0);
    
    // Generate animation steps based on the algorithm
    if (currentAlgorithm === 'Bubble Sort') {
      const steps = generateBubbleSortSteps(newData);
      setAnimationSteps(steps);
    } else {
      setAnimationSteps([newData]);
    }
  };

  const nextStep = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setVisualizationState(animationSteps[currentStep + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setVisualizationState(animationSteps[currentStep - 1]);
    }
  };

  // Handle algorithm selection
  const handleAlgorithmSelect = (algorithm: string) => {
    setCurrentAlgorithm(algorithm);
    setIsPlaying(false);
    setCurrentStep(0);
    generateNewData();
  };

  // Auto-play effect
  useState(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        if (currentStep < animationSteps.length - 1) {
          nextStep();
        } else {
          setIsPlaying(false);
        }
      }, speed);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, currentStep, speed]);

  return (
    <AlgorithmContext.Provider
      value={{
        currentAlgorithm,
        visualizationState,
        animationSteps,
        currentStep,
        isPlaying,
        speed,
        setCurrentAlgorithm: handleAlgorithmSelect,
        generateNewData,
        setIsPlaying,
        nextStep,
        previousStep,
        setSpeed,
      }}
    >
      {children}
    </AlgorithmContext.Provider>
  );
}

export function useAlgorithmContext() {
  const context = useContext(AlgorithmContext);
  if (context === undefined) {
    throw new Error('useAlgorithmContext must be used within an AlgorithmProvider');
  }
  return context;
}