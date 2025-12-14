import React, { createContext, useContext, useState, useEffect } from 'react';

const MedicationContext = createContext();

export const useMedication = () => useContext(MedicationContext);

export const MedicationProvider = ({ children }) => {
    const [medications, setMedications] = useState([
        { id: '1', name: 'Amoxicillin', dosage: '500mg', quantity: 14, frequency: 'Every 8 hours', refills: 2 },
        { id: '2', name: 'Lisinopril', dosage: '10mg', quantity: 30, frequency: 'Once daily', refills: 0 },
    ]);

    const [cart, setCart] = useState([]);
    const [reminders, setReminders] = useState([]);

    // Load data from local storage on mount (mock persistence)
    useEffect(() => {
        const storedMeds = localStorage.getItem('meds');
        if (storedMeds) {
            try {
                setMedications(JSON.parse(storedMeds));
            } catch (error) {
                console.error("Failed to parse medications from local storage:", error);
                // Optionally clear invalid data
                localStorage.removeItem('meds');
            }
        }
    }, []);

    // Save to local storage whenever meds change
    useEffect(() => {
        localStorage.setItem('meds', JSON.stringify(medications));
    }, [medications]);

    const addMedication = (med) => {
        const newMed = { ...med, id: Date.now().toString(), refills: 0 };
        setMedications((prev) => [...prev, newMed]);
    };

    const addToCart = (med) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === med.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...med, cartQuantity: 1 }];
        });
    };

    const removeFromCart = (medId) => {
        setCart((prev) => prev.filter((item) => item.id !== medId));
    };

    const clearCart = () => setCart([]);

    const toggleReminder = (medId) => {
        // Mock reminder logic
        console.log(`Toggled reminder for ${medId}`);
    };

    return (
        <MedicationContext.Provider
            value={{
                medications,
                addMedication,
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                reminders,
                toggleReminder,
            }}
        >
            {children}
        </MedicationContext.Provider>
    );
};
