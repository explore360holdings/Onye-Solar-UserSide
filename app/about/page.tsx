// File: /app/about/page.tsx
"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Leaf, ShieldCheck, Sun } from "lucide-react";

const teamMembers = [
    { name: "John Carter", role: "Founder & CEO", avatarSrc: "/avatars/john.jpg" },
    { name: "Jane Doe", role: "Lead Solar Engineer", avatarSrc: "/avatars/jane.jpg" },
    { name: "Peter Jones", role: "Head of Sales", avatarSrc: "/avatars/peter.jpg" },
    { name: "Mary Smith", role: "Customer Support Lead", avatarSrc: "/avatars/mary.jpg" },
];

const coreValues = [
    { icon: Leaf, title: "Sustainability", description: "Committed to a greener planet with every product we sell." },
    { icon: Zap, title: "Innovation", description: "Sourcing only the most advanced and efficient solar technology." },
    { icon: ShieldCheck, title: "Quality & Reliability", description: "Providing durable products that stand the test of time." },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-20 bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900">
                <div className="absolute inset-0">
                    <Image src="/images/solar-panels-background.jpg" alt="Solar panels" fill className="object-cover opacity-30" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Powering a Brighter Future</h1>
                    <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
                        At OnyeSolar, our mission is to make renewable energy accessible and affordable for everyone.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Our Story Section */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                        <p className="text-gray-600 leading-relaxed space-y-4">
                            Founded in 2024 with a simple yet powerful vision, OnyeSolar began as a small team of passionate individuals with an objective to impact society by providing alternative power supply to light up every city. We saw the potential of how solar energy can transform not just homes and businesses, we believe in impact of how it lights up every city, town, villages and the world at large.
                            <br /><br />
                            Today, we've grown into a leading provider of solar solutions, having helped thousands of customers transition to clean, sustainable energy as alternate source of power. Our commitment to quality, innovation, and customer satisfaction remains at the heart of everything we do.
                        </p>
                    </div>
                    <div className="relative h-96 rounded-2xl overflow-hidden">
                        <Image src="/images/team-meeting.jpg" alt="SolarTech team" fill className="object-cover" />
                    </div>
                </div>

                {/* Core Values Section */}
                <div className="text-center mb-24">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Core Values</h2>
                    <div className="grid sm:grid-cols-3 gap-12">
                        {coreValues.map(value => (
                            <div key={value.title}>
                                <div className="mx-auto h-16 w-16 flex items-center justify-center bg-primary/10 text-primary rounded-2xl mb-4">
                                    <value.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                                <p className="mt-2 text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
}
