import { useState } from 'react';
import clsx from 'clsx';
import { CircularWord } from './CircularWord';
import { Circle } from './Circle';
import { ConfirmForm } from './ConfigForm';
import { Word } from '../types';

type CardProps = {
    initialWords?: Word[]
}

const defaultWords: Word[] = [
    {
        word: '',
        color: '#C0392B'
    }, {
        word: '',
        color: '#8E44AD'
    }, {
        word: '',
        color: '#27AE60'
    }
];

export const Card = ({ initialWords = defaultWords }: CardProps) => {
    const [editVisible, setEditVisible] = useState(false);
    const [words, setWords] = useState<Word[]>(initialWords);

    return (
        <div className="h-[500px] w-[500px] relative select-none">
            <div
                className={clsx('relative w-full h-full flex justify-center', {
                    'blur-sm': editVisible,
                })}
            >
                <Circle size="500px" color1={words[0].color} color2={words[1].color} color3={words[2].color} />
                <CircularWord word={words[0].word} radius={8.6} fontSize={3} />
                <CircularWord word={words[1].word} radius={6.1} fontSize={3} />
                <CircularWord word={words[2].word} radius={3.5} fontSize={3} />
            </div>

            {editVisible ? (
                <ConfirmForm className="w-[250px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
                    words={words}
                    onChangeWords={setWords}
                    onClose={() => setEditVisible(false)}
                />

            ) : (
                <button
                    className="opacity-0 hover:opacity-100 transition-opacity absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-4 py-2"
                    onClick={() => setEditVisible(true)}
                >
                    EDIT
                </button>
            )}
        </div>
    );
}

