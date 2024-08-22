import Image from "next/image";

const Logo = () => {
    return (
        <div className="flex justify-center mt-3">
            <Image src="/logo.svg" alt="logo" height={50} width={70} />
        </div>
    );
};

export default Logo;
