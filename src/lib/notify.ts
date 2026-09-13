"use client";

import Swal from "sweetalert2";

const BRAND = "#FF4500";

function base() {
  return Swal.mixin({
    confirmButtonColor: BRAND,
    cancelButtonColor: "#6b7280",
    customClass: {
      popup: "rounded-3xl",
      confirmButton: "rounded-xl font-bold",
      cancelButton: "rounded-xl font-bold",
      input: "rounded-xl",
    },
  });
}

export const notify = {
  success(title: string, text?: string) {
    return base().fire({ icon: "success", title, text, timer: 2600, showConfirmButton: false });
  },
  error(title: string, text?: string) {
    return base().fire({ icon: "error", title, text });
  },
  info(title: string, text?: string) {
    return base().fire({ icon: "info", title, text });
  },
  /** Themed delete confirmation. Resolves true when confirmed. */
  async confirmDelete(title: string, text: string): Promise<boolean> {
    const result = await base().fire({
      icon: "warning",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    return result.isConfirmed;
  },
  /** Themed password prompt. Resolves the value, or null when cancelled. */
  async promptPassword(title: string): Promise<string | null> {
    const result = await base().fire({
      icon: "question",
      title,
      input: "password",
      inputPlaceholder: "At least 8 characters",
      showCancelButton: true,
      confirmButtonText: "Update password",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      inputValidator: (value) =>
        !value ? "Enter a password." : value.length < 8 ? "Minimum 8 characters." : undefined,
    });
    return result.isConfirmed ? String(result.value) : null;
  },
  /** Small auto-dismiss toast (top-end) for lightweight feedback. */
  toast(message: string, icon: "success" | "error" | "info" = "success") {
    return Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
      customClass: { popup: "rounded-2xl" },
    }).fire({ icon, title: message });
  },
};
