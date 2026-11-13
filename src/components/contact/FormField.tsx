import { cx } from "@/lib/cx";

type FormFieldProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email";
  multiline?: boolean;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  defaultValue?: string;
};

const controlClass =
  "w-full rounded-lg border bg-background-light-yellow px-4 text-sm leading-6 text-text-primary " +
  "placeholder:text-text-tertiary-strong transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none " +
  "focus:border-primary-blue focus:outline-none focus-visible:ring-3 focus-visible:ring-primary-blue/25";

/** Label + input/textarea + error message, wired for assistive tech (Figma 19:105). */
export function FormField({
  id,
  name,
  label,
  type = "text",
  multiline = false,
  placeholder,
  autoComplete,
  error,
  defaultValue,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    placeholder,
    defaultValue,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: cx(controlClass, error ? "border-error" : "border-line-1"),
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm leading-6 font-bold text-text-primary">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={4} className={cx(shared.className, "h-30 resize-y py-3.5")} />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          className={cx(shared.className, "py-3")}
        />
      )}
      {error && (
        <p id={errorId} className="text-sm leading-5 text-error">
          {error}
        </p>
      )}
    </div>
  );
}
