export function isUsernameValid(username: string) {
  return (username && username !== '')
}
export function isPasswordValid(password: string) {
  return (password && password !== '')
}
export function isEmailValid(email: string) {
  return email !== '' && email.includes('@') && email.includes('.')
}
