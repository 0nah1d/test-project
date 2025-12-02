import { Text } from '@/components/UI/typography'
import { Filters, SaleItem } from '@/types/sales'
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CaretLeftOutlined,
    CaretRightOutlined,
} from '@ant-design/icons'
import { Button, Flex, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface Props {
    sales: SaleItem[] | undefined
    loading: boolean
    sortBy: Filters['sortBy']
    sortOrder: Filters['sortOrder']
    onSortChange: (field: Filters['sortBy']) => void
    hasNextPage: boolean
    hasPrevPage: boolean
    onNextPage: () => void
    onPrevPage: () => void
}

export const SalesTable = ({
    sales,
    loading,
    sortBy,
    sortOrder,
    onSortChange,
    hasNextPage,
    hasPrevPage,
    onNextPage,
    onPrevPage,
}: Props) => {
    const getSortIcon = (field: Filters['sortBy']) => {
        if (sortBy !== field) return null
        return sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />
    }

    const columns: ColumnsType<SaleItem> = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Customer Email',
            dataIndex: 'customerEmail',
            key: 'customerEmail',
        },
        {
            title: 'Phone',
            dataIndex: 'customerPhone',
            key: 'customerPhone',
        },
        {
            title: () => <span>Price {getSortIcon('price')}</span>,
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            render: (price: number) => <span>$ {price.toLocaleString()}</span>,
            onHeaderCell: () => ({
                onClick: () => onSortChange('price'),
            }),
        },
        {
            title: 'Date & Time',
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            render: (date: string) => (
                <Text>{dayjs(date).format('DD-MMM-YYYY')}</Text>
            ),
            onHeaderCell: () => ({
                onClick: () => onSortChange('date'),
            }),
        },
    ]

    console.log(hasNextPage, hasPrevPage)
    return (
        <>
            <Table
                columns={columns}
                dataSource={sales || []}
                rowKey="_id"
                loading={loading}
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
            <Flex
                align="center"
                justify="space-between"
                style={{ marginTop: 32 }}
            >
                <Text type="secondary">
                    Showing {sales?.length} sales records
                </Text>

                <Flex gap={16} align="center">
                    <Button
                        onClick={onPrevPage}
                        disabled={!hasPrevPage || loading}
                        icon={<CaretLeftOutlined />}
                    >
                        Previous
                    </Button>

                    <Button
                        onClick={onNextPage}
                        disabled={!hasNextPage || loading}
                        icon={<CaretRightOutlined />}
                        iconPlacement="end"
                    >
                        Next
                    </Button>
                </Flex>
            </Flex>
        </>
    )
}
