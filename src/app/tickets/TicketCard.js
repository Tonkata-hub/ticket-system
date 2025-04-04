import { Badge } from "@/components/ui/badge"
import { User, CheckCircle } from "lucide-react"

export default function TicketCard({ ticket, onClick }) {
  const statusColor = {
    Open: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "In Progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Urgent: "bg-red-100 text-red-800 hover:bg-red-200",
    Closed: "bg-green-100 text-green-800 hover:bg-green-200",
  }

  const priorityColor = {
    High: "bg-red-100 text-red-800 hover:bg-red-200",
    Medium: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    Low: "bg-green-100 text-green-800 hover:bg-green-200",
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${ticket.statusBadge === "Closed" ? "border-2 border-green-500 bg-gray-100" : ""}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3
          className={`text-lg font-semibold ${ticket.statusBadge === "Closed" ? "line-through text-gray-500" : "text-blue-800"}`}
        >
          {ticket.selectedEvent}
        </h3>
        <span className="text-sm text-gray-500">
          {ticket.uid} - {formatDate(ticket.createdAt)}
        </span>
      </div>
      <p className={`mb-4 line-clamp-2 ${ticket.statusBadge === "Closed" ? "text-gray-500" : "text-gray-600"}`}>
        {ticket.clientNote}
      </p>
      <div className="flex justify-between items-center mb-4">
        <Badge
          className={`${statusColor[ticket.statusBadge]} capitalize ${ticket.statusBadge === "Closed" ? "opacity-60" : ""}`}
        >
          {ticket.statusBadge}
        </Badge>
        <Badge
          className={`${priorityColor[ticket.priority]} capitalize ${ticket.statusBadge === "Closed" ? "opacity-60" : ""}`}
        >
          {ticket.priority}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center text-sm font-medium ${ticket.statusBadge === "Closed" ? "text-gray-500" : "text-blue-600"}`}
        >
          <User className="mr-2 h-4 w-4" />
          Created by: {ticket.createdBy}
        </div>
        {ticket.statusBadge === "Closed" && (
          <div className="flex items-center text-sm text-green-600 font-medium">
            <CheckCircle className="mr-2 h-4 w-4" />
            Closed
          </div>
        )}
      </div>
    </div>
  )
}
