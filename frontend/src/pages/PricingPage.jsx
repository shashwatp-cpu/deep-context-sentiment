import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
            // Logic to update user to free if needed, or just redirect
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
                amount: amount, // dollars
                plan_name: planName
            });

            const { amount: orderAmount, id: order_id, currency } = result.data;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE", // Replace with env var
                amount: orderAmount.toString(),
                currency: currency,
                name: "Deep Context Sentiment",
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
                    color: "#4f46e5",
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
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Pricing Plans
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                    Choose the plan that fits your needs
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">
                {/* Free Plan */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h3 className="text-center text-2xl font-bold text-gray-900">Free</h3>
                        <p className="text-center text-gray-500 mt-2">Basic features</p>
                        <div className="mt-6 text-center">
                            <span className="text-4xl font-extrabold text-gray-900">$0</span>
                            <span className="text-gray-500">/mo</span>
                        </div>
                        <ul className="mt-6 space-y-4 text-gray-500">
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 5 Analysis per day</li>
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Basic Sentiment</li>
                        </ul>
                    </div>
                    <div className="px-6 py-4 bg-gray-50">
                        <button
                            onClick={() => handlePayment(0, 'free')}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 border-indigo-600"
                        >
                            Current Plan
                        </button>
                    </div>
                </div>

                {/* Basic Plan */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform scale-105 border-2 border-indigo-500 relative">
                    <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-wide rounded-bl">
                        Popular
                    </span>
                    <div className="px-6 py-8">
                        <h3 className="text-center text-2xl font-bold text-gray-900">Basic</h3>
                        <p className="text-center text-gray-500 mt-2">For starters</p>
                        <div className="mt-6 text-center">
                            <span className="text-4xl font-extrabold text-gray-900">$1</span>
                            <span className="text-gray-500">/mo</span>
                        </div>
                        <ul className="mt-6 space-y-4 text-gray-500">
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 50 Analysis per day</li>
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Detailed Reports</li>
                        </ul>
                    </div>
                    <div className="px-6 py-4 bg-gray-50">
                        <button
                            onClick={() => handlePayment(1, 'basic_1')}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Pro Plan */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h3 className="text-center text-2xl font-bold text-gray-900">Pro</h3>
                        <p className="text-center text-gray-500 mt-2">Power users</p>
                        <div className="mt-6 text-center">
                            <span className="text-4xl font-extrabold text-gray-900">$5</span>
                            <span className="text-gray-500">/mo</span>
                        </div>
                        <ul className="mt-6 space-y-4 text-gray-500">
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Unlimited Analysis</li>
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Priority Support</li>
                            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Export Data</li>
                        </ul>
                    </div>
                    <div className="px-6 py-4 bg-gray-50">
                        <button
                            onClick={() => handlePayment(5, 'pro_5')}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 border-indigo-600"
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
