"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Plus, Trash2, Edit, Save, RefreshCw, AlertTriangle, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AdminBadge from "@/app/tickets/shared/components/AdminBadge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Predefined category types with friendly names
const CATEGORY_TYPES = {
    issueType: "Issue Types",
    condition: "Conditions",
    priority: "Priorities",
    event: "Events",
}

export default function CategoriesPage() {
    const { role } = useAuth()
    const router = useRouter()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("issueType")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentCategory, setCurrentCategory] = useState(null)
    const [isSavingOrder, setIsSavingOrder] = useState(false)
    const [isOrderDirty, setIsOrderDirty] = useState(false)
    const [formData, setFormData] = useState({
        type: "issueType",
        value: "",
        label: "",
        description: "",
    })

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/categories")
            if (!res.ok) {
                throw new Error("Failed to fetch categories")
            }
            const data = await res.json()
            setCategories(data.categories)
        } catch (error) {
            console.error("Error fetching categories:", error)
            toast.error("Failed to load categories")
        } finally {
            setLoading(false)
        }
    }

    const handleAddCategory = async () => {
        try {
            // Validate form
            if (!formData.value || !formData.label) {
                toast.error("Value and label are required")
                return
            }

            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    description: formData.type === "priority" ? formData.description : null,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Failed to add category")
            }

            // Success
            toast.success("Category item added successfully")
            setIsAddDialogOpen(false)
            setFormData({ ...formData, value: "", label: "" })
            fetchCategories()
        } catch (error) {
            console.error("Error adding category:", error)
            toast.error(error.message)
        }
    }

    const handleEditCategory = async () => {
        try {
            // Validate form
            if (!formData.value || !formData.label) {
                toast.error("Value and label are required")
                return
            }

            const res = await fetch(`/api/admin/categories/${currentCategory.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    description: formData.type === "priority" ? formData.description : null,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Failed to update category")
            }

            // Success
            toast.success("Category item updated successfully")
            setIsEditDialogOpen(false)
            setCurrentCategory(null)
            setFormData({ ...formData, value: "", label: "" })
            fetchCategories()
        } catch (error) {
            console.error("Error updating category:", error)
            toast.error(error.message)
        }
    }

    const handleDeleteCategory = async () => {
        try {
            const res = await fetch(`/api/admin/categories/${currentCategory.id}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Failed to delete category")
            }

            // Success
            toast.success("Category item deleted successfully")
            setIsDeleteDialogOpen(false)
            setCurrentCategory(null)
            fetchCategories()
        } catch (error) {
            console.error("Error deleting category:", error)
            toast.error(error.message)
        }
    }

    const openEditDialog = (category) => {
        setCurrentCategory(category)
        setFormData({
            type: category.type,
            value: category.value,
            label: category.label,
            description: category.description || "",
        })
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (category) => {
        setCurrentCategory(category)
        setIsDeleteDialogOpen(true)
    }

    const openAddDialog = (type) => {
        setFormData({
            type: type,
            value: "",
            label: "",
        })
        setIsAddDialogOpen(true)
    }

    // Drag & Drop helpers
    function SortableRow({ category, children }) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id })
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        }
        return (
            <TableRow ref={setNodeRef} style={style} className={isDragging ? "opacity-50" : ""}>
                <TableCell className="w-[36px]">
                    <button
                        aria-label="Drag handle"
                        {...attributes}
                        {...listeners}
                        className="cursor-grab p-1 text-gray-400 hover:text-gray-600"
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                </TableCell>
                {children}
            </TableRow>
        )
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        setCategories((prev) => {
            const currentType = activeTab
            const withinType = prev.filter((c) => c.type === currentType)
            const otherTypes = prev.filter((c) => c.type !== currentType)
            const oldIndex = withinType.findIndex((c) => c.id === active.id)
            const newIndex = withinType.findIndex((c) => c.id === over.id)
            const moved = arrayMove(withinType, oldIndex, newIndex)
            setIsOrderDirty(true)
            return [...otherTypes, ...moved]
        })
    }

    const handleSaveOrder = async () => {
        try {
            setIsSavingOrder(true)
            const orderedIds = categories
                .filter((c) => c.type === activeTab)
                .map((c) => c.id)
            const res = await fetch("/api/admin/categories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: activeTab, orderedIds }),
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || "Failed to save order")
            }
            toast.success("Order saved")
            setIsOrderDirty(false)
            fetchCategories()
        } catch (e) {
            console.error(e)
            toast.error(e.message)
        } finally {
            setIsSavingOrder(false)
        }
    }

    // Filter categories based on the active tab
    const filteredCategories = categories.filter((cat) => cat.type === activeTab)

    // If not admin, redirect (this is a backup to middleware protection)
    if (role !== "admin") {
        return (
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
                <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                <Button onClick={() => router.push("/tickets")}>Return to Tickets</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer position="top-center" />

            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <motion.h1
                        className="text-3xl font-bold text-purple-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Category Management
                    </motion.h1>
                    <AdminBadge className="ml-3" />
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchCategories}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <Tabs defaultValue="issueType" value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex justify-between items-center mb-6">
                        <TabsList>
                            {Object.entries(CATEGORY_TYPES).map(([type, label]) => (
                                <TabsTrigger key={type} value={type} className="px-4 py-2">
                                    {label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="flex items-center gap-2">
                            {isOrderDirty && (
                                <Button onClick={handleSaveOrder} disabled={isSavingOrder} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                                    <Save className="h-4 w-4" />
                                    <span>{isSavingOrder ? "Saving..." : "Save Order"}</span>
                                </Button>
                            )}
                            <Button
                                onClick={() => openAddDialog(activeTab)}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add {CATEGORY_TYPES[activeTab].slice(0, -1)}</span>
                            </Button>
                        </div>
                    </div>

                    {Object.keys(CATEGORY_TYPES).map((type) => (
                        <TabsContent key={type} value={type} className="pt-2">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
                                </div>
                            ) : filteredCategories.length > 0 ? (
                                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={filteredCategories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[36px]"></TableHead>
                                                        <TableHead>Value</TableHead>
                                                        <TableHead>Label</TableHead>
                                                        {activeTab === "priority" && <TableHead>Description</TableHead>}
                                                        <TableHead className="text-right w-[120px]">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredCategories.map((category) => (
                                                        <SortableRow key={category.id} category={category}>
                                                            <TableCell className="font-medium">{category.value}</TableCell>
                                                            <TableCell>{category.label}</TableCell>
                                                            {activeTab === "priority" && (
                                                                <TableCell className="text-sm text-gray-700 italic">
                                                                    {category.description || <span className="text-gray-400">No description</span>}
                                                                </TableCell>
                                                            )}
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openEditDialog(category)}
                                                                        className="h-8 w-8 p-0 text-blue-600"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                        <span className="sr-only">Edit</span>
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openDeleteDialog(category)}
                                                                        className="h-8 w-8 p-0 text-red-600"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                        <span className="sr-only">Delete</span>
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </SortableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="bg-gray-100 rounded-full p-3 mb-4">
                                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
                                    <p className="text-gray-500 mb-4">
                                        There are no items in the {CATEGORY_TYPES[activeTab]} category yet.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openAddDialog(activeTab)}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add {CATEGORY_TYPES[activeTab].slice(0, -1)}</span>
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Add Category Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New {CATEGORY_TYPES[formData.type]?.slice(0, -1)}</DialogTitle>
                        <DialogDescription>Add a new item to the {CATEGORY_TYPES[formData.type]} category.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="value" className="text-right text-sm font-medium">
                                Value
                            </label>
                            <div className="col-span-3">
                                <Input
                                    id="value"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    placeholder="e.g. hardware-issue, urgent"
                                />
                                <p className="text-xs text-gray-500 mt-1">The value stored in the database</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="label" className="text-right text-sm font-medium">
                                Label
                            </label>
                            <div className="col-span-3">
                                <Input
                                    id="label"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="e.g. Hardware Issue, Urgent"
                                />
                                <p className="text-xs text-gray-500 mt-1">The text displayed to users</p>
                            </div>
                        </div>

                        {formData.type === "priority" && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="description" className="text-right text-sm font-medium">
                                    Description
                                </label>
                                <div className="col-span-3">
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Optional description (tooltip info)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Shown as tooltip on (i) icon for priorities</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddCategory} className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit {CATEGORY_TYPES[formData.type]?.slice(0, -1)}</DialogTitle>
                        <DialogDescription>Update this item in the {CATEGORY_TYPES[formData.type]} category.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-value" className="text-right text-sm font-medium">
                                Value
                            </label>
                            <div className="col-span-3">
                                <Input
                                    id="edit-value"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-label" className="text-right text-sm font-medium">
                                Label
                            </label>
                            <div className="col-span-3">
                                <Input
                                    id="edit-label"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                />
                            </div>
                        </div>

                        {formData.type === "priority" && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="edit-description" className="text-right text-sm font-medium">
                                    Description
                                </label>
                                <div className="col-span-3">
                                    <Input
                                        id="edit-description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditCategory} className="bg-blue-600 hover:bg-blue-700">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the item "{currentCategory?.label}" from the{" "}
                            {currentCategory && CATEGORY_TYPES[currentCategory.type]} category. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-600 hover:bg-red-700 text-white">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )

}
