import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LayoutContext = createContext({
    title: '',
    setTitle: () => { },
    action: null,
    setAction: () => { },
    showRefresh: true,
    setHeaderProps: () => { },
});

export function LayoutProvider({ children }) {
    const [title, setTitle] = useState('');
    const [action, setAction] = useState(null);
    const [showRefresh, setShowRefresh] = useState(true);

    const setHeaderProps = useCallback(({ title, action, showRefresh }) => {
        if (title !== undefined) setTitle(title);
        if (action !== undefined) setAction(action);
        if (showRefresh !== undefined) setShowRefresh(showRefresh);
    }, []);

    return (
        <LayoutContext.Provider value={{ title, setTitle, action, setAction, showRefresh, setHeaderProps }}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => useContext(LayoutContext);

