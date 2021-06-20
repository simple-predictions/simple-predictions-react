/* eslint-disable */
import React from "react";
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import FrontPage from '../FrontPage';
import store from '../store/store';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'

describe('test front page', function() {
    it("should update widget", async function() {
        const { rerender } = render(<Provider store={store}><Router><FrontPage widget="Login" /></Router></Provider>)
        const items = await screen.findAllByText("Login")
        expect(items).toHaveLength(2)

        rerender(<Provider store={store}><Router><FrontPage widget="Register" /></Router></Provider>)
        await screen.findByText("Login")
        await screen.findByText("Register")
        await screen.findByText("Sign up")

        rerender(<Provider store={store}><Router><FrontPage widget="Reset Password" /></Router></Provider>)
        await screen.findByPlaceholderText("Username")
        await screen.findByText("Reset")

        rerender(<Provider store={store}><Router><FrontPage widget="Create new password" /></Router></Provider>)
        await screen.findByPlaceholderText("New password")
        await screen.findByText("Reset")
    })
})