import { SaleItem } from '@/types/sales'
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CaretLeftOutlined,
    CaretRightOutlined,
} from '@ant-design/icons'
import { Button, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { Text } = Typography

interface Props {
    sales: SaleItem[] | []
    loading: boolean
    sortBy: 'date' | 'price'
    sortOrder: 'asc' | 'desc'
    onSortChange: (field: 'date' | 'price') => void
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
    const getSortIcon = (field: 'date' | 'price') => {
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
                <Text>{new Date(date).toLocaleString()}</Text>
            ),
            onHeaderCell: () => ({
                onClick: () => onSortChange('date'),
            }),
        },
    ]

    return (
        <>
            <Table
                columns={columns}
                dataSource={sales}
                rowKey="_id"
                loading={loading}
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
            <div
                style={{
                    marginTop: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Text type="secondary">
                    Showing {sales.length} sales records
                </Text>
                <div>
                    <Button
                        onClick={onPrevPage}
                        disabled={!hasPrevPage}
                        icon={<CaretLeftOutlined />}
                        style={{ marginRight: 8 }}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={onNextPage}
                        disabled={!hasNextPage}
                        icon={<CaretRightOutlined />}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    )
}
