'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { UpskillContent } from './content/UpskillContent'
import { StudentInternshipContent } from './content/StudentInternshipContent'
import { TrainToHireContent } from './content/TrainToHireContent'
import { OnTheJobContent } from './content/OnTheJobContent'
import { ExpatriateContent } from './content/ExpatriateContent'
import FAQsPage from '@/app/[lang]/FAQs/page'

export default function GrantTabs({ defaultTab = "overview" }) {
    const [activeTab, setActiveTab] = React.useState(defaultTab)

    React.useEffect(() => {
        // Get hash from URL and set active tab
        const hash = window.location.hash.replace('#', '')
        if (hash) {
            setActiveTab(hash)
            // Smooth scroll to tab content
            setTimeout(() => {
                const element = document.getElementById(hash)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                }
            }, 100)
        }
    }, [])

    const tabs = [
        { value: "overview", label: "Overview" },
        { value: "student", label: "Student Internship" },
        { value: "train-to-hire", label: "Train-to-hire" },
        { value: "on-the-job", label: "On-the-job Training" },
        { value: "expatriate", label: "Expatriate and Diaspora" },
        { value: "faq", label: "FAQ" },
    ]

    return (
        <div className='flex-grow bg-gray-50'>
            <motion.div
                className='container mx-auto h-full'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex md:flex-row flex-col items-baseline h-full">
                    <div className="md:w-64 w-full sticky top-20">
                        <TabsList className='flex md:flex-col flex-row md:items-stretch items-center md:justify-start justify-start md:space-y-2 md:space-x-0 space-x-2 p-4 min-w-max md:min-w-0 bg-white/80 backdrop-blur-sm'>
                            {tabs.map((tab) => (
                                <TabsTrigger 
                                    key={tab.value}
                                    value={tab.value}
                                    className="flex-shrink-0 md:w-full px-4 py-2 md:py-3 text-center transition-all duration-200 ease-in-out
                                               text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900
                                               data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                                               data-[state=active]:shadow-md rounded-md whitespace-nowrap md:whitespace-normal"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className='flex-grow overflow-auto p-4 md:p-6'>
                        <TabsContent value="overview">
                            <UpskillContent />
                        </TabsContent>
                        <TabsContent value="student">
                            <StudentInternshipContent />
                        </TabsContent>
                        <TabsContent value="train-to-hire">
                            <TrainToHireContent />
                        </TabsContent>
                        <TabsContent value="on-the-job">
                            <OnTheJobContent />
                        </TabsContent>
                        <TabsContent value="expatriate">
                            <ExpatriateContent />
                        </TabsContent>
                        <TabsContent value="faq">
                            <FAQsPage />
                        </TabsContent>
                    </div>
                </Tabs>
            </motion.div>
        </div>
    )
}

