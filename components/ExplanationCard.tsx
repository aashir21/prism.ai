import React from 'react'
import SectionTitle from './SectionTitle'

const ExplanationCard = ({ title, description, width = "100%" }: { title: string, description: string, width?: string }) => {
    return (
        <div className={`${width} rounded-xl bg-card border-2 p-4`}>
            <SectionTitle title={title} />
            <p className='text-sm'>{description}</p>
        </div>
    )
}

export default ExplanationCard