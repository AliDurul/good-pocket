
export interface IProduct {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    image?: string;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    category?: IProductCategory;
    variants?: IProductVariant[];
}

export interface IProductCategory {
    id: string;
    name: string;
    description?: string;
    image?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductVariant {
    id: string;
    productId: string;
    weightKg: number;
    weightLabel: string;
    price: number;
    earnValue: number;
    image?: string;
    stockQty: number;
    lowStockThreshold: number;
    isOutOfStock: boolean;
    lastRestockedAt: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductVariantWithProduct extends IProductVariant {
    product: IProduct;
}