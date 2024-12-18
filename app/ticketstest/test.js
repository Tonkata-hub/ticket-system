'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const mockTickets = [
    {
        id: '1',
        createdAt: new Date('2023-05-01T10:30:00'),
        author: 'John Doe',
        queryType: 'PC, components and mobile devices',
        status: 'Open',
        priority: 'High',
        title: 'For hardware review',
        clientNote: 'New gaming PC not booting up',
        ghost: false,
        signOff: 'Pending',
        actionStartDate: new Date('2023-05-01T11:00:00'),
        admin: 'Alice Johnson',
        dispatcher: 'Bob Smith',
        adminStatus: 'Investigating',
        supportType: 'Remote',
        actionPerformed: 'Guided client through BIOS check',
        timeSpent: 45,
        steps: ['Verified all components are properly connected', 'Checked BIOS settings', 'Attempted boot from recovery media']
    },
    {
        id: '2',
        createdAt: new Date('2023-05-02T09:15:00'),
        author: 'Jane Smith',
        queryType: 'Software and applications',
        status: 'In Progress',
        priority: 'Medium',
        title: 'Software installation issue',
        clientNote: 'Unable to install design software',
        ghost: false,
        signOff: 'N/A',
        actionStartDate: new Date('2023-05-02T10:00:00'),
        admin: 'Charlie Brown',
        dispatcher: 'Diana Prince',
        adminStatus: 'Working on solution',
        supportType: 'Remote',
        actionPerformed: 'Troubleshooting installation errors',
        timeSpent: 30,
        steps: ['Checked system requirements', 'Attempted clean install', 'Investigating compatibility issues']
    },
]

// Simulated database fetch function
const fetchTickets = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockTickets);
        }, 2000); // 2 second delay
    });
};

export default function Component() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const loadTickets = async () => {
            try {
                setLoading(true);
                const data = await fetchTickets();
                setTickets(data);
            } catch (err) {
                setError('Failed to load tickets');
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, []);

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleCloseDetails = () => {
        setSelectedTicket(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tickets</h1>
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/2">
                    {loading ? (
                        <TicketListSkeleton />
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <TicketList tickets={tickets} onTicketClick={handleTicketClick} />
                    )}
                </div>
                <div className="w-full lg:w-1/2">
                    {selectedTicket ? (
                        <TicketDetails ticket={selectedTicket} onClose={handleCloseDetails} />
                    ) : (
                        <div className="bg-muted p-4 rounded-lg text-center">
                            <p>Select a ticket to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TicketList({ tickets, onTicketClick }) {
    return (
        <ScrollArea className="h-[calc(100vh-200px)]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id} onClick={() => onTicketClick(ticket)} className="cursor-pointer hover:bg-muted">
                            <TableCell>{ticket.queryType}</TableCell>
                            <TableCell>
                                <Badge variant={ticket.status === 'Open' ? 'default' : ticket.status === 'In Progress' ? 'secondary' : 'outline'}>
                                    {ticket.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={ticket.priority === 'High' ? 'destructive' : ticket.priority === 'Medium' ? 'warning' : 'default'}>
                                    {ticket.priority}
                                </Badge>
                            </TableCell>
                            <TableCell>{ticket.createdAt.toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ScrollArea>
    );
}

function TicketListSkeleton() {
    return (
        <ScrollArea className="h-[calc(100vh-200px)]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ScrollArea>
    );
}

function TicketDetails({ ticket, onClose }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{ticket.title}</span>
                    <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{ticket.queryType}</Badge>
                            <Badge variant={ticket.status === 'Open' ? 'default' : ticket.status === 'In Progress' ? 'secondary' : 'outline'}>
                                {ticket.status}
                            </Badge>
                            <Badge variant={ticket.priority === 'High' ? 'destructive' : ticket.priority === 'Medium' ? 'warning' : 'default'}>
                                {ticket.priority}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <p><strong>Created:</strong> {ticket.createdAt.toLocaleDateString()}</p>
                            <p><strong>Author:</strong> {ticket.author}</p>
                            <p><strong>Query Type:</strong> {ticket.queryType}</p>
                            <p><strong>Sign Off:</strong> {ticket.signOff || 'N/A'}</p>
                        </div>
                        <div>
                            <p><strong>Client Note:</strong> {ticket.clientNote}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Admin Details</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <p><strong>Action Start:</strong> {ticket.actionStartDate?.toLocaleString() || 'N/A'}</p>
                                <p><strong>Admin:</strong> {ticket.admin || 'N/A'}</p>
                                <p><strong>Dispatcher:</strong> {ticket.dispatcher || 'N/A'}</p>
                                <p><strong>Admin Status:</strong> {ticket.adminStatus || 'N/A'}</p>
                                <p><strong>Support Type:</strong> {ticket.supportType || 'N/A'}</p>
                                <p><strong>Time Spent:</strong> {ticket.timeSpent ? `${ticket.timeSpent} minutes` : 'N/A'}</p>
                            </div>
                            <p><strong>Action Performed:</strong> {ticket.actionPerformed || 'N/A'}</p>
                            {ticket.steps && ticket.steps.length > 0 && (
                                <div className="mt-2">
                                    <strong>Steps:</strong>
                                    <ul className="list-disc list-inside">
                                        {ticket.steps.map((step, index) => (
                                            <li key={index}>{step}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p><strong>Ghost:</strong> {ticket.ghost ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}