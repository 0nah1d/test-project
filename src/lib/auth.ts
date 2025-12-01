import axios from 'axios'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'API Login',
            credentials: {},

            async authorize() {
                try {
                    const { data } = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/getAuthorize`,
                        {
                            tokenType: 'frontEndTest',
                        }
                    )

                    if (!data?.token) return null

                    return data
                } catch (error: any) {
                    throw new Error('Authorization Failed')
                }
            },
        }),
    ],

    pages: {
        signIn: '/auth/login',
    },

    session: { strategy: 'jwt' },

    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.token = user.token
                token.expire = user.expire
            }
            return token
        },

        async session({ session, token }: any) {
            session.user = {
                token: token.token,
                expire: token.expire,
            }
            return session
        },
    },

    secret: process.env.JWT_SECRET,
}
