import { ComponentProps } from 'react';
import clsx from 'clsx';
import classes from './Circle.module.css';

type CircleProps = {
  size: string;
  color1: string;
  color2: string;
  color3: string;
} & ComponentProps<'div'>;

export const Circle = ({
  size,
  className,
  color1,
  color2,
  color3,
  ...props
}: CircleProps) => (
  <div
    style={{
      width: size,
      height: size,
      '--color1': color1,
      '--color2': color2,
      '--color3': color3,
    }}
    className={clsx(
      `top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 absolute rounded-full`,
      classes.bgcolor,
      className
    )}
    {...props}
  ></div>
);
