"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  BarChart3,
  Users,
  MessageSquare,
  Tags,
  FileIcon as FileTemplate,
  Activity,
  Settings,
} from "lucide-react";

const commands = [
  {
    group: "Navigation",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "My Work", href: "/my-work", icon: FolderKanban },
      { name: "Projects", href: "/projects", icon: FolderKanban },
      { name: "Kanban", href: "/kanban", icon: FolderKanban },
      { name: "Sprints", href: "/sprints", icon: Calendar },
      { name: "Calendar", href: "/calendar", icon: Calendar },
      { name: "Reports", href: "/reports", icon: BarChart3 },
      { name: "Chat", href: "/chat", icon: MessageSquare },
    ],
  },
  {
    group: "Management",
    items: [
      { name: "Templates", href: "/templates", icon: FileTemplate },
      { name: "Tags", href: "/tags", icon: Tags },
      { name: "Activity", href: "/activity", icon: Activity },
      { name: "Team Roles", href: "/dashboard/roles", icon: Users },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => console.log("Create new project"))}
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>Create New Project</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => console.log("Create new task"))}
          >
            <FileTemplate className="mr-2 h-4 w-4" />
            <span>Create New Task</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return { open, setOpen };
}
