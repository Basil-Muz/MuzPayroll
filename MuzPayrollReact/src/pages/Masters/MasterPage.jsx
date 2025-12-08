import Header from "../../components/Header/Header";
import "./Master.css";
export default function HomePage() {
    const sitemapData = [
  {
    title: "System Management/Masters",
    subtitle: "Masters",
    rows: [
      [
        { title: "Status Update", subtitle: "Status Update" },
      ],
    ],
  },
  {
    title: "System Management/Masters/Organisation",
    subtitle: "Organisation",
    rows: [
      [
        { title: "Company", subtitle: "Company" },
        { title: "Branch", subtitle: "Branch" },
        { title: "Location", subtitle: "Location" },
      ],
      [
        { title: "Company List", subtitle: "Company List" },
        { title: "Branch List", subtitle: "Branch List" },
        { title: "Location List", subtitle: "Location List" },
      ],
      [
        { title: "License Agreement", subtitle: "License Agreement" },
      ],
    ],
  },
  {
    title: "System Management/Masters/Payroll",
    subtitle: "Payroll",
    rows: [
      [
        { title: "Designation", subtitle: "Designation" },
        { title: "Department", subtitle: "Department" },
        { title: "Job Grade", subtitle: "Job Grade" },
      ],
      // add more rows/cards if you want
    ],
  },
];

  return <>
  <Header />
   <div className="app-shell">
      {/* LEFT SIDEBAR */}
      <aside className="side-nav">
        <div className="side-header">
          <div className="avatar-circle">A</div>
          <div className="avatar-name">ADMIN</div>
        </div>

        <div className="side-menu">
          {/* fake icons using simple blocks – replace with react-icons if you like */}
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="side-icon-row">
              <div className="side-icon" />
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="main-area">
        {/* TOP BAR */}
        <header className="top-bar">
          <div className="top-left" />
          <div className="top-right">
            <div className="top-icon square" />
            <div className="top-icon lines" />
            <div className="top-icon red" />
          </div>
        </header>

        {/* CONTENT */}
        <main className="content">
          <h1 className="page-title">Sitemap</h1>

          <div className="sitemap-card">
            {sitemapData.map((section) => (
              <section key={section.title} className="sitemap-section">
                <div className="section-header">
                  <div className="section-icon" />
                  <div>
                    <div className="section-title">{section.title}</div>
                    <div className="section-subtitle">{section.subtitle}</div>
                  </div>
                </div>

                {section.rows.map((row, idx) => (
                  <div className="tile-row" key={idx}>
                    {row.map((tile) => (
                      <div className="tile-card" key={tile.title}>
                        <div className="tile-icon">*</div>
                        <div className="tile-text">
                          <div className="tile-title">{tile.title}</div>
                          <div className="tile-subtitle">{tile.subtitle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
    </>

};

