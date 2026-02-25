
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
import { MdAccountBalance } from "react-icons/md";
// import { MdDescription } from "react-icons/md";
import { MdPeople } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";
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
  sitemap:{
        reports: MdAssessment,
    pf: MdAccountBalance,
    esi: MdAccountBalance,
    wf: MdAccountBalance,
        masters: MdStorage,
    organisation: MdBusiness,
    organization: MdBusiness,
    payroll: MdSettings,
    "user rights": FaUserCog,
    "employee management":MdPeople,
    "attendance and leave management":MdEventAvailable,
  }
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
const collectLeafPages = (node, result = []) => {
  if (node.optionYn && node.url) {
    result.push(node);
  }

  node.children?.forEach((child) =>
    collectLeafPages(child, result)
  );

  return result;
};
export default function GenericSitemap({ data, pageType = "masters" }) {
  if (!data || data.length === 0) return null;

  return (
    <>
      {data.flatMap((root) =>
        root.children
          ?.filter((section) => section.isFolder) // LEVEL 2 ONLY
          .map((section) => {
            const SectionIcon = getSectionIcon(
              pageType,
              section.displayName
            );

            return (
              <section
                key={section.menuRowNo}
                className="sitemap-section"
              >
                {/* ================= HEADER ================= */}
                <div className="section-header">
                  <div className="first">
                    <SectionIcon size={20} />
                    <div className="section-title">
                      {section.fullPath.replace(" / ", "/")}
                    </div>
                  </div>

                  <div className="section-subtitle">
                    {section.displayName}
                  </div>
                </div>

                {/* ================= CHILD TILES ================= */}
                <div className="tile-row">
                  {collectLeafPages(section).map((tile) => (
                    <Link
                      key={tile.menuRowNo}
                      to={tile.url}
                      className="tile-card"
                    >
                      <SectionIcon size={18} />
                      <div className="tile-text">
                        <div className="tile-title">
                          {tile.displayName}
                        </div>
                        <div className="tile-subtitle">
                          {tile.fullPath}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })
      )}
    </>
  );
}