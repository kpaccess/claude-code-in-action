import { test, expect, vi, beforeEach } from "vitest";
import { buildStrReplaceTool } from "@/lib/tools/str-replace";

const mockFileSystem = {
  viewFile: vi.fn(),
  createFileWithParents: vi.fn(),
  replaceInFile: vi.fn(),
  insertInFile: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

// --- view command ---

test("view command calls viewFile with path", async () => {
  mockFileSystem.viewFile.mockReturnValue("file contents");
  const tool = buildStrReplaceTool(mockFileSystem as any);

  const result = await tool.execute({ command: "view", path: "/App.jsx" });

  expect(mockFileSystem.viewFile).toHaveBeenCalledWith("/App.jsx", undefined);
  expect(result).toBe("file contents");
});

test("view command passes view_range to viewFile", async () => {
  mockFileSystem.viewFile.mockReturnValue("lines 1-5");
  const tool = buildStrReplaceTool(mockFileSystem as any);

  await tool.execute({ command: "view", path: "/App.jsx", view_range: [1, 5] });

  expect(mockFileSystem.viewFile).toHaveBeenCalledWith("/App.jsx", [1, 5]);
});

// --- create command ---

test("create command calls createFileWithParents with path and content", async () => {
  mockFileSystem.createFileWithParents.mockReturnValue("Created /App.jsx");
  const tool = buildStrReplaceTool(mockFileSystem as any);

  const result = await tool.execute({
    command: "create",
    path: "/App.jsx",
    file_text: "export default function App() {}",
  });

  expect(mockFileSystem.createFileWithParents).toHaveBeenCalledWith(
    "/App.jsx",
    "export default function App() {}"
  );
  expect(result).toBe("Created /App.jsx");
});

test("create command defaults to empty string when file_text is omitted", async () => {
  mockFileSystem.createFileWithParents.mockReturnValue("Created /empty.js");
  const tool = buildStrReplaceTool(mockFileSystem as any);

  await tool.execute({ command: "create", path: "/empty.js" });

  expect(mockFileSystem.createFileWithParents).toHaveBeenCalledWith("/empty.js", "");
});

// --- str_replace command ---

test("str_replace command calls replaceInFile with path, old_str, and new_str", async () => {
  mockFileSystem.replaceInFile.mockReturnValue("Replaced successfully");
  const tool = buildStrReplaceTool(mockFileSystem as any);

  const result = await tool.execute({
    command: "str_replace",
    path: "/App.jsx",
    old_str: "Hello",
    new_str: "World",
  });

  expect(mockFileSystem.replaceInFile).toHaveBeenCalledWith(
    "/App.jsx",
    "Hello",
    "World"
  );
  expect(result).toBe("Replaced successfully");
});

test("str_replace command defaults old_str and new_str to empty strings when omitted", async () => {
  mockFileSystem.replaceInFile.mockReturnValue("ok");
  const tool = buildStrReplaceTool(mockFileSystem as any);

  await tool.execute({ command: "str_replace", path: "/App.jsx" });

  expect(mockFileSystem.replaceInFile).toHaveBeenCalledWith("/App.jsx", "", "");
});

// --- insert command ---

test("insert command calls insertInFile with path, line, and new_str", async () => {
  mockFileSystem.insertInFile.mockReturnValue("Inserted at line 3");
  const tool = buildStrReplaceTool(mockFileSystem as any);

  const result = await tool.execute({
    command: "insert",
    path: "/App.jsx",
    insert_line: 3,
    new_str: "const x = 1;",
  });

  expect(mockFileSystem.insertInFile).toHaveBeenCalledWith(
    "/App.jsx",
    3,
    "const x = 1;"
  );
  expect(result).toBe("Inserted at line 3");
});

test("insert command defaults insert_line to 0 and new_str to empty string when omitted", async () => {
  mockFileSystem.insertInFile.mockReturnValue("ok");
  const tool = buildStrReplaceTool(mockFileSystem as any);

  await tool.execute({ command: "insert", path: "/App.jsx" });

  expect(mockFileSystem.insertInFile).toHaveBeenCalledWith("/App.jsx", 0, "");
});

// --- undo_edit command ---

test("undo_edit command returns unsupported error message", async () => {
  const tool = buildStrReplaceTool(mockFileSystem as any);

  const result = await tool.execute({ command: "undo_edit", path: "/App.jsx" });

  expect(result).toContain("undo_edit command is not supported");
  expect(mockFileSystem.viewFile).not.toHaveBeenCalled();
  expect(mockFileSystem.replaceInFile).not.toHaveBeenCalled();
  expect(mockFileSystem.insertInFile).not.toHaveBeenCalled();
});

// --- tool shape ---

test("buildStrReplaceTool returns tool with correct id", () => {
  const tool = buildStrReplaceTool(mockFileSystem as any);
  expect(tool.id).toBe("str_replace_editor");
});
