export const usEpaIndexText = (index: number) => {
  const epaLabels = new Map([
    [1, { label: "Good" }],
    [2, { label: "Moderate" }],
    [3, { label: "Unhealthy for Sensitive Groups" }],
    [4, { label: "Unhealthy" }],
    [5, { label: "Very Unhealthy" }],
  ]);

  const epaData = epaLabels.get(index);

  return epaData ? epaData.label : null;
}