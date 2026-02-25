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

/* ======================================================
   COMPONENT
====================================================== */

export default function GenericSitemap({ data, pageType = "masters" }) {
  if (!data || data.length === 0) return null;

  return (
    <>
      {data.map((section) => {
        // ONE ICON PER SECTION
        const SectionIcon = getSectionIcon(pageType, section.title);

        return (
          <section key={section.rowNumber} className="sitemap-section">
            {/* ================= HEADER ================= */}
            <div className="section-header">
              <div className="first">
                <SectionIcon size={20} />
                <div className="section-title">{section.title}</div>
              </div>

              <div className="section-subtitle">{section.subtitle}</div>
            </div>

            {/* ================= CHILD TILES ================= */}
            {section.rows?.map((row, idx) => (
              <div className="tile-row" key={idx}>
                {row.map((tile) => (
                  <Link
                    key={tile.rowNumber}
                    to={tile.link}
                    className="tile-card"
                  >
                    {/* SAME ICON AS SECTION */}
                    <SectionIcon size={18} />

                    <div className="tile-text">
                      <div className="tile-title">{tile.title}</div>
                      <div className="tile-subtitle">{tile.subtitle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </section>
        );
      })}
    </>
  );
}
