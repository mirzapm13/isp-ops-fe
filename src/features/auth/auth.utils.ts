// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasRole(user: any, role: string) {
  return user?.roles?.includes(role);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasPermission(user: any, permission: string) {
  return user?.permissions?.includes(permission);
}
