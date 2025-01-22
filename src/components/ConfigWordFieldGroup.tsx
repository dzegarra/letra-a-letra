import { Word } from "../types";
import { InputField } from "./InputField";

type ConfigWordFieldGroupProps = Word & {
    index: number;
    autoFocus?: boolean;
    onChangeWord: (word: string) => void;
    onChangeColor: (color: string) => void;
}

export const ConfigWordFieldGroup = ({ index, word, color, autoFocus, onChangeWord, onChangeColor }: ConfigWordFieldGroupProps) => (<div className="flex items-end gap-2">
    <InputField
        label={`Palabra #${index+1}`}
        inputProps={{placeholder:"Ingresa la palabra", autoFocus}}
        value={word}
        onChange={(evt) => onChangeWord(evt.target.value)}
    />
    <input type="color" value={color} onChange={(evt) => onChangeColor(evt.target.value)} />
</div>)