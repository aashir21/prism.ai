import React from 'react'
import ExplanationCard from '../ExplanationCard'
import HintSection from '../HintSection'
import StrategySection from '../StrategySection'
import PatternSection from '../PatternSection'
import SolutionSection from '../SolutionSection'
import { ProblemExplanation } from '@/types'

const AIResponseView = ({ explanation }: { explanation: ProblemExplanation }) => {
    return (
        <div className='w-full p-4 h-full overflow-y-auto [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-thumb]:bg-neutral-700'>
            <div>
                <h1 className='font-semibold text-3xl'>Explanation</h1>
                <p className='text-sm text-neutral-400'>A thorough breakdown of the problem statement</p>
            </div>

            <div className='my-4'>
                <PatternSection patterns={explanation.pattern} />
                <ExplanationCard title='Explanation' description={explanation.explanation} />
                <HintSection hints={explanation.hints} />
                <StrategySection strategy={explanation.steps} />
                <SolutionSection solutions={explanation.solutions} />
            </div>
        </div>
    )
}

export default AIResponseView