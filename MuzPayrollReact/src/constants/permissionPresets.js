export const PERMISSION_PRESETS_LOCATION = [
  {
    id: "full-access",
    name: "Full Access",
    description: "View, Add, Edit, Delete, Print",
    permissions: {
      egrView: true,
      egrAdd: true,
      egrEdit: true,
      egrDelete: true,
      egrPrint: true,
    },
  },
  {
    id: "view-only",
    name: "View Only",
    description: "View only, no modifications",
    permissions: {
      egrView: true,
      egrAdd: false,
      egrEdit: false,
      egrDelete: false,
      egrPrint: false,
    },
  },
  {
    id: "view-print",
    name: "View & Print",
    description: "View and Print only",
    permissions: {
      egrView: true,
      egrAdd: false,
      egrEdit: false,
      egrDelete: false,
      egrPrint: true,
    },
  },
  {
    id: "editor",
    name: "Editor",
    description: "View, Add, Edit",
    permissions: {
      egrView: true,
      egrAdd: true,
      egrEdit: true,
      egrDelete: false,
      egrPrint: false,
    },
  },
  {
    id: "no-access",
    name: "No Access",
    description: "No permissions",
    permissions: {
      egrView: false,
      egrAdd: false,
      egrEdit: false,
      egrDelete: false,
      egrPrint: false,
    },
  },
];

export const PERMISSION_PRESETS_USER = [
  {
    id: "full-access",
    name: "Full Access",
    description: "View, Add, Edit, Delete, Print",
    permissions: {
      ugrView: true,
      ugrAdd: true,
      ugrEdit: true,
      ugrDelete: true,
      ugrPrint: true,
    },
  },
  {
    id: "view-only",
    name: "View Only",
    description: "View only, no modifications",
    permissions: {
      ugrView: true,
      ugrAdd: false,
      ugrEdit: false,
      ugrDelete: false,
      ugrPrint: false,
    },
  },
  {
    id: "view-print",
    name: "View & Print",
    description: "View and Print only",
    permissions: {
      ugrView: true,
      ugrAdd: false,
      ugrEdit: false,
      ugrDelete: false,
      ugrPrint: true,
    },
  },
  {
    id: "editor",
    name: "Editor",
    description: "View, Add, Edit",
    permissions: {
      ugrView: true,
      ugrAdd: true,
      ugrEdit: true,
      ugrDelete: false,
      ugrPrint: false,
    },
  },
  {
    id: "no-access",
    name: "No Access",
    description: "No permissions",
    permissions: {
      ugrView: false,
      ugrAdd: false,
      ugrEdit: false,
      ugrDelete: false,
      ugrPrint: false,
    },
  },
];

export const OPTION_TYPE_MAP = {
  T: "Transaction",
  M: "Masters",
  R: "Report",
  C: "Configuration",
  S:"Settings",
  P:"Payroll",
  D:"Dashboard"
};