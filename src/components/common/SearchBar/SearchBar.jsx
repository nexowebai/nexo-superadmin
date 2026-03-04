import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '@lib/cn';
import { useDebounce } from '@hooks/useDebounce';
import './SearchBar.css';

function SearchBar({
    placeholder = 'Search...',
    onSearch,
    value = '',
    onChange,
    size = 'md',
    className,
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const inputRef = useRef(null);
    const debouncedValue = useDebounce(inputValue, 300);

    useEffect(() => {
        if (onSearch && debouncedValue !== undefined) {
            onSearch(debouncedValue);
        }
    }, [debouncedValue, onSearch]);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            inputRef.current?.focus();
        }
        if (e.key === 'Escape') {
            inputRef.current?.blur();
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange && onChange(e);
    };

    const handleClear = () => {
        setInputValue('');
        onChange && onChange({ target: { value: '' } });
        inputRef.current && inputRef.current.focus();
    };

    return (
        <div
            className={cn(
                'ds-search',
                `ds-search--${size}`,
                isFocused && 'ds-search--focused',
                className
            )}
        >
            <Search size={18} className="ds-search__icon" />

            <input
                ref={inputRef}
                type="text"
                className="ds-search__input"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />

            <AnimatePresence mode="wait">
                {inputValue && (
                    <motion.button
                        key="clear"
                        type="button"
                        className="ds-search__clear"
                        onClick={handleClear}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                    >
                        <X size={16} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SearchBar;