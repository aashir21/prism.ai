import React from 'react'
import { Tag } from 'lucide-react'
import { Badge } from './ui/badge'


const PatternSection = ({ patterns }: { patterns: string[] }) => {
    return (
        <div className='my-4 flex items-center gap-1'>
            {patterns.map((pattern, idx) => {
                return (
                    <Badge key={idx}>
                        <Tag />
                        {pattern}
                    </Badge>
                )
            })}
        </div>
    )
}

export default PatternSection