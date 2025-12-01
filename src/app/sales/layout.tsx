interface Props {
    children: React.ReactNode
}
const SalesLayout = ({ children }: Props) => {
    return (
        <div
            style={{
                maxWidth: 1280,
                margin: '0 auto',
                width: '100%',
                padding: '0 20px',
            }}
        >
            {children}
        </div>
    )
}

export default SalesLayout
