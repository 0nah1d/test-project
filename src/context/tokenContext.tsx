'use client'

import { setAuthToken } from '@/lib/axiosClient'
import { useSession } from 'next-auth/react'
import { createContext, useContext, useEffect } from 'react'

interface TokenContextValue {
    token: string | null
    tokenStatus: 'undefined' | 'added' | 'removed'
}

export const TokenContext = createContext<TokenContextValue>({
    token: null,
    tokenStatus: 'undefined',
})

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session }: any = useSession()
    const token = session?.user?.token ?? null

    const tokenStatus: TokenContextValue['tokenStatus'] = token
        ? 'added'
        : 'removed'

    useEffect(() => {
        setAuthToken(token)
    }, [token])

    return (
        <TokenContext.Provider value={{ token, tokenStatus }}>
            {children}
        </TokenContext.Provider>
    )
}

export const useToken = () => useContext(TokenContext)
