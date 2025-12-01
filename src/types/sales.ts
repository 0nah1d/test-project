export interface SaleItem {
    _id: string
    date: string
    price: number
    customerEmail: string
    customerPhone: string
    __v: number
}

export interface DailySales {
    day: string
    totalSale: number
}

export interface SalesResponse {
    results: {
        TotalSales: DailySales[]
        Sales: SaleItem[]
    }
    pagination: {
        before: string | null
        after: string | null
    }
}

export interface Filters {
    startDate?: string
    endDate?: string
    priceMin?: string
    email?: string
    phone?: string
    sortBy?: 'date' | 'price'
    sortOrder?: 'asc' | 'desc'
}

export interface ChartData {
    date: string
    sales: number
}
