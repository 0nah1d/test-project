import { Filters } from '@/types/sales'
import { Button, Col, Form, Input, Row } from 'antd'
import { debounce } from 'lodash'
import { useEffect, useMemo } from 'react'

interface Props {
    filters: Filters
    onFilterChange: (filters: Partial<Filters>) => void
    onReset: () => void
}

export const FiltersPanel = ({ filters, onFilterChange, onReset }: Props) => {
    const [form] = Form.useForm()

    const debouncedFilterChange = useMemo(
        () =>
            debounce(
                (changed: Partial<Filters>) => onFilterChange(changed),
                300
            ),
        [onFilterChange]
    )

    const handleReset = () => {
        form.resetFields()
        onReset()
    }

    useEffect(() => {
        form.setFieldsValue(filters)
    }, [filters, form])

    const handleInputChange = (key: keyof Filters, value: any) => {
        debouncedFilterChange({ [key]: value })
    }

    return (
        <Form form={form} layout="vertical" initialValues={filters}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Form.Item label="Min Price" name="priceMin">
                        <Input
                            type="number"
                            placeholder="Minimum price"
                            prefix="$"
                            onChange={(e) =>
                                handleInputChange('priceMin', e.target.value)
                            }
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Form.Item label="Email" name="email">
                        <Input
                            placeholder="Customer email"
                            onChange={(e) =>
                                handleInputChange('email', e.target.value)
                            }
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Form.Item label="Phone" name="phone">
                        <Input
                            placeholder="Phone number"
                            onChange={(e) =>
                                handleInputChange('phone', e.target.value)
                            }
                        />
                    </Form.Item>
                </Col>

                <Col
                    xs={24}
                    sm={12}
                    md={4}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 6,
                    }}
                >
                    <Button type="default" onClick={handleReset} block>
                        Reset Filters
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}
