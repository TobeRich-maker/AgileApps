"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  ExternalLink,
  Settings,
  FolderSyncIcon as Sync,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CalendarIntegration {
  id: string
  name: string
  type: "google" | "outlook" | "apple"
  connected: boolean
  lastSync: string
  syncEnabled: boolean
  syncSettings: {
    sprints: boolean
    deadlines: boolean
    meetings: boolean
    personalTasks: boolean
  }
}

// Mock calendar integrations
const mockIntegrations: CalendarIntegration[] = [
  {
    id: "1",
    name: "Google Calendar",
    type: "google",
    connected: true,
    lastSync: "2024-01-25T10:30:00Z",
    syncEnabled: true,
    syncSettings: {
      sprints: true,
      deadlines: true,
      meetings: true,
      personalTasks: false,
    },
  },
  {
    id: "2",
    name: "Outlook Calendar",
    type: "outlook",
    connected: false,
    lastSync: "",
    syncEnabled: false,
    syncSettings: {
      sprints: false,
      deadlines: false,
      meetings: false,
      personalTasks: false,
    },
  },
  {
    id: "3",
    name: "Apple Calendar",
    type: "apple",
    connected: false,
    lastSync: "",
    syncEnabled: false,
    syncSettings: {
      sprints: false,
      deadlines: false,
      meetings: false,
      personalTasks: false,
    },
  },
]

export function CalendarSync() {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>(mockIntegrations)
  const [selectedIntegration, setSelectedIntegration] = useState<CalendarIntegration | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const connectCalendar = (integrationId: string) => {
    // In a real app, this would initiate OAuth flow
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              connected: true,
              lastSync: new Date().toISOString(),
              syncEnabled: true,
            }
          : integration,
      ),
    )
  }

  const disconnectCalendar = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              connected: false,
              lastSync: "",
              syncEnabled: false,
              syncSettings: {
                sprints: false,
                deadlines: false,
                meetings: false,
                personalTasks: false,
              },
            }
          : integration,
      ),
    )
  }

  const toggleSync = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, syncEnabled: !integration.syncEnabled } : integration,
      ),
    )
  }

  const updateSyncSettings = (integrationId: string, settings: Partial<CalendarIntegration["syncSettings"]>) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              syncSettings: { ...integration.syncSettings, ...settings },
              lastSync: new Date().toISOString(),
            }
          : integration,
      ),
    )
  }

  const syncNow = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, lastSync: new Date().toISOString() } : integration,
      ),
    )
  }

  const getCalendarIcon = (type: CalendarIntegration["type"]) => {
    switch (type) {
      case "google":
        return "🗓️"
      case "outlook":
        return "📅"
      case "apple":
        return "🍎"
    }
  }

  const getStatusColor = (integration: CalendarIntegration) => {
    if (!integration.connected) return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
    if (!integration.syncEnabled) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  }

  const getStatusText = (integration: CalendarIntegration) => {
    if (!integration.connected) return "Not Connected"
    if (!integration.syncEnabled) return "Connected (Sync Disabled)"
    return "Connected & Syncing"
  }

  const formatLastSync = (lastSync: string) => {
    if (!lastSync) return "Never"
    const date = new Date(lastSync)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-navy-900 dark:text-navy-100 mb-2">Calendar Integration</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Sync your SprintFlow events with external calendar applications
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCalendarIcon(integration.type)}</span>
                  <CardTitle className="text-base">{integration.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(integration)}>
                  {integration.connected ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {getStatusText(integration)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {integration.connected ? (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`sync-${integration.id}`} className="text-sm">
                      Enable Sync
                    </Label>
                    <Switch
                      id={`sync-${integration.id}`}
                      checked={integration.syncEnabled}
                      onCheckedChange={() => toggleSync(integration.id)}
                    />
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3" />
                      Last sync: {formatLastSync(integration.lastSync)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncNow(integration.id)}
                      disabled={!integration.syncEnabled}
                    >
                      <Sync className="h-3 w-3 mr-1" />
                      Sync Now
                    </Button>

                    <Dialog
                      open={isSettingsOpen && selectedIntegration?.id === integration.id}
                      onOpenChange={(open) => {
                        setIsSettingsOpen(open)
                        if (open) setSelectedIntegration(integration)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Sync Settings - {integration.name}</DialogTitle>
                          <DialogDescription>Choose which events to sync with your calendar</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="sync-sprints">Sprint Events</Label>
                            <Switch
                              id="sync-sprints"
                              checked={integration.syncSettings.sprints}
                              onCheckedChange={(checked) => updateSyncSettings(integration.id, { sprints: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="sync-deadlines">Deadlines</Label>
                            <Switch
                              id="sync-deadlines"
                              checked={integration.syncSettings.deadlines}
                              onCheckedChange={(checked) => updateSyncSettings(integration.id, { deadlines: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="sync-meetings">Team Meetings</Label>
                            <Switch
                              id="sync-meetings"
                              checked={integration.syncSettings.meetings}
                              onCheckedChange={(checked) => updateSyncSettings(integration.id, { meetings: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="sync-personal">Personal Tasks</Label>
                            <Switch
                              id="sync-personal"
                              checked={integration.syncSettings.personalTasks}
                              onCheckedChange={(checked) =>
                                updateSyncSettings(integration.id, { personalTasks: checked })
                              }
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button onClick={() => setIsSettingsOpen(false)}>Save Settings</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectCalendar(integration.id)}
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Connect your {integration.name} to sync SprintFlow events
                  </p>
                  <Button
                    onClick={() => connectCalendar(integration.id)}
                    className="w-full bg-navy-600 hover:bg-navy-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect {integration.name}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-navy-600" />
            Sync Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy-900 dark:text-navy-100">
                {integrations.filter((i) => i.connected).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Connected</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {integrations.filter((i) => i.syncEnabled).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Syncing</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {integrations.reduce((sum, i) => sum + Object.values(i.syncSettings).filter(Boolean).length, 0)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Event Types</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {integrations.filter((i) => i.lastSync).length > 0 ? "Active" : "Inactive"}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
