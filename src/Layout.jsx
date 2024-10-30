import React from 'react'

function Layout({ children }) {
    return (
        <div className=' mx-auto container px-6 py-10 max-md:px-4 h-[100vh] gap-4 flex justify-start items-center'>
            <div className='w-full h-full'>
                {children}
            </div>


        </div>
    )
}

export default Layout