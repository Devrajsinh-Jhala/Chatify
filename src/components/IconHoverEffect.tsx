import React from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  red?: boolean;
  blue?: boolean;
};

const IconHoverEffect = ({ children, red = false, blue = false }: Props) => {
  const colorClasses = red
    ? "outline-red-400 hover:bg-red-200 group-hover-bg-red-200 group-focus-visible:bg-red-200 focus-visible-bg-red-200"
    : "outline-gray-400 hover:bg-gray-200 dark:hover:text-gray-800 group-hover-bg-gray-200 group-focus-visible:bg-gray-200 focus-visible-bg-gray-200";

  const bookmarkClasses = blue
    ? "outline-blue-400 hover:bg-blue-200 group-hover-bg-blue-200 group-focus-visible:bg-blue-200 focus-visible-bg-blue-200"
    : "outline-gray-400 hover:bg-gray-200 dark:hover:text-gray-800 group-hover-bg-gray-200 group-focus-visible:bg-gray-200 focus-visible-bg-gray-200";

  return (
    <div
      className={`rounded-full p-2 transition-colors duration-200  ${colorClasses} ${bookmarkClasses}`}
    >
      {children}
    </div>
  );
};

export default IconHoverEffect;
