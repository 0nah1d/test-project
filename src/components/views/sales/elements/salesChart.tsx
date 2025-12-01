import { ChartData } from '@/types/sales'
import { Card } from 'antd'
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

interface Props {
    chartData: ChartData[]
}

export const SalesChart = ({ chartData }: Props) => {
    if (!chartData.length) {
        return (
            <Card
                styles={{
                    body: {
                        padding: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                }}
            >
                No data available for the selected period
            </Card>
        )
    }

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })

    return (
        <>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        tickFormatter={(v) => `€${v.toLocaleString()}`}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value: number) => [
                            `€${value.toLocaleString()}`,
                            'Sales',
                        ]}
                        labelFormatter={(l) => `Date: ${formatDate(l)}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#1890ff"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}
