import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
    dark?: boolean;
}

export default function Logo({ className = '', iconOnly = false, dark = false }: LogoProps) {
    return (
        <Link href="/" className={`flex items-center group ${className}`}>
            <div className={`relative ${iconOnly ? 'h-8 w-8 md:h-10 md:w-10' : 'h-8 w-[120px] md:h-10 md:w-[160px]'}`}>
                <Image
                    src={iconOnly ? "/iconmark.png" : (dark ? "/onionlogo.png" : "/onionlight.png")}
                    alt="Onionlabel"
                    fill
                    className="object-contain object-left"
                    priority
                />
            </div>
        </Link>
    );
}
