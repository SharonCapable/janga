import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans selection:bg-purple-500/30">
            <header className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/">
                        <Logo size={32} />
                    </Link>
                    <Link href="/login" className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors">
                        Back to Login
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-20 animate-fade-in">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Terms of Service</h1>
                <p className="text-[#a1a1aa] mb-12">Last updated: March 8, 2026</p>

                <div className="space-y-12 prose prose-invert prose-purple max-w-none">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
                        <p className="text-[#a1a1aa] leading-relaxed">
                            By accessing or using Janga (the "Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
                        <p className="text-[#a1a1aa] leading-relaxed">
                            Janga provides an AI-powered video generation platform that allows users to create short-form content and publish it to third-party social media platforms. We provide the tools for content creation, but the user is solely responsible for the content generated and published.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">3. User Responsibilities</h2>
                        <p className="text-zinc-400">
                            If you have any questions about these Terms, please contact us at: <strong>senyonam557@gmail.com</strong>
                        </p>
                        <p className="text-[#a1a1aa] leading-relaxed mb-4">
                            As a user of Janga, you agree that you will not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-[#a1a1aa]">
                            <li>Generate or publish content that is illegal, harmful, threatening, abusive, or defamatory.</li>
                            <li>Violate the terms of service of any third-party platforms (TikTok, YouTube, etc.) connected to your account.</li>
                            <li>Attempt to reverse engineer or disrupt the AI inference pipeline or any part of the service.</li>
                            <li>Use the service to generate spam or mass-automated low-quality content that violates platform safety guidelines.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">4. Ownership and Intellectual Property</h2>
                        <p className="text-[#a1a1aa] leading-relaxed">
                            <strong>Your Content:</strong> You retain all ownership rights to the videos you generate using Janga. Janga does not claim any copyright over your finished videos.
                        </p>
                        <p className="text-[#a1a1aa] leading-relaxed mt-4">
                            <strong>The Platform:</strong> The Janga software, branding, code, and AI workflows are the intellectual property of Janga.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">5. Termination</h2>
                        <p className="text-[#a1a1aa] leading-relaxed">
                            We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">6. Limitation of Liability</h2>
                        <p className="text-[#a1a1aa] leading-relaxed">
                            In no event shall Janga be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>
                </div>
            </main>

            <footer className="border-t border-white/5 py-12">
                <div className="max-w-4xl mx-auto px-6 text-center text-sm text-[#52525b]">
                    &copy; 2026 Janga. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
