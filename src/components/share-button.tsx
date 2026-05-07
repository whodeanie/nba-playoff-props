"use client";

import { useState } from "react";

interface Props {
  url: string;
  label?: string;
}

export function ShareButton({ url, label = "Copy link" }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button onClick={copy} className="btn" aria-label={label}>
      {copied ? "Copied" : label}
    </button>
  );
}
