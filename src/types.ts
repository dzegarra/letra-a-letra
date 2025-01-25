export type Word = {
    word: string;
    color: string;
    rotationDeg?: number;
}

export type Card = {
    id: string;
    words: Word[];
}