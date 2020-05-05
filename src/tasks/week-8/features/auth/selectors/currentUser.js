import { createSelector } from '@reduxjs/toolkit'

const getCurrentUser = createSelector(
  state => state.currentUser.user,
  user => user
);

export { getCurrentUser }
