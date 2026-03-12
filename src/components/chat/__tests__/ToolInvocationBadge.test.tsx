import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state = "result",
  result: unknown = "Success"
) {
  return { toolName, args, state, result };
}

test("shows 'Creating file' for str_replace_editor create command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "create",
        path: "/src/App.tsx",
      })}
    />
  );
  expect(screen.getByText("Creating file: App.tsx")).toBeDefined();
});

test("shows 'Editing file' for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "str_replace",
        path: "/src/components/Button.tsx",
      })}
    />
  );
  expect(screen.getByText("Editing file: Button.tsx")).toBeDefined();
});

test("shows 'Editing file' for str_replace_editor insert command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "insert",
        path: "/src/index.ts",
      })}
    />
  );
  expect(screen.getByText("Editing file: index.ts")).toBeDefined();
});

test("shows 'Reading file' for str_replace_editor view command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "view",
        path: "/src/App.tsx",
      })}
    />
  );
  expect(screen.getByText("Reading file: App.tsx")).toBeDefined();
});

test("shows 'Deleting file' for file_manager delete command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("file_manager", {
        command: "delete",
        path: "/src/old.tsx",
      })}
    />
  );
  expect(screen.getByText("Deleting file: old.tsx")).toBeDefined();
});

test("shows 'Renaming file' for file_manager rename command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("file_manager", {
        command: "rename",
        path: "/src/old.tsx",
        new_path: "/src/new.tsx",
      })}
    />
  );
  expect(screen.getByText("Renaming file: old.tsx")).toBeDefined();
});

test("falls back to raw tool name for unknown tool", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("some_unknown_tool", {})}
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});

test("falls back to raw tool name when args are empty (streaming partial-call)", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {})}
    />
  );
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("shows spinner when in-progress (state: call)", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation(
        "str_replace_editor",
        { command: "create", path: "/src/App.tsx" },
        "call",
        undefined
      )}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows green dot when completed (state: result with result)", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "create",
        path: "/src/App.tsx",
      })}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
