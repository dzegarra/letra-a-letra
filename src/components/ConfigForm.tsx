import { ComponentProps } from 'react'
import clsx from 'clsx'
import { Word } from "../types"
import { ConfigWordFieldGroup } from './ConfigWordFieldGroup'

type ConfirmFormProps = {
    words: Word[],
    onChangeWords: (words: Word[]) => void,
    onClose: () => void,
} & ComponentProps<'div'>

export const ConfirmForm = ({ className, words, onClose, onChangeWords, ...props }: ConfirmFormProps) => {
    const handleWordChange = (index: number, word: string) => {
        const newWords = [...words];
        const color = newWords[index].color;
        newWords.splice(index, 1, { word, color });
        onChangeWords(newWords);
    }

    const handleColorChange = (index: number, color: string) => {
        const newWords = [...words];
        const word = newWords[index].word;
        newWords.splice(index, 1, { word, color });
        onChangeWords(newWords);
    }

    return (
        <div className={clsx("flex flex-col gap-4 bg-slate-50/85 p-3 rounded", className)} {...props}>
            {words.map(({ word, color }, index) => (
                <ConfigWordFieldGroup index={index} word={word} color={color} autoFocus={index === 0}
                    onChangeWord={word => handleWordChange(index, word)}
                    onChangeColor={color => handleColorChange(index, color)}
                />
            ))}

            <button onClick={onClose}>OK</button>
        </div>)
}