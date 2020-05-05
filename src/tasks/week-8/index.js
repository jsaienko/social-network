import React from 'react'
import store from './configureStore'
import { Provider } from 'react-redux'
import SocialApp from './SocialApp'

export default function App() {
    return (
        <Provider store={store}>
            <SocialApp />
        </Provider>
    )
}
