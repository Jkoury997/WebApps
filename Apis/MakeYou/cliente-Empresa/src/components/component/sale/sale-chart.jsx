"use client";

import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function SalesChart({ data }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <ResponsiveContainer width="100%" height={300}>
      {data.length === 0 ? (
        <p className="text-center text-gray-500">No hay datos disponibles.</p>
      ) : (
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            stroke="#888888"
            fontSize={12}
          />
          <YAxis
            tickFormatter={(value) => `$${value / 1000}k`}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            stroke="#888888"
            fontSize={12}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value), "Ventas"]}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Line type="monotone" dataKey="ventas" strokeWidth={2} activeDot={{ r: 6 }} stroke="#2563eb" />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}
