import React, { useMemo } from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "../ContentCard.js";

const toYMD = (date) => date.toISOString().split("T")[0];

const SpendingVelocityChart = () => {
  const { appState } = useAppState();
  const { expenses } = appState;

  const { dailyTotals, maxDailyTotal, total } = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29); // 30 days including today

    const totals: Record<string, number> = {};

    for (let i = 0; i < 30; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      totals[toYMD(d)] = 0;
    }

    let total = 0;
    expenses.forEach((exp) => {
      const expDate = new Date(exp.date);
      if (expDate >= startDate && expDate <= endDate) {
        const dateStr = toYMD(expDate);
        totals[dateStr] = (totals[dateStr] || 0) + exp.amount;
        total += exp.amount;
      }
    });

    const dailyTotals = Object.entries(totals).map(([date, total]) => ({
      date,
      total,
    }));
    const maxDailyTotal = Math.max(...dailyTotals.map((d) => d.total), 0);

    return { dailyTotals, maxDailyTotal, total };
  }, [expenses]);

  return (
    <ContentCard title="Spending Velocity (Last 30 Days)">
      <p className="text-sm text-gray-400 mb-4">
        Total spent in this period:{" "}
        <span className="font-bold text-accent-blue">${total.toFixed(2)}</span>
      </p>
      <div className="flex gap-1 h-40 items-end">
        {dailyTotals.map(({ date, total }) => {
          const height = maxDailyTotal > 0 ? (total / maxDailyTotal) * 100 : 0;
          return (
            <div key={date} className="flex-1 group relative">
              <div
                className="w-full bg-accent-blue rounded-t-sm hover:bg-accent-teal transition-colors"
                ref={(el) => {
                  if (el) {
                    el.style.height = `${height}%`;
                  }
                }}
              ></div>
              <div className="absolute bottom-full mb-2 w-max left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                {date}: ${total.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>-30 days</span>
        <span>Today</span>
      </div>
    </ContentCard>
  );
};

export default SpendingVelocityChart;
