"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  CalendarIcon,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Save,
  GripVertical,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { tasksApi } from "@/api/tasks"
import type { Task, TaskGroup } from "./types"
import { toast } from "sonner"
import { TaskManagementSkeleton } from "./task-management-skeleton"

interface TaskTableRow {
  type: "group" | "task" | "add-group" | "add-task"
  id?: number
  name?: string
  description?: string
  level: number
  parentId?: number
  groupId?: number
  startDate?: string
  endDate?: string
  estimate?: string
  assigneeIds?: number[]
}

export function TaskManagement({ projectId }: { projectId: number }) {
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({})
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState<{ id: number; type: "group" | "task" } | null>(null)
  const [dropTarget, setDropTarget] = useState<{ id: number; type: "group" | "task" } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Adding states
  const [addingRow, setAddingRow] = useState<{ type: "group" | "task"; parentId?: number; level: number } | null>(null)
  const [newItemName, setNewItemName] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const [newItemStartDate, setNewItemStartDate] = useState<Date | undefined>(undefined)
  const [newItemEndDate, setNewItemEndDate] = useState<Date | undefined>(undefined)
  const [newItemEstimate, setNewItemEstimate] = useState<number>(0)
  const [newItemAssignees, setNewItemAssignees] = useState<number[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [groups, projectTasks] = await Promise.all([
          tasksApi.getTaskGroups(projectId),
          tasksApi.getByProjectId(projectId)
        ])
        
        setTaskGroups(groups)
        setTasks(projectTasks)
        
        // Set all groups as expanded by default
        const expandedState = groups.reduce((acc, group) => ({
          ...acc,
          [group.id]: true
        }), {})
        setExpandedGroups(expandedState)
      } catch (error) {
        console.error('Error loading task data:', error)
        toast.error("Failed to load tasks. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [projectId])

  // Add new item
  const addNewItem = async () => {
    if (!addingRow || !newItemName.trim()) return

    setIsSaving(true)
    try {
      if (addingRow.type === "group") {
        const newGroup = await tasksApi.createTaskGroup({
          name: newItemName,
          project_id: projectId,
          parent_id: addingRow.parentId || null,
          created_at: new Date().toISOString()
        })
        
        setTaskGroups([...taskGroups, newGroup])
        setExpandedGroups(prev => ({ ...prev, [newGroup.id]: true }))
        toast.success("New group created successfully.")
      } else {
        const newTask = await tasksApi.create({
          name: newItemName,
          description: newItemDescription,
          project_id: projectId,
          start_date: newItemStartDate ? format(newItemStartDate, "yyyy-MM-dd") : null,
          end_date: newItemEndDate ? format(newItemEndDate, "yyyy-MM-dd") : null,
          estimate: newItemEstimate ? newItemEstimate.toString() : null,
          created_at: new Date().toISOString()
        })
        
        setTasks([...tasks, newTask])
        toast.success("New task created successfully.")
      }
    } catch (error) {
      console.error('Error creating new item:', error)
      toast.error(`Failed to create new ${addingRow.type}. Please try again.`)
    } finally {
      setIsSaving(false)
      setAddingRow(null)
      setNewItemName("")
      setNewItemDescription("")
      setNewItemStartDate(undefined)
      setNewItemEndDate(undefined)
      setNewItemEstimate(0)
      setNewItemAssignees([])
    }
  }

  // Delete item
  const deleteItem = async (id: number, type: "group" | "task") => {
    try {
      if (type === "group") {
        // Delete child groups and tasks recursively
        const deleteGroupRecursive = async (groupId: number) => {
          const childGroups = taskGroups.filter(g => g.parent_id === groupId)
          for (const child of childGroups) {
            await deleteGroupRecursive(child.id)
          }
          // Delete tasks in this group
          const groupTasks = tasks.filter(t => t.task_group_id === groupId)
          for (const task of groupTasks) {
            await tasksApi.delete(task.id)
          }
        }
        
        await deleteGroupRecursive(id)
        await tasksApi.deleteTaskGroup(id)
        
        setTaskGroups(groups => groups.filter(g => g.id !== id))
        setTasks(tasks => tasks.filter(t => t.task_group_id !== id))
      } else {
        await tasksApi.delete(id)
        setTasks(tasks => tasks.filter(t => t.id !== id))
      }

      toast.success(`${type === "group" ? "Group" : "Task"} deleted successfully.`)
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error(`Failed to delete ${type}. Please try again.`)
    }
  }

  // Toggle group expansion
  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  // Build table rows
  const buildTableRows = (): TaskTableRow[] => {
    const rows: TaskTableRow[] = []

    const addGroupRows = (parentId: number | null, level: number) => {
      const groups = taskGroups.filter((g) => g.parent_id === parentId)

      groups.forEach((group) => {
        // Add group row
        rows.push({
          type: "group",
          id: group.id,
          name: group.name,
          level,
        })

        if (expandedGroups[group.id]) {
          // Add child groups
          addGroupRows(group.id, level + 1)

          // Add tasks for this group
          const groupTasks = tasks.filter((t) => t.task_group_id === group.id)
          groupTasks.forEach((task) => {
            rows.push({
              type: "task",
              id: task.id,
              name: task.name,
              description: task.description || "",
              level: level + 1,
              groupId: group.id,
              startDate: task.start_date || undefined,
              endDate: task.end_date || undefined,
              estimate: task.estimate || undefined,
              assigneeIds: task.assignee_ids,
            })
          })

          // Add "add task" row if we're adding to this group
          if (addingRow?.type === "task" && addingRow.parentId === group.id) {
            rows.push({
              type: "add-task",
              level: level + 1,
              parentId: group.id,
            })
          }
        }

        // Add "add child group" row if we're adding to this group
        if (addingRow?.type === "group" && addingRow.parentId === group.id) {
          rows.push({
            type: "add-group",
            level: level + 1,
            parentId: group.id,
          })
        }
      })
    }

    addGroupRows(null, 0)

    // Add "add top-level group" row
    if (addingRow?.type === "group" && !addingRow.parentId) {
      rows.push({
        type: "add-group",
        level: 0,
      })
    }

    return rows
  }

  const tableRows = buildTableRows()

  if (isLoading) {
    return <TaskManagementSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button onClick={() => setAddingRow({ type: "group", level: 0 })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectAll}
                onCheckedChange={(checked) => {
                  setSelectAll(checked as boolean)
                  if (checked) {
                    const allIds = new Set<string>()
                    taskGroups.forEach((group) => {
                      allIds.add(`group-${group.id}`)
                      tasks
                        .filter((task) => task.task_group_id === group.id)
                        .forEach((task) => allIds.add(`task-${task.id}`))
                    })
                    setSelectedRows(allIds)
                  } else {
                    setSelectedRows(new Set())
                  }
                }}
              />
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Estimate</TableHead>
            <TableHead>Assignees</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableRows.map((row, index) => (
            <TableRow
              key={`${row.type}-${row.id || index}`}
              className={cn(
                "group",
                row.type === "add-group" || row.type === "add-task" ? "bg-muted/50" : "",
                isDragging && draggedItem?.id === row.id ? "opacity-50" : "",
                isDragging && dropTarget?.id === row.id ? "border-2 border-primary" : ""
              )}
              draggable={row.type === "group" || row.type === "task"}
              onDragStart={(e) => {
                if (row.type === "group" || row.type === "task") {
                  setIsDragging(true)
                  setDraggedItem({ id: row.id!, type: row.type })
                  e.dataTransfer.setData("text/plain", `${row.type}-${row.id}`)
                }
              }}
              onDragEnd={() => {
                setIsDragging(false)
                setDraggedItem(null)
                setDropTarget(null)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                if (row.type === "group" || row.type === "task") {
                  setDropTarget({ id: row.id!, type: row.type })
                }
              }}
              onDrop={(e) => {
                e.preventDefault()
                if (!draggedItem || !dropTarget) return
                // Handle drop logic here
              }}
            >
              <TableCell>
                {row.type !== "add-group" && row.type !== "add-task" && (
                  <Checkbox
                    checked={selectedRows.has(`${row.type}-${row.id}`)}
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedRows)
                      if (checked) {
                        newSelected.add(`${row.type}-${row.id}`)
                      } else {
                        newSelected.delete(`${row.type}-${row.id}`)
                      }
                      setSelectedRows(newSelected)
                    }}
                  />
                )}
              </TableCell>
              <TableCell>
                {row.type === "group" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleGroup(row.id!)}
                  >
                    {expandedGroups[row.id!] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
                {row.type === "task" && (
                  <div className="h-8 w-8 flex items-center justify-center">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2" style={{ paddingLeft: `${row.level * 20}px` }}>
                  {row.type === "add-group" || row.type === "add-task" ? (
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder={`Enter ${row.type === "add-group" ? "group" : "task"} name`}
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full"
                      />
                      {row.type === "add-task" && (
                        <Textarea
                          placeholder="Enter task description"
                          value={newItemDescription}
                          onChange={(e) => setNewItemDescription(e.target.value)}
                          className="w-full"
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      <span>{row.name}</span>
                      {row.type === "group" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          onClick={() => setAddingRow({ type: "task", level: row.level + 1, parentId: row.id })}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {row.type === "add-task" ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !newItemStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newItemStartDate ? format(newItemStartDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newItemStartDate}
                        onSelect={setNewItemStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  row.startDate && format(new Date(row.startDate), "MMM d, yyyy")
                )}
              </TableCell>
              <TableCell>
                {row.type === "add-task" ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !newItemEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newItemEndDate ? format(newItemEndDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newItemEndDate}
                        onSelect={setNewItemEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  row.endDate && format(new Date(row.endDate), "MMM d, yyyy")
                )}
              </TableCell>
              <TableCell>
                {row.type === "add-task" ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={newItemEstimate}
                      onChange={(e) => setNewItemEstimate(parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                ) : (
                  row.estimate && `${row.estimate} hours`
                )}
              </TableCell>
              <TableCell>
                {row.type === "add-task" ? (
                  <div className="flex -space-x-2">
                    {newItemAssignees.map((userId) => (
                      <Avatar key={userId} className="h-8 w-8 border-2 border-background">
                        <AvatarFallback>{userId}</AvatarFallback>
                      </Avatar>
                    ))}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/25"
                      onClick={() => {/* TODO: Implement assignee selection */}}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  row.assigneeIds && (
                    <div className="flex -space-x-2">
                      {row.assigneeIds.map((userId) => (
                        <Avatar key={userId} className="h-8 w-8 border-2 border-background">
                          <AvatarFallback>{userId}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )
                )}
              </TableCell>
              <TableCell>
                {row.type === "add-group" || row.type === "add-task" ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={addNewItem}
                      disabled={isSaving || !newItemName.trim()}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAddingRow(null)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {/* TODO: Implement edit */}}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          if (row.type === "group" || row.type === "task") {
                            deleteItem(row.id!, row.type)
                          }
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
