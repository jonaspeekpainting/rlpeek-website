"use client";

import { useRef } from "react";
import { Box, Button, Group, Text, Textarea } from "@mantine/core";

type MarkdownBodyEditorProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
  placeholder?: string;
};

function wrapOrInsert(
  text: string,
  start: number,
  end: number,
  before: string,
  after: string = before
): string {
  if (start === end) {
    return text.slice(0, start) + before + after + text.slice(start);
  }
  const selected = text.slice(start, end);
  return text.slice(0, start) + before + selected + after + text.slice(end);
}

function linePrefix(text: string, start: number, prefix: string): string {
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  return text.slice(0, lineStart) + prefix + text.slice(lineStart);
}

export function MarkdownBodyEditor({
  label = "Body (markdown)",
  value,
  onChange,
  minRows = 10,
  placeholder,
}: MarkdownBodyEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const getSelection = () => {
    const el = ref.current;
    if (!el) return { start: 0, end: 0 };
    return { start: el.selectionStart, end: el.selectionEnd };
  };

  const apply = (fn: (text: string, start: number, end: number) => string) => {
    const { start, end } = getSelection();
    const next = fn(value, start, end);
    onChange(next);
    setTimeout(() => ref.current?.focus(), 0);
  };

  return (
    <Box>
      {label && (
        <Text size="sm" fw={600} mb="xs">
          {label}
        </Text>
      )}
      <Group gap="xs" mb="xs" wrap="wrap">
        <Button
          size="xs"
          variant="light"
          onClick={() => apply((t, s, e) => wrapOrInsert(t, s, e, "**"))}
        >
          Bold
        </Button>
        <Button
          size="xs"
          variant="light"
          onClick={() => apply((t, s, e) => wrapOrInsert(t, s, e, "*"))}
        >
          Italic
        </Button>
        <Button
          size="xs"
          variant="light"
          onClick={() => apply((t, s) => linePrefix(t, s, "## "))}
        >
          H2
        </Button>
        <Button
          size="xs"
          variant="light"
          onClick={() => apply((t, s) => linePrefix(t, s, "### "))}
        >
          H3
        </Button>
        <Button
          size="xs"
          variant="light"
          onClick={() => apply((t, s) => linePrefix(t, s, "- "))}
        >
          List
        </Button>
        <Button
          size="xs"
          variant="light"
          onClick={() => apply((t, s, e) => wrapOrInsert(t, s, e, "[", "](url)"))}
        >
          Link
        </Button>
      </Group>
      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        minRows={minRows}
        placeholder={placeholder}
        styles={{
          input: {
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "0.875rem",
            lineHeight: 1.5,
          },
        }}
      />
    </Box>
  );
}
