import { useState } from 'react';
import { Card } from './components/Card';
import { InputField } from './components/InputField';


function App() {
  const [numberOfCards, setNumberOfCards] = useState(1)

  return (
    <div className="flex flex-col gap-5 p-4">

      <InputField label='Numero de tarjetas' inputProps={{type:'number', min: 1, max: 100, step: 1}} className='w-40'
        value={numberOfCards}
        onChange={evt => setNumberOfCards(parseInt(evt.target.value, 10))} />

      <div className='flex flex-wrap gap-5'>
        {new Array(numberOfCards).fill(1).map((c, index) => <Card key={index} /> ) }
      </div>
    </div>
  );
}

export default App;
