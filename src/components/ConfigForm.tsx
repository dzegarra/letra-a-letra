import { ComponentProps, useCallback, useState } from 'react'
import clsx from 'clsx'
import { Word } from "../types"
import { ConfigWordFieldGroup } from './ConfigWordFieldGroup'

type ConfirmFormProps = {
    words: Word[],
    onChangeWords: (words: Word[]) => void,
    onClose: () => void,
} & ComponentProps<'div'>

export const ConfirmForm = ({ className, words, onClose, onChangeWords, ...props }: ConfirmFormProps) => {
    const [wordsCopy, setWordsCopy] = useState(words);

    const handleWordChange = useCallback((index: number, word: string) => {
        setWordsCopy(wordsCopy => {
            const newWords = [...wordsCopy];
            const color = newWords[index].color;
            newWords.splice(index, 1, { word, color });
            return newWords
        })
    }, [])

    const handleColorChange = useCallback((index: number, color: string) => {
        setWordsCopy(wordsCopy => {
            const newWords = [...wordsCopy];
            const word = newWords[index].word;
            newWords.splice(index, 1, { word, color });
            return newWords;
        })
    }, [])

    const confirmChanges = useCallback(() => {
        onChangeWords(wordsCopy)
        onClose();
    }, [onChangeWords, onClose, wordsCopy]);

    return (
        <div className={clsx("flex flex-col gap-4 bg-slate-50/85 p-3 rounded", className)} {...props}>
            {wordsCopy.map(({ word, color }, index) => (
                <ConfigWordFieldGroup key={index} index={index} word={word} color={color} autoFocus={index === 0}
                    onChangeWord={word => handleWordChange(index, word)}
                    onChangeColor={color => handleColorChange(index, color)}
                />
            ))}

            <button onClick={confirmChanges}>OK</button>
        </div>)
}