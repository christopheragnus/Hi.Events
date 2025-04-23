import React, { useEffect, useState } from 'react';
import { SortableProduct } from "./SortableProduct";
import { SortableCategory } from "./SortableCategory";
import classes from "./ProductsTable.module.scss";
import { IdParam, Product, ProductCategory } from "../../../types.ts";
import { ProductsBlankSlate } from "./ProductsBlankSlate";
import { IconCategory } from '@tabler/icons-react';


export interface ProductCategoryListProps {
    initialCategories: ProductCategory[];
    event: any;
    onCreateOpen: (categoryId: IdParam) => void;
    searchTerm: string;
}

export const ProductCategoryList: React.FC<ProductCategoryListProps> = ({
    initialCategories,
    event,
    onCreateOpen,
    searchTerm
}) => {
    const [categories, setCategories] = useState<ProductCategory[]>(initialCategories);
    const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>(initialCategories);

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    // Moved useEffect hook before the early return to fix conditional hook call error
    useEffect(() => {
        if (searchTerm) {
            const lowercaseSearch = searchTerm.toLowerCase();
            const filtered = categories
                .map(category => {
                    const categoryMatchesSearch = category.name.toLowerCase().includes(lowercaseSearch);
                    const filteredProducts = category.products?.filter(product =>
                        product.title.toLowerCase().includes(lowercaseSearch)
                    );

                    return {
                        ...category,
                        products: categoryMatchesSearch
                            ? category.products
                            : filteredProducts
                    };
                })
                .filter(category => {
                    const hasMatchingProducts = category.products ? category.products.length > 0 : false;
                    const categoryNameMatches = category.name.toLowerCase().includes(lowercaseSearch);
                    return hasMatchingProducts || categoryNameMatches;
                });

            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categories);
        }
    }, [searchTerm, categories]);

    // Replaced span with null to avoid literal string error and checked categories/event *after* hooks
    if (!categories || categories.length === 0 || !event) {
        return null;
    }

    console.log(filteredCategories)

    return (
        <div>
            {filteredCategories.length > 0 ? (
                <div className={classes.categories}>
                    {filteredCategories.map((category) => {
                        // Add key to the fragment for cases where category.products is missing
                        if (!category?.products) return <React.Fragment key={category.id} />;

                        return (
                            <SortableCategory
                                key={category.id}
                                category={category}
                                openCreateModal={() => onCreateOpen(category.id)}
                                isLastCategory={filteredCategories.length === 1}
                                categories={categories}
                            >
                                {category.products.length === 0 && (
                                    <ProductsBlankSlate
                                        productCategories={categories}
                                        searchTerm={searchTerm}
                                        openCreateModal={() => onCreateOpen(category.id)}
                                    />
                                )}
                                {category.products.length > 0 && (
                                    <div className={classes.cards}>
                                        {category.products.map((product: Product) => (
                                            <SortableProduct
                                                key={product.id}
                                                product={product}
                                                currencyCode={product.price_currency}
                                                categories={categories}
                                                category={category}
                                            />
                                        ))}
                                    </div>
                                )}
                            </SortableCategory>
                        );
                    })}
                </div>
            ) : (
                <ProductsBlankSlate
                    productCategories={categories}
                    searchTerm={searchTerm}
                    openCreateModal={onCreateOpen}
                />
            )}
        </div>
    );
};
