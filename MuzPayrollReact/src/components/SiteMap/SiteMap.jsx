import React from "react";
import { Link } from "react-router-dom";
import {
  MdSettings,
  MdBusiness,
  MdAttachMoney,
  MdSecurity,
  MdAssignment,
  MdTune,
  MdDescription,
} from "react-icons/md";
import { FaBuildingUser } from "react-icons/fa6";
import { FaUserCog } from "react-icons/fa";
import { MdStorage } from "react-icons/md";
import { MdAssessment } from "react-icons/md";
import { MdGavel } from "react-icons/md";
import { MdAccountBalance } from "react-icons/md";
// import { MdDescription } from "react-icons/md";
import { MdPeople } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { MdAutorenew } from "react-icons/md";
import { FaUserTie, FaRegCalendarAlt, FaBalanceScale } from "react-icons/fa";
import { MdSyncAlt } from "react-icons/md";
import { MdOutlineAssessment } from "react-icons/md";
import { MdBackup } from "react-icons/md";
/* ======================================================
   SECTION ICON MAP (DOMAIN-LEVEL)
====================================================== */

const PAGE_SECTION_ICON_MAP = {
  masters: {
    masters: MdStorage,
    organisation: MdBusiness,
    organization: MdBusiness,
    payroll: MdSettings,
    "user rights": FaUserCog,
  },
  settings: {
    payroll: FaBuildingUser,
    // settings: MdTune,
    // security: MdSecurity,
    configuration: MdSettings,
    "user rights": MdSecurity,
  },
  letters: {
    letters: MdDescription,
    reports: MdAssignment,
  },
  reports: {
    reports: MdAssessment,
    pf: MdAccountBalance,
    esi: MdAccountBalance,
    wf: MdAccountBalance,
  },
  sitemap: {
    reports: MdAssessment,
    pf: MdAccountBalance,
    esi: MdAccountBalance,
    wf: MdAccountBalance,
    masters: MdStorage,
    organisation: MdBusiness,
    organization: MdBusiness,
    // payroll: MdSettings,
    "user rights": FaUserCog,
    "employee management": MdPeople,
    "attendance and leave management": MdEventAvailable,
    dashboard: MdDashboard,
    "advance management": FaMoneyBillTransfer,
    "other transaction": MdSyncAlt,
    "employee relieving": MdLogout,
    "appraisal process management": MdOutlineAssessment,
    process: MdAutorenew,
    "statutory compliance": FaBalanceScale,
    letters: MdDescription,
    "system management":MdBackup,
        payroll: FaBuildingUser,
  },
};

/* ======================================================
   ICON RESOLVER (SECTION LEVEL)
====================================================== */

const getSectionIcon = (pageType = "masters", sectionTitle = "") => {
  const lower = sectionTitle.toLowerCase();
  const pageMap = PAGE_SECTION_ICON_MAP[pageType] || {};

  const matchedKey = Object.keys(pageMap).find((key) => lower.includes(key));

  return matchedKey ? pageMap[matchedKey] : MdSettings;
};
// const collectLeafPages = (node, result = []) => {
//   if (node.optionYn && node.url) {
//     result.push(node);
//   }

//   node.children?.forEach((child) =>
//     collectLeafPages(child, result)
//   );

//   return result;
// };

export default function GenericSitemap({ data, pageType = "masters" }) {
  if (!data?.length) return null;

  const renderSections = (nodes) => {
    return nodes.flatMap((node) => {
      const SectionIcon = getSectionIcon(pageType, node.displayName);

      const directPages = node.children?.filter(
        (child) => child.optionYn && child.url,
      );

      const childFolders = node.children?.filter((child) => child.isFolder);

      // 🔹 CASE 1: ROOT PAGE (Dashboard type)
      if (node.optionYn && node.url && !node.isFolder) {
        return (
          <section key={node.menuRowNo} className="sitemap-section">
            {/* <div className="section-header">
              <SectionIcon size={20} />
              <div className="section-title">
                {node.fullPath.replace(/\s\/\s/g, "/")}
              </div>
              <div className="section-subtitle">{node.displayName}</div>
            </div> */}

            <div className="tile-row">
              <Link to={node.url} className="tile-card">
                <SectionIcon size={18} />
                <div className="tile-text">
                  <div className="tile-title">{node.displayName}</div>
                  <div className="tile-subtitle">{node.displayName}</div>{" "}
                </div>
              </Link>
            </div>
          </section>
        );
      }

      // 🔹 CASE 2: Folder
      if (node.isFolder) {
        return [
          <section key={node.menuRowNo} className="sitemap-section">
            <div className="section-header">
              <SectionIcon size={20} />

              <div className="section-title">
                {node.fullPath.replace(/\s\/\s/g, "/")}
              </div>
              <div className="section-subtitle">{node.description}</div>
            </div>

            <div className="tile-row">
              {directPages?.map((page) => (
                <Link key={page.menuRowNo} to={page.url} className="tile-card">
                  <SectionIcon size={18} />
                  <div className="tile-text">
                    <div className="tile-title">{page.displayName}</div>
                    <div className="tile-subtitle">{page.description}</div>{" "}
                  </div>
                </Link>
              ))}
            </div>
          </section>,

          ...renderSections(childFolders || []),
        ];
      }

      return [];
    });
  };

  return <>{renderSections(data)}</>;
}
