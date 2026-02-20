import { MAIN_MENU_ICON_MAP } from "./menuIcons";
import { MdOutlineDashboard } from "react-icons/md";

export const organizeMenuFromBackend = (rawMenu) => {
  if (!Array.isArray(rawMenu)) return [];

  const sorted = [...rawMenu].sort(
    (a, b) => (a.menuRowNo ?? 0) - (b.menuRowNo ?? 0)
  );

  const parentMap = {};
  const finalMenu = [];

  // Create parents
  sorted.forEach((item) => {
    if (!item.parentMenuRowNo) {
      const label = item.displayName || item.description || "Menu";

      const IconComponent =
        MAIN_MENU_ICON_MAP[label] || MdOutlineDashboard; // modern default

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

      parent.children.push({
        id: `${parent.id}.${item.optionId}`,
        label: item.description || item.displayName,
        url: item.url || null,
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

  return finalMenu;
};
