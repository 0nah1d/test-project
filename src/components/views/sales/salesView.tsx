'use client'

import { Title } from '@/components/UI/typography'
import { FiltersPanel } from '@/components/views/sales/elements/filtersPanel'
import { SalesChart } from '@/components/views/sales/elements/salesChart'
import { SalesTable } from '@/components/views/sales/elements/salesTable'
import { useToken } from '@/context/tokenContext'
import { useSalesData } from '@/hooks/useSalesData'
import { ChartData } from '@/types/sales'
import { Alert, Button, Divider, Flex, Spin } from 'antd'
import { signOut } from 'next-auth/react'
import { useMemo } from 'react'

const SalesView = () => {
    const { tokenStatus, token } = useToken()
    const {
        data,
        loading,
        error,
        filters,
        updateFilters,
        nextPage,
        prevPage,
        hasNextPage,
        hasPrevPage,
        refetch,
        resetFilters,
    } = useSalesData(token)

    const chartData: ChartData[] = useMemo(() => {
        if (!data?.results?.TotalSales) return []
        return data.results.TotalSales.map((item) => ({
            date: item.day,
            sales: item.totalSale,
        }))
    }, [data])

    const handleSortChange = (field: 'date' | 'price') => {
        const newSortOrder =
            filters.sortBy === field && filters.sortOrder === 'desc'
                ? 'asc'
                : 'desc'
        updateFilters({ sortBy: field, sortOrder: newSortOrder })
    }

    if (tokenStatus !== 'added' || !token) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Spin size="large" tip="Loading..." />
            </div>
        )
    }

    return (
        <div style={{ padding: '24px' }}>
            <Flex
                align="center"
                justify="space-between"
                style={{ marginBottom: 32 }}
            >
                <Title level={3}>Sales Dashboard</Title>
                <Button type="primary" onClick={() => signOut()}>
                    Logout
                </Button>
            </Flex>

            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    style={{ marginBottom: 24 }}
                />
            )}

            <div style={{ margin: '24px 0' }}>
                <Flex>
                    <Title level={4} style={{ marginBottom: 24 }}>
                        Sales Over Time
                    </Title>
                </Flex>
                <SalesChart chartData={chartData} />
            </div>

            <FiltersPanel
                filters={filters}
                onFilterChange={updateFilters}
                onReset={resetFilters}
            />

            <Divider />

            <Flex
                align="center"
                justify="space-between"
                style={{ margin: '32px 0' }}
            >
                <Title level={4}>Sales Records</Title>

                <Button onClick={() => refetch()} loading={loading}>
                    Refresh Data
                </Button>
            </Flex>

            <SalesTable
                sales={data?.results?.Sales ?? []}
                loading={loading}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={handleSortChange}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                onNextPage={nextPage}
                onPrevPage={prevPage}
            />
        </div>
    )
}

export default SalesView
