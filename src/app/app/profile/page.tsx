"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, UserPlus } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const { familyMembers, addFamilyMember, deleteFamilyMember } = useStore()
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("Member")
  const [newMemberColor, setNewMemberColor] = useState("#4F46E5")
  
  const colorOptions = [
    { name: "Indigo", value: "#4F46E5" },
    { name: "Red", value: "#EF4444" },
    { name: "Green", value: "#10B981" },
    { name: "Orange", value: "#F97316" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Yellow", value: "#F59E0B" },
  ]
  
  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addFamilyMember({
        name: newMemberName.trim(),
        role: newMemberRole as "Admin" | "Member",
        color: newMemberColor,
        avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${newMemberName.trim()}`
      })
      setNewMemberName("")
      setNewMemberRole("Member")
      setNewMemberColor("#4F46E5")
      setIsAddMemberOpen(false)
    }
  }
  
  return (
    <div className="container mx-auto max-w-3xl py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Family Members</h1>
        <Button 
          onClick={() => setIsAddMemberOpen(true)} 
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {familyMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback style={{ backgroundColor: member.color }}>
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{member.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span 
                        className="inline-block h-3 w-3 rounded-full" 
                        style={{ backgroundColor: member.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteFamilyMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete member</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 ${
                      newMemberColor === color.value
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNewMemberColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={!newMemberName.trim()}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
