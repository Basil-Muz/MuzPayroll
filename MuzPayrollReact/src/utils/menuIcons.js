// utils/menuIcons.js

import { HiMiniSwatch } from "react-icons/hi2";
import { FaUserTie, FaRegCalendarAlt, FaBalanceScale } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { MdAccountTree } from "react-icons/md";
import {
  HiMiniSquares2X2,
  HiMiniCalendarDays,
  HiMiniUsers,
  HiMiniTrophy,
  HiMiniCheckBadge,
  HiMiniDocumentText,
  HiMiniClock,
  HiMiniArrowPath,
  HiMiniCalendar
} from "react-icons/hi2";
import {
  MdOutlineAssessment,
  MdOutlineSettings,
  MdSettings,
  MdSwapHoriz,
  MdLogout,
} from "react-icons/md";
import { MdAutorenew } from "react-icons/md";
export const MAIN_MENU_ICON_MAP = {
  // Core
  Dashboard: HiMiniSwatch,
  "My Dashboard": HiMiniSquares2X2,
  "Team Dashboard": HiMiniUsers,
  // HR
  "Employee Management": FaUserTie,
  "Attendance and Leave Management": FaRegCalendarAlt,
  "Leave Management": HiMiniCalendarDays,

  // Finance / Transactions
  "Advance Management": FaHandHoldingDollar,
  "Other Transaction": MdSwapHoriz,

  // Employee lifecycle
  "Employee Relieving": MdLogout,
  "Appraisal Process Management": MdOutlineAssessment,

  // System / Process
  Process: MdAutorenew,
  "System Management": MdSettings,

  // Compliance
  "Statutory Compliance": FaBalanceScale,
  Sitemap: MdAccountTree,

  "Achievements Entry": HiMiniTrophy,
  "Relieving Activity Approval": HiMiniCheckBadge,
  "Salary Slip": HiMiniDocumentText,
  "Time Log Management":HiMiniClock,
  "Compensatory Offs":HiMiniArrowPath,
  "Offday Management":HiMiniCalendar,
};
