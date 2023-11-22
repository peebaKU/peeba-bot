// App.tsx
import React, { useState, useEffect } from 'react';

// Define a TypeScript interface for the dictionary-like structure

interface UserItem {
  user_id: string;
  name: string;
  vulgar_words_count: number;
}

interface ApiResponse  {
  items: UserItem[];
}


const App: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    // Define the API endpoint URL
    const apiUrl = 'http://localhost:8000/items';

    // Make a GET request to the FastAPI backend
    fetch(apiUrl);


    
  }, []); // The empty dependency array ensures the effect runs once when the component mounts

  return (
    <div>
      <h1>React + FastAPI Example</h1>
      {data ? (
        <div>
          <h2>Data from FastAPI:</h2>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
