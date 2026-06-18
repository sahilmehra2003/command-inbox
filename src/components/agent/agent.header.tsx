import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'

const AgentHeader = () => {
  return (
    <div className='text-center font-semibold text-3xl'>
        <Card>
  <CardHeader>
    <CardTitle>
      Command Inbox Agent
    </CardTitle>

    <CardDescription>
      Manage email and calendar using
      natural language.
    </CardDescription>
  </CardHeader>
</Card>
    </div>
  )
}

export default AgentHeader