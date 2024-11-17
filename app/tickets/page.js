'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/authContext";

export default function TicketDashboard() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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

    const filteredTickets = tickets.filter(ticket =>
        filterStatus === 'all' || ticket.status === filterStatus
    )

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-4 md:mb-0">Твоите билети</h1>
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
                    <CardTitle className="text-2xl text-blue-600">Преглед на билетите</CardTitle>
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
                                        <TableHead className="text-blue-600">Запитване</TableHead>
                                        <TableHead className="text-blue-600">Състояние</TableHead>
                                        <TableHead className="text-blue-600">Приоритет</TableHead>
                                        <TableHead className="text-blue-600">Събитие</TableHead>
                                        <TableHead className="text-blue-600">Статус</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTickets.map((ticket) => (
                                        <TableRow key={ticket.id}>
                                            <TableCell>{ticket.id}</TableCell>
                                            <TableCell>{ticket.issue_type}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={ticket.status} />
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="hidden lg:table-cell">{ticket.state}</TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <PriorityBadge priority={ticket.priority} />
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
                    <Skeleton className="h-4 w-[140px]" />
                    <Skeleton className="h-4 w-[120px]" />
                </div>
            ))}
        </div>
    )
}