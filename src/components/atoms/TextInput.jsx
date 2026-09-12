import { forwardRef } from "react";

const TextInput = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`p-2 h-14 rounded-xl border border-gray-300 bg-gray-100  ${className}`}
      ref={ref}
      {...props}
    ></input>
  );
});

TextInput.displayName = "TextInput";

export default TextInput;
