import React, { useState, useEffect } from 'react';
import {
  getGoals, createGoal,
  updateGoal, deleteGoal, depositGoal
} from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { FiTrash2, FiPlus, FiDollarSign } from 'react-icons/fi';

const GOAL_CATEGORIES = [
  'Emergency Fund', 'Vacation', 'Education',
  'Electronics', 'Vehicle', 'Home', 'Other'
];

const GOAL_ICONS = ['🎯', '✈️', '🏠', '🚗', '📱', '📚', '💰', '🏖️'];

const Goals = () => {
  const [goals,      setGoals]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [depositId,  setDepositId]  = useState(null);
  const [depositAmt, setDepositAmt] = useState('');
  const [form, setForm] = useState({
    title: '', targetAmount: '', deadline: '',
    category: 'Other', icon: '🎯', notes: ''
  });

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await getGoals();
      setGoals(data);
    } catch (error) {
      toast.error('Failed to load goals!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGoal(form);
      toast.success('🎯 Goal created!');
      setShowForm(false);
      setForm({
        title: '', targetAmount: '', deadline: '',
        category: 'Other', icon: '🎯', notes: ''
      });
      fetchGoals();
    } catch (error) {
      toast.error('Failed to create goal!');
    }
  };

  const handleDeposit = async (id) => {
    if (!depositAmt || depositAmt <= 0) {
      toast.error('Enter a valid amount!');
      return;
    }
    try {
      const { data } = await depositGoal(id, { amount: depositAmt });
      toast.success(data.message);
      setDepositId(null);
      setDepositAmt('');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to deposit!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await deleteGoal(id);
      toast.success('🗑️ Goal deleted!');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to delete goal!');
    }
  };

  // Status color
  const statusColor = {
    active:    '#2E75B6',
    completed: '#10B981',
    failed:    '#EF4444'
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '24px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
              Savings Goals 🎯
            </h1>
            <p style={{ color: '#64748B', fontSize: '14px' }}>
              Set goals and track your savings progress
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <FiPlus /> New Goal
          </button>
        </div>

        {/* Add Goal Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: '700' }}>
              ➕ Create New Goal
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div className="form-group">
                  <label>Goal Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Vacation Fund"
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Target Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={form.targetAmount}
                    onChange={e => setForm({...form, targetAmount: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={e => setForm({...form, deadline: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                  >
                    {GOAL_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Icon Picker */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Pick an Icon</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {GOAL_ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setForm({...form, icon})}
                        style={{
                          fontSize: '24px', padding: '8px',
                          borderRadius: '8px', border: '2px solid',
                          borderColor: form.icon === icon ? '#1F4E79' : '#E2E8F0',
                          background: form.icon === icon ? '#EFF6FF' : 'white',
                          cursor: 'pointer'
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Notes (optional)</label>
                  <input
                    type="text"
                    placeholder="Any notes about this goal..."
                    value={form.notes}
                    onChange={e => setForm({...form, notes: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">
                  🎯 Create Goal
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : goals.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ color: '#1E293B', marginBottom: '8px' }}>
              No goals yet!
            </h3>
            <p style={{ color: '#64748B' }}>
              Create your first savings goal to get started
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {goals.map(goal => (
              <div key={goal._id} className="card" style={{
                borderTop: `4px solid ${statusColor[goal.status]}`
              }}>
                {/* Goal Header */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '32px' }}>{goal.icon}</span>
                    <div>
                      <h3 style={{ fontWeight: '700', fontSize: '16px' }}>
                        {goal.title}
                      </h3>
                      <span style={{
                        fontSize: '11px', fontWeight: '600',
                        color: statusColor[goal.status],
                        background: `${statusColor[goal.status]}20`,
                        padding: '2px 8px', borderRadius: '10px'
                      }}>
                        {goal.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn"
                    onClick={() => handleDelete(goal._id)}
                    style={{
                      background: '#FEF2F2', color: '#EF4444',
                      padding: '6px 10px'
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '13px', marginBottom: '6px'
                  }}>
                    <span style={{ color: '#64748B' }}>Progress</span>
                    <span style={{ fontWeight: '700', color: '#1F4E79' }}>
                      {goal.progressPercentage}%
                    </span>
                  </div>
                  <div style={{
                    height: '8px', background: '#E2E8F0',
                    borderRadius: '10px', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '10px',
                      width: `${goal.progressPercentage}%`,
                      background: goal.status === 'completed'
                        ? '#10B981'
                        : 'linear-gradient(90deg, #1F4E79, #2E75B6)',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>

                {/* Amount Info */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '12px', fontSize: '13px'
                }}>
                  <div>
                    <p style={{ color: '#64748B' }}>Saved</p>
                    <p style={{ fontWeight: '700', color: '#10B981', fontSize: '16px' }}>
                      ₹{goal.savedAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#64748B' }}>Target</p>
                    <p style={{ fontWeight: '700', color: '#1F4E79', fontSize: '16px' }}>
                      ₹{goal.targetAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Days Left */}
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
                  📅 {goal.daysLeft > 0
                    ? `${goal.daysLeft} days left`
                    : 'Deadline passed'
                  } — Due {new Date(goal.deadline).toLocaleDateString()}
                </p>

                {/* Deposit Section */}
                {goal.status === 'active' && (
                  depositId === goal._id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        placeholder="Amount to add"
                        value={depositAmt}
                        onChange={e => setDepositAmt(e.target.value)}
                        style={{
                          flex: 1, padding: '8px 12px',
                          border: '1.5px solid #E2E8F0',
                          borderRadius: '8px', fontSize: '14px'
                        }}
                      />
                      <button
                        className="btn btn-success"
                        onClick={() => handleDeposit(goal._id)}
                      >
                        ✅ Add
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => setDepositId(null)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => setDepositId(goal._id)}
                    >
                      <FiDollarSign /> Add Money
                    </button>
                  )
                )}

                {goal.status === 'completed' && (
                  <div style={{
                    textAlign: 'center', padding: '10px',
                    background: '#D1FAE5', borderRadius: '8px',
                    color: '#065F46', fontWeight: '600'
                  }}>
                    🎉 Goal Completed!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;