"use client";

import type { MouseEvent, ReactNode } from "react";

export function ConfirmSubmitButton({
  children,
  className,
  formAction,
  message,
}: {
  children: ReactNode;
  className?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
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
      onClick={confirmSubmission}
    >
      {children}
    </button>
  );
}
