'use client'

import { Button, Flex } from 'antd'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

const LoginView = () => {
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)

        try {
            await signIn('credentials', {
                redirect: true,
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Flex
            justify="center"
            align="center"
            style={{ height: '100vh', width: '100%' }}
        >
            <Button
                type="primary"
                loading={loading}
                disabled={loading}
                onClick={handleLogin}
            >
                Get Token / Login
            </Button>
        </Flex>
    )
}

export default LoginView
