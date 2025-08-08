import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import SectionTitle from './SectionTitle'
import { Sparkle } from 'lucide-react'

const HintSection = ({ hints }: { hints: string[] }) => {
    return (
        <div className='p-4 border rounded-xl my-2'>
            <SectionTitle title='Hints' />
            {hints.map((hint, idx) => {
                return (
                    <Accordion key={idx} type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className='cursor-pointer'>
                                <div className='flex items-center justify-center gap-2'>
                                    <Sparkle size={16} />
                                    <p>Hint {idx + 1}</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {hint}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )
            })}
        </div>
    )
}

export default HintSection