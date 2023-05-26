import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type Props = {
  small?: boolean;
  gray?: boolean;
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button({
  small,
  gray,
  className = "",
  ...props
}: Props) {
  const sizeClasses = small ? "py-2 px-1" : "px-4 py-2 font-bold";
  const colorClasses = gray
    ? "bg-gray-400 hover:bg-gray-300 "
    : "bg-blue-500 hover:bg-blue-400 ";
  return (
    <button
      className={`rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${colorClasses} ${className}`}
      {...props}
    ></button>
  );
}
