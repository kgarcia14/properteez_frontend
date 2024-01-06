import Image from 'next/image';
import logo from '../../public/properteez_logo.png';

//This is a separate component so the logo gets preloaded
const Logo = () => {
    return (
        <>
            <Image className='logo' src={logo} alt='properteez logo' width={100} />
        </>
    )
}

export default Logo;