import { FC } from 'react';
import { NavSection } from '@/types/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const navigation: NavSection[] = [
  {
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FontAwesomeIcon icon="home" className="w-5 h-5 text-current" />,
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
        icon: <FontAwesomeIcon icon="user-md" className="w-5 h-5 text-current" />,
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
        icon: <FontAwesomeIcon icon="hospital" className="w-5 h-5 text-current" />
      },
      {
        title: "Billing & Financials",
        path: "/billing",
        icon: <FontAwesomeIcon icon="dollar-sign" className="w-5 h-5 text-current" />,
        children: [
          {
            title: "Billing Dashboard",
            path: "/billing",
          },
          {
            title: "Billing Manager",
            path: "/billing-manager",
          }
        ]
      },
      {
        title: "Reports and Analytics",
        path: "/reports",
        icon: <FontAwesomeIcon icon="chart-bar" className="w-5 h-5 text-current" />
      }
    ]
  },
  {
    items: [
      {
        title: "Support",
        path: "/support",
        icon: <FontAwesomeIcon icon="question-circle" className="w-5 h-5 text-current" />
      },
      {
        title: "Settings",
        path: "/settings",
        icon: <FontAwesomeIcon icon="cog" className="w-5 h-5 text-current" />
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