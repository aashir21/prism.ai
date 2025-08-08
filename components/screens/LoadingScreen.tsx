import React from 'react'
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

const LoadingScreen = () => {
    return (
        <div className='w-full p-4 h-full overflow-y-auto'>
            <div className='flex items-center w-full h-full justify-center flex-col'>
                <Bouncy
                    size="48"
                    speed="1"
                    color="#a3e635"
                />
                <p className='text-center mt-2'>Prism is making it easier for you...</p>
            </div>
        </div>
    )
}

export default LoadingScreen