'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { useAuth } from "@/lib/AuthContext"

export default function TicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const router = useRouter();
    const { isLoggedIn, loading: authLoading, logout } = useAuth();
    // const isLoggedIn = true, authLoading = false;

    useEffect(() => {
        console.log("test");
        if (authLoading) return;

        if (!isLoggedIn) {
            router.push('/login');
        } else {
            loadTickets();
        }
    }, [isLoggedIn, authLoading, router]);

    const fetchTickets = async () => {
        try {
            const response = await fetch('/api/getTickets', {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            });

            if (response.ok) {
                const tickets = await response.json();
                setTickets(tickets);
                setError('');
            } else if (response.status === 401) {
                await logout();
                router.push('/login');
            } else {
                setError('Failed to load tickets.');
            }
        } catch {
            setError('Error fetching tickets. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadTickets = async () => {
        setLoading(true);
        try {
            await fetchTickets();
        } catch {
            setError('Failed to load tickets.');
        } finally {
            setLoading(false);
        }
    };

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleCloseDetails = () => {
        setSelectedTicket(null);
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold mb-6 text-blue-800 border-b-2 border-blue-300 pb-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2">Tickets</span>
                Management
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-bold">Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <TicketListSkeleton />
                        ) : error ? (
                            <p className="text-destructive">{error}</p>
                        ) : (
                            <TicketList
                                tickets={tickets}
                                onTicketClick={handleTicketClick}
                                selectedTicketId={selectedTicket?.id}
                            />
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="font-bold">Ticket Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedTicket ? (
                            <TicketDetails ticket={selectedTicket} onClose={handleCloseDetails} />
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <p>Select a ticket to view details</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function TicketList({ tickets, onTicketClick, selectedTicketId }) {
    return (
        <ScrollArea className="h-[calc(100vh-300px)]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Query Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Category</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow
                            key={ticket.id}
                            onClick={() => onTicketClick(ticket)}
                            className={`cursor-pointer hover:bg-muted ${selectedTicketId === ticket.id ? 'bg-primary/10' : ''
                                }`}
                        >
                            <TableCell>
                                {dayjs(ticket.createdAt).format('DD MMM YYYY, HH:mm')}
                            </TableCell>
                            <TableCell>{ticket.author}</TableCell>
                            <TableCell>{ticket.queryType}</TableCell>
                            <TableCell>{ticket.status}</TableCell>
                            <TableCell>
                                <PriorityBadge priority={ticket.priority} />
                            </TableCell>
                            <TableCell>{ticket.category}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ScrollArea>
    );
}

function PriorityBadge({ priority }) {
    const variants = {
        'Спешен': 'destructive',
        'Стандартен': 'default',
        'Нисък приоритет': 'secondary'
    };

    return (
        <Badge variant={variants[priority] || 'default'}>
            {priority}
        </Badge>
    );
}

function TicketDetails({ ticket, onClose }) {
    return (
        <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{ticket.queryType}</h3>
                    <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
                </div>
                <TicketDetailItem label="Created At" value={dayjs(ticket.createdAt).format('DD MMM YYYY, HH:mm')} />
                <TicketDetailItem label="Author" value={ticket.author} />
                <TicketDetailItem label="Author ID" value={ticket.authorId} />
                <TicketDetailItem label="Query Description" value={ticket.queryDesc || 'N/A'} />
                <TicketDetailItem label="Status" value={ticket.status} />
                <TicketDetailItem label="Status Description" value={ticket.statusDesc || 'N/A'} />
                <TicketDetailItem label="Priority" value={<PriorityBadge priority={ticket.priority} />} />
                <TicketDetailItem label="Category" value={ticket.category} />
                <TicketDetailItem label="Sign Off" value={ticket.signOff || 'N/A'} />
                <TicketDetailItem label="Action Start Date" value={ticket.actionStartDate ? dayjs(ticket.actionStartDate).format('DD MMM YYYY, HH:mm') : 'N/A'} />
                <TicketDetailItem label="Admin" value={ticket.admin || 'N/A'} />
                <TicketDetailItem label="Dispatcher" value={ticket.dispatcher || 'N/A'} />
                <TicketDetailItem label="Admin Status" value={ticket.adminStatus || 'N/A'} />
                <TicketDetailItem label="Support Type" value={ticket.supportType || 'N/A'} />
                <TicketDetailItem label="Action Performed" value={ticket.actionPerformed || 'N/A'} />
                <TicketDetailItem label="Time Spent" value={ticket.timeSpent ? `${ticket.timeSpent} minutes` : 'N/A'} />
                {ticket.steps && (
                    <div>
                        <strong className="font-semibold">Steps:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            {ticket.steps.split('\n').map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <TicketDetailItem label="Ghost" value={ticket.ghost || 'N/A'} />
            </div>
        </ScrollArea>
    );
}

function TicketDetailItem({ label, value }) {
    return (
        <div>
            <strong className="font-semibold">{label}:</strong> {value}
        </div>
    );
}

function TicketListSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Query Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Category</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
