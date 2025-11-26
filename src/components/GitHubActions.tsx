import { useState } from "react";
import { useAppState } from "@contexts/AppStateContext";
import { githubService } from "../services/githubService";

export default function GitHubActions() {
  const { dispatch } = useAppState() as any;
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [title, setTitle] = useState("");
  const [head, setHead] = useState("");
  const [base, setBase] = useState("main");

  const onCreatePR = async () => {
    try {
      const pr = await githubService.createPR(
        owner,
        repo,
        title,
        head,
        base,
        "Created from Wonky",
      );
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `gh-pr-${Date.now()}`,
          emoji: "✨",
          message: `PR created: #${pr.number} ${pr.title}`,
        },
      });
    } catch (e) {
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `gh-pr-err-${Date.now()}`,
          emoji: "⚠️",
          message: `PR failed: ${(e as any).message || "unknown"}`,
        },
      });
    }
  };

  const onValidate = async () => {
    try {
      await githubService.validateToken();
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `gh-validate-${Date.now()}`,
          emoji: "✅",
          message: "GitHub token valid",
        },
      });
    } catch (e) {
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `gh-validate-err-${Date.now()}`,
          emoji: "⚠️",
          message: "GitHub token invalid",
        },
      });
    }
  };

  const onRevoke = async () => {
    try {
      await githubService.revokeToken();
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `gh-revoke-${Date.now()}`,
          emoji: "🗑️",
          message: "GitHub session cleared",
        },
      });
    } catch (e) {
      dispatch({
        type: "ADD_TOAST",
        payload: {
          id: `gh-revoke-err-${Date.now()}`,
          emoji: "⚠️",
          message: "Failed to revoke token",
        },
      });
    }
  };

  return (
    <div className="card-base p-3">
      <h4 className="text-md font-semibold">GitHub Actions</h4>
      <div className="flex gap-2 mt-3">
        <input
          placeholder="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="input"
        />
        <input
          placeholder="repo"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          className="input"
        />
      </div>
      <div className="flex gap-2 mt-2">
        <input
          placeholder="PR title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input flex-1"
        />
        <input
          placeholder="head"
          value={head}
          onChange={(e) => setHead(e.target.value)}
          className="input"
        />
        <input
          placeholder="base (default main)"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="input w-28"
        />
        <button
          onClick={onCreatePR}
          className="px-3 py-1 bg-accent-blue text-white rounded"
        >
          Create PR
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onValidate}
          className="px-3 py-1 bg-surface-600 rounded"
        >
          Validate Token
        </button>
        <button
          onClick={onRevoke}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Revoke Token
        </button>
      </div>
    </div>
  );
}
