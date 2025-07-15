"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { usersApi } from "@/lib/api/users";
import { teamApi } from "@/lib/api/team";
import type { Team, CreateTeamRequest } from "@/lib/types/api";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const initialNewTeam: CreateTeamRequest = {
  name: "",
  description: "",
  member_ids: [],
};

export function Timview() {
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState<CreateTeamRequest>(initialNewTeam);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editTeamId, setEditTeamId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [memberSearch, setMemberSearch] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const data = await teamApi.getAll();
      setTeams(data);
    } catch (error) {
      console.error("❌ Failed to fetch teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await usersApi.getAll({ limit: 100 });
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Gagal mengambil user:", error);
    }
  };

  const toggleMember = (userId: number) => {
    setNewTeam((prev) => ({
      ...prev,
      member_ids: prev.member_ids.includes(userId)
        ? prev.member_ids.filter((id) => id !== userId)
        : [...prev.member_ids, userId],
    }));
  };

  const handleCreateTeam = async () => {
    if (newTeam.name.trim().length < 3) {
      setErrorMsg("Nama tim minimal 3 karakter.");
      setShowErrorDialog(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setShowErrorDialog(false);

    try {
      await teamApi.create({
        ...newTeam,
        member_ids: [...new Set(newTeam.member_ids)],
      });
      setNewTeam(initialNewTeam);
      setIsCreateDialogOpen(false);
      fetchTeams();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.name?.[0] ||
        "Gagal membuat tim.";
      setErrorMsg(message);
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTeam = async () => {
    if (newTeam.name.trim().length < 3) {
      setErrorMsg("Team name must be at least 3 characters.");
      setShowErrorDialog(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setShowErrorDialog(false);

    try {
      if (editTeamId !== null) {
        await teamApi.update(editTeamId, {
          ...newTeam,
          member_ids: [...new Set(newTeam.member_ids)],
        });

        setIsEditDialogOpen(false);
        setNewTeam(initialNewTeam);
        setEditTeamId(null);
        fetchTeams();
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.name?.[0] ||
        "Failed to update team.";
      setErrorMsg(message);
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      user.id.toString() === memberSearch
  );

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditDialog = (team: Team) => {
    setEditTeamId(team.id);
    setNewTeam({
      name: team.name,
      description: team.description || "",
      member_ids: team.members?.map((m) => m.id) || [],
    });
    setIsEditDialogOpen(true);
  };

  const renderUserLabel = (userId: number) => {
    const isSelected = newTeam.member_ids.includes(userId);
    const userName = users.find((u) => u.id === userId)?.name || "-";
    return (
      <div
        key={userId}
        onClick={() => toggleMember(userId)}
        className={`cursor-pointer px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex justify-between items-center ${
          isSelected ? "bg-green-100 dark:bg-green-900" : ""
        }`}
      >
        <span>{userName}</span>
        {isSelected && <Badge variant="outline">Terdaftar</Badge>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-navy-100">
            Manage Teams
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            List of your teams
          </p>
        </div>
        <Button
          className="bg-navy-600 hover:bg-navy-700"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>Select team name and members.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Team Name</Label>
            <Input
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              placeholder="e.g. Developer Squad"
            />

            <Label>Description</Label>
            <Textarea
              value={newTeam.description}
              onChange={(e) =>
                setNewTeam({ ...newTeam, description: e.target.value })
              }
              placeholder="Brief description"
            />

            <div>
              <Label>Search Members</Label>
              <Input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search user by name"
              />
              <div className="mt-2 border rounded max-h-40 overflow-y-auto divide-y">
                {filteredUsers.map((u) => renderUserLabel(u.id))}
                {filteredUsers.length === 0 && (
                  <p className="p-2 text-sm text-slate-500 text-center">
                    No users found.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTeam} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Team Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Update your team information.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-team-name">Team Name</Label>
              <Input
                id="edit-team-name"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
                placeholder="Enter new team name"
              />
            </div>
            <div>
              <Label htmlFor="edit-team-description">Description</Label>
              <Textarea
                id="edit-team-description"
                value={newTeam.description}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, description: e.target.value })
                }
                placeholder="Enter team description"
              />
            </div>
            <div>
              <Label>Search Members</Label>
              <Input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search user by name"
              />
              <div className="mt-2 border rounded max-h-40 overflow-y-auto divide-y">
                {filteredUsers.map((u) => renderUserLabel(u.id))}
                {filteredUsers.length === 0 && (
                  <p className="p-2 text-sm text-slate-500 text-center">
                    No users found.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTeam} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="mx-auto w-10 h-10 border-4 border-navy-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading teams...</p>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No teams found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your search or create a new team to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="card-hover">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {team.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(team)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setTeamToDelete(team)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <p>
                    <strong>ID:</strong> {team.id}
                  </p>
                  <p>
                    <strong>Nama:</strong> {team.name}
                  </p>
                  <p>
                    <strong>Deskripsi:</strong>{" "}
                    {team.description || "Tidak ada deskripsi"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {team.is_active ? "Aktif" : "Non-aktif"}
                  </p>
                  <p>
                    <strong>Dibuat oleh:</strong> {team.creator?.name} (ID:{" "}
                    {team.created_by})
                  </p>
                  <p>
                    <strong>Jumlah Anggota:</strong> {team.members?.length || 0}
                  </p>
                  <p>
                    <strong>Anggota:</strong>{" "}
                    {team.members && team.members.length > 0
                      ? team.members.map((m) => m.name).join(", ")
                      : "Belum ada anggota"}
                  </p>
                  <p>
                    <strong>Jumlah Project:</strong>{" "}
                    {team.projects?.length || 0}
                  </p>
                  <p>
                    <strong>Total Sprint:</strong>{" "}
                    {team.projects?.reduce(
                      (acc, project) => acc + (project.sprints?.length || 0),
                      0
                    ) || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className="sm:max-w-[400px] text-center">
          <AlertDialogHeader>
            <div className="text-5xl text-red-500 mb-2">⚠️</div>
            <AlertDialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
              Notification
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-slate-700 dark:text-slate-300">
              {errorMsg || "Failed to update team."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex justify-center">
            <AlertDialogCancel
              className="px-6 py-2 bg-red-600 text-white hover:bg-red-700"
              onClick={() => setShowErrorDialog(false)}
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!teamToDelete}
        onOpenChange={(open) => !open && setTeamToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tim</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus tim{" "}
              <strong>{teamToDelete?.name}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (teamToDelete) {
                  try {
                    await teamApi.delete(teamToDelete.id);
                    setTeamToDelete(null);
                    fetchTeams();
                  } catch (error) {
                    console.error("Gagal menghapus tim:", error);
                  }
                }
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
