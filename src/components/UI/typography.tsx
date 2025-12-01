'use client'
import { Typography } from 'antd'
import type { ParagraphProps } from 'antd/es/typography/Paragraph'
import type { TextProps } from 'antd/es/typography/Text'
import type { TitleProps } from 'antd/es/typography/Title'

export const Title = ({ style, ...rest }: TitleProps) => {
    return <Typography.Title {...rest} style={{ margin: 0, ...style }} />
}

export const Paragraph = ({ style, ...rest }: ParagraphProps) => {
    return <Typography.Paragraph {...rest} style={{ margin: 0, ...style }} />
}

export const Text = ({ style, ...rest }: TextProps) => {
    return <Typography.Text {...rest} style={{ margin: 0, ...style }} />
}
