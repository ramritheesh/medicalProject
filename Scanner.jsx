import React, { useState, useRef } from 'react';
import { useMedication } from '../context/MedicationContext';
import { Upload, Camera, Check, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tesseract from 'tesseract.js';
import { useNavigate } from 'react-router-dom';

const Scanner = () => {
    const { addMedication } = useMedication();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [image, setImage] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [error, setError] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            processImage(imageUrl);
        }
    };

    const processImage = async (imageUrl) => {
        setIsScanning(true);
        setError(null);
        try {
            const result = await Tesseract.recognize(imageUrl, 'eng', {
                logger: m => console.log(m)
            });

            const text = result.data.text;
            console.log("Scanned Text:", text);

            // Simple parsing logic (can be improved)
            const nameMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/); // Looks for capitalized words
            const dosageMatch = text.match(/(\d+\s?mg)/i);
            const qtyMatch = text.match(/(\d+)\s?(?:tablet|cap|pill)/i);

            setScannedData({
                name: nameMatch ? nameMatch[0] : '',
                dosage: dosageMatch ? dosageMatch[0] : '',
                quantity: qtyMatch ? parseInt(qtyMatch[1]) : 30, // Default to 30 if not found
                frequency: 'Once daily' // Default
            });
        } catch (err) {
            console.error(err);
            setError("Failed to scan image. Please try again or enter manually.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleSave = () => {
        if (scannedData && scannedData.name) {
            addMedication(scannedData);
            navigate('/');
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Scan Prescription</h1>
                <p className="text-slate-500 mt-2">Upload a photo of your prescription bottle or label.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Area */}
                <div className="space-y-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group h-80 relative overflow-hidden"
                    >
                        {image ? (
                            <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-700">Click to upload</h3>
                                <p className="text-sm text-slate-500">or drag and drop</p>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {isScanning && (
                        <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium animate-pulse">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Scanning prescription...
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Results Form */}
                <AnimatePresence>
                    {scannedData && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel p-6 rounded-2xl space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-slate-800">Medication Details</h2>
                                <button onClick={() => setScannedData(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Medication Name</label>
                                    <input
                                        type="text"
                                        value={scannedData.name}
                                        onChange={(e) => setScannedData({ ...scannedData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g. Amoxicillin"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
                                        <input
                                            type="text"
                                            value={scannedData.dosage}
                                            onChange={(e) => setScannedData({ ...scannedData, dosage: e.target.value })}
                                            className="input-field"
                                            placeholder="e.g. 500mg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            value={scannedData.quantity}
                                            onChange={(e) => setScannedData({ ...scannedData, quantity: parseInt(e.target.value) })}
                                            className="input-field"
                                            placeholder="30"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                                    <select
                                        value={scannedData.frequency}
                                        onChange={(e) => setScannedData({ ...scannedData, frequency: e.target.value })}
                                        className="input-field"
                                    >
                                        <option>Once daily</option>
                                        <option>Twice daily</option>
                                        <option>Every 8 hours</option>
                                        <option>As needed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
                                    <Check className="w-5 h-5" />
                                    Confirm & Add Medication
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Scanner;
