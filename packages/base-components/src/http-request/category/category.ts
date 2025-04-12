export const getWebstoreCategory = async () => {
  const res = await fetch("/api/category-navigation", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const response = await res.json();
  return response;
};