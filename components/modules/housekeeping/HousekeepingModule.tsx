import { useMemo, useState, useEffect } from "react";
import Modal from "../../Modal";
import ContentCard from "../../ContentCard";
import { Button } from "../../Button";
import { useAppState } from "@contexts/AppStateContext";
import { dualTestId } from "@utils/dualTestId";

const HousekeepingModule = () => {
  const { appState, dispatch } = useAppState();
  const inboxCount =
    (appState?.tasks || []).length +
    (appState?.knowledgeVaultEntries || []).length;

  const unscheduledTasks = useMemo(
    () =>
      (appState?.tasks || []).filter(
        (t: any) => !t.projectId && t.status !== "done",
      ),
    [appState?.tasks],
  );
  const [showGuidedClear, setShowGuidedClear] = useState(false);
  const [guidedIndex, setGuidedIndex] = useState(0);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [archiveDays, setArchiveDays] = useState(30);
  // Grandpa Wallet: use localStorage to keep a small coin balance for tips and donations
  const [coins, setCoins] = useState<number>(() => {
    try {
      if (typeof window === "undefined") {
        return 0;
      }
      const v = window.localStorage.getItem("wonky-coin-wallet");
      return v ? Number(v) : 0;
    } catch {
      return 0;
    }
  });
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(1);
  const [showStartDay, setShowStartDay] = useState(false);
  const startSteps = [
    { id: "water", title: "Drink a glass of water (250-500ml)", done: false },
    {
      id: "meds",
      title: "Take medication if prescribed (check your pill organizer)",
      done: false,
    },
    {
      id: "capture",
      title: "Quick Capture: note the top 3 tasks in Inbox",
      done: false,
    },
  ];
  const [startStepIndex, setStartStepIndex] = useState(0);
  const NUDGES = [
    "Small wins compound: do 1 small thing & repeat.",
    "Try a 10-minute focus block — set a timer & defend it.",
    "Bubble Shield Reminder: noise-canceling headphones help limit distraction while working.",
  ];
  const [nudgeIndex, setNudgeIndex] = useState(0);

  const handleClearInbox = () => {
    // Dispatch an action to clear ephemeral items — this is a suggestion; devs should wire actual handler
    dispatch({ type: "CLEAR_INBOX" } as any);
    // Also trigger module-level housekeeping run so the module's reducer can record lastRun
    dispatch({ type: "HOUSEKEEPING_RUN" } as any);
  };

  const handleArchiveOld = () => {
    // Open confirm modal, final action will call ARCHIVE_OLD_ENTRIES
    setShowArchiveConfirm(true);
  };

  const confirmArchiveOld = () => {
    dispatch({
      type: "ARCHIVE_OLD_ENTRIES",
      payload: { days: archiveDays },
    } as any);
    dispatch({ type: "HOUSEKEEPING_RUN" } as any);
    // show undo toast
    dispatch({
      type: "ADD_TOAST",
      payload: {
        id: `hk-archive-${Date.now()}`,
        emoji: "🗂️",
        message: `Archived items older than ${archiveDays} days`,
        actionLabel: "Undo",
        actionType: "RESTORE_ARCHIVED_TASKS",
        actionPayload: null,
      } as any,
    } as any);
    setShowArchiveConfirm(false);
  };
  const lastRun = ((appState?.moduleStates as any) || {})["housekeeping"]
    ?.lastRun;

  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      window.localStorage.setItem("wonky-coin-wallet", String(coins));
    } catch (e) {
      /* ignore */
    }
  }, [coins]);

  const addCoins = (val = 1) => {
    setCoins((c) => Math.max(0, Math.round((c + val) * 100) / 100));
    dispatch({
      type: "ADD_TOAST",
      payload: {
        id: `coin-add-${Date.now()}`,
        emoji: "🎟️",
        message: `Added ${val} coin${val > 1 ? "s" : ""}`,
      },
    } as any);
  };

  const spendCoins = (amt: number) => {
    setCoins((c) => Math.max(0, Math.round((c - amt) * 100) / 100));
  };

  const handleOpenDonate = () => setShowDonateModal(true);
  const handleDonate = async (amt: number) => {
    // For now: simulate donation and redirect to a placeholder donate page
    try {
      if (coins < amt) {
        dispatch({
          type: "ADD_TOAST",
          payload: {
            id: `donate-funds-${Date.now()}`,
            emoji: "💸",
            message: "Not enough coins — add more to your wallet",
          },
        } as any);
        return;
      }
      spendCoins(amt);
      setShowDonateModal(false);
      // real implementation should open a secure hosted checkout (Stripe / PayPal)
      window.open(`https://example.com/donate?amt=${amt}`, "_blank");
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `donate-${Date.now()}`,
          emoji: "💖",
          message: `Thanks for donating $${amt}!`,
        },
      } as any);
    } catch (e) {
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `donate-err-${Date.now()}`,
          emoji: "⚠️",
          message: "Donation failed (demo). Try again.",
        },
      } as any);
    }
  };

  const resetStartFlow = () => {
    setStartStepIndex(0);
  };

  const advanceStartFlow = () => {
    if (startStepIndex + 1 >= startSteps.length) {
      setShowStartDay(false);
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `start-day-${Date.now()}`,
          emoji: "🚀",
          message: "Good job! You're set for the day",
        },
      } as any);
      setStartStepIndex(0);
      // Guide user into the garden with a friendly nudge
      dispatch({ type: "SET_VIEW", payload: "garden-view" } as any);
    } else {
      setStartStepIndex((i) => i + 1);
    }
  };

  const nextNudge = () => setNudgeIndex((i) => (i + 1) % NUDGES.length);
  const showNudgeAction = () => {
    dispatch({
      type: "ADD_TOAST",
      payload: {
        id: `nudge-${Date.now()}`,
        emoji: "💬",
        message: NUDGES[nudgeIndex],
      },
    } as any);
  };

  const unlockAi = () => {
    const cost = 5;
    if (coins >= cost) {
      spendCoins(cost);
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("wonky-ai-unlocked", "true");
        }
      } catch (e) {}
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `unlockAi-${Date.now()}`,
          emoji: "🤖",
          message: "AI features unlocked — enjoy!",
        },
      } as any);
    } else {
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `unlockAi-funds-${Date.now()}`,
          emoji: "💸",
          message: `Need $${cost} in coins to unlock AI features`,
        },
      } as any);
    }
  };

  return (
    <ContentCard title="🏡 Housekeeping">
      <p className="text-sm text-text-light">
        Simple housekeeping tools — clear small items, archive old stuff, and
        keep your workspace tidy.
      </p>
      <div className="space-y-3 mt-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Inbox & Vault</div>
            <div className="text-xs text-gray-400">
              {inboxCount} items in your local inbox / knowledge vault
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setShowGuidedClear(true)}
              variant="secondary"
              size="sm"
            >
              Grandpa suggests: Clear 3 small items
            </Button>
            <Button onClick={handleClearInbox} variant="secondary" size="sm">
              Clear Inbox
            </Button>
            <Button onClick={handleArchiveOld} variant="primary" size="sm">
              Archive Old
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-3">
          <div className="font-semibold">Digital Files</div>
          <div className="text-xs text-gray-400">
            Run local cleanup scripts to find large files and duplicates.
          </div>
          <div className="mt-2 flex gap-2">
            <Button
              onClick={() =>
                window.open("/docs/HOUSEKEEPING_REPORT.md", "_blank")
              }
              variant="secondary"
              size="sm"
            >
              View Report
            </Button>
            <Button
              onClick={() => window.open("about:blank", "_self")}
              variant="primary"
              size="sm"
            >
              Run Cleanup
            </Button>
          </div>
        </div>
      </div>

      {/* Grandpa Coin Wallet */}
      <div className="border-t border-gray-700 pt-3 mt-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Grandpa's Coin Wallet</div>
            <div className="text-xs text-gray-400">
              Save spare change and tip to support the app. No ads, no pressure.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="bg-yellow-400 rounded-full px-3 py-1 font-bold text-black flex items-center gap-2"
              {...dualTestId("coin-balance", "workshop-coin-balance")}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <span aria-hidden="true" className="text-lg">
                🪙
              </span>
              <span className="sr-only">Coin balance: </span>
              <span>{coins.toFixed(2)}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addCoins(0.25)}
              {...dualTestId("add-coin-025", "workshop-add-coin-025")}
            >
              Add $0.25
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addCoins(1)}
              {...dualTestId("add-coin", "workshop-add-coin")}
            >
              Add $1
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenDonate}
              {...dualTestId("open-donate-modal", "workshop-open-donate-modal")}
              aria-describedby="donateModalDesc"
            >
              Donate
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={unlockAi}
              {...dualTestId("unlock-ai", "workshop-unlock-ai")}
              aria-describedby="unlockAiCost"
            >
              Unlock AI ($5)
            </Button>
            <span id="unlockAiCost" className="sr-only">
              Unlocking AI costs 5 coins
            </span>
          </div>
        </div>
      </div>

      {/* Start of Day Storyboard */}
      <div className="border-t border-gray-700 pt-3 mt-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">
              Start Your Day — Grandpa's Routine
            </div>
            <div className="text-xs text-gray-400">
              Quick flow to start your morning with small, reliable steps.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowStartDay(true)}
              {...dualTestId("start-day-open", "workshop-start-day-open")}
            >
              Start My Day
            </Button>
          </div>
        </div>
      </div>

      {/* Nudge / App Talks */}
      <div className="border-t border-gray-700 pt-3 mt-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💬</div>
          <div className="flex-1">
            <div className="font-semibold">App Nudge</div>
            <div className="text-xs text-gray-400">{NUDGES[nudgeIndex]}</div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="secondary" onClick={nextNudge}>
                Next
              </Button>
              <Button size="sm" variant="primary" onClick={showNudgeAction}>
                Show as Toast
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence & Resources */}
      <div className="border-t border-gray-700 pt-3 mt-3">
        <div className="font-semibold">Evidence & Research</div>
        <div className="text-xs text-gray-400 mt-2">
          We value evidence-based guidance for neurodivergent users. Here are
          reputable resources:
        </div>
        <ul className="mt-2 space-y-2 text-xs">
          <li>
            <a
              className="text-accent-blue underline"
              href="https://www.cdc.gov/ncbddd/adhd/guidelines.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              CDC - ADHD Guidelines
            </a>{" "}
            — Practical guidance for executive function & routines.
          </li>
          <li>
            <a
              className="text-accent-blue underline"
              href="https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NHS - ADHD and daily routine
            </a>{" "}
            — Structuring your day for better outcomes.
          </li>
          <li>
            <a
              className="text-accent-blue underline"
              href="https://chadd.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CHADD — ADHD support
            </a>{" "}
            — Advocacy and practical strategies for adults & kids.
          </li>
          <li>
            <a
              className="text-accent-blue underline"
              href="https://www.ncbi.nlm.nih.gov/pmc/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIH / PubMed — Research articles
            </a>{" "}
            — Academic research about behavior change, reminders, and executive
            function supports.
          </li>
        </ul>
      </div>
      {lastRun && (
        <div className="mt-3 text-xs text-gray-400">
          Last run: {new Date(lastRun).toLocaleString()}
        </div>
      )}

      {/* Donate Modal */}
      {showDonateModal && (
        <Modal
          isOpen={showDonateModal}
          onClose={() => setShowDonateModal(false)}
          ariaLabelledBy="donateModalTitle"
        >
          <h3 id="donateModalTitle" className="text-xl font-bold mb-2">
            Donate & Support
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            If you like Wonky Sprout OS and want to support its development (no
            ads, just love), consider tipping a little. This demo uses a
            placeholder external link for actual payments.
          </p>
          <div className="flex gap-2 mb-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setDonationAmount(0.5)}
            >
              Donate $0.50
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setDonationAmount(1)}
            >
              Donate $1
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setDonationAmount(2)}
            >
              Donate $2
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="donation-amount" className="text-sm text-gray-200">
              Amount:{" "}
            </label>
            <input
              id="donation-amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(Number(e.target.value) || 0)}
              type="number"
              min={0.01}
              step={0.01}
              className="p-2 bg-gray-800 border rounded w-24"
            />
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleDonate(donationAmount)}
            >
              Donate
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowDonateModal(false)}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {/* Start Day / Storyboard Modal */}
      {showStartDay && (
        <Modal
          isOpen={showStartDay}
          onClose={() => setShowStartDay(false)}
          ariaLabelledBy="startDayTitle"
        >
          <h3 id="startDayTitle" className="text-xl font-bold mb-2">
            Start Your Day
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            A gentle, structured flow to help you start strong. We'll guide you
            through a few small steps.
          </p>
          <div className="space-y-3">
            <div className="card-base p-3">
              <div className="font-semibold">
                Step {startStepIndex + 1} / {startSteps.length}
              </div>
              <div className="text-sm text-gray-300 mt-2">
                {startSteps[startStepIndex].title}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={advanceStartFlow}
                  {...dualTestId(
                    `start-step-${startStepIndex}`,
                    `workshop-start-step-${startStepIndex}`,
                  )}
                  data-step-index={startStepIndex}
                >
                  Mark Done
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowStartDay(false);
                    resetStartFlow();
                  }}
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Guided Clear Modal */}
      {showGuidedClear && (
        <Modal
          isOpen={showGuidedClear}
          onClose={() => setShowGuidedClear(false)}
          ariaLabelledBy="guidedClearTitle"
        >
          <h3 id="guidedClearTitle" className="text-xl font-bold mb-2">
            Grandpa's 3 Small Steps
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Let's finish three small items to reduce overwhelm.
          </p>
          <div className="space-y-3">
            {unscheduledTasks
              .slice(guidedIndex, guidedIndex + 1)
              .map((task: any) => (
                <div key={task.id} className="card-base p-3">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-xs text-gray-400">
                    {task.priority || "Medium"} • Created:{" "}
                    {new Date(
                      task.createdAt || Date.now(),
                    ).toLocaleDateString()}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      onClick={() => {
                        dispatch({
                          type: "UPDATE_TASK",
                          payload: {
                            id: task.id,
                            status: "done",
                            completedAt: new Date().toISOString(),
                          },
                        });
                        setGuidedIndex((i) => i + 1);
                        if (
                          guidedIndex + 1 >=
                          Math.min(3, unscheduledTasks.length)
                        ) {
                          setShowGuidedClear(false);
                          dispatch({
                            type: "ADD_TOAST",
                            payload: {
                              id: `hk-clear-${Date.now()}`,
                              emoji: "✅",
                              message: "Cleared a few items — nice!",
                            },
                          } as any);
                        }
                      }}
                      variant="primary"
                      size="sm"
                    >
                      Mark Done
                    </Button>
                    <Button
                      onClick={() => {
                        setGuidedIndex((i) => i + 1);
                        if (
                          guidedIndex + 1 >=
                          Math.min(3, unscheduledTasks.length)
                        ) {
                          setShowGuidedClear(false);
                        }
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              ))}
            {unscheduledTasks.length === 0 && (
              <div className="p-3 text-sm text-gray-400">
                No small unscheduled tasks found. Try reviewing your Inbox.
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <Modal
          isOpen={showArchiveConfirm}
          onClose={() => setShowArchiveConfirm(false)}
          ariaLabelledBy="archiveConfirmTitle"
        >
          <h3 id="archiveConfirmTitle" className="text-xl font-bold mb-2">
            Archive Old Items
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            This will archive knowledge and completed tasks older than{" "}
            <strong>{archiveDays}</strong> days. You can undo this with the Undo
            toast.
          </p>
          <div className="flex gap-2 items-center">
            <label htmlFor="archiveDays" className="text-sm text-gray-200 mr-3">
              Days
            </label>
            <input
              id="archiveDays"
              aria-label="archive-days"
              type="number"
              min={1}
              value={archiveDays}
              onChange={(e) => setArchiveDays(Number(e.target.value) || 1)}
              className="p-2 bg-gray-800 border rounded w-24"
            />
            <Button onClick={confirmArchiveOld} variant="primary" size="sm">
              Confirm & Archive
            </Button>
            <Button
              onClick={() => setShowArchiveConfirm(false)}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </ContentCard>
  );
};

export default HousekeepingModule;
