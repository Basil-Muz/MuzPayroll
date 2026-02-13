const BASE_URL = "http://localhost:8087/entity";

export const fetchCompanies = async (userId) => {
  const res = await fetch(`${BASE_URL}/fetchCompany?userId=${userId}`);
  return res.json();
};

export const fetchBranch = async (userId, companyId) => {
  const res = await fetch(
    `${BASE_URL}/fetchBranch?userId=${userId}&companyId=${companyId}`
  );
  return res.json();
};

export const fetchLocation = async (userId, companyId, branchId) => {
  const res = await fetch(
    `${BASE_URL}/fetchLocation?userId=${userId}&companyId=${companyId}&branchId=${branchId}`
  );
  return res.json();
};
