export const PRESETS = {
  FULL_ACCESS: 'full_access',
  VIEW_ONLY: 'view_only',
  TRANSACTION_ONLY: 'transaction_only',
  REPORT_ONLY: 'report_only'
};

export const presetOptions = [
  { value: PRESETS.FULL_ACCESS, label: 'Full Access' },
  { value: PRESETS.VIEW_ONLY, label: 'View Only' },
  { value: PRESETS.TRANSACTION_ONLY, label: 'Transaction Only' },
  { value: PRESETS.REPORT_ONLY, label: 'Report Only' }
];

export const applyPreset = (preset, modules) => {
  return modules.map(module => ({
    ...module,
    screens: module.screens.map(screen => ({
      ...screen,
      permissions: {
        allow: preset !== PRESETS.VIEW_ONLY, // View only still needs allow
        add: preset === PRESETS.FULL_ACCESS || preset === PRESETS.TRANSACTION_ONLY,
        edit: preset === PRESETS.FULL_ACCESS || preset === PRESETS.TRANSACTION_ONLY,
        delete: preset === PRESETS.FULL_ACCESS,
        print: preset === PRESETS.FULL_ACCESS || preset === PRESETS.REPORT_ONLY,
        save: preset === PRESETS.FULL_ACCESS || preset === PRESETS.TRANSACTION_ONLY
      }
    }))
  }));
};