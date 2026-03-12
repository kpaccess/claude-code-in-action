import { test, expect, vi, beforeEach } from "vitest";
import { buildFileManagerTool } from "@/lib/tools/file-manager";

const mockFileSystem = {
  rename: vi.fn(),
  deleteFile: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

// --- rename command ---

test("rename command calls fileSystem.rename and returns success", async () => {
  mockFileSystem.rename.mockReturnValue(true);
  const tool = buildFileManagerTool(mockFileSystem as any);

  const result = await tool.execute({
    command: "rename",
    path: "/old.jsx",
    new_path: "/new.jsx",
  });

  expect(mockFileSystem.rename).toHaveBeenCalledWith("/old.jsx", "/new.jsx");
  expect(result).toEqual({
    success: true,
    message: "Successfully renamed /old.jsx to /new.jsx",
  });
});

test("rename command returns error when fileSystem.rename fails", async () => {
  mockFileSystem.rename.mockReturnValue(false);
  const tool = buildFileManagerTool(mockFileSystem as any);

  const result = await tool.execute({
    command: "rename",
    path: "/old.jsx",
    new_path: "/new.jsx",
  });

  expect(result).toEqual({
    success: false,
    error: "Failed to rename /old.jsx to /new.jsx",
  });
});

test("rename command returns error when new_path is omitted", async () => {
  const tool = buildFileManagerTool(mockFileSystem as any);

  const result = await tool.execute({ command: "rename", path: "/old.jsx" });

  expect(mockFileSystem.rename).not.toHaveBeenCalled();
  expect(result).toEqual({
    success: false,
    error: "new_path is required for rename command",
  });
});

// --- delete command ---

test("delete command calls fileSystem.deleteFile and returns success", async () => {
  mockFileSystem.deleteFile.mockReturnValue(true);
  const tool = buildFileManagerTool(mockFileSystem as any);

  const result = await tool.execute({ command: "delete", path: "/App.jsx" });

  expect(mockFileSystem.deleteFile).toHaveBeenCalledWith("/App.jsx");
  expect(result).toEqual({
    success: true,
    message: "Successfully deleted /App.jsx",
  });
});

test("delete command returns error when fileSystem.deleteFile fails", async () => {
  mockFileSystem.deleteFile.mockReturnValue(false);
  const tool = buildFileManagerTool(mockFileSystem as any);

  const result = await tool.execute({ command: "delete", path: "/missing.jsx" });

  expect(result).toEqual({
    success: false,
    error: "Failed to delete /missing.jsx",
  });
});

// --- tool shape ---

test("buildFileManagerTool returns a tool with description and parameters", () => {
  const tool = buildFileManagerTool(mockFileSystem as any);
  expect(tool).toHaveProperty("description");
  expect(tool).toHaveProperty("parameters");
  expect(tool).toHaveProperty("execute");
});
