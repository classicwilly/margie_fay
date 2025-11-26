import { describe, it, expect } from "vitest";
import { userReducer } from "../src/contexts/userReducer";
import { defaultUserState } from "../defaultStates";

describe("userReducer housekeeping actions", () => {
  it("CLEAR_INBOX should mark idi tasks done and archive knowledge", () => {
    const base = {
      ...defaultUserState,
      tasks: [
        {
          id: "t1",
          title: "Inbox task",
          status: "todo",
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
        {
          id: "t2",
          title: "Project task",
          status: "todo",
          createdAt: new Date().toISOString(),
          completedAt: null,
          projectId: "p1",
        },
      ],
      knowledgeVaultEntries: [
        { id: "k1", title: "Note", content: "n", tags: [], isArchived: false },
      ],
      brainDumpText: "stuff",
    } as any;
    const next = userReducer(base, { type: "CLEAR_INBOX" } as any);
    expect(next.tasks.find((t: any) => t.id === "t1").status).toBe("done");
    expect(
      next.tasks.find((t: any) => t.id === "t1").completedAt,
    ).not.toBeNull();
    expect(next.tasks.find((t: any) => t.id === "t2").status).toBe("todo");
    expect(next.knowledgeVaultEntries[0].isArchived).toBeTruthy();
    expect(next.brainDumpText).toBe("");
  });

  it("ARCHIVE_OLD_ENTRIES should archive old knowledge and flag old completed tasks", () => {
    const oldDate = new Date(
      Date.now() - 100 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const recentDate = new Date().toISOString();
    const base = {
      ...defaultUserState,
      tasks: [
        {
          id: "t1",
          title: "old done",
          status: "done",
          createdAt: oldDate,
          completedAt: oldDate,
        },
        {
          id: "t2",
          title: "recent done",
          status: "done",
          createdAt: recentDate,
          completedAt: recentDate,
        },
      ],
      knowledgeVaultEntries: [
        {
          id: "k1",
          title: "old note",
          content: "n",
          tags: [],
          createdAt: oldDate,
          isArchived: false,
        },
        {
          id: "k2",
          title: "recent note",
          content: "n",
          tags: [],
          createdAt: recentDate,
          isArchived: false,
        },
      ],
    } as any;
    const next = userReducer(base, {
      type: "ARCHIVE_OLD_ENTRIES",
      payload: { days: 30 },
    } as any);
    expect(
      next.knowledgeVaultEntries.find((e: any) => e.id === "k1").isArchived,
    ).toBeTruthy();
    expect(
      next.knowledgeVaultEntries.find((e: any) => e.id === "k2").isArchived,
    ).toBeFalsy();
    expect(
      next.tasks.find((t: any) => t.id === "t1").archivedByHousekeeping,
    ).toBeTruthy();
    expect(
      next.tasks.find((t: any) => t.id === "t2").archivedByHousekeeping,
    ).toBeUndefined();
  });

  it("RESTORE_ARCHIVED_TASKS should restore tasks and knowledge archived by last housekeeping", () => {
    const oldDate = new Date(
      Date.now() - 100 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const base = {
      ...defaultUserState,
      tasks: [
        {
          id: "t1",
          title: "old done",
          status: "done",
          createdAt: oldDate,
          completedAt: oldDate,
        },
      ],
      knowledgeVaultEntries: [
        {
          id: "k1",
          title: "old note",
          content: "n",
          tags: [],
          createdAt: oldDate,
          isArchived: true,
        },
      ],
      lastHousekeepingArchive: { tasks: ["t1"], knowledge: ["k1"] },
    } as any;
    const archived = userReducer(base, {
      type: "RESTORE_ARCHIVED_TASKS",
    } as any);
    expect(
      archived.tasks.find((t: any) => t.id === "t1").archivedByHousekeeping,
    ).toBeUndefined();
    expect(
      archived.knowledgeVaultEntries.find((e: any) => e.id === "k1").isArchived,
    ).toBeFalsy();
    expect(archived.lastHousekeepingArchive).toBeNull();
  });
});
