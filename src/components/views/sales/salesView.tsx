'use client'

import { Title } from '@/components/UI/typography'
import { FiltersPanel } from '@/components/views/sales/elements/filtersPanel'
import { SalesChart } from '@/components/views/sales/elements/salesChart'
import { SalesTable } from '@/components/views/sales/elements/salesTable'
import { useToken } from '@/context/tokenContext'
import { useSalesData } from '@/hooks/useSalesData'
import { ChartData, Filters } from '@/types/sales'
import { Button, DatePicker, Divider, Flex, Result, Spin } from 'antd'
import dayjs from 'dayjs'
import { signOut } from 'next-auth/react'
import { useMemo } from 'react'

const { RangePicker } = DatePicker

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

    const handleSortChange = (field: Filters['sortBy']) => {
        const newSortOrder =
            filters.sortBy === field && filters.sortOrder === 'desc'
                ? 'asc'
                : 'desc'
        updateFilters({ sortBy: field, sortOrder: newSortOrder })
    }

    const handleDateChange = (dates: any) => {
        updateFilters({
            startDate: dates && dates[0] ? dates[0].format('YYYY-MM-DD') : '',
            endDate: dates && dates[1] ? dates[1].format('YYYY-MM-DD') : '',
        })
    }

    if (tokenStatus !== 'added' || !token) {
        return (
            <Flex
                align="center"
                justify="center"
                style={{
                    height: '100vh',
                }}
            >
                <Spin size="large" />
            </Flex>
        )
    }

    return (
        <div style={{ padding: '32px 0' }}>
            <Flex
                align="center"
                justify="space-between"
                style={{ marginBottom: 48 }}
            >
                <Title level={3}>Sales Dashboard</Title>
                <Button type="primary" onClick={() => signOut()}>
                    Logout
                </Button>
            </Flex>

            {error ? (
                <Flex
                    align="center"
                    justify="center"
                    style={{
                        height: '80vh',
                    }}
                >
                    <Result title="Error" subTitle={error} status="error" />
                </Flex>
            ) : (
                <>
                    <div style={{ margin: '24px 0' }}>
                        <Flex
                            align="center"
                            justify="space-between"
                            style={{ marginBottom: 24 }}
                        >
                            <Title level={4}>Sales Over Time</Title>

                            <RangePicker
                                value={[
                                    filters.startDate
                                        ? dayjs(filters.startDate)
                                        : null,
                                    filters.endDate
                                        ? dayjs(filters.endDate)
                                        : null,
                                ]}
                                onChange={handleDateChange}
                            />
                        </Flex>
                        <SalesChart chartData={chartData} />
                    </div>

                    <Divider />

                    <Flex
                        align="center"
                        justify="space-between"
                        style={{ margin: '32px 0' }}
                    >
                        <Title level={4}>Sales Records</Title>

                        <Button
                            onClick={() => refetch()}
                            loading={loading}
                            disabled={loading}
                        >
                            Refresh Data
                        </Button>
                    </Flex>

    

                    <FiltersPanel
                        filters={filters}
                        onFilterChange={updateFilters}
                        onReset={resetFilters}
                    />

                    <SalesTable
                        sales={data?.results?.Sales}
                        loading={loading}
                        sortBy={filters.sortBy}
                        sortOrder={filters.sortOrder}
                        onSortChange={handleSortChange}
                        hasNextPage={hasNextPage}
                        hasPrevPage={hasPrevPage}
                        onNextPage={nextPage}
                        onPrevPage={prevPage}
                    />
                </>
            )}
        </div>
    )
}

export default SalesView
