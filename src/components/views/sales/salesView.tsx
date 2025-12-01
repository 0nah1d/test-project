'use client'

import { Title } from '@/components/UI/typography'
import { useToken } from '@/context/tokenContext'
import api from '@/lib/axiosClient'
import { Button, Flex } from 'antd'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

const SalesView = () => {
    const { tokenStatus, token } = useToken()
    const [sales, setSales] = useState<any[]>([])

    const fetchSales = async () => {
        try {
            const res = await api.get(
                '/sales?startDate=&endDate=&priceMin=&email=&phone=&sortBy=date&sortOrder=&after=&before=',
                {
                    headers: {
                        'X-AUTOBIZZ-TOKEN': token,
                    },
                }
            )
            return res.data
        } catch (err) {
            console.error(err)
            return []
        }
    }

    useEffect(() => {
        if (tokenStatus !== 'added' || !token) return

        const loadSales = async () => {
            const salesData = await fetchSales()
            setSales(salesData)
        }

        loadSales()
    }, [tokenStatus, token])

    return (
        <>
            <Flex
                align="center"
                justify="space-between"
                style={{ padding: '32px 0' }}
            >
                <Title level={3}>Test App</Title>
                <Button type="primary" onClick={() => signOut()}>
                    Logout
                </Button>
            </Flex>

            <div>
                <Title level={4}>Sales Data ({sales.length} items)</Title>
                <pre>{JSON.stringify(sales, null, 2)}</pre>
            </div>
        </>
    )
}

export default SalesView
