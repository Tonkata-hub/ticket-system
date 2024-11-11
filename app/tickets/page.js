'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/authContext";

export default function TicketDashboard() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const { isLoggedIn, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const a = fetchTickets();
        console.log(a);
        if (authLoading) return;

        if (!isLoggedIn) {
            router.push('/login');
        } else {
            loadTickets();
        }
    }, [isLoggedIn, authLoading, router]);

    const fetchTickets = async (userID) => {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // return [
        //     { id: '1', title: 'PC not working', status: 'open', createdAt: '2024-03-01', issueType: 'pc', condition: 'not-working', priority: 'urgent', event: 'no' },
        //     { id: '2', title: 'Software installation issue', status: 'in-progress', createdAt: '2024-03-02', issueType: 'apps', condition: 'slow-issues', priority: 'standard', event: 'yes' },
        //     { id: '3', title: 'Network connectivity problem', status: 'resolved', createdAt: '2024-03-03', issueType: 'networks', condition: 'review-hardware', priority: 'standard', event: 'yes' },
        // ]
        try {
            const response = await fetch('/api/getTickets', {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            });

            if (response.ok) {
                const tickets = await response.json();
                setTickets(tickets);
                setError('');
                return tickets;
            } else {
                setError('Failed to load tickets.');
            }
        } catch (error) {
            setError('Error fetching tickets. Please try again.');
        }
    }

    const loadTickets = async () => {
        setLoading(true);
        try {
            const fetchedTickets = await fetchTickets();
            setTickets(fetchedTickets);
            setError('');
        } catch (err) {
            setError('Failed to load tickets. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleCloseTicket = (ticketId) => {
        console.log('Closing ticket:', ticketId);
        loadTickets();
    }

    const filteredTickets = tickets.filter(ticket =>
        filterStatus === 'all' || ticket.status === filterStatus
    )

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-4 md:mb-0">Your Tickets</h1>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={loadTickets} variant="outline" className="w-full sm:w-auto hover:bg-blue-100">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            <Card className="border-blue-200 shadow-lg overflow-hidden">
                <CardHeader className="bg-blue-50 border-b border-blue-200">
                    <CardTitle className="text-2xl text-blue-600">Ticket Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <TicketTableSkeleton />
                    ) : error ? (
                        <p className="text-red-500 p-4">{error}</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-blue-600">ID</TableHead>
                                        <TableHead className="text-blue-600">Title</TableHead>
                                        <TableHead className="text-blue-600">Status</TableHead>
                                        <TableHead className="text-blue-600 hidden md:table-cell">Created At</TableHead>
                                        <TableHead className="text-blue-600 hidden lg:table-cell">Issue Type</TableHead>
                                        <TableHead className="text-blue-600 hidden lg:table-cell">Priority</TableHead>
                                        <TableHead className="text-blue-600">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTickets.map((ticket) => (
                                        <TableRow key={ticket.id}>
                                            <TableCell>{ticket.id}</TableCell>
                                            <TableCell>{ticket.title}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={ticket.status} />
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="hidden lg:table-cell">{ticket.issueType}</TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <PriorityBadge priority={ticket.priority} />
                                            </TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" onClick={() => setSelectedTicket(ticket)} className="hover:bg-blue-100">View</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-white max-w-3xl w-full">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl text-blue-600">Ticket Details</DialogTitle>
                                                        </DialogHeader>
                                                        <TicketDetails ticket={selectedTicket} onClose={handleCloseTicket} />
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function StatusBadge({ status }) {
    const statusConfig = {
        'open': { icon: AlertCircle, className: 'bg-yellow-100 text-yellow-800' },
        'in-progress': { icon: Clock, className: 'bg-blue-100 text-blue-800' },
        'resolved': { icon: CheckCircle, className: 'bg-green-100 text-green-800' },
    }

    const { icon: Icon, className } = statusConfig[status] || statusConfig.open

    return (
        <Badge variant="outline" className={`${className} flex items-center gap-1`}>
            <Icon className="w-3 h-3" />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </Badge>
    )
}

function PriorityBadge({ priority }) {
    const priorityConfig = {
        urgent: 'bg-red-100 text-red-800',
        priority: 'bg-orange-100 text-orange-800',
        standard: 'bg-green-100 text-green-800',
    }

    return (
        <Badge variant="outline" className={priorityConfig[priority] || priorityConfig.standard}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
    )
}

function TicketDetails({ ticket, onClose }) {
    if (!ticket) return null

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label className="text-blue-600">Ticket ID</Label>
                    <Input value={ticket.id} readOnly />
                </div>
                <div>
                    <Label className="text-blue-600">Title</Label>
                    <Input value={ticket.title} readOnly />
                </div>
                <div>
                    <Label className="text-blue-600">Status</Label>
                    <div className="mt-1">
                        <StatusBadge status={ticket.status} />
                    </div>
                </div>
                <div>
                    <Label className="text-blue-600">Created At</Label>
                    <Input value={new Date(ticket.createdAt).toLocaleString()} readOnly />
                </div>
                <div>
                    <Label className="text-blue-600">Issue Type</Label>
                    <Input value={ticket.issueType} readOnly />
                </div>
                <div>
                    <Label className="text-blue-600">Condition</Label>
                    <Input value={ticket.condition} readOnly />
                </div>
                <div>
                    <Label className="text-blue-600">Priority</Label>
                    <div className="mt-1">
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                </div>
                <div>
                    <Label className="text-blue-600">Event</Label>
                    <Input value={ticket.event} readOnly />
                </div>
            </div>
            <div>
                <Label className="text-blue-600">Description</Label>
                <textarea
                    className="w-full p-2 border rounded border-gray-300 bg-gray-50"
                    rows={4}
                    value="This is a sample description for the ticket. In a real application, this would contain detailed information about the issue."
                    readOnly
                />
            </div>
            {ticket.status !== 'resolved' && (
                <Button onClick={() => onClose(ticket.id)} variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">Close Ticket</Button>
            )}
        </div>
    )
}

function TicketTableSkeleton() {
    return (
        <div className="space-y-4 p-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[140px]" />
                    <Skeleton className="h-4 w-[140px]" />
                    <Skeleton className="h-4 w-[140px]" />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            ))}
        </div>
    )
}