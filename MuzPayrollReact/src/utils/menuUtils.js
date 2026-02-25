import { MAIN_MENU_ICON_MAP } from "./menuIcons";
import { MdOutlineDashboard } from "react-icons/md";
import { MdAccountTree } from "react-icons/md";
export const organizeMenuFromBackend = (rawMenu) => {
  if (!Array.isArray(rawMenu)) return [];

  const sorted = [...rawMenu].sort(
    (a, b) => (a.menuRowNo ?? 0) - (b.menuRowNo ?? 0),
  );

  const parentMap = {};
  const finalMenu = [];

  // Create parents
  sorted.forEach((item) => {
    if (!item.parentMenuRowNo) {
      const label = item.displayName || item.description || "Menu";

      const IconComponent = MAIN_MENU_ICON_MAP[label] || MdOutlineDashboard; // modern default

      parentMap[item.menuRowNo] = {
        id: label.toLowerCase().replace(/\s+/g, ""),
        label,
        menuRowNo: item.menuRowNo,
        url: item.url || null,
        icon: IconComponent, // injected here
        children: [],
      };
    }
  });

  // Attach children
  sorted.forEach((item) => {
    if (item.parentMenuRowNo) {
      const parent = parentMap[item.parentMenuRowNo];
      if (!parent) return;
      // Custom rule for Main Menu 530
      let subMenuUrl = item.url || null;

      if (item.parentMenuRowNo === 530 && item.menuRowNo === 540) {
        subMenuUrl = `/masters/${item.menuRowNo || ""}`;
      }
      if (item.parentMenuRowNo === 530 && item.menuRowNo === 750) {
        subMenuUrl = `/settings/${item.menuRowNo || ""}`;
      }

      if (item.parentMenuRowNo === 250 && item.menuRowNo === 270) {
        subMenuUrl = `/letters/${item.menuRowNo || ""}`;
      }
      if (item.parentMenuRowNo === 250 && item.menuRowNo === 320) {
        subMenuUrl = `/reports/${item.menuRowNo || ""}`;
      }
      parent.children.push({
        id: `${parent.id}.${item.optionId}`,
        label: item.description || item.displayName,
        url: subMenuUrl,
        menuRowNo: item.menuRowNo,
        optionId: item.optionId,
      });
    }
  });

  // Final order (keep empty parents)
  Object.values(parentMap)
    .sort((a, b) => a.menuRowNo - b.menuRowNo)
    .forEach((parent) => {
      parent.children.sort((a, b) => a.menuRowNo - b.menuRowNo);
      finalMenu.push(parent);
    });
    //adding site map
  finalMenu.push({
    id: "sitemap",
    label: "Sitemap",
    menuRowNo: 10009, // high number to stay last
    url: "/sitemap",
    icon: MdAccountTree,
    children: [],

    // frontend-only fields
    isCustom: true,
    showInSitemap: true,
  });

  return finalMenu;
};

export const buildSitemapFromSubMenuResponse = (
  rawMenu,
  mainHeading = "System Management",
) => {
  if (!Array.isArray(rawMenu)) return [];

  const sitemap = [];
  let currentSection = null;
  let currentRow = [];

  rawMenu.forEach((item) => {
    const label = item.displayName || item.description;

    // HEADING
    if (!item.optionId) {
      if (currentSection) {
        if (currentRow.length) {
          currentSection.rows.push(currentRow);
        }
        sitemap.push(currentSection);
      }

      currentSection = {
        title: `${mainHeading}/${label}`,
        subtitle: label,
        rowNumber: item.menuRowNo,
        rows: [],
      };

      currentRow = [];
      return;
    }

    // CHILD
    if (item.optionYn && item.optionId) {
      const link =
        item.url && item.url.startsWith("?") ? `/masters${item.url}` : item.url;

      currentRow.push({
        title: label,
        subtitle: label,
        link,
        rowNumber: item.menuRowNo,
      });

      // 3 tiles per row (UI rule)
      if (currentRow.length === 3) {
        currentSection.rows.push(currentRow);
        currentRow = [];
      }
    }
  });

  // push last section
  if (currentSection) {
    if (currentRow.length) {
      currentSection.rows.push(currentRow);
    }
    sitemap.push(currentSection);
  }

  return sitemap;
};


export const buildSitemapUIData = (tree = []) => {
  const sections = [];

  const collectPages = (node, bucket) => {
    if (node.optionYn && node.url) {
      bucket.push({
        title: node.displayName,
        subtitle: node.displayName,
        link: node.url
      });
    }

    node.children?.forEach(child => collectPages(child, bucket));
  };

  tree.forEach(root => {
    if (!root.isFolder) return;

    root.children.forEach(sectionNode => {
      if (!sectionNode.isFolder) return;

      const pages = [];
      collectPages(sectionNode, pages);

      // Split into rows of 3 (same UI behavior as before)
      const rows = [];
      for (let i = 0; i < pages.length; i += 3) {
        rows.push(pages.slice(i, i + 3));
      }

      sections.push({
        title: sectionNode.fullPath.replace(" / ", "/"),
        subtitle: sectionNode.displayName,
        rows
      });
    });
  });

  return sections;
};