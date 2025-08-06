import { Path, UseFormRegister } from "react-hook-form";

type InputProps<T> = {
  name: Path<T>;
  register: UseFormRegister<T>;
  validation?: any;
  type?: string;
  label?: string;
  placeholder?: string;
  iconInput?: React.ReactNode;
};

function InputShared<T extends Record<string, any>>({
  name,
  register,
  validation,
  type = "text",
  label,
  placeholder,
  iconInput,
}: InputProps<T>){
  return (
    <div className='w-full p-2'>
      {label && (
        <label htmlFor={name} className=" block mb-2 text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <div className="relative mb-1">
        {iconInput && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {iconInput}
          </div>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ${
            iconInput ? 'pl-10' : 'pl-3'
          } p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          {...(register ? register(name, validation) : {})}
        />
      </div>
     
    </div>
  );
};

export default InputShared;
