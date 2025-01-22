import clsx from 'clsx';
import classes from './CircularWord.module.css';

type CircularWordProps = {
  className?: string;
  word: string;
  radius?: number;
  fontSize?: number;
  width?: string;
  height?: string;
};

export const CircularWord = ({
  className,
  word,
  width,
  height,
  fontSize = 1,
  radius = 5,
}: CircularWordProps) => (
  <span
    className={clsx(classes.ring, className)}
    style={
      {
        '--total': word.length,
        '--font-size': fontSize,
        '--radius': radius,
        width,
        height,
      } as any
    }
  >
    {word.split('').map((letter, i) => (
      <span key={i} style={{ '--index': i } as any}>
        {letter}
      </span>
    ))}
  </span>
);
