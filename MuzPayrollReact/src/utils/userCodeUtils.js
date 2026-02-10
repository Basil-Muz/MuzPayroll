export const normalizeUserCode = (userCode) => {
    if (!userCode)
        return {cleaned:"", value: ""};

    const cleaned = userCode.trim().replace("@muziris", "");
    const value = cleaned + "@muziris";
    return {cleaned, value};
}