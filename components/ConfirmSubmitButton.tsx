"use client";

import type { MouseEvent, ReactNode } from "react";

export function ConfirmSubmitButton({
  children,
  className,
  formAction,
  formNoValidate,
  message,
}: {
  children: ReactNode;
  className?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
  formNoValidate?: boolean;
  message: string;
}) {
  function confirmSubmission(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm(message)) event.preventDefault();
  }

  return (
    <button
      className={className}
      type="submit"
      formAction={formAction}
      formNoValidate={formNoValidate}
      onClick={confirmSubmission}
    >
      {children}
    </button>
  );
}
