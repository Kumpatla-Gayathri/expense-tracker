import React, { useState, useEffect } from 'react';
import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
} from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const CATEGORIES = [
    'Food', 'Transport', 'Shopping', 'Entertainment',
    'Health', 'Education', 'Rent', 'Salary', 'Freelance', 'Other'
];

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [receipt, setReceipt] = useState(null);
    const [form, setForm] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        description: '',
        date: '',
        isRecurring: false
    });

    useEffect(() => { fetchTransactions(); }, [filter]);

    const fetchTransactions = async() => {
        try {
            const params = filter !== 'all' ? { type: filter } : {};
            const { data } = await getTransactions(params);
            setTransactions(data.transactions);
        } catch (error) {
            toast.error('Failed to load transactions!');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('amount', form.amount);
            formData.append('type', form.type);
            formData.append('category', form.category);
            formData.append('description', form.description);
            formData.append('date', form.date);
            formData.append('isRecurring', form.isRecurring);
            if (receipt) formData.append('receipt', receipt);

            if (editId) {
                await updateTransaction(editId, formData);
                toast.success('Transaction updated!');
            } else {
                await addTransaction(formData);
                toast.success('Transaction added!');
            }
            resetForm();
            fetchTransactions();
        } catch (error) {
            toast.error('Failed to save transaction!');
        }
    };

    const handleDelete = async(id) => {
        if (!window.confirm('Delete this transaction?')) return;
        try {
            await deleteTransaction(id);
            toast.success('Transaction deleted!');
            fetchTransactions();
        } catch (error) {
            toast.error('Failed to delete!');
        }
    };

    const handleEdit = (t) => {
        setForm({
            title: t.title,
            amount: t.amount,
            type: t.type,
            category: t.category,
            description: t.description || '',
            date: t.date ? t.date.split('T')[0] : '',
            isRecurring: t.isRecurring
        });
        setEditId(t._id);
        setShowForm(true);
    };

    const resetForm = () => {
        setForm({
            title: '',
            amount: '',
            type: 'expense',
            category: 'Food',
            description: '',
            date: '',
            isRecurring: false
        });
        setEditId(null);
        setShowForm(false);
        setReceipt(null);
    };

    return ( <
            div >
            <
            Navbar / >
            <
            div className = "page-container" >

            { /* Header */ } <
            div style = {
                {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }
            } >
            <
            div >
            <
            h1 style = {
                { fontSize: '24px', fontWeight: '800' }
            } >
            Transactions <
            /h1> <
            p style = {
                { color: '#64748B', fontSize: '14px' }
            } >
            Manage your income and expenses <
            /p> < /
            div > <
            button className = "btn btn-primary"
            onClick = {
                () => setShowForm(!showForm)
            } >
            <
            FiPlus / > Add Transaction <
            /button> < /
            div >

            { /* Add/Edit Form */ } {
                showForm && ( <
                    div className = "card"
                    style = {
                        { marginBottom: '24px' }
                    } >
                    <
                    h3 style = {
                        { marginBottom: '16px', fontWeight: '700' }
                    } > { editId ? 'Edit Transaction' : 'New Transaction' } <
                    /h3> <
                    form onSubmit = { handleSubmit } >
                    <
                    div style = {
                        {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px'
                        }
                    } >
                    <
                    div className = "form-group" >
                    <
                    label > Title < /label> <
                    input type = "text"
                    placeholder = "e.g. Grocery Shopping"
                    value = { form.title }
                    onChange = { e => setForm({...form, title: e.target.value }) }
                    required /
                    >
                    <
                    /div>

                    <
                    div className = "form-group" >
                    <
                    label > Amount < /label> <
                    input type = "number"
                    placeholder = "500"
                    value = { form.amount }
                    onChange = { e => setForm({...form, amount: e.target.value }) }
                    required /
                    >
                    <
                    /div>

                    <
                    div className = "form-group" >
                    <
                    label > Type < /label> <
                    select value = { form.type }
                    onChange = { e => setForm({...form, type: e.target.value }) } >
                    <
                    option value = "expense" > Expense < /option> <
                    option value = "income" > Income < /option> < /
                    select > <
                    /div>

                    <
                    div className = "form-group" >
                    <
                    label > Category < /label> <
                    select value = { form.category }
                    onChange = { e => setForm({...form, category: e.target.value }) } > {
                        CATEGORIES.map(c => ( <
                            option key = { c }
                            value = { c } > { c } < /option>
                        ))
                    } <
                    /select> < /
                    div >

                    <
                    div className = "form-group" >
                    <
                    label > Date < /label> <
                    input type = "date"
                    value = { form.date }
                    onChange = { e => setForm({...form, date: e.target.value }) }
                    /> < /
                    div >

                    <
                    div className = "form-group" >
                    <
                    label > Receipt(optional) < /label> <
                    input type = "file"
                    accept = "image/*"
                    onChange = { e => setReceipt(e.target.files[0]) }
                    /> < /
                    div >

                    <
                    div className = "form-group"
                    style = {
                        { gridColumn: 'span 2' }
                    } >
                    <
                    label > Description(optional) < /label> <
                    input type = "text"
                    placeholder = "Any extra details..."
                    value = { form.description }
                    onChange = { e => setForm({...form, description: e.target.value }) }
                    /> < /
                    div >

                    <
                    div style = {
                        {
                            gridColumn: 'span 2',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }
                    } >
                    <
                    input type = "checkbox"
                    id = "recurring"
                    checked = { form.isRecurring }
                    onChange = { e => setForm({...form, isRecurring: e.target.checked }) }
                    /> <
                    label htmlFor = "recurring"
                    style = {
                        { margin: 0 }
                    } >
                    Recurring expense <
                    /label> < /
                    div > <
                    /div>

                    <
                    div style = {
                        { display: 'flex', gap: '10px', marginTop: '16px' }
                    } >
                    <
                    button type = "submit"
                    className = "btn btn-primary" > { editId ? 'Update' : 'Add Transaction' } <
                    /button> <
                    button type = "button"
                    className = "btn btn-outline"
                    onClick = { resetForm } >
                    Cancel <
                    /button> < /
                    div > <
                    /form> < /
                    div >
                )
            }

            { /* Filter Tabs */ } <
            div style = {
                { display: 'flex', gap: '8px', marginBottom: '16px' }
            } > {
                ['all', 'income', 'expense'].map(f => ( <
                    button key = { f }
                    className = { 'btn ' + (filter === f ? 'btn-primary' : 'btn-outline') }
                    onClick = {
                        () => setFilter(f)
                    }
                    style = {
                        { padding: '6px 16px', fontSize: '13px' }
                    } > { f === 'all' ? 'All' : f === 'income' ? 'Income' : 'Expense' } <
                    /button>
                ))
            } <
            /div>

            { /* Transactions List */ } <
            div className = "card" > {
                loading ? ( <
                    div style = {
                        { textAlign: 'center', padding: '40px' }
                    } >
                    <
                    div className = "spinner"
                    style = {
                        { margin: '0 auto' }
                    }
                    /> < /
                    div >
                ) : transactions.length === 0 ? ( <
                    p style = {
                        { textAlign: 'center', color: '#64748B', padding: '40px' }
                    } >
                    No transactions found!
                    <
                    /p>
                ) : (
                    transactions.map(t => ( <
                            div key = { t._id }
                            style = {
                                {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '14px 0',
                                    borderBottom: '1px solid #E2E8F0'
                                }
                            } >
                            <
                            div style = {
                                { display: 'flex', alignItems: 'center', gap: '12px' }
                            } >
                            <
                            div style = {
                                {
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: t.type === 'income' ? '#D1FAE5' : '#FEE2E2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px'
                                }
                            } > { t.type === 'income' ? '💰' : '💸' } <
                            /div> <
                            div >
                            <
                            p style = {
                                { fontWeight: '600', fontSize: '14px' }
                            } > { t.title } {
                                t.isRecurring === true && ( <
                                    span style = {
                                        {
                                            marginLeft: '8px',
                                            fontSize: '11px',
                                            background: '#EDE9FE',
                                            color: '#5B21B6',
                                            padding: '2px 8px',
                                            borderRadius: '10px'
                                        }
                                    } >
                                    Recurring <
                                    /span>
                                )
                            } <
                            /p> <
                            p style = {
                                { fontSize: '12px', color: '#64748B' }
                            } > { t.category }• { new Date(t.date).toLocaleDateString() } <
                            /p> {
                            t.receipt && t.receipt.url && ( <
                                a href = { t.receipt.url }
                                target = "_blank"
                                rel = "noreferrer"
                                style = {
                                    { fontSize: '12px', color: '#2E75B6' }
                                } >
                                View Receipt <
                                /a>
                            )
                        } <
                        /div> < /
                        div >

                        <
                        div style = {
                            { display: 'flex', alignItems: 'center', gap: '12px' }
                        } >
                        <
                        span style = {
                            {
                                fontWeight: '700',
                                fontSize: '16px',
                                color: t.type === 'income' ? '#10B981' : '#EF4444'
                            }
                        } > { t.type === 'income' ? '+' : '-' }
                        Rs. { t.amount.toLocaleString() } <
                        /span> <
                        button className = "btn"
                        onClick = {
                            () => handleEdit(t)
                        }
                        style = {
                            {
                                background: '#EFF6FF',
                                color: '#2E75B6',
                                padding: '6px 10px'
                            }
                        } >
                        <
                        FiEdit2 / >
                        <
                        /button> <
                        button className = "btn"
                        onClick = {
                            () => handleDelete(t._id)
                        }
                        style = {
                            {
                                background: '#FEF2F2',
                                color: '#EF4444',
                                padding: '6px 10px'
                            }
                        } >
                        <
                        FiTrash2 / >
                        <
                        /button> < /
                        div > <
                        /div>
                    ))
            )
        } <
        /div> < /
    div > <
        /div>
);
};

export default Transactions;