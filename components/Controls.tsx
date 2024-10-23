'use client';

import { useEffect } from 'react';
import { useAlgorithmStore } from '@/store/algorithmStore';
import { 
  PlayIcon, 
  PauseIcon, 
  ForwardIcon,
  BackwardIcon,
} from '@heroicons/react/24/solid';

export default function Controls() {
  const { 
    currentAlgorithm,
    generateNewData,
    isPlaying,
    setIsPlaying,
    nextStep,
    previousStep,
    currentStep,
    steps,
    speed,
    setSpeed,
  } = useAlgorithmStore();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        nextStep();
      }, speed);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, speed, nextStep]);

  const handlePlayPause = () => {
    if (currentStep === steps.length - 1) {
      generateNewData();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <button
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          onClick={previousStep}
          disabled={currentStep === 0 || isPlaying}
        >
          <BackwardIcon className="w-6 h-6 text-gray-600" />
        </button>

        <button
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
          onClick={handlePlayPause}
          disabled={!currentAlgorithm}
        >
          {isPlaying ? (
            <PauseIcon className="w-6 h-6" />
          ) : (
            <PlayIcon className="w-6 h-6" />
          )}
        </button>

        <button
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          onClick={nextStep}
          disabled={currentStep === steps.length - 1 || isPlaying}
        >
          <ForwardIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm disabled:opacity-50"
          onClick={generateNewData}
          disabled={isPlaying}
        >
          Generate New Data
        </button>

        <select
          className="px-4 py-2 bg-gray-100 rounded-md text-sm"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          disabled={isPlaying}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Normal</option>
          <option value={200}>Fast</option>
        </select>
      </div>

      {steps.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </div>
      )}
    </div>
  );
}