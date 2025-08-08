import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import SectionTitle from './SectionTitle'
import { Target } from 'lucide-react'

const StrategySection = ({ strategy }: { strategy: string[] }) => {
    return (
        <div className='p-4 border rounded-xl my-2'>
            <SectionTitle title='Steps To Follow' />
            {strategy.map((strategy, idx) => {
                return (
                    <Accordion key={idx} type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className='cursor-pointer'>
                                <div className='flex items-center justify-center gap-2'>
                                    <Target size={16} />
                                    <p>Step {idx + 1}</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {strategy}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )
            })}
        </div>
    )
}

export default StrategySection