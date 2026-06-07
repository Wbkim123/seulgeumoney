'use client';

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'admin1234';

const USERS_STORAGE_KEY = 'seulgeumoney_users';
const AUTH_STORAGE_KEY = 'seulgeumoney_auth';
const SIGNUP_DRAFT_KEY = 'seulgeumoney_signup_draft';
const RESET_DRAFT_KEY = 'seulgeumoney_reset_draft';
const DEMO_CODE = '123456';

export type AuthRole = 'admin' | 'user';

export type StoredUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  dob: string;
  country: string;
  phone: string;
  address?: string;
  createdAt: string;
};

export type SignupDraft = Partial<Pick<StoredUser, 'email' | 'password' | 'name' | 'dob' | 'country' | 'phone' | 'address'>>;

export type AuthSession = {
  userId: string;
  email: string;
  role: AuthRole;
  loggedInAt: string;
};

type CompleteSignupDraft = Required<
  Pick<StoredUser, 'email' | 'password' | 'name' | 'dob' | 'country' | 'phone' | 'address'>
>;

type CurrentUserContext = {
  session: AuthSession;
  users: StoredUser[];
  user: StoredUser;
};

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);

  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isCompleteSignupDraft(draft: SignupDraft): draft is CompleteSignupDraft {
  return Boolean(
    draft.email &&
      draft.password &&
      draft.name &&
      draft.dob &&
      draft.country &&
      draft.phone &&
      draft.address
  );
}

function findUserById(userId: string, users = getUsers()) {
  return users.find((user) => user.id === userId) ?? null;
}

function requireCurrentUserContext(loginError: string, adminError = loginError): CurrentUserContext {
  const session = getAuthSession();

  if (!session) {
    throw new Error(loginError);
  }

  if (session.role === 'admin') {
    throw new Error(adminError);
  }

  const users = getUsers();
  const user = findUserById(session.userId, users);

  if (!user) {
    throw new Error('Unable to find the current user.');
  }

  return { session, users, user };
}

export function getDemoVerificationCode() {
  return DEMO_CODE;
}

export function getUsers() {
  return readJson<StoredUser[]>(USERS_STORAGE_KEY, []);
}

export function findUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  return getUsers().find((user) => user.email === normalizedEmail) ?? null;
}

export function getSignupDraft() {
  return readJson<SignupDraft>(SIGNUP_DRAFT_KEY, {});
}

export function updateSignupDraft(draft: SignupDraft) {
  writeJson(SIGNUP_DRAFT_KEY, { ...getSignupDraft(), ...draft });
}

export function clearSignupDraft() {
  localStorage.removeItem(SIGNUP_DRAFT_KEY);
}

export function createUserFromDraft(draft: SignupDraft) {
  if (!isCompleteSignupDraft(draft)) {
    throw new Error('Missing signup information.');
  }

  const email = normalizeEmail(draft.email);

  if (findUserByEmail(email)) {
    throw new Error('An account already exists with this email.');
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    email,
    password: draft.password,
    name: draft.name.trim(),
    dob: draft.dob,
    country: draft.country,
    phone: draft.phone,
    address: draft.address.trim(),
    createdAt: new Date().toISOString(),
  };

  writeJson(USERS_STORAGE_KEY, [...getUsers(), user]);
  clearSignupDraft();
  return user;
}

export function authenticateUser(email: string, password: string) {
  const user = findUserByEmail(email);
  return user && user.password === password ? user : null;
}

export function authenticateAdmin(username: string, password: string) {
  return username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function saveSession(session: Omit<AuthSession, 'loggedInAt'>) {
  writeJson(AUTH_STORAGE_KEY, {
    ...session,
    loggedInAt: new Date().toISOString(),
  });
}

export function saveAdminSession() {
  saveSession({
    userId: 'admin',
    email: ADMIN_USERNAME,
    role: 'admin',
  });
}

export function saveUserSession(user: StoredUser) {
  saveSession({
    userId: user.id,
    email: user.email,
    role: 'user',
  });
}

export function getAuthSession() {
  const session = readJson<AuthSession | null>(AUTH_STORAGE_KEY, null);

  if (!session) return null;
  if (session.role === 'admin' && session.email === ADMIN_USERNAME) return session;
  if (session.role === 'user' && findUserByEmail(session.email)) return session;

  clearAuthSession();
  return null;
}

export function getCurrentUser() {
  const session = getAuthSession();

  if (!session || session.role !== 'user') {
    return null;
  }

  return findUserById(session.userId);
}

export function updateCurrentUserProfile(profile: Pick<StoredUser, 'name' | 'dob' | 'email' | 'phone' | 'address'>) {
  const { session, users, user } = requireCurrentUserContext('Please log in before updating your profile.');
  const email = normalizeEmail(profile.email);
  const emailOwner = users.find((storedUser) => storedUser.email === email);

  if (emailOwner && emailOwner.id !== user.id) {
    throw new Error('An account already exists with this email.');
  }

  const nextUser: StoredUser = {
    ...user,
    name: profile.name.trim(),
    dob: profile.dob,
    email,
    phone: profile.phone,
    address: profile.address?.trim(),
  };

  writeJson(
    USERS_STORAGE_KEY,
    users.map((storedUser) => (storedUser.id === user.id ? nextUser : storedUser))
  );

  if (session.email !== email) {
    saveSession({
      userId: session.userId,
      email,
      role: session.role,
    });
  }

  return nextUser;
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function startPasswordReset(email: string) {
  const user = findUserByEmail(email);

  if (!user) {
    throw new Error('No account exists with this email.');
  }

  writeJson(RESET_DRAFT_KEY, { email: user.email, verified: false });
}

export function verifyPasswordResetCode(code: string) {
  const resetDraft = readJson<{ email: string; verified: boolean } | null>(RESET_DRAFT_KEY, null);

  if (!resetDraft) {
    throw new Error('Start password reset first.');
  }

  if (code !== DEMO_CODE) {
    throw new Error('Invalid verification code.');
  }

  writeJson(RESET_DRAFT_KEY, { ...resetDraft, verified: true });
}

export function resetPassword(password: string) {
  const resetDraft = readJson<{ email: string; verified: boolean } | null>(RESET_DRAFT_KEY, null);

  if (!resetDraft?.verified) {
    throw new Error('Verify your email before resetting the password.');
  }

  const users = getUsers();
  const nextUsers = users.map((user) =>
    user.email === resetDraft.email ? { ...user, password } : user
  );

  writeJson(USERS_STORAGE_KEY, nextUsers);
  localStorage.removeItem(RESET_DRAFT_KEY);
}

export function changeCurrentUserPassword(currentPassword: string, nextPassword: string) {
  const { users, user } = requireCurrentUserContext(
    'Please log in before changing your password.',
    'The local admin password cannot be changed.'
  );

  if (user.password !== currentPassword) {
    throw new Error('Current password is incorrect.');
  }

  const nextUsers = users.map((storedUser) =>
    storedUser.id === user.id ? { ...storedUser, password: nextPassword } : storedUser
  );

  writeJson(USERS_STORAGE_KEY, nextUsers);
}
