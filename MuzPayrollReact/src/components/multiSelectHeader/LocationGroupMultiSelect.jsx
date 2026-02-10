import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { CgUndo } from "react-icons/cg";
import "./LocationGroupMultiSelect.css";

export function LocationGroupMultiSelect({
  options = [],
  value = [],
  onChange,
  onCancel,
  placeholder = "Select group(s)",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [placement, setPlacement] = useState("bottom");

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  /* Decide top or bottom */
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 200;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    setPlacement(
      spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? "top" : "bottom",
    );
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
  }, [open, setSearch]);

  const isSelected = (opt) => value.some((v) => v.id === opt.id);

  const filtered = search
    ? options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
    : options;

  // const visibleOptions = search ? filtered : options.slice(0, 6);

  const allSelected =
    options.length > 0 && options.every((opt) => isSelected(opt));

  const toggle = (opt) => {
    onChange(
      isSelected(opt) ? value.filter((v) => v.id !== opt.id) : [...value, opt],
    );
  };

  return (
    <div className="ms" ref={triggerRef}>
      <div className="ms-control" onClick={() => setOpen((o) => !o)}>
        {value.length ? (
          <>
            <div className="ms-all-chip">
              {value.slice(0, 2).map((v) => (
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
               {value.length > 2 && (
                <span className="ms-chip muted">+{value.length - 2}</span>
              )}
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

      {open && (
        <div ref={dropdownRef} className={`ms-dropdown ${placement}`}>
          {options.length > 6 && (
            <input
              className="ms-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search…"
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
        </div>
      )}
    </div>
  );
}
