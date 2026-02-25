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


export const organizeSiteMapMenu = (rawMenu) => {
  if (!Array.isArray(rawMenu)) return [];

  const map = new Map();

  // 1. Normalize & index
  rawMenu.forEach(item => {
    map.set(item.menuRowNo, {
      ...item,
      children: [],
      fullPath: "",
      isFolder: item.optionYn === false
    });
  });

  const roots = [];

  // 2. Build hierarchy
  map.forEach(node => {
    if (node.parentMenuRowNo && map.has(node.parentMenuRowNo)) {
      map.get(node.parentMenuRowNo).children.push(node);
    } else {
      roots.push(node);
    }
  });

  // 3. Cleanup duplicates:
  //    If a folder has a child with SAME displayName → keep only folder
  const removeDuplicateTitles = node => {
    const seen = new Set();

    node.children = node.children.filter(child => {
      const key = child.displayName?.toLowerCase();

      if (seen.has(key) && !child.isFolder) {
        return false; // drop duplicate page
      }

      seen.add(key);
      return true;
    });

    node.children.forEach(removeDuplicateTitles);
  };

  roots.forEach(removeDuplicateTitles);

  // 4. Build sitemap path
  const buildPath = (node, parentPath = "") => {
    node.fullPath = parentPath
      ? `${parentPath} / ${node.displayName}`
      : node.displayName;

    node.children.forEach(child => buildPath(child, node.fullPath));
  };

  roots.forEach(root => buildPath(root));

  // 5. Sort by menuRowNo (stable UI)
  const sortTree = node => {
    node.children.sort(
      (a, b) => (a.menuRowNo ?? 0) - (b.menuRowNo ?? 0)
    );
    node.children.forEach(sortTree);
  };

  roots.forEach(sortTree);

  return roots;
};