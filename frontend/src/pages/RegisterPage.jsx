import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            navigate('/pricing'); // Go to pricing after register
        } catch (err) {
            setError('Failed to register. Email might be already in use.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-brand-primary/10 border border-brand-primary/5">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-bold text-brand-primary">Create Account</h2>
                    <p className="text-center text-slate-500 mt-2">Start analyzing in seconds</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-t-xl relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm bg-slate-50"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-b-xl relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm bg-slate-50"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all shadow-lg hover:shadow-brand-primary/25"
                        >
                            Sign up
                        </button>
                        <div className="text-center mt-2">
                            <Link to="/login" className="font-medium text-brand-primary/80 hover:text-brand-primary hover:underline">
                                Already have an account? Log in
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
