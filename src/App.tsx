import React, { useEffect, useState } from 'react';
import './App.css';
import { Option } from './Components/Autocomplete/Autocomplete.types';
import { Autocomplete } from './Components/Autocomplete/Autocomplete';

interface MovieProps {
  name: string;
  id: number;
}

function App() {
  const [ options, setOptions ] = useState<Option<number>[]>([]);
  const [ selectedUser, setSelectedUser ] = useState<any>(1);
  
  useEffect(() => {
    const url = 'https://jsonplaceholder.typicode.com/users';
    fetch(url).then(data => data.json())
      .then((users: MovieProps[]) => {
        const userOptions = users.map((movie) => ({
          label: movie.name,
          value: movie.id,
        }));
        setOptions(userOptions);
      });
  }, []);
  
  return (
    <div className="App">
      <div>
        {selectedUser}
      </div>
      <Autocomplete
        options={options}
        value={selectedUser}
        onChange={value => {
          setSelectedUser(value);
        }}
        
        bindKey={value => value }
        placeholder={'Search'}/>
    
    </div>
  );
}

export default App;
