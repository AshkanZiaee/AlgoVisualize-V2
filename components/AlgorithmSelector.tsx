'use client';

import { useAlgorithmStore } from '@/store/algorithmStore';

const algorithms = {
  Sorting: [
    'Bubble Sort',
    'Quick Sort',
    'Merge Sort',
  ],
  Graph: [
    'BFS',
    'DFS',
    "Dijkstra's Algorithm",
  ],
  Tree: [
    'Binary Search Tree',
    'AVL Tree',
    'Red-Black Tree',
  ],
};

export default function AlgorithmSelector() {
  const { setAlgorithm, currentAlgorithm } = useAlgorithmStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Algorithms</h2>
      <div className="space-y-4">
        {Object.entries(algorithms).map(([category, algs]) => (
          <div key={category}>
            <h3 className="text-lg font-medium text-gray-700 mb-2">{category}</h3>
            <div className="space-y-2">
              {algs.map((alg) => (
                <button
                  key={alg}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    currentAlgorithm === alg
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setAlgorithm(alg)}
                >
                  {alg}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}