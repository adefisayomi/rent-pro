"use client"

import dynamic from 'next/dynamic';
import RootLayout from '@/sections/layout';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

export default function Map () {
    return (

        <RootLayout>
        <div className="w-full border h-screen">
            <LeafletMap />
        </div>
        </RootLayout>
    )
}