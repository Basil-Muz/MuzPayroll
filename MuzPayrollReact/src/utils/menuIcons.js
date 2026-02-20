// utils/menuIcons.js

import { HiMiniSwatch } from "react-icons/hi2";
import {
  FaUserTie,
  FaRegCalendarAlt,
  FaBalanceScale,
} from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";

import {
  MdOutlineAssessment,
  MdOutlineSettings,
  MdSettings,
  MdSwapHoriz,
  MdLogout,
} from "react-icons/md";

export const MAIN_MENU_ICON_MAP = {
  // Core
  Dashboard: HiMiniSwatch,

  // HR
  "Employee Management": FaUserTie,
  "Attendance and Leave Management": FaRegCalendarAlt,

  // Finance / Transactions
  "Advance Management": FaHandHoldingDollar,
  "Other Transaction": MdSwapHoriz,

  // Employee lifecycle
  "Employee Relieving": MdLogout,
  "Appraisal Process Management": MdOutlineAssessment,

  // System / Process
  Process: MdOutlineSettings,
  "System Management": MdSettings,

  // Compliance
  "Statutory Compliance": FaBalanceScale,
};
