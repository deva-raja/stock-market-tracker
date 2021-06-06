import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
const alpha = require('alphavantage')({ key: process.env.REACT_APP_ALPHA_API_KEY });

function StockComponent() {
  const [chartDatas, setChartDatas] = useState([]);
  useEffect(() => {
    // alpha advantage
    alpha.data
      .daily(`GOOGL`, 10)
      .then((data) => {
        console.log(data);
        let array = Object.entries(data);
        let result = array[1][1];

        const chartData = [];

        for (let key in result) {
          chartData.push({
            date: key,
            value: result[key]['1. open'],
          });
        }
        const slicedData = chartData.slice(0, 31);
        setChartDatas(slicedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const data = [];
  for (let num = 30; num >= 0; num--) {
    data.push({
      value: 1 + Math.random(),
      date: subDays(new Date(), num).toISOString().substr(0, 10),
    });
  }

  console.log({ chartDatas });
  return (
    <div style={{ marginTop: '200px' }}>
      <ResponsiveContainer width='100%' height={400}>
        <AreaChart data={chartDatas}>
          <defs>
            <linearGradient id='bull' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#4e57a0 ' stopOpacity={0.8} />
              <stop offset='65%' stopColor='#4e57a0 ' stopOpacity={0.2} />
              <stop offset='90%' stopColor='#4e57a0 ' stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area dataKey='value' stroke='#7b68ee ' fill='url(#bull)' />
          <XAxis
            dataKey='date'
            axisLine={false}
            tickLine={false}
            tickCount={6}
            tickFormatter={(str) => {
              const date = parseISO(str);

              //   for finding todays stock
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (date.getDate() % 5 === 0 || date.getDate() === today) {
                return format(date, 'MMM, d');
              }
              return '';
            }}
          />
          <YAxis
            datakey='value'
            axisLine={false}
            tickLine={false}
            tickCount={8}
            tickFormatter={(number) => `$${number.toFixed(2)}`}
          />

          <Tooltip content={<CustomTooltip />} />
          <CartesianGrid opacity={0.1} vertical={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active) {
    return (
      <div className='tooltip'>
        <h4>{format(parseISO(label), 'eeee, d MMM, yyyy')}</h4>
        <p>${payload[0].value.toFixed(2)} USD</p>
        <p>₹{(payload[0].value * 73.15).toFixed(2)} INR</p>
      </div>
    );
  }
  return null;
}

export default StockComponent;
