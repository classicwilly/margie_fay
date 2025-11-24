import { Type } from "@google/genai";

export const addTaskTool = {
  name: "addTask",
  parameters: {
    type: Type.OBJECT,
    properties: { taskDescription: { type: Type.STRING } },
    required: ["taskDescription"],
  },
};

export const addBrainDumpTool = {
  name: "addBrainDump",
  parameters: {
    type: Type.OBJECT,
    properties: { note: { type: Type.STRING } },
    required: ["note"],
  },
};

export const addCalendarEventTool = {
  name: "addCalendarEvent",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      date: { type: Type.STRING, description: "YYYY-MM-DD" },
      time: { type: Type.STRING, description: "HH:MM (24-hour)" },
    },
    required: ["title", "date", "time"],
  },
};

export const setMoodTool = {
  name: "setMood",
  parameters: {
    type: Type.OBJECT,
    properties: {
      mood: { type: Type.STRING, enum: ["Focused", "Calm", "Overwhelmed"] },
    },
    required: ["mood"],
  },
};

export const setEnergyTool = {
  name: "setEnergy",
  parameters: {
    type: Type.OBJECT,
    properties: {
      energy: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
    },
    required: ["energy"],
  },
};

export const logExpenseTool = {
  name: "logExpense",
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: { type: Type.NUMBER },
      description: { type: Type.STRING },
    },
    required: ["amount", "description"],
  },
};

export const markHabitAsDoneTool = {
  name: "markHabitAsDone",
  parameters: {
    type: Type.OBJECT,
    properties: { habitName: { type: Type.STRING } },
    required: ["habitName"],
  },
};

export const startPomodoroTool = {
  name: "startPomodoro",
  parameters: {
    type: Type.OBJECT,
    properties: {
      mode: { type: Type.STRING, enum: ["work", "shortBreak", "longBreak"] },
    },
    required: ["mode"],
  },
};

export const pausePomodoroTool = {
  name: "pausePomodoro",
  parameters: { type: Type.OBJECT, properties: {} },
};
export const resetPomodoroTool = {
  name: "resetPomodoro",
  parameters: { type: Type.OBJECT, properties: {} },
};

export const addQuickReferenceTool = {
  name: "addQuickReference",
  parameters: {
    type: Type.OBJECT,
    properties: { key: { type: Type.STRING }, value: { type: Type.STRING } },
    required: ["key", "value"],
  },
};

export const addKnowledgeEntryTool = {
  name: "addKnowledgeEntry",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.STRING },
      tags: {
        type: Type.STRING,
        description: "A comma-separated list of tags.",
      },
    },
    required: ["title", "content"],
  },
};

export const captureAndProcessThoughtTool = {
  name: "captureAndProcessThought",
  parameters: {
    type: Type.OBJECT,
    properties: { thought: { type: Type.STRING } },
    required: ["thought"],
  },
};

export const setActiveSopTool = {
  name: "setActiveSop",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sopName: { type: Type.STRING },
      isActive: { type: Type.BOOLEAN },
    },
    required: ["sopName", "isActive"],
  },
};

export const clearActiveSopsTool = {
  name: "clearActiveSops",
  parameters: { type: Type.OBJECT, properties: {} },
};

export const logDailyEssentialTool = {
  name: "logDailyEssential",
  parameters: {
    type: Type.OBJECT,
    properties: {
      item: {
        type: Type.STRING,
        enum: [
          "morning medication",
          "noon medication",
          "night medication",
          "water",
          "breakfast",
          "lunch",
          "dinner",
        ],
      },
    },
    required: ["item"],
  },
};

export const getSystemStateTool = {
  name: "getSystemState",
  parameters: { type: Type.OBJECT, properties: {} },
  description:
    "Retrieves the current state of the entire OS, including tasks, calendar, status, knowledge vault, etc., to answer user questions.",
};

export const manageDashboardModuleTool = {
  name: "manageDashboardModule",
  parameters: {
    type: Type.OBJECT,
    properties: {
      moduleName: { type: Type.STRING },
      action: { type: Type.STRING, enum: ["add", "remove"] },
    },
    required: ["moduleName", "action"],
  },
};

export const findKnowledgeForSopTool = {
  name: "findKnowledgeForSop",
  parameters: {
    type: Type.OBJECT,
    properties: {
      topic: {
        type: Type.STRING,
        description:
          "The topic to search for in the knowledge vault to synthesize an SOP.",
      },
    },
    required: ["topic"],
  },
};

export const deleteLastExpenseTool = {
  name: "deleteLastExpense",
  parameters: { type: Type.OBJECT, properties: {} },
  description: "Deletes the most recently logged financial expense.",
};

export const clearBrainDumpTool = {
  name: "clearBrainDump",
  parameters: { type: Type.OBJECT, properties: {} },
  description: "Clears all text from the Brain Dump module.",
};

export const navigateToViewTool = {
  name: "navigateToView",
  parameters: {
    type: Type.OBJECT,
    properties: {
      destinationName: {
        type: Type.STRING,
        description:
          "The name of the view or SOP to navigate to, e.g., 'Flight Protocol Vault', 'Weekly Review', or 'Life Maintenance Protocol'.",
      },
    },
    required: ["destinationName"],
  },
  description:
    "Navigates to a different screen, view, or specific SOP within the OS.",
};

export const addQuestTool = {
  name: "addQuest",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      steps: {
        type: Type.STRING,
        description: "A comma-separated list of steps for the quest.",
      },
      gemRewardId: {
        type: Type.STRING,
        enum: ["quest-bronze", "quest-silver", "quest-gold"],
      },
      assignedTo: { type: Type.STRING, enum: ["willow", "sebastian", "both"] },
    },
    required: ["title", "description", "steps", "gemRewardId", "assignedTo"],
  },
  description:
    "Creates a new quest for the children with a title, description, steps, a gem reward, and assignment.",
};

export const findKnowledgeEntryTool = {
  name: "findKnowledgeEntry",
  parameters: {
    type: Type.OBJECT,
    properties: {
      topic: {
        type: Type.STRING,
        description: "The topic or title of the knowledge entry to find.",
      },
    },
    required: ["topic"],
  },
  description:
    "Searches the Knowledge Vault for an entry on a specific topic and finds related entries.",
};

export const shutdownAndPlanTool = {
  name: "shutdownAndPlan",
  parameters: {
    type: Type.OBJECT,
    properties: {
      brainDumpContent: {
        type: Type.STRING,
        description:
          "Final thoughts for the day to be added to the brain dump.",
      },
      tomorrowTasks: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of critical task descriptions for the next day.",
      },
    },
    required: ["brainDumpContent", "tomorrowTasks"],
  },
  description:
    "Initiates the end-of-day shutdown protocol. It captures a final brain dump and schedules critical tasks for tomorrow.",
};

// NEW TOOLS
export const completeTaskTool = {
  name: "completeTask",
  parameters: {
    type: Type.OBJECT,
    properties: {
      taskName: {
        type: Type.STRING,
        description: "The title of the task to mark as complete.",
      },
    },
    required: ["taskName"],
  },
  description: "Marks a task as complete in the Task Matrix.",
};
export const listTasksTool = {
  name: "listTasks",
  parameters: {
    type: Type.OBJECT,
    properties: {
      filter: {
        type: Type.STRING,
        enum: ["today", "inbox", "all"],
        description:
          "The category of tasks to list. 'today' for tasks due today, 'inbox' for unscheduled tasks.",
      },
    },
    required: ["filter"],
  },
  description: "Lists tasks from the Task Matrix based on a filter.",
};
export const addHabitTool = {
  name: "addHabit",
  parameters: {
    type: Type.OBJECT,
    properties: { habitName: { type: Type.STRING } },
    required: ["habitName"],
  },
  description: "Adds a new habit to the Habit Streak Tracker.",
};
export const setBudgetTool = {
  name: "setBudget",
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        enum: [
          "Housing",
          "Utilities",
          "Groceries",
          "Transport",
          "Health",
          "Kids",
          "Personal",
          "Other",
          "School",
        ],
      },
      amount: { type: Type.NUMBER },
    },
    required: ["category", "amount"],
  },
  description: "Sets the monthly budget for a financial category.",
};
export const deleteQuestTool = {
  name: "deleteQuest",
  parameters: {
    type: Type.OBJECT,
    properties: { questName: { type: Type.STRING } },
    required: ["questName"],
  },
  description: "Deletes a quest by its title.",
};
export const awardGemTool = {
  name: "awardGem",
  parameters: {
    type: Type.OBJECT,
    properties: {
      persona: { type: Type.STRING, enum: ["willow", "sebastian"] },
      gemLabel: {
        type: Type.STRING,
        description: "The descriptive label of the gem, e.g., 'Brushed Hair'.",
      },
    },
    required: ["persona", "gemLabel"],
  },
  description: "Manually awards a specific gem to a child.",
};

export const allTools = [
  addTaskTool,
  addBrainDumpTool,
  addCalendarEventTool,
  setMoodTool,
  setEnergyTool,
  logExpenseTool,
  markHabitAsDoneTool,
  startPomodoroTool,
  pausePomodoroTool,
  resetPomodoroTool,
  addQuickReferenceTool,
  addKnowledgeEntryTool,
  captureAndProcessThoughtTool,
  setActiveSopTool,
  clearActiveSopsTool,
  logDailyEssentialTool,
  getSystemStateTool,
  manageDashboardModuleTool,
  findKnowledgeForSopTool,
  deleteLastExpenseTool,
  clearBrainDumpTool,
  navigateToViewTool,
  addQuestTool,
  findKnowledgeEntryTool,
  shutdownAndPlanTool,
  // NEW
  completeTaskTool,
  listTasksTool,
  addHabitTool,
  setBudgetTool,
  deleteQuestTool,
  awardGemTool,
];
