import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { CgUndo } from "react-icons/cg";
import "./LocationGroupMultiSelect.css";
import { createPortal } from "react-dom";
export function LocationGroupMultiSelect({
  options = [],
  value = [],
  onChange,
  onCancel,
  placeholder = "Select group(s)",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [placement, setPlacement] = useState("bottom");
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  /* Decide top or bottom */
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 290;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const isTop = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setPlacement(isTop ? "top" : "bottom");
    setDropdownStyle({
      position: "fixed", // ← fixed, not absolute
      left: rect.left+3,
      width: rect.width,
      zIndex: 9999,
      ...(isTop
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
  }, [open]);

  /* Outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inTrigger = triggerRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);

      if (!inTrigger && !inDropdown) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Reset search on close */
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const isSelected = (opt) => value.some((v) => v.id === opt.id);

  const filtered = search
    ? options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
    : options;

  // const visibleOptions = search ? filtered : options.slice(0, 6);
  const selectedVisible = value.filter((v) =>
    options.some((opt) => opt.id === v.id),
  );
  const allSelected =
    options.length > 0 && options.every((opt) => isSelected(opt));

  const toggle = (opt) => {
    if (disabled) return;

    onChange(
      isSelected(opt) ? value.filter((v) => v.id !== opt.id) : [...value, opt],
    );
  };

  useEffect(() => {
    const valid = value.filter((v) => options.some((opt) => opt.id === v.id));

    if (valid.length !== value.length) {
      onChange(valid);
    }
  }, [options]);

  return (
    <div className="ms" ref={triggerRef}>
      <div
        className={`ms-control ${open ? "open" : ""} ${disabled? "disabled":""}`}
        onClick={() => {
          if (!disabled) setOpen((o) => !o);
        }}
      >
        {value.length ? (
          <>
            <div className="ms-all-chip">
              {selectedVisible.slice(0, 2).map((v) => (
                <span className="ms-chip" key={v.id}>
                  {v.name}
                  <button
                    className="ms-chip-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(v);
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            {selectedVisible.length > 2 && (
              <span className="ms-chip muted">
                +{selectedVisible.length - 2}
              </span>
            )}
            {/* {value.length > 2 && (
              <span className="ms-chip muted">+{value.length - 2}</span>
            )} */}
            {onCancel && (
              <button
                className="ms-undo"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
              >
                <CgUndo size={16} />
              </button>
            )}
          </>
        ) : (
          <span className="ms-placeholder">{placeholder}</span>
        )}
      </div>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`ms-dropdown ${placement}`}
            style={dropdownStyle}
          >
            {options.length > 6 && (
              <input
                className="ms-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search…"
                disabled={disabled}
                autoFocus
              />
            )}

            <div
              className="ms-option select-all"
              onClick={() => {
                onChange(allSelected ? [] : options);
                setOpen(false); // optional UX improvement
              }}
            >
              <input type="checkbox" checked={allSelected} readOnly />
              Select all groups
            </div>

            {filtered.map((opt) => (
              <div
                key={opt.id}
                className={`ms-option ${isSelected(opt) ? "active" : ""}`}
                onClick={() => toggle(opt)}
              >
                <input type="checkbox" checked={isSelected(opt)} readOnly />
                {opt.name}
              </div>
            ))}
            {value.length > 0 && (
              <div className="ms-footer">
                <button
                  className="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([]);
                    setOpen(false); // optional UX improvement
                  }}
                >
                  Clear
                </button>
                <span>{value.length} selected</span>
              </div>
            )}
          </div>,
          document.body, // ← renders outside the table entirely
        )}
    </div>
  );
}
