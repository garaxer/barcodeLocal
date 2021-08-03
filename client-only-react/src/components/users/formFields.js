export default [
  { name: 'name', label: 'Full Name', component: 'text' },
  { name: 'email', label: 'New Email', component: 'text' },
  { name: 'password', label: 'Password', component: 'text' },
  { name: 'permission', label: 'Admin?', component: 'checkbox' },
];

export const editUserFields = [
  { name: 'name', label: 'Full Name', component: 'text' },
  { name: 'email', label: 'New Email', component: 'text' },
];

export const editUserFieldsAsAdmin = [
  { name: 'name', label: 'Full Name', component: 'text' },
  { name: 'email', label: 'New Email', component: 'text' },
  { name: 'permission', label: 'Admin?', component: 'checkbox' },
];

export const passwordFields = [
  { label: 'Password', name: 'password', component: 'text', type: 'password' },
];
