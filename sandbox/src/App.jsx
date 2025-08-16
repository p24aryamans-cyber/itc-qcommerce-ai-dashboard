import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer,
         LineChart, Line, XAxis, YAxis, Tooltip as LineTooltip } from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B"];

function Kpi({ label, value, sub }) {
  return (
    <div className="card">
      <div style={{ fontSize:12, color:"#64748b" }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:700 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:"#94a3b8" }}>{sub}</div>}
    </div>
  );
}

export default function App() {
  const [rows, setRows] = useState([]);
  const [trend, setTrend] = useState([]);
  const [kpi, setKpi] = useState({});

  useEffect(() => {
    // Minimal mock to validate build
    const platforms = ["Blinkit", "Swiggy Instamart", "Zepto"];
    const data = Array.from({ length: 60 }).map((_, i) => {
      const spend = 1000 + Math.random() * 4000;
      const clicks = Math.random() * 200 + 10;
      const revenue = clicks * (30 + Math.random() * 120);
      return {
        id: i,
        platform: platforms[i % 3],
        sku: `SKU-${i + 1}`,
        spend,
        revenue,
        roas: revenue / spend,
        ctr: (clicks / (spend * 10)) * 100
      };
    });
    const trendData = Array.from({ length: 7 }).map((_, i) => ({
      day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
      roas: 1.5 + Math.random() * 2,
      ctr: 1 + Math.random() * 4
    }));
    setRows(data);
    setTrend(trendData);
    const spend = data.reduce((s, r) => s + r.spend, 0);
    const revenue = data.reduce((s, r) => s + r.revenue, 0);
    const ctr = data.reduce((s, r) => s + r.ctr, 0) / data.length;
    setKpi({ spend, revenue, roas: revenue / spend, ctr });
  }, []);

  const pieData = ["Blinkit","Swiggy Instamart","Zepto"].map(p => ({
    name: p,
    value: rows.filter(r => r.platform === p).reduce((s, r) => s + r.spend, 0)
  }));

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ margin:0 }}>ITC Q‑Commerce AI Dashboard</h2>
        <div style={{ color:"#64748b", fontSize:13 }}>Blinkit • Swiggy Instamart • Zepto</div>
      </div>

      <div className="grid kpis" style={{ marginTop:16 }}>
        <Kpi label="Total Spend" value={`₹${(kpi.spend/100000).toFixed(1)}L`} />
        <Kpi label="Revenue" value={`₹${(kpi.revenue/100000).toFixed(1)}L`} />
        <Kpi label="ROAS" value={`${kpi.roas?.toFixed(2)}x`} />
        <Kpi label="CTR" value={`${kpi.ctr?.toFixed(2)}%`} />
      </div>

      <div className="grid" style={{ gridTemplateColumns:"1fr 1fr", marginTop:16 }}>
        <div className="card">
          <div style={{ fontWeight:600, marginBottom:8 }}>Platform Spend Distribution</div>
          <div style={{ height:260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}
                     label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <PieTooltip formatter={v => `₹${(v/1000).toFixed(1)}k`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight:600, marginBottom:8 }}>7‑Day Trend</div>
          <div style={{ height:260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="day" />
                <YAxis />
                <LineTooltip />
                <Line dataKey="roas" stroke="#6366F1" strokeWidth={2} />
                <Line dataKey="ctr" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop:16 }}>
        <div style={{ fontWeight:600, marginBottom:8 }}>Top 12 Performance</div>
        <div style={{ overflowX:"auto" }}>
          <table className="table">
            <thead>
              <tr><th>SKU</th><th>Platform</th><th>Spend</th><th>ROAS</th></tr>
            </thead>
            <tbody>
              {rows.slice(0,12).map(r => (
                <tr key={r.id}>
                  <td>{r.sku}</td>
                  <td><span className="badge">{r.platform}</span></td>
                  <td>₹{(r.spend/1000).toFixed(1)}k</td>
                  <td className="mono">{r.roas.toFixed(2)}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
