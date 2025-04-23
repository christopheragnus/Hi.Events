import { TextInput, TextInputProps } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import classes from './SearchBar.module.scss';
import { useEffect, useState } from "react";
import { SortSelector, SortSelectorProps } from "../SortSelector";
import { t } from "@lingui/macro";
import classNames from "classnames";
import { PaginationData, QueryFilters } from "../../../types.ts";
import ErrorBoundary from '../ErrorBoundary';

interface SearchBarProps extends TextInputProps {
    onClear: () => void;
    sortProps?: SortSelectorProps | undefined,
}

interface SearchBarWrapperProps {
    placeholder?: string,
    setSearchParams: (updates: Partial<QueryFilters>) => void,
    searchParams: Partial<QueryFilters>,
    pagination?: PaginationData,
}

export const SearchBarWrapper = ({ setSearchParams, searchParams, pagination, placeholder }: SearchBarWrapperProps) => {
    console.log('pagination', pagination)
    console.log('searchParams', searchParams)

    let sortPropsValue: SortSelectorProps | undefined = undefined;

    if (pagination && Array.isArray(pagination.allowed_sorts) && pagination.allowed_sorts.length > 0) {
        let selectedSortValue: string;
        if (searchParams.sortBy && searchParams.sortDirection) {
            selectedSortValue = `${searchParams.sortBy}:${searchParams.sortDirection}`;
        } else if (pagination.default_sort && pagination.default_sort_direction) {
            selectedSortValue = `${pagination.default_sort}:${pagination.default_sort_direction}`;
        } else {
            // Fallback to an empty string if no sort is actively selected or defined as default
            selectedSortValue = '';
        }

        // Only define sortProps if there are allowed sorts
        sortPropsValue = {
            selected: selectedSortValue,
            options: pagination.allowed_sorts,
            onSortSelect: (key, sortDirection) => {
                setSearchParams({
                    sortBy: key,
                    sortDirection: sortDirection,
                    pageNumber: 1, // Reset page number on sort change
                });
            },
        };
    }

    return (
        <SearchBar
            value={searchParams.query}
            onChange={(event) => {
                setSearchParams({
                    query: event.target.value,
                    pageNumber: 1,
                });
            }}
            onClear={() => setSearchParams({
                query: '',
                pageNumber: 1,
            })}
            placeholder={placeholder || t`Search...`}
            sortProps={sortPropsValue}
        />
    );
}

export const SearchBar = ({ sortProps, onClear, value, onChange, ...props }: SearchBarProps) => {
    const [searchValue, setSearchValue] = useState<typeof value>(value);

    useEffect(() => {
        setSearchValue(value);
    }, [value])

    return (
        <div className={classNames(classes.searchBarWrapper, props.className)}>
            <TextInput
                className={classes.searchBar}
                leftSection={<IconSearch size="1.1rem" stroke={1.5} />}
                radius="sm"
                size="md"
                value={searchValue}
                {...props}
                onChange={(event) => {
                    setSearchValue(event.currentTarget.value);
                    if (onChange) {
                        onChange(event);
                    }
                }}
                rightSection={<IconX aria-label={t`Clear Search Text`}
                    color={'#ddd'}
                    style={{ cursor: 'pointer' }}
                    display={value ? 'block' : 'none'}
                    onClick={() => onClear()}
                />}
            />
            {sortProps && (
                <ErrorBoundary fallback={<div style={{ color: 'orange', fontSize: '0.9em' }}>{t`Sort error`}</div>}>
                    <SortSelector
                        selected={sortProps.selected}
                        options={sortProps.options}
                        onSortSelect={sortProps.onSortSelect}
                    />
                </ErrorBoundary>
            )}
        </div>
    );
};


