import { render, screen } from '@testing-library/react';
import Home from './Home';

function login (event) {}
function logout (event) {}

test('login for user=null', () => {
  render(<Home user={null} login={login} logout={logout} />);

  const loginButton = document.getElementById("login")
  expect(loginButton).not.toBeNull();
});

test('no logout for user=null', () => {
  render(<Home user={null} login={login} logout={logout} />);

  const logoutButton = document.getElementById("logout")
  expect(logoutButton).toBeNull();
});

test('logout for user=Hubcap', () => {
  render(<Home user={"Hubcap"} login={login} logout={logout} />);

  const logoutButton = document.getElementById("logout")
  expect(logoutButton).not.toBeNull();
});

test('no login for user=Hubcap', () => {
  render(<Home user={"Hubcap"} login={login} logout={logout} />);

  const loginButton = document.getElementById("login")
  expect(loginButton).toBeNull();
});
