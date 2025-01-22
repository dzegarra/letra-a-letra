import { useState } from 'react';
import clsx from 'clsx';
import { CircularWord } from './components/CircularWord';
import { InputField } from './components/InputField';
import { Circle } from './components/Circle';

function App() {
  const [editVisible, setEditVisible] = useState(false);
  const [palabra1, setPalabra1] = useState('ABRACADABRA');
  const [palabra2, setPalabra2] = useState('COMIDA');
  const [palabra3, setPalabra3] = useState('SOPA');

  return (
    <div className="container mx-auto p-4 flex flex-col">
      <div className="h-[500px] w-[500px] relative select-none">
        <div
          className={clsx('relative w-full h-full flex justify-center', {
            'blur-sm': editVisible,
          })}
        >
          <Circle size="500px" color1="red" color2="green" color3="blue" />
          <CircularWord word={palabra1} radius={8.6} fontSize={3} />
          <CircularWord word={palabra2} radius={6.1} fontSize={3} />
          <CircularWord word={palabra3} radius={3.5} fontSize={3} />
        </div>

        {editVisible ? (
          <div className="flex flex-col gap-4 w-[200px] absolute top-0 left-0 translate-x-1/2 translate-y-1/2 bg-slate-50/85 p-3 rounded">
            <InputField
              label="Palabra #1"
              placeholder="Type the first word"
              value={palabra1}
              onChange={(evt) => setPalabra1(evt.target.value)}
            />
            <InputField
              label="Palabra #2"
              placeholder="Type the second word"
              value={palabra2}
              onChange={(evt) => setPalabra2(evt.target.value)}
            />
            <InputField
              label="Palabra #3"
              placeholder="Type the third word"
              value={palabra3}
              onChange={(evt) => setPalabra3(evt.target.value)}
            />
            <button onClick={() => setEditVisible(false)}>Ok</button>
          </div>
        ) : (
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-3 py-1"
            onClick={() => setEditVisible(true)}
          >
            EDIT
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
