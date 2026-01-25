import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./BpmChart.css";
import type { Exercise } from "../../types";

interface BpmChartProps {
  exercise: Exercise | null;
}

export default function BpmChart({ exercise }: BpmChartProps) {
  const chartData = useMemo(() => {
    if (!exercise || !exercise.history || exercise.history.length === 0) {
      return [];
    }
    return exercise.history.map((h, index) => ({
      bpm: h.bpm,
      id: `${h.date}-${index}`,
      date: new Date(h.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
    }));
  }, [exercise]);

  if (!exercise) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Evolução de Velocidade</h3>
        <p
          style={{ color: "#64748b", textAlign: "center", fontSize: "0.8rem" }}
        >
          Selecione um exercício.
        </p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Evolução de Velocidade</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={150}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            onMouseMove={(e) => {
              if (!e) return;
            }}
          >
            <XAxis dataKey="id" hide={true} />
            <YAxis domain={["dataMin", "dataMax"]} hide={true} />
            <Tooltip
              labelFormatter={(_, payload) => {
                if (payload && payload.length > 0) {
                  return payload[0].payload.date;
                }
                return "";
              }}
              shared={false}
              contentStyle={{
                backgroundColor: "#334155",
                border: "none",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
              itemStyle={{ color: "#06B6D4" }}
              labelStyle={{ color: "#cbd5e1" }}
              cursor={false}
              trigger="hover"
            />
            <Line
              type="monotone"
              dataKey="bpm"
              stroke="#06B6D4"
              strokeWidth={3}
              dot={{ r: 4, fill: "white" }}
              activeDot={{
                r: 6,
                fill: "white",
                strokeWidth: 0,
                onMouseOver: (e) => e,
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p
          style={{ color: "#64748b", textAlign: "center", fontSize: "0.8rem" }}
        >
          Sem histórico de BPM para exibir.
        </p>
      )}
    </div>
  );
}
