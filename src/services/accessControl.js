// Guest access limits for Clara
const GUEST_LIMITS = {
  rearrange: 100,
  grammar: 3,
  practice: 3,
  quiz: 2,
  questionBank: 5,
  dictionary: 5,
  askClara: 3,
  library: 2,
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