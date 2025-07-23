1. Fix Array from broken '"\{([0-9,]+)\]\}' to ARRAY[]

Replace: '"\{([0-9,]+)\]\}'
With: ARRAY[$1]
