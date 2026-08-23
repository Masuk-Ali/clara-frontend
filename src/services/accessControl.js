// Guest access limits for Clara
const GUEST_LIMITS = {
  rearrange: 3,
};

export function canGuestAccess(type, index) {
  const limit = GUEST_LIMITS[type];

  // If Clara has no guest limit defined for this content type,
  // don't allow access by default.
  if (limit === undefined) {
    return false;
  }

  return index < limit;
}