import { Filters } from '@/types/sales'
import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select

interface Props {
    filters: Filters
    onFilterChange: (filters: Partial<Filters>) => void
    onReset: () => void
}

export const FiltersPanel = ({ filters, onFilterChange, onReset }: Props) => {
    const [form] = Form.useForm()

    const handleDateChange = (dates: any) => {
        onFilterChange({
            startDate: dates && dates[0] ? dates[0].format('YYYY-MM-DD') : '',
            endDate: dates && dates[1] ? dates[1].format('YYYY-MM-DD') : '',
        })
    }

    const handleReset = () => {
        form.resetFields()
        onReset()
    }

    return (
        <Form form={form} layout="vertical" initialValues={filters}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Form.Item label="Date Range">
                        <RangePicker
                            style={{ width: '100%' }}
                            value={[
                                filters.startDate
                                    ? dayjs(filters.startDate)
                                    : null,
                                filters.endDate ? dayjs(filters.endDate) : null,
                            ]}
                            onChange={handleDateChange}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                    <Form.Item label="Min Price">
                        <Input
                            type="number"
                            placeholder="Minimum price"
                            prefix="€"
                            value={filters.priceMin}
                            onChange={(e) =>
                                onFilterChange({ priceMin: e.target.value })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                    <Form.Item label="Email">
                        <Input
                            placeholder="Customer email"
                            value={filters.email}
                            onChange={(e) =>
                                onFilterChange({ email: e.target.value })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                    <Form.Item label="Phone">
                        <Input
                            placeholder="Phone number"
                            value={filters.phone}
                            onChange={(e) =>
                                onFilterChange({ phone: e.target.value })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                    <Form.Item label="Sort By">
                        <Select
                            value={filters.sortBy}
                            onChange={(value) =>
                                onFilterChange({ sortBy: value as any })
                            }
                        >
                            <Option value="date">Date</Option>
                            <Option value="price">Price</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                    <Form.Item label="Order">
                        <Select
                            value={filters.sortOrder}
                            onChange={(value) =>
                                onFilterChange({ sortOrder: value as any })
                            }
                        >
                            <Option value="desc">Descending</Option>
                            <Option value="asc">Ascending</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={() => onFilterChange({ ...filters })}
                            style={{ marginRight: 8 }}
                        >
                            Apply
                        </Button>
                        <Button icon={<FilterOutlined />} onClick={handleReset}>
                            Reset
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}
