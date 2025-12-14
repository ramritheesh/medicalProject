import React from 'react';
import { useMedication } from '../context/MedicationContext';
import { Bell, CheckCircle2, Circle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Reminders = () => {
    const { medications, toggleReminder } = useMedication();

    // Mock generating daily schedule based on frequency
    const generateSchedule = () => {
        const schedule = [];
        medications.forEach(med => {
            // Simplified logic: just adding a morning and evening slot for demo
            schedule.push({ ...med, time: '08:00 AM', taken: false, id: `${med.id}-am` });
            if (med.frequency !== 'Once daily') {
                schedule.push({ ...med, time: '08:00 PM', taken: false, id: `${med.id}-pm` });
            }
        });
        return schedule.sort((a, b) => a.time.localeCompare(b.time));
    };

    const [schedule, setSchedule] = React.useState([]);

    React.useEffect(() => {
        setSchedule(generateSchedule());
    }, [medications]);

    const handleTake = (id) => {
        setSchedule(prev => prev.map(item =>
            item.id === id ? { ...item, taken: !item.taken } : item
        ));
        toggleReminder(id);
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Daily Reminders</h1>
                <p className="text-slate-500 mt-2">Track your medication intake for today.</p>
            </header>

            <div className="max-w-2xl">
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-12">
                    {schedule.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8"
                        >
                            <div className="absolute -left-[9px] top-0 bg-white p-1">
                                <div className={`w-4 h-4 rounded-full border-2 ${item.taken ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`} />
                            </div>

                            <div
                                onClick={() => handleTake(item.id)}
                                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 group ${item.taken
                                        ? 'bg-emerald-50 border-emerald-200'
                                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className={`w-4 h-4 ${item.taken ? 'text-emerald-600' : 'text-slate-400'}`} />
                                            <span className={`text-sm font-medium ${item.taken ? 'text-emerald-700' : 'text-slate-500'}`}>
                                                {item.time}
                                            </span>
                                        </div>
                                        <h3 className={`text-lg font-bold ${item.taken ? 'text-emerald-900' : 'text-slate-800'}`}>
                                            {item.name}
                                        </h3>
                                        <p className={`text-sm ${item.taken ? 'text-emerald-700' : 'text-slate-500'}`}>
                                            {item.dosage} • Take 1 pill
                                        </p>
                                    </div>

                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.taken ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300 group-hover:text-emerald-500'
                                        }`}>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {schedule.length === 0 && (
                        <div className="pl-8 text-slate-500">
                            No reminders scheduled for today.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reminders;
