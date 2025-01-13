'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDataEditor() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/admin-data');
            if (!response.ok) throw new Error('Failed to fetch data');
            const fetchedData = await response.json();
            setData(fetchedData);
        } catch (err) {
            toast.error('Failed to load data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (
        category,
        index,
        field,
        value
    ) => {
        if (!data) return;
        const newData = { ...data };
        newData[category][index][field] = value;
        setData(newData);
    };

    const handleAddItem = (category) => {
        if (!data) return;
        const newData = { ...data };
        newData[category].push({ value: '', label: '' });
        setData(newData);
    };

    const handleRemoveItem = (category, index) => {
        if (!data) return;
        const newData = { ...data };
        newData[category].splice(index, 1);
        setData(newData);
    };

    const handleSave = async () => {
        if (!data) return;
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to save data');
            toast.success('Data saved successfully!');
        } catch (err) {
            toast.error('Failed to save data. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6 h-[calc(100vh-10.6rem)] md:h-[calc(100vh-8.5rem)]">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <Accordion type="single" collapsible className="w-full">
                {(Object.keys(data)).map((category) => (
                    <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="text-lg font-semibold">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </AccordionTrigger>
                        <AccordionContent>
                            <AnimatePresence initial={false}>
                                {data[category].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-center space-x-2 mb-2 px-1"
                                    >
                                        <Input
                                            value={item.value}
                                            onChange={(e) => handleInputChange(category, index, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="flex-1"
                                        />
                                        <Input
                                            value={item.label}
                                            onChange={(e) => handleInputChange(category, index, 'label', e.target.value)}
                                            placeholder="Label"
                                            className="flex-1"
                                        />
                                        <Button onClick={() => handleRemoveItem(category, index)} variant="destructive" size="sm">
                                            Remove
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Button onClick={() => handleAddItem(category)} variant="outline" size="sm" className="mt-2">
                                    Add Item
                                </Button>
                            </motion.div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Button onClick={handleSave} disabled={isSaving} className="mt-4">
                {isSaving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    'Save Changes'
                )}
            </Button>
        </div>
    );
}

