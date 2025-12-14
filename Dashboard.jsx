import React from 'react';
import { useMedication } from '../context/MedicationContext';
import { Pill, AlertCircle, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { medications } = useMedication();

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Medications</h1>
                    <p className="text-slate-500 mt-2">Manage your active prescriptions and refills.</p>
                </div>
                <Link to="/scanner" className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add New
                </Link>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medications.map((med, index) => (
                    <motion.div
                        key={med.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Pill className="w-6 h-6" />
                            </div>
                            {med.refills === 0 && (
                                <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    No Refills
                                </span>
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-1">{med.name}</h3>
                        <p className="text-slate-500 text-sm mb-4">{med.dosage}</p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                <span>{med.frequency}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Pill className="w-4 h-4 text-emerald-500" />
                                <span>{med.quantity} remaining</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                            <Link to="/shop" className="btn-secondary flex-1 text-center text-sm">
                                Refill
                            </Link>
                            <Link to="/reminders" className="btn-secondary flex-1 text-center text-sm">
                                Schedule
                            </Link>
                        </div>
                    </motion.div>
                ))}

                {medications.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        <p className="mb-4">No medications added yet.</p>
                        <Link to="/scanner" className="text-emerald-500 font-medium hover:underline">
                            Scan your first prescription
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
