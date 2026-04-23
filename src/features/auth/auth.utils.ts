// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasRole(user: any, role: string | [string]) {
  if (user?.roles?.includes("Superadmin")) return true;
  return user?.roles?.includes(role);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasPermission(user: any, permission: string | [string]) {
  if (user?.roles?.includes("Superadmin")) return true;
  return user?.permissions?.includes(permission);
}
