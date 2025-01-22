export const focusareasTableConfig = {
  defaultPageSize: 10,
  enableSearch: true,
  searchPlaceholder: "Search focus areas...",
  filterableColumns: ["titleEn", "titleAr"],
  sortableColumns: ["createdAt", "titleEn", "titleAr"],
  
  // Add required status configuration
  statusOptions: [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "DRAFT", label: "Draft" }
  ] as const,
  
  statusColors: {
    ACTIVE: "success",
    INACTIVE: "destructive",
    DRAFT: "warning"
  } as const,
} as const;
