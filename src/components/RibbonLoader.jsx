import React from 'react';
import flowerIcon from '../assets/flower.png';

export default function RibbonLoader({ progress }) {

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
            <div className="relative" style={{ width: '150px', height: '150px' }}>

                <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ fontFamily: 'serif', fontSize: '18px', color: '#857666', fontWeight: 'bold' }}>
                        {progress}%
                    </span>
                </div>
            </div>
        </div>
    );
}