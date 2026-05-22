import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { getSummary, getTransactions } from '../services/api';
import axios from 'axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

// Colors for pie chart
const COLORS = ['#1F4E79', '#2E75B6', '#10B981', '#F59E0B',
                '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const Dashboard = () => {
  const [summary,      setSummary]      = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
const [aiTips, setAiTips]       = useState('');
const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
//Add getAITips function here
const getAITips = async () => {
  setAiLoading(true);
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL || 'https://expense-tracker-backend-adl2.onrender.com/api'}/ai/tips`,
      {
        totalIncome:       summary.totalIncome,
        totalExpense:      summary.totalExpense,
        balance:           summary.balance,
        categoryBreakdown: summary.categoryBreakdown,
        reportCard:        summary.reportCard
      },
      { headers: { Authorization: 'Bearer ' + token } }
    );
    setAiTips(data.tips);
  } catch (error) {
    toast.error('Failed to get AI tips!');
  } finally {
    setAiLoading(false);
  }
};
  // Runs once when page loads

  const fetchData = async () => {
    try {
      const [summaryRes, transRes] = await Promise.all([
        getSummary(),
        getTransactions({ limit: 5 })
        // Get summary and last 5 transactions at same time
      ]);
      setSummary(summaryRes.data);
      setTransactions(transRes.data.transactions);
    } catch (error) {
      toast.error('Failed to load dashboard data!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '80vh'
      }}>
        <div className="spinner" />
      </div>
    </div>
  );

  // Prepare chart data
  const pieData = summary?.categoryBreakdown
    ? Object.entries(summary.categoryBreakdown).map(([name, value]) => ({
        name, value
      }))
    : [];

  const barData = summary?.monthlyData
    ? Object.entries(summary.monthlyData).map(([month, data]) => ({
        month,
        Income:  data.income,
        Expense: data.expense
      }))
    : [];

  // Report card color
  const gradeColor = {
    'A': '#10B981', 'B': '#3B82F6',
    'C': '#F59E0B', 'D': '#EF4444', 'F': '#991B1B'
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">

        {/* Page Title */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '24px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>
              Dashboard 📊
            </h1>
            <p style={{ color: '#64748B', fontSize: '14px' }}>
              Your financial overview at a glance
            </p>
          </div>
          <Link to="/transactions" className="btn btn-primary">
            + Add Transaction
          </Link>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>

          {/* Balance */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, #1F4E79, #2E75B6)',
            color: 'white'
          }}>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>Total Balance</p>
            <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '8px 0' }}>
              ₹{summary?.balance?.toLocaleString() || 0}
            </h2>
            <p style={{ fontSize: '12px', opacity: 0.7 }}>Current balance</p>
          </div>

          {/* Income */}
          <div className="card" style={{ borderTop: '4px solid #10B981' }}>
            <p style={{ fontSize: '13px', color: '#64748B' }}>Total Income</p>
            <h2 style={{
              fontSize: '28px', fontWeight: '800',
              color: '#10B981', margin: '8px 0'
            }}>
              ₹{summary?.totalIncome?.toLocaleString() || 0}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B' }}>💰 Money in</p>
          </div>

          {/* Expense */}
          <div className="card" style={{ borderTop: '4px solid #EF4444' }}>
            <p style={{ fontSize: '13px', color: '#64748B' }}>Total Expenses</p>
            <h2 style={{
              fontSize: '28px', fontWeight: '800',
              color: '#EF4444', margin: '8px 0'
            }}>
              ₹{summary?.totalExpense?.toLocaleString() || 0}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B' }}>💸 Money out</p>
          </div>

          {/* Report Card */}
          <div className="card" style={{
            borderTop: `4px solid ${gradeColor[summary?.reportCard?.grade] || '#64748B'}`
          }}>
            <p style={{ fontSize: '13px', color: '#64748B' }}>Spending Grade</p>
            <h2 style={{
              fontSize: '48px', fontWeight: '800',
              color: gradeColor[summary?.reportCard?.grade] || '#64748B',
              margin: '4px 0'
            }}>
              {summary?.reportCard?.grade || 'N/A'}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B' }}>
              {summary?.reportCard?.message || 'Add transactions to get grade'}
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px'
        }}>

          {/* Bar Chart */}
          <div className="card">
            <h3 style={{
              fontSize: '16px', fontWeight: '700',
              marginBottom: '16px', color: '#1E293B'
            }}>
              📈 Monthly Income vs Expense
            </h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Income"  fill="#10B981" radius={[4,4,0,0]} />
                  <Bar dataKey="Expense" fill="#EF4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: 250, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#64748B'
              }}>
                No data yet — add transactions!
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="card">
            <h3 style={{
              fontSize: '16px', fontWeight: '700',
              marginBottom: '16px', color: '#1E293B'
            }}>
              🥧 Expense by Category
            </h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`₹${value}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: 250, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#64748B'
              }}>
                No expenses yet!
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>
              🕐 Recent Transactions
            </h3>
            <Link to="/transactions" style={{
              color: '#2E75B6', fontSize: '13px',
              fontWeight: '600', textDecoration: 'none'
            }}>
              View all →
            </Link>
          </div>
          {/* AI Spending Tips */}
        <div className="card" style={{ marginTop: '16px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>
              🤖 AI Spending Tips
            </h3>
            <button
              className="btn btn-primary"
              onClick={getAITips}
              disabled={aiLoading}
            >
              {aiLoading ? '⏳ Analyzing...' : '✨ Get AI Tips'}
            </button>
          </div>

          {aiTips ? (
            <div style={{
              background: '#F0F7FF',
              borderRadius: '10px',
              padding: '16px',
              lineHeight: '2',
              color: '#1E293B',
              fontSize: '14px',
              whiteSpace: 'pre-line'
            }}>
              {aiTips}
            </div>
          ) : (
            <p style={{ color: '#64748B', textAlign: 'center', padding: '20px' }}>
              Click "Get AI Tips" to get personalized spending advice! 🤖
            </p>
          )}
        </div>

          {transactions.length > 0 ? (
            transactions.map(t => (
              <div key={t._id} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '12px 0',
                borderBottom: '1px solid #E2E8F0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '10px',
                    background: t.type === 'income' ? '#D1FAE5' : '#FEE2E2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    {t.type === 'income' ? '💰' : '💸'}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>{t.title}</p>
                    <p style={{ fontSize: '12px', color: '#64748B' }}>
                      {t.category} • {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span style={{
                  fontWeight: '700', fontSize: '15px',
                  color: t.type === 'income' ? '#10B981' : '#EF4444'
                }}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: '#64748B', textAlign: 'center', padding: '20px' }}>
              No transactions yet — add your first one!
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;