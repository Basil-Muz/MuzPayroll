export const getFloatingActions = (
  permissions,
  handlers,
  uiState = {},
  requiredButtons = [],
) => {
  const {
    canSave = true,
    canSearch = true,
    canClear = true,
    canRefresh = true,
    canNew
  } = uiState;

  const allActions = {
    save: {
      onClick: handlers.handleSave,
      disabled: canSave,
    },

    clear: {
      onClick: handlers?.handleClear,
      disabled: canClear,
    },

    search: {
      onClick: handlers?.handleSearch,
      disabled: canSearch,
    },

    refresh: {
      onClick: handlers?.handleRefresh,
      disabled: canRefresh,
    },

    new: {
      onClick: handlers?.handleNew,
      disabled: !permissions?.add || canNew,
    },

    delete: {
      onClick: handlers?.handleDelete,
      disabled: !permissions?.delete,
    },

    print: {
      onClick: handlers?.handlePrint,
      disabled: !permissions?.print,
    },
  };

  const actions = {};

  requiredButtons.forEach((btn) => {
    if (allActions[btn]) {
      actions[btn] = allActions[btn];
    }
  });
  // console.log("Actions2",permissions)
  return actions;
};
