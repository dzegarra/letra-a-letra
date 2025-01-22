import { ComponentProps } from 'react';
import clsx from 'clsx'

type LabelProps = ComponentProps<'label'>
type InputFieldProps = {
  label: string;
  inputProps: ComponentProps<'input'>
  value: ComponentProps<'input'>['value'],
  onChange: ComponentProps<'input'>['onChange']
} & Omit<LabelProps, 'onChange'>;

export const InputField = ({ label, className, value, onChange, inputProps, ...props }: InputFieldProps) => (
  <label className={clsx("block flex-col", className)} id="palabra1" {...props}>
    <span className="text-sm font-medium text-slate-700 text-left">
      {label}
    </span>
    <input
      className="mt-1 px-2 py-1 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
      onChange={onChange}
      value={value}
      {...inputProps}
    />
  </label>
);
