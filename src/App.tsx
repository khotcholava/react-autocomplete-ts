import React, { useEffect, useState } from 'react';
import './App.css';
import { Option } from './Components/Autocomplete/Autocomplete.types';
import { Autocomplete } from './Components/Autocomplete/Autocomplete';
import { options } from './mock';

interface IUser {
  name: string;
  id: number;
  userName: string;
  email: string
}

function App() {
  const [ options, setOptions ] = useState<Option<number>[]>([]);
  const [ selectedUser, setSelectedUser ] = useState<any>(1);
  
  // For offline options pass this variable as options prop in Autocomplete.
  // const offlineOptions = options;
  
  useEffect(() => {
    const url = 'https://jsonplaceholder.typicode.com/users';
    fetch(url).then(data => data.json())
      .then((users: IUser[]) => {
        const userOptions = users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
        setOptions(userOptions);
      });
  }, []);
  
  return (
    <div className="App">
      <pre>
        {
          JSON.stringify(options)
        }
      </pre>
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
