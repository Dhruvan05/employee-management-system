export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    // For Spring Boot, it must be 'Bearer ' + token
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
}