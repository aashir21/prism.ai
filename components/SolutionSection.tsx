import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import SectionTitle from './SectionTitle'
import { FlaskConical } from 'lucide-react'
import CodeSnippet from './CodeSnippet'
import { Solution } from '@/types'

const SolutionSection = ({ solutions }: { solutions: Solution[] }) => {
    return (
        <div className='p-4 border rounded-xl my-2'>
            <SectionTitle title='Solutions' />
            {solutions.map((solution, idx) => {
                return (
                    <Accordion key={idx} type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className='cursor-pointer'>
                                <div className='flex items-center justify-center gap-2'>
                                    <FlaskConical size={16} />
                                    <p className='capitalize'>{solution.language}</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CodeSnippet
                                    language={solution.language}
                                    code={solution.code}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )
            })}
        </div>
    )
}

export default SolutionSection