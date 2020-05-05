import React, { useContext } from 'react';

const ThemeContext = React.createContext('light');


function Button() {
    const theme = useContext(ThemeContext);
    return (
        <div className={`button ${theme}`}>Click me</div>
    )
}

function Root() {

    return (
        <ThemeContext.Provider value='dark'>
            <Button />
        </ThemeContext.Provider>
    )
}

