import {
  BookOpen,
  Briefcase,
  Building,
  Users,
  Settings,
  LucideIcon,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(): Group[] {
  return [
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/courses",
          label: "Courses",
          icon: BookOpen,
        },
        {
          href: "/projects",
          label: "Projects",
          icon: Briefcase,
        },
        {
          href: "/org",
          label: "Org",
          icon: Building,
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          icon: Users,
        },
        {
          href: "/settings",
          label: "Account Settings",
          icon: Settings,
        },
      ],
    },
  ];
}
