import { FC } from 'react';
import { NavSection } from '@/types/navigation';
import { HomeIcon, UserIcon, UsersIcon, BanknotesIcon, ChartBarIcon, QuestionMarkCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export const navigation: NavSection[] = [
  {
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <HomeIcon className="w-5 h-5" />,
        children: [
          {
            title: "Overview",
            path: "/dashboard",
          },
          {
            title: "My Tasks",
            path: "/dashboard/tasks",
          }
        ]
      },
      {
        title: "Patient Care",
        path: "/patient-care",
        icon: <UserIcon className="w-5 h-5" />,
        children: [
            {
              title: "Intake and Onboarding",
              path: "/patient-care/intake",
            },
            {
              title: "All Encounters",
              path: "/patient-care/all-encounters",
            },
            {
              title: "All Patients",
              path: "/patient-care/all-patients",
            },
            {
              title: "Assessments & Treatment Plans",
              path: "/patient-care/assessments-treatment-plans",
            },
            {
              title: "Follow ups",
              path: "/patient-care/follow-ups",
            },
            {
              title: "Referrals",
              path: "/patient-care/referrals",
            },
            {
              title: "Patient Incidents",
              path: "/patient-care/patient-incidents",
            }
          ]
      },
      {
        title: "Clinic Operations",
        path: "/clinic-operations",
        icon: <UsersIcon className="w-5 h-5" />
      },
      {
        title: "Billing & Financials",
        path: "/billing",
        icon: <BanknotesIcon className="w-5 h-5" />
      },
      {
        title: "Reports and Analytics",
        path: "/reports",
        icon: <ChartBarIcon className="w-5 h-5" />
      }
    ]
  },
  {
    items: [
      {
        title: "Support",
        path: "/support",
        icon: <QuestionMarkCircleIcon className="w-5 h-5" />
      },
      {
        title: "Settings",
        path: "/settings",
        icon: <Cog6ToothIcon className="w-5 h-5" />
      }
    ]
  }
];

export const SidebarMenu: FC = () => {
  return (
    <div>
      {/* Render your sidebar items here using the navigation array */}
      {/* This is a placeholder for the actual rendering logic */}
    </div>
  );
}; 