'use client';

import AlgorithmSelector from '@/components/AlgorithmSelector';
import VisualizationArea from '@/components/VisualizationArea';
import Controls from '@/components/Controls';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Algorithm Visualizer
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <AlgorithmSelector />
        </div>
        
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <VisualizationArea />
            <Controls />
          </div>
        </div>
      </div>
    </main>
  );
}