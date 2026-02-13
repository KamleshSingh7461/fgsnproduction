
'use client';

import { useState } from 'react';
import { Button } from '@fgsn/ui';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { submitContactRequest } from '../../lib/actions';

export function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        setStatus('loading');
        setErrorMessage('');

        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            organization: formData.get('organization') as string,
            message: formData.get('message') as string,
        };

        try {
            await submitContactRequest(data);
            setStatus('success');
        } catch (e) {
            console.error(e);
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again later.');
        }
    }

    if (status === 'success') {
        return (
            <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-2xl text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-emerald-900 uppercase italic mb-2">Message Received</h3>
                <p className="text-emerald-700 font-medium">
                    Thank you for reaching out. Our team will review your inquiry and get back to you shortly.
                </p>
                <Button
                    variant="secondary"
                    className="mt-6 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    onClick={() => setStatus('idle')}
                >
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 transition-colors font-medium text-zinc-900"
                        placeholder="John Doe"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address *</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 transition-colors font-medium text-zinc-900"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 transition-colors font-medium text-zinc-900"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="organization" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Organization / Team</label>
                    <input
                        type="text"
                        name="organization"
                        id="organization"
                        className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 transition-colors font-medium text-zinc-900"
                        placeholder="Global Sports League"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Your Message *</label>
                <textarea
                    name="message"
                    id="message"
                    required
                    rows={6}
                    className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 transition-colors font-medium text-zinc-900 resize-none"
                    placeholder="Tell us about your project or inquiry..."
                />
            </div>

            {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3 text-sm font-bold">
                    <AlertCircle className="w-5 h-5" />
                    {errorMessage}
                </div>
            )}

            <Button
                type="submit"
                disabled={status === 'loading'}
                className="h-14 bg-zinc-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-3 transition-all"
            >
                {status === 'loading' ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                    </>
                ) : (
                    <>
                        Send Inquiry <Send className="w-4 h-4" />
                    </>
                )}
            </Button>
        </form>
    );
}
