import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PricingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (amount, planName) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (amount === 0) {
            alert("You are now on the Free plan.");
            navigate('/search');
            return;
        }

        const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            const result = await axios.post('http://localhost:8000/api/v1/payment/orders', {
                amount: amount,
                plan_name: planName
            });

            const { amount: orderAmount, id: order_id, currency } = result.data;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE",
                amount: orderAmount.toString(),
                currency: currency,
                name: "DeepContext",
                description: `Subscribe to ${planName}`,
                order_id: order_id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('http://localhost:8000/api/v1/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan_name: planName
                        });
                        if (verifyRes.data.status === 'success') {
                            alert("Payment Successful! Plan updated.");
                            navigate('/search');
                        }
                    } catch (error) {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.email,
                    email: user.email,
                },
                theme: {
                    color: "#003049",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert("Error creating order");
        }
    };

    return (
        <div className="bg-brand-cream min-h-screen py-24 px-4 sm:px-6 lg:px-8 font-sans text-brand-primary">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-brand-primary sm:text-5xl mb-4">
                    Simple, Transparent Pricing
                </h2>
                <p className="max-w-xl mx-auto text-xl text-slate-600">
                    Invest in clarity. Scale when you need to.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">
                {/* Free Plan */}
                <div className="bg-white rounded-3xl shadow-xl shadow-brand-primary/5 hover:shadow-2xl transition-all border border-brand-primary/5 overflow-hidden flex flex-col">
                    <div className="px-6 py-8 flex-1">
                        <h3 className="text-center text-2xl font-bold text-brand-primary">Free</h3>
                        <p className="text-center text-slate-500 mt-2">Basic features</p>
                        <div className="mt-8 text-center flex items-baseline justify-center">
                            <span className="text-5xl font-extrabold text-brand-primary">$0</span>
                            <span className="text-slate-400 ml-1 text-xl">/mo</span>
                        </div>
                        <ul className="mt-8 space-y-4">
                            <li className="flex items-center text-slate-600 font-medium"><CheckCircle className="w-5 h-5 text-brand-primary/40 mr-3" /> 5 Analysis per day</li>
                            <li className="flex items-center text-slate-600 font-medium"><CheckCircle className="w-5 h-5 text-brand-primary/40 mr-3" /> Basic Sentiment</li>
                        </ul>
                    </div>
                    <div className="px-6 py-6 bg-slate-50 border-t border-slate-100">
                        <button
                            onClick={() => handlePayment(0, 'free')}
                            className="w-full py-4 px-4 rounded-xl shadow-sm text-sm font-bold text-brand-primary bg-white border border-slate-200 hover:bg-slate-100 transition-colors uppercase tracking-wide"
                        >
                            Select Plan
                        </button>
                    </div>
                </div>

                {/* Basic Plan */}
                <div className="bg-brand-primary rounded-3xl shadow-2xl overflow-hidden transform scale-105 border-4 border-brand-accent relative flex flex-col z-10">
                    <span className="absolute top-0 inset-x-0 bg-brand-accent text-brand-primary text-xs font-bold px-3 py-1 uppercase tracking-widest text-center shadow-sm">
                        Most Popular
                    </span>
                    <div className="px-6 py-8 flex-1 mt-4">
                        <h3 className="text-center text-2xl font-bold text-white">Basic</h3>
                        <p className="text-center text-brand-accent/80 mt-2">For starters</p>
                        <div className="mt-8 text-center flex items-baseline justify-center">
                            <span className="text-5xl font-extrabold text-white">$1</span>
                            <span className="text-brand-accent/60 ml-1 text-xl">/mo</span>
                        </div>
                        <ul className="mt-8 space-y-4">
                            <li className="flex items-center text-white/90 font-medium"><CheckCircle className="w-5 h-5 text-brand-accent mr-3" /> 50 Analysis per day</li>
                            <li className="flex items-center text-white/90 font-medium"><CheckCircle className="w-5 h-5 text-brand-accent mr-3" /> Detailed Reports</li>
                        </ul>
                    </div>
                    <div className="px-6 py-6 bg-white/5 border-t border-white/10">
                        <button
                            onClick={() => handlePayment(1, 'basic_1')}
                            className="w-full py-4 px-4 rounded-xl shadow-lg text-sm font-bold text-brand-primary bg-brand-accent hover:bg-white transition-all uppercase tracking-wide transform hover:scale-105"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>

                {/* Pro Plan */}
                <div className="bg-white rounded-3xl shadow-xl shadow-brand-primary/5 hover:shadow-2xl transition-all border border-brand-primary/5 overflow-hidden flex flex-col">
                    <div className="px-6 py-8 flex-1">
                        <h3 className="text-center text-2xl font-bold text-brand-primary">Pro</h3>
                        <p className="text-center text-slate-500 mt-2">Power users</p>
                        <div className="mt-8 text-center flex items-baseline justify-center">
                            <span className="text-5xl font-extrabold text-brand-primary">$5</span>
                            <span className="text-slate-400 ml-1 text-xl">/mo</span>
                        </div>
                        <ul className="mt-8 space-y-4">
                            <li className="flex items-center text-slate-600 font-medium"><CheckCircle className="w-5 h-5 text-brand-primary/40 mr-3" /> Unlimited Analysis</li>
                            <li className="flex items-center text-slate-600 font-medium"><CheckCircle className="w-5 h-5 text-brand-primary/40 mr-3" /> Priority Support</li>
                            <li className="flex items-center text-slate-600 font-medium"><CheckCircle className="w-5 h-5 text-brand-primary/40 mr-3" /> Export Data</li>
                        </ul>
                    </div>
                    <div className="px-6 py-6 bg-slate-50 border-t border-slate-100">
                        <button
                            onClick={() => handlePayment(5, 'pro_5')}
                            className="w-full py-4 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary/90 transition-colors uppercase tracking-wide"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
