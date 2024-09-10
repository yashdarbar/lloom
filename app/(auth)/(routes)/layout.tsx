export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full mt-[300px] flex justify-center items-center">
            {children}
        </div>
    );
}
