import { render, screen } from '@testing-library/react';
import Home from './Home';

function login (event) {}
function logout (event) {}

test('initial state', () => {
  render(<Home />);

  expect(document.getElementById("login")).not.toBeNull();
  expect(document.getElementById("logout")).toBeNull();
});

test('log in', () => {
  render(<Home />);

  document.getElementById("login").click();

  expect(document.getElementById("login")).toBeNull();
  expect(document.getElementById("logout")).not.toBeNull();
});

test('log out', () => {
  render(<Home />);

  document.getElementById("login").click();
  document.getElementById("logout").click();

  expect(document.getElementById("login")).not.toBeNull();
  expect(document.getElementById("logout")).toBeNull();
});
