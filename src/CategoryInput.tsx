import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IconButton } from './IconButton';

interface CategoryInputProps {
    categoryNames: string[];
    formProps: UseFormRegisterReturn;
    setValue: UseFormSetValue<{ category: string }>;
}

export function CategoryInput({ categoryNames, formProps, setValue }: CategoryInputProps) {
    const [isListVisible, setIsListVisible] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(0);

    const filteredCategories = categoryNames?.filter((categoryName) => {
        return categoryName.includes(selectedCategory);
    });

    const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        itemsRef.current = itemsRef.current.slice(0, filteredCategories.length);
    }, [filteredCategories.length]);

    function handleList() {
        if (isListVisible) {
            setIsListVisible(false);
        } else {
            setSelectedCategory('');
            setIsListVisible(true);
        }
    }

    useEffect(() => {
        if (isListVisible) {
            itemsRef.current[activeSuggestionIndex]?.focus();
            inputRef.current?.focus();
        }
    }, [activeSuggestionIndex, isListVisible]);

    useEffect(() => {
        const form = inputRef.current?.closest('form');
        const handleFormReset = () => {
            setSelectedCategory('');
            setActiveSuggestionIndex(0);
            setIsListVisible(false);
        };
        form?.addEventListener('reset', handleFormReset);

        return () => {
            form?.removeEventListener('reset', handleFormReset);
        };
    }, []);

    useEffect(() => {
        setValue('category', selectedCategory);
    }, [selectedCategory]);

    function handleSelectCategory(categoryName: string) {
        setSelectedCategory(categoryName);
        setIsListVisible(false);
        setActiveSuggestionIndex(0);
    }

    function handleChangeCategory(event: ChangeEvent<HTMLInputElement>) {
        setSelectedCategory(event.target.value);
        setActiveSuggestionIndex(0);
        setIsListVisible(true);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'ArrowDown' && activeSuggestionIndex < filteredCategories.length - 1) {
            if (!isListVisible) {
                setIsListVisible(true);
                setActiveSuggestionIndex(0);
            } else {
                setActiveSuggestionIndex((activeSuggestionIndex) => activeSuggestionIndex + 1);
            }
        }

        if (event.key === 'ArrowUp' && activeSuggestionIndex > 0) {
            setActiveSuggestionIndex((activeSuggestionIndex) => activeSuggestionIndex - 1);
        }

        if (event.key === 'Enter' && isListVisible) {
            event.preventDefault();
            setSelectedCategory(filteredCategories[activeSuggestionIndex]);
            setIsListVisible(false);
        }
    }

    return (
        <div className="inline-block">
            <div>
                <label htmlFor="category" className="font-semibold text-normal text-opacity-60 text-xl">
                    category:
                </label>
            </div>
            <div>
                <div className="border-2 border-secondary rounded-xl flex">
                    <IconButton
                        onClick={handleList}
                        className="bg-white p-2 rounded-l-xl border-r-2 border-secondary text-normal text-opacity-60"
                    >
                        {isListVisible ? <FaChevronUp /> : <FaChevronDown />}
                    </IconButton>
                    <input
                        id="category"
                        {...formProps}
                        placeholder="e.x. english"
                        value={selectedCategory}
                        className="p-2 rounded-r-xl text-xl font-sriracha focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={handleChangeCategory}
                        autoComplete="off"
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                        style={{ textIndent: '1.5px' }}
                    />
                </div>
                {isListVisible ? (
                    <ul className="absolute border-2 border-secondary w-72 rounded-lg overflow-y-auto max-h-32 bg-white py-1 text-xl font-sriracha text-normal text-opacity-60">
                        {filteredCategories.map((categoryName, index) => {
                            return (
                                <li
                                    key={categoryName}
                                    onClick={() => handleSelectCategory(categoryName)}
                                    className={
                                        'cursor-pointer min-w-max pr-4 pl-2 hover:bg-selecting' +
                                        (index === activeSuggestionIndex ? ' bg-secondary' : ' bg-white')
                                    }
                                    ref={(el) => (itemsRef.current[index] = el)}
                                    tabIndex={-1}
                                >
                                    {categoryName}
                                </li>
                            );
                        })}
                    </ul>
                ) : null}
            </div>
        </div>
    );
}
