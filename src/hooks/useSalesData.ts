import api from '@/lib/axiosClient'
import { Filters, SalesResponse } from '@/types/sales'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface SalesFilters {
    startDate: string
    endDate: string
    priceMin: string
    email: string
    phone: string
    sortBy: Filters['sortBy']
    sortOrder: Filters['sortOrder']
    after: string
    before: string
}

const DEFAULT_FILTERS: SalesFilters = {
    startDate: '',
    endDate: '',
    priceMin: '',
    email: '',
    phone: '',
    sortBy: 'date',
    sortOrder: 'asc',
    after: '',
    before: '',
}

type PartialFilters = Partial<SalesFilters>

export const useSalesData = (token: string | null) => {
    const [filters, setFilters] = useState<SalesFilters>({ ...DEFAULT_FILTERS })
    const [data, setData] = useState<SalesResponse | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const filtersRef = useRef<SalesFilters>(filters)
    useEffect(() => {
        filtersRef.current = filters
    }, [filters])

    const [paginationToken, setPaginationToken] = useState<{
        before: string | null
        after: string | null
    }>({
        before: null,
        after: null,
    })

    const buildQueryString = useCallback((f: SalesFilters) => {
        const params = new URLSearchParams()

        params.set('startDate', f.startDate ?? '')
        params.set('endDate', f.endDate ?? '')
        params.set('priceMin', f.priceMin ?? '')
        params.set('email', f.email ?? '')
        params.set('phone', f.phone ?? '')
        params.set('sortBy', f.sortBy ?? 'date')
        params.set('sortOrder', f.sortOrder ?? 'asc')
        params.set('after', f.after ?? '')
        params.set('before', f.before ?? '')
        return params.toString()
    }, [])

    const fetchSalesData = useCallback(
        async (opts?: {
            filters?: PartialFilters
            pagination?: { before?: string; after?: string }
        }) => {
            if (!token) {
                setError('No token provided')
                return
            }

            setLoading(true)
            setError(null)

            try {
                const merged: SalesFilters = {
                    ...filtersRef.current,
                    ...(opts?.filters || {}),
                }

                if (opts?.pagination) {
                    if (typeof opts.pagination.before !== 'undefined')
                        merged.before = opts.pagination.before ?? ''
                    if (typeof opts.pagination.after !== 'undefined')
                        merged.after = opts.pagination.after ?? ''
                }

                const toSend: SalesFilters = {
                    startDate: merged.startDate ?? '',
                    endDate: merged.endDate ?? '',
                    priceMin: merged.priceMin ?? '',
                    email: merged.email ?? '',
                    phone: merged.phone ?? '',
                    sortBy: merged.sortBy ?? 'date',
                    sortOrder: merged.sortOrder ?? 'asc',
                    after: merged.after ?? '',
                    before: merged.before ?? '',
                }

                const qs = buildQueryString(toSend)
                const url = `/sales?${qs}`

                const response = await api.get<SalesResponse>(url, {
                    headers: {
                        'X-AUTOBIZZ-TOKEN': token,
                    },
                })

                setData(response.data)
                setPaginationToken({
                    before: response.data?.pagination?.before ?? null,
                    after: response.data?.pagination?.after ?? null,
                })

                if (opts?.filters || opts?.pagination) {
                    setFilters(toSend)
                    filtersRef.current = toSend
                } else {
                    filtersRef.current = toSend
                }
            } catch (err: any) {
                console.error('useSalesData.fetchSalesData error:', err)
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to fetch sales data'
                setError(message)
            } finally {
                setLoading(false)
            }
        },
        [token, buildQueryString]
    )

    const updateFilters = useCallback(
        (partial: PartialFilters) => {
            const merged: SalesFilters = {
                ...filtersRef.current,
                ...(partial as SalesFilters),
            }

            const normalized: SalesFilters = {
                startDate: merged.startDate ?? '',
                endDate: merged.endDate ?? '',
                priceMin: merged.priceMin ?? '',
                email: merged.email ?? '',
                phone: merged.phone ?? '',
                sortBy: merged.sortBy ?? 'date',
                sortOrder: merged.sortOrder ?? 'asc',
                after: merged.after ?? '',
                before: merged.before ?? '',
            }

            setFilters(normalized)
            filtersRef.current = normalized
            const paginationReset = { before: '', after: '' }
            fetchSalesData({ filters: normalized, pagination: paginationReset })
        },
        [fetchSalesData]
    )

    const resetFilters = useCallback(() => {
        const baseline = { ...DEFAULT_FILTERS }
        setFilters(baseline)
        filtersRef.current = baseline
        setPaginationToken({ before: null, after: null })
        fetchSalesData({
            filters: baseline,
            pagination: { before: '', after: '' },
        })
    }, [fetchSalesData])

    const nextPage = useCallback(() => {
        const after = paginationToken.after ?? ''
        fetchSalesData({ pagination: { after, before: '' } })
    }, [paginationToken.after, fetchSalesData])

    const prevPage = useCallback(() => {
        const before = paginationToken.before ?? ''
        fetchSalesData({ pagination: { before, after: '' } })
    }, [paginationToken.before, fetchSalesData])

    const refetch = useCallback(() => {
        fetchSalesData()
    }, [fetchSalesData])

    useEffect(() => {
        if (token) {
            fetchSalesData({
                filters: filtersRef.current,
                pagination: {
                    before: filtersRef.current.before,
                    after: filtersRef.current.after,
                },
            })
        } else {
            setData(null)
            setPaginationToken({ before: null, after: null })
            setError('No token')
        }
    }, [token])

    return {
        data,
        loading,
        error,
        filters,
        setFilters: (f: SalesFilters) => {
            setFilters(f)
            filtersRef.current = f
        },
        updateFilters,
        resetFilters,
        nextPage,
        prevPage,
        hasNextPage: Boolean(paginationToken.after),
        hasPrevPage: Boolean(paginationToken.before),
        refetch,
    }
}
