import { ComponentProps } from 'react';

type InputFieldProps = {
  label: string;
} & ComponentProps<'input'>;

export const InputField = ({ label, ...props }: InputFieldProps) => (
  <label className="block flex-col" id="palabra1">
    <span className="text-sm font-medium text-slate-700 text-left">
      {label}
    </span>
    <input
      className="mt-1 px-2 py-1 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
      {...props}
    />
  </label>
);
